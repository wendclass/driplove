import fs from "fs";
import path from "path";
import crypto from "crypto";
import type {
  User,
  AdminProfile,
  ClubPass,
  Conversation,
  Message,
  InternalNote,
  MessageLock,
  ReviewRequest,
  Chronicle,
  ResponseTemplate,
  AuditLog,
  AdminInvitation,
  SetupState,
  LoginAttempt,
  DecryptedConversation,
  DecryptedMessage,
  ConversationCategory,
  PriorityLevel,
} from "../types/index.ts";
import {
  encryptText,
  decryptText,
  hashPassword,
  verifyPassword,
  hashClubCode,
} from "./crypto.ts";
import {
  verifyTotpCode,
  verifyAndConsumeBackupCode,
  hashBackupCode,
} from "./totp.ts";

interface DatabaseStore {
  clubPasses: ClubPass[];
  users: User[];
  adminProfiles: AdminProfile[];
  conversations: Conversation[];
  messages: Message[];
  messageLocks: MessageLock[];
  internalNotes: InternalNote[];
  reviewRequests: ReviewRequest[];
  chronicles: Chronicle[];
  responseTemplates: ResponseTemplate[];
  auditLogs: AuditLog[];
  adminInvitations: AdminInvitation[];
  setupState: SetupState;
  loginAttempts: LoginAttempt[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "dr_iplove_store.json");

// Mots-clés de sensibilité (Détection interne non punitive)
const DISTRESS_KEYWORDS = [
  "suicide",
  "en finir",
  "mourir",
  "tuer",
  "mutiler",
  "violer",
  "violée",
  "viol",
  "frapper",
  "battue",
  "menace",
  "diffuser des photos",
  "chantage",
  "séquestrer",
  "détresse",
];

export function detectSensibility(text: string): {
  isSensitive: boolean;
  priority: PriorityLevel;
  trigger?: string;
} {
  const lower = text.toLowerCase();
  for (const kw of DISTRESS_KEYWORDS) {
    if (lower.includes(kw)) {
      return {
        isSensitive: true,
        priority: "CRITICAL",
        trigger: `Mot-clé détecté : "${kw}"`,
      };
    }
  }
  return {
    isSensitive: false,
    priority: "NORMAL",
  };
}

/**
 * Initialisation d'un magasin de données 100% VIERGE
 * Aucun compte démo, aucun mot de passe par défaut, aucun seed résiduel
 */
function getInitialStore(): DatabaseStore {
  return {
    clubPasses: [],
    users: [],
    adminProfiles: [],
    conversations: [],
    messages: [],
    messageLocks: [],
    internalNotes: [],
    reviewRequests: [],
    chronicles: [],
    responseTemplates: [],
    auditLogs: [],
    adminInvitations: [],
    setupState: { completed: false },
    loginAttempts: [],
  };
}

class JsonDatabase {
  private store: DatabaseStore;

  constructor() {
    this.store = this.load();
  }

  private load(): DatabaseStore {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf8");
        const parsed = JSON.parse(raw);
        return {
          clubPasses: parsed.clubPasses || [],
          users: parsed.users || [],
          adminProfiles: parsed.adminProfiles || [],
          conversations: parsed.conversations || [],
          messages: parsed.messages || [],
          messageLocks: parsed.messageLocks || [],
          internalNotes: parsed.internalNotes || [],
          reviewRequests: parsed.reviewRequests || [],
          chronicles: parsed.chronicles || [],
          responseTemplates: parsed.responseTemplates || [],
          auditLogs: parsed.auditLogs || [],
          adminInvitations: parsed.adminInvitations || [],
          setupState: parsed.setupState || { completed: false },
          loginAttempts: parsed.loginAttempts || [],
        };
      }
    } catch (e) {
      console.error("Erreur lecture BDD :", e);
    }
    const initial = getInitialStore();
    this.save(initial);
    return initial;
  }

  private save(data?: DatabaseStore): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const toWrite = data || this.store;
      fs.writeFileSync(DB_FILE, JSON.stringify(toWrite, null, 2), "utf8");
    } catch (e) {
      console.error("Erreur écriture BDD :", e);
    }
  }

  // --- CONFIGURATION INITIALE & GOUVERNANCE SUPERADMIN ---
  hasSuperadmin(): boolean {
    return this.store.users.some(
      (u) => u.role === "SUPERADMIN" && u.isActive
    );
  }

  getSetupState(): SetupState {
    if (this.hasSuperadmin()) {
      return {
        completed: true,
        completedAt: this.store.setupState?.completedAt || new Date().toISOString(),
      };
    }

    const envToken = process.env.SETUP_TOKEN?.trim();
    if (envToken && envToken.length >= 16) {
      return {
        completed: false,
        token: envToken,
        tokenExpiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      };
    }

    const now = Date.now();
    if (
      this.store.setupState?.token &&
      this.store.setupState?.tokenExpiresAt &&
      new Date(this.store.setupState.tokenExpiresAt).getTime() > now
    ) {
      return this.store.setupState;
    }

    const newToken = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(now + 30 * 60 * 1000).toISOString();
    this.store.setupState = {
      completed: false,
      token: newToken,
      tokenExpiresAt: expiresAt,
    };
    this.save();
    return this.store.setupState;
  }

  verifySetupToken(token: string): boolean {
    if (this.hasSuperadmin()) return false;
    const state = this.getSetupState();
    if (!state.token || !state.tokenExpiresAt) return false;
    if (new Date(state.tokenExpiresAt).getTime() < Date.now()) return false;
    return token.trim() === state.token;
  }

  completeInitialSetup(params: {
    pseudonym: string;
    passwordPlain: string;
    displayName: string;
    internalEmail: string;
    totpSecretBase32: string;
    backupCodes: string[];
  }): { user?: User; error?: string } {
    if (this.hasSuperadmin()) {
      return { error: "La configuration initiale a déjà été effectuée." };
    }

    const cleanPseudo = params.pseudonym.trim();
    if (cleanPseudo.length < 3) {
      return { error: "L'identifiant doit comporter au moins 3 caractères." };
    }

    const userId = "u-super-" + crypto.randomBytes(4).toString("hex");
    const now = new Date().toISOString();

    const superUser: User = {
      id: userId,
      pseudonym: cleanPseudo,
      passwordHash: hashPassword(params.passwordPlain),
      role: "SUPERADMIN",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const backupHashes = (params.backupCodes || []).map((c) => hashBackupCode(c));

    const adminProfile: AdminProfile = {
      id: "prof-" + crypto.randomBytes(4).toString("hex"),
      userId,
      displayName: params.displayName.trim(),
      internalEmail: params.internalEmail.trim(),
      totpSecretBase32: params.totpSecretBase32.trim(),
      backupCodesHashed: backupHashes,
      charterAcceptedAt: now,
      isOnDuty: true,
    };

    this.store.users.push(superUser);
    this.store.adminProfiles.push(adminProfile);
    this.store.setupState = {
      completed: true,
      completedAt: now,
    };

    this.logAudit({
      adminId: userId,
      adminName: params.displayName.trim(),
      actionType: "INITIAL_SETUP",
      targetResourceType: "SYSTEM",
      targetResourceId: "initial-setup",
      metadataSanitized: {
        role: "SUPERADMIN",
        twoFactorConfigured: true,
        backupCodesCount: backupHashes.length,
      },
      ipSubnetHash: "system-setup",
    });

    this.save();
    return { user: superUser };
  }

  // --- GESTION DES INVITATIONS ADMINISTRATEURS (48H, USAGE UNIQUE) ---
  createAdminInvitation(
    createdByAdminId: string,
    createdByName: string,
    role: "RESPONDER" | "SUPERADMIN" = "RESPONDER"
  ): AdminInvitation {
    const inv: AdminInvitation = {
      id: "inv-" + crypto.randomBytes(6).toString("hex"),
      token: crypto.randomBytes(24).toString("hex"),
      role,
      createdByAdminId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      isUsed: false,
    };

    if (!this.store.adminInvitations) {
      this.store.adminInvitations = [];
    }
    this.store.adminInvitations.push(inv);

    this.logAudit({
      adminId: createdByAdminId,
      adminName: createdByName,
      actionType: "INVITE_ADMIN",
      targetResourceType: "INVITATION",
      targetResourceId: inv.id,
      metadataSanitized: { role, expiresAt: inv.expiresAt },
      ipSubnetHash: "admin-action",
    });

    this.save();
    return inv;
  }

  getInvitationByToken(token: string): AdminInvitation | null {
    if (!token) return null;
    const inv = (this.store.adminInvitations || []).find(
      (i) => i.token === token.trim()
    );
    if (!inv) return null;
    if (inv.isUsed) return null;
    if (new Date(inv.expiresAt).getTime() < Date.now()) return null;
    return inv;
  }

  revokeInvitation(invitationId: string, adminId: string, adminName: string): boolean {
    const inv = (this.store.adminInvitations || []).find((i) => i.id === invitationId);
    if (!inv || inv.isUsed) return false;

    this.store.adminInvitations = this.store.adminInvitations.filter(
      (i) => i.id !== invitationId
    );

    this.logAudit({
      adminId,
      adminName,
      actionType: "REVOKE_INVITATION",
      targetResourceType: "INVITATION",
      targetResourceId: invitationId,
      metadataSanitized: { revokedAt: new Date().toISOString() },
      ipSubnetHash: "admin-action",
    });

    this.save();
    return true;
  }

  getAdminInvitations(): AdminInvitation[] {
    return this.store.adminInvitations || [];
  }

  acceptAdminInvitation(
    token: string,
    params: {
      pseudonym: string;
      passwordPlain: string;
      displayName: string;
      internalEmail: string;
      totpSecretBase32: string;
      backupCodes: string[];
      charterAccepted: boolean;
    }
  ): { user?: User; error?: string } {
    const inv = this.getInvitationByToken(token);
    if (!inv) {
      return { error: "L'invitation est invalide, a expiré (délai de 48h) ou a déjà été utilisée." };
    }

    if (!params.charterAccepted) {
      return { error: "L'acceptation formelle de la charte de confidentialité est obligatoire." };
    }

    const cleanPseudo = params.pseudonym.trim();
    if (this.findUserByPseudonym(cleanPseudo)) {
      return { error: "Cet identifiant est déjà utilisé. Choisis-en un autre." };
    }

    const userId = "u-adm-" + crypto.randomBytes(4).toString("hex");
    const now = new Date().toISOString();

    const user: User = {
      id: userId,
      pseudonym: cleanPseudo,
      passwordHash: hashPassword(params.passwordPlain),
      role: inv.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const backupHashes = (params.backupCodes || []).map((c) => hashBackupCode(c));

    const adminProfile: AdminProfile = {
      id: "prof-" + crypto.randomBytes(4).toString("hex"),
      userId,
      displayName: params.displayName.trim(),
      internalEmail: params.internalEmail.trim(),
      totpSecretBase32: params.totpSecretBase32.trim(),
      backupCodesHashed: backupHashes,
      charterAcceptedAt: now,
      isOnDuty: true,
    };

    inv.isUsed = true;
    inv.usedAt = now;
    inv.usedByUserId = userId;

    this.store.users.push(user);
    this.store.adminProfiles.push(adminProfile);

    this.logAudit({
      adminId: userId,
      adminName: params.displayName.trim(),
      actionType: "ACCEPT_INVITATION",
      targetResourceType: "USER",
      targetResourceId: userId,
      metadataSanitized: {
        role: inv.role,
        invitationId: inv.id,
        twoFactorConfigured: true,
      },
      ipSubnetHash: "invitation-setup",
    });

    this.save();
    return { user };
  }

  // --- GOUVERNANCE COMPTES ADMINISTRATEURS (DÉSACTIVATION / SUPPRESSION) ---
  getAllAdminUsers(): Array<{ user: User; profile?: AdminProfile }> {
    const adminUsers = this.store.users.filter(
      (u) => u.role === "RESPONDER" || u.role === "SUPERADMIN"
    );
    return adminUsers.map((u) => ({
      user: {
        id: u.id,
        pseudonym: u.pseudonym,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        passwordHash: "",
      },
      profile: this.getAdminProfile(u.id) || undefined,
    }));
  }

  setAdminUserStatus(
    userId: string,
    isActive: boolean,
    actingAdminId: string,
    actingAdminName: string
  ): { success: boolean; error?: string } {
    const target = this.findUserById(userId);
    if (!target) return { success: false, error: "Utilisateur introuvable." };

    if (!isActive && target.role === "SUPERADMIN") {
      const activeSuperadmins = this.store.users.filter(
        (u) => u.role === "SUPERADMIN" && u.isActive && u.id !== userId
      );
      if (activeSuperadmins.length === 0) {
        return { success: false, error: "Impossible de désactiver le dernier Super-Administrateur." };
      }
    }

    target.isActive = isActive;
    target.updatedAt = new Date().toISOString();

    this.logAudit({
      adminId: actingAdminId,
      adminName: actingAdminName,
      actionType: isActive ? "REACTIVATE_ADMIN" : "DEACTIVATE_ADMIN",
      targetResourceType: "USER",
      targetResourceId: userId,
      metadataSanitized: { targetPseudonym: target.pseudonym, isActive },
      ipSubnetHash: "admin-governance",
    });

    this.save();
    return { success: true };
  }

  deleteAdminUser(
    userId: string,
    actingAdminId: string,
    actingAdminName: string
  ): { success: boolean; error?: string } {
    const target = this.findUserById(userId);
    if (!target) return { success: false, error: "Utilisateur introuvable." };

    if (target.role === "SUPERADMIN") {
      const remainingSuper = this.store.users.filter(
        (u) => u.role === "SUPERADMIN" && u.id !== userId
      );
      if (remainingSuper.length === 0) {
        return { success: false, error: "Impossible de supprimer le seul Super-Administrateur." };
      }
    }

    this.store.users = this.store.users.filter((u) => u.id !== userId);
    this.store.adminProfiles = this.store.adminProfiles.filter((p) => p.userId !== userId);
    this.store.messageLocks = this.store.messageLocks.filter((l) => l.lockedByAdminId !== userId);

    this.logAudit({
      adminId: actingAdminId,
      adminName: actingAdminName,
      actionType: "DELETE_ADMIN",
      targetResourceType: "USER",
      targetResourceId: userId,
      metadataSanitized: { deletedPseudonym: target.pseudonym },
      ipSubnetHash: "admin-governance",
    });

    this.save();
    return { success: true };
  }

  // --- VÉRIFICATION 2FA & CODES DE SECOURS ---
  verifyAdminTotp(
    userId: string,
    code: string
  ): { valid: boolean; usedBackupCode?: boolean } {
    const profile = this.getAdminProfile(userId);
    if (!profile) return { valid: false };

    if (profile.totpSecretBase32 && verifyTotpCode(profile.totpSecretBase32, code)) {
      return { valid: true };
    }

    if (profile.backupCodesHashed && profile.backupCodesHashed.length > 0) {
      const backupCheck = verifyAndConsumeBackupCode(code, profile.backupCodesHashed);
      if (backupCheck.valid && backupCheck.matchingHashIndex !== undefined) {
        profile.backupCodesHashed.splice(backupCheck.matchingHashIndex, 1);
        this.save();
        return { valid: true, usedBackupCode: true };
      }
    }

    return { valid: false };
  }

  // --- SÉCURITÉ : RATE LIMITING & ANTI BRUTE-FORCE ---
  recordLoginFailure(pseudonym: string, ipSubnet: string): void {
    if (!this.store.loginAttempts) {
      this.store.loginAttempts = [];
    }
    this.store.loginAttempts.push({
      id: crypto.randomBytes(6).toString("hex"),
      pseudonym: pseudonym.toLowerCase(),
      ipSubnet,
      timestamp: Date.now(),
    });

    const cutoff = Date.now() - 30 * 60 * 1000;
    this.store.loginAttempts = this.store.loginAttempts.filter((a) => a.timestamp > cutoff);
    this.save();
  }

  clearLoginFailures(pseudonym: string, ipSubnet: string): void {
    if (!this.store.loginAttempts) return;
    this.store.loginAttempts = this.store.loginAttempts.filter(
      (a) => a.pseudonym !== pseudonym.toLowerCase() && a.ipSubnet !== ipSubnet
    );
    this.save();
  }

  isLoginLocked(pseudonym: string, ipSubnet: string): boolean {
    if (!this.store.loginAttempts) return false;
    const windowMs = 15 * 60 * 1000;
    const now = Date.now();
    const recent = this.store.loginAttempts.filter(
      (a) =>
        (a.pseudonym === pseudonym.toLowerCase() || a.ipSubnet === ipSubnet) &&
        now - a.timestamp < windowMs
    );
    return recent.length >= 5;
  }

  // --- GESTION DU PASS COMMUNAUTAIRE (SANS VALEURS EN DUR) ---
  verifyClubPass(code: string): boolean {
    if (!code || typeof code !== "string") return false;
    const hash = hashClubCode(code.trim());
    const pass = this.store.clubPasses.find(
      (p) => p.codeHash === hash && p.isActive
    );
    return !!pass;
  }

  createClubPass(
    code: string,
    seasonLabel: string,
    adminId: string,
    adminName: string
  ): ClubPass {
    const pass: ClubPass = {
      id: "pass-" + crypto.randomBytes(4).toString("hex"),
      codeHash: hashClubCode(code),
      seasonLabel,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    };
    this.store.clubPasses.push(pass);
    this.logAudit({
      adminId,
      adminName,
      actionType: "EXPORT_DATA",
      targetResourceType: "SYSTEM",
      targetResourceId: pass.id,
      metadataSanitized: { seasonLabel },
      ipSubnetHash: "admin-pass",
    });
    this.save();
    return pass;
  }

  // --- RECHERCHE ET GESTION DES UTILISATEURS ---
  findUserByPseudonym(pseudonym: string): User | null {
    return (
      this.store.users.find(
        (u) => u.pseudonym.toLowerCase() === pseudonym.toLowerCase()
      ) || null
    );
  }

  findUserById(id: string): User | null {
    return this.store.users.find((u) => u.id === id) || null;
  }

  getAdminProfile(userId: string): AdminProfile | null {
    return this.store.adminProfiles.find((p) => p.userId === userId) || null;
  }

  createStudent(
    pseudonym: string,
    passwordPlain: string,
    recoveryEmail?: string
  ): { user?: User; error?: string } {
    if (this.findUserByPseudonym(pseudonym)) {
      return { error: "Ce pseudonyme est déjà utilisé. Choisis-en un autre." };
    }

    const id = "u-" + Math.random().toString(36).substring(2, 9);
    let recoveryEmailEncrypted: string | undefined;
    let recoveryEmailIv: string | undefined;

    if (recoveryEmail && recoveryEmail.trim()) {
      const enc = encryptText(recoveryEmail.trim());
      recoveryEmailEncrypted = enc.encryptedHex;
      recoveryEmailIv = enc.ivHex;
    }

    const newUser: User = {
      id,
      pseudonym: pseudonym.trim(),
      passwordHash: hashPassword(passwordPlain),
      recoveryEmailEncrypted,
      recoveryEmailIv,
      role: "STUDENT",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.store.users.push(newUser);
    this.save();
    return { user: newUser };
  }

  verifyUserCredentials(
    pseudonym: string,
    passwordPlain: string
  ): User | null {
    const user = this.findUserByPseudonym(pseudonym);
    if (!user || !user.isActive) return null;
    const ok = verifyPassword(passwordPlain, user.passwordHash);
    return ok ? user : null;
  }

  deleteStudentAccount(userId: string): boolean {
    const userConversations = this.store.conversations.filter(
      (c) => c.studentId === userId
    );
    const convIds = new Set(userConversations.map((c) => c.id));

    this.store.messages = this.store.messages.filter(
      (m) => !convIds.has(m.conversationId)
    );
    this.store.internalNotes = this.store.internalNotes.filter(
      (n) => !convIds.has(n.conversationId)
    );
    this.store.messageLocks = this.store.messageLocks.filter(
      (l) => !convIds.has(l.conversationId)
    );
    this.store.reviewRequests = this.store.reviewRequests.filter(
      (r) => !convIds.has(r.conversationId)
    );
    this.store.conversations = this.store.conversations.filter(
      (c) => c.studentId !== userId
    );
    this.store.users = this.store.users.filter((u) => u.id !== userId);

    this.save();
    return true;
  }

  // --- CONVERSATIONS ÉTUDIANT ---
  createConversation(
    studentId: string,
    category: ConversationCategory,
    contentPlain: string,
    titlePlain?: string
  ): { conversation: Conversation; message: Message } {
    const convId = "c-" + Math.random().toString(36).substring(2, 9);
    const msgId = "m-" + Math.random().toString(36).substring(2, 9);

    const { isSensitive, priority, trigger } = detectSensibility(contentPlain);

    let titleEncrypted: string | undefined;
    let titleIv: string | undefined;
    if (titlePlain) {
      const encTitle = encryptText(titlePlain);
      titleEncrypted = encTitle.encryptedHex;
      titleIv = encTitle.ivHex;
    }

    const encMsg = encryptText(contentPlain);

    const newConv: Conversation = {
      id: convId,
      studentId,
      category,
      status: "NEW",
      priority,
      isSensitive,
      sensitivityTrigger: trigger,
      titleEncrypted,
      titleIv,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newMsg: Message = {
      id: msgId,
      conversationId: convId,
      senderType: "STUDENT",
      contentEncrypted: encMsg.encryptedHex,
      iv: encMsg.ivHex,
      authTag: encMsg.authTagHex,
      createdAt: new Date().toISOString(),
    };

    this.store.conversations.push(newConv);
    this.store.messages.push(newMsg);
    this.save();

    return { conversation: newConv, message: newMsg };
  }

  getStudentConversations(studentId: string): DecryptedConversation[] {
    this.purgeExpiredConversations();

    const convs = this.store.conversations.filter(
      (c) => c.studentId === studentId
    );

    return convs.map((c) => {
      const msgs = this.store.messages
        .filter((m) => m.conversationId === c.id)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((m) => ({
          id: m.id,
          conversationId: m.conversationId,
          senderType: m.senderType,
          content: decryptText(m.contentEncrypted, m.iv, m.authTag),
          createdAt: m.createdAt,
          readAt: m.readAt,
        }));

      let title: string | undefined;
      if (c.titleEncrypted && c.titleIv) {
        title = decryptText(c.titleEncrypted, c.titleIv);
      }

      return {
        id: c.id,
        category: c.category,
        status: c.status,
        priority: c.priority,
        isSensitive: c.isSensitive,
        title,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        closedAt: c.closedAt,
        autoPurgeAt: c.autoPurgeAt,
        messages: msgs,
      };
    });
  }

  getConversationById(convId: string): DecryptedConversation | null {
    const c = this.store.conversations.find((item) => item.id === convId);
    if (!c) return null;

    const msgs = this.store.messages
      .filter((m) => m.conversationId === c.id)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderType: m.senderType,
        content: decryptText(m.contentEncrypted, m.iv, m.authTag),
        createdAt: m.createdAt,
        readAt: m.readAt,
      }));

    let title: string | undefined;
    if (c.titleEncrypted && c.titleIv) {
      title = decryptText(c.titleEncrypted, c.titleIv);
    }

    const student = this.findUserById(c.studentId);

    const activeLock = this.getActiveLock(c.id);

    return {
      id: c.id,
      studentPseudonym: student?.pseudonym || "Anonyme",
      category: c.category,
      status: c.status,
      priority: c.priority,
      isSensitive: c.isSensitive,
      title,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      closedAt: c.closedAt,
      autoPurgeAt: c.autoPurgeAt,
      lock: activeLock
        ? {
            lockedByAdminId: activeLock.lockedByAdminId,
            lockedByName: activeLock.lockedByName,
            expiresAt: activeLock.expiresAt,
            isLockedByMe: false,
          }
        : undefined,
      messages: msgs,
    };
  }

  addStudentReply(
    convId: string,
    studentId: string,
    contentPlain: string
  ): Message | null {
    const conv = this.store.conversations.find(
      (c) => c.id === convId && c.studentId === studentId
    );
    if (!conv) return null;

    const enc = encryptText(contentPlain);
    const msg: Message = {
      id: "m-" + Math.random().toString(36).substring(2, 9),
      conversationId: convId,
      senderType: "STUDENT",
      contentEncrypted: enc.encryptedHex,
      iv: enc.ivHex,
      authTag: enc.authTagHex,
      createdAt: new Date().toISOString(),
    };

    conv.status = "NEW";
    conv.updatedAt = new Date().toISOString();

    const { isSensitive, priority } = detectSensibility(contentPlain);
    if (isSensitive) {
      conv.isSensitive = true;
      conv.priority = priority;
    }

    this.store.messages.push(msg);
    this.save();
    return msg;
  }

  deleteConversation(convId: string, studentId: string): boolean {
    const conv = this.store.conversations.find(
      (c) => c.id === convId && c.studentId === studentId
    );
    if (!conv) return false;

    this.store.messages = this.store.messages.filter(
      (m) => m.conversationId !== convId
    );
    this.store.internalNotes = this.store.internalNotes.filter(
      (n) => n.conversationId !== convId
    );
    this.store.messageLocks = this.store.messageLocks.filter(
      (l) => l.conversationId !== convId
    );
    this.store.reviewRequests = this.store.reviewRequests.filter(
      (r) => r.conversationId !== convId
    );
    this.store.conversations = this.store.conversations.filter(
      (c) => c.id !== convId
    );

    this.save();
    return true;
  }

  // --- GESTION DES EXPIRATIONS (RÉTENTION STRICTE 30 JOURS) ---
  purgeExpiredConversations(): number {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 3600 * 1000;

    const expired = this.store.conversations.filter((c) => {
      const updated = new Date(c.updatedAt).getTime();
      return updated < thirtyDaysAgo;
    });

    if (expired.length === 0) return 0;

    const expiredIds = new Set(expired.map((c) => c.id));
    this.store.messages = this.store.messages.filter(
      (m) => !expiredIds.has(m.conversationId)
    );
    this.store.internalNotes = this.store.internalNotes.filter(
      (n) => !expiredIds.has(n.conversationId)
    );
    this.store.messageLocks = this.store.messageLocks.filter(
      (l) => !expiredIds.has(l.conversationId)
    );
    this.store.reviewRequests = this.store.reviewRequests.filter(
      (r) => !expiredIds.has(r.conversationId)
    );
    this.store.conversations = this.store.conversations.filter(
      (c) => !expiredIds.has(c.id)
    );

    this.save();
    return expired.length;
  }

  // --- BACK-OFFICE MULTI-RÉPONDANTS & ANTI-COLLISION ---
  getAdminQueue(filter?: {
    unassignedOnly?: boolean;
    assignedToAdminId?: string;
    sensitiveOnly?: boolean;
  }): Array<
    DecryptedConversation & {
      assignedToName?: string;
      isLockedByMe: boolean;
      notesCount: number;
    }
  > {
    this.purgeExpiredConversations();
    this.cleanupExpiredLocks();

    let list = this.store.conversations;

    if (filter?.sensitiveOnly) {
      list = list.filter((c) => c.isSensitive);
    }

    const priorityWeight: Record<PriorityLevel, number> = {
      CRITICAL: 3,
      HIGH: 2,
      NORMAL: 1,
    };

    const mapped = list.map((c) => {
      const decrypted = this.getConversationById(c.id)!;
      const lock = this.store.messageLocks.find(
        (l) => l.conversationId === c.id
      );
      const isLockedByMe =
        lock?.lockedByAdminId === filter?.assignedToAdminId;
      const notes = this.store.internalNotes.filter(
        (n) => n.conversationId === c.id
      );

      return {
        ...decrypted,
        assignedToName: lock ? lock.lockedByName : undefined,
        isLockedByMe: !!isLockedByMe,
        notesCount: notes.length,
      };
    });

    let filtered = mapped;
    if (filter?.unassignedOnly) {
      filtered = mapped.filter((item) => !item.assignedToName);
    } else if (filter?.assignedToAdminId) {
      filtered = mapped.filter((item) => item.isLockedByMe);
    }

    return filtered.sort((a, b) => {
      const pDiff =
        priorityWeight[b.priority] - priorityWeight[a.priority];
      if (pDiff !== 0) return pDiff;
      return (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });
  }

  // --- VERROUILLAGE ANTI-COLLISION (20 MINUTES) ---
  acquireLock(
    conversationId: string,
    adminId: string,
    adminName: string
  ): { success: boolean; message?: string; lockedBy?: string } {
    this.cleanupExpiredLocks();

    const existing = this.store.messageLocks.find(
      (l) => l.conversationId === conversationId
    );

    if (existing) {
      if (existing.lockedByAdminId === adminId) {
        existing.expiresAt = new Date(
          Date.now() + 20 * 60 * 1000
        ).toISOString();
        this.save();
        return { success: true };
      }
      return {
        success: false,
        message: `Dossier actuellement pris en charge par ${existing.lockedByName}. Verrouillage anti-collision actif.`,
        lockedBy: existing.lockedByName,
      };
    }

    const newLock: MessageLock = {
      conversationId,
      lockedByAdminId: adminId,
      lockedByName: adminName,
      lockedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    };

    const conv = this.store.conversations.find(
      (c) => c.id === conversationId
    );
    if (conv && conv.status === "NEW") {
      conv.status = "IN_PROGRESS";
      conv.updatedAt = new Date().toISOString();
    }

    this.store.messageLocks = this.store.messageLocks.filter(
      (l) => l.conversationId !== conversationId
    );
    this.store.messageLocks.push(newLock);

    this.logAudit({
      adminId,
      adminName,
      actionType: "ACQUIRE_LOCK",
      targetResourceType: "CONVERSATION",
      targetResourceId: conversationId,
      metadataSanitized: { adminName, expiresAt: newLock.expiresAt },
      ipSubnetHash: "local-node",
    });

    this.save();
    return { success: true };
  }

  releaseLock(conversationId: string, adminId: string): boolean {
    const existing = this.store.messageLocks.find(
      (l) => l.conversationId === conversationId
    );
    if (!existing || existing.lockedByAdminId !== adminId) {
      return false;
    }

    this.store.messageLocks = this.store.messageLocks.filter(
      (l) => l.conversationId !== conversationId
    );

    this.logAudit({
      adminId,
      adminName: existing.lockedByName,
      actionType: "RELEASE_LOCK",
      targetResourceType: "CONVERSATION",
      targetResourceId: conversationId,
      ipSubnetHash: "local-node",
    });

    this.save();
    return true;
  }

  getActiveLock(conversationId: string): MessageLock | null {
    this.cleanupExpiredLocks();
    return (
      this.store.messageLocks.find(
        (l) => l.conversationId === conversationId
      ) || null
    );
  }

  private cleanupExpiredLocks(): void {
    const now = Date.now();
    const active = this.store.messageLocks.filter(
      (l) => new Date(l.expiresAt).getTime() > now
    );
    if (active.length !== this.store.messageLocks.length) {
      this.store.messageLocks = active;
      this.save();
    }
  }

  // --- RÉPONSE COLLECTIVE DR IPLOVE (SIGNATURE UNIQUE) ---
  sendAdminResponse(
    conversationId: string,
    adminId: string,
    adminName: string,
    responsePlain: string
  ): Message {
    const enc = encryptText(responsePlain);
    const msgId = "m-" + Math.random().toString(36).substring(2, 9);

    const msg: Message = {
      id: msgId,
      conversationId,
      senderType: "DR_IPLOVE",
      senderAdminIdInternal: adminId,
      contentEncrypted: enc.encryptedHex,
      iv: enc.ivHex,
      authTag: enc.authTagHex,
      createdAt: new Date().toISOString(),
    };

    const conv = this.store.conversations.find(
      (c) => c.id === conversationId
    );
    if (conv) {
      conv.status = "ANSWERED";
      conv.updatedAt = new Date().toISOString();
    }

    this.store.messages.push(msg);
    this.store.messageLocks = this.store.messageLocks.filter(
      (l) => l.conversationId !== conversationId
    );

    this.logAudit({
      adminId,
      adminName,
      actionType: "SEND_RESPONSE",
      targetResourceType: "CONVERSATION",
      targetResourceId: conversationId,
      metadataSanitized: { signature: "Dr IPLOVE" },
      ipSubnetHash: "local-node",
    });

    this.save();
    return msg;
  }

  // --- NOTES INTERNES (SECRET ÉTUDIANT PRÉSERVÉ) ---
  addInternalNote(
    conversationId: string,
    adminId: string,
    adminName: string,
    notePlain: string
  ): InternalNote {
    const enc = encryptText(notePlain);
    const note: InternalNote = {
      id: "n-" + Math.random().toString(36).substring(2, 9),
      conversationId,
      authorAdminId: adminId,
      authorName: adminName,
      noteEncrypted: enc.encryptedHex,
      iv: enc.ivHex,
      authTag: enc.authTagHex,
      createdAt: new Date().toISOString(),
    };

    this.store.internalNotes.push(note);
    this.save();
    return note;
  }

  getInternalNotes(
    conversationId: string
  ): Array<{ id: string; authorName: string; note: string; createdAt: string }> {
    return this.store.internalNotes
      .filter((n) => n.conversationId === conversationId)
      .map((n) => ({
        id: n.id,
        authorName: n.authorName,
        note: decryptText(n.noteEncrypted, n.iv, n.authTag),
        createdAt: n.createdAt,
      }));
  }

  // --- PROTOCOLE DE RELECTURE À 4 YEUX ---
  requestReview(
    conversationId: string,
    adminId: string,
    adminName: string,
    draftPlain: string,
    notes?: string
  ): ReviewRequest {
    const enc = encryptText(draftPlain);
    const req: ReviewRequest = {
      id: "rev-" + Math.random().toString(36).substring(2, 9),
      conversationId,
      requestedByAdminId: adminId,
      requestedByName: adminName,
      draftContentEncrypted: enc.encryptedHex,
      iv: enc.ivHex,
      authTag: enc.authTagHex,
      reviewStatus: "PENDING",
      feedbackNotes: notes,
      createdAt: new Date().toISOString(),
    };

    const conv = this.store.conversations.find(
      (c) => c.id === conversationId
    );
    if (conv) {
      conv.status = "UNDER_REVIEW";
      conv.updatedAt = new Date().toISOString();
    }

    this.store.reviewRequests.push(req);
    this.save();
    return req;
  }

  // --- CHRONIQUES PUBLIQUES ---
  getPublicChronicles(): Chronicle[] {
    return this.store.chronicles
      .filter((c) => c.studentConsentGranted)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }

  // --- MODÈLES DE RÉPONSES ---
  getResponseTemplates(category?: ConversationCategory): ResponseTemplate[] {
    let t = this.store.responseTemplates.filter((item) => item.isActive);
    if (category) {
      t = t.filter(
        (item) => item.category === category || item.category === "GENERAL"
      );
    }
    return t;
  }

  // --- JOURNAL D'AUDIT INALTÉRABLE ---
  logAudit(entry: Omit<AuditLog, "id" | "createdAt">): void {
    const log: AuditLog = {
      id: "log-" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      ...entry,
    };
    this.store.auditLogs.unshift(log);
    if (this.store.auditLogs.length > 2000) {
      this.store.auditLogs = this.store.auditLogs.slice(0, 2000);
    }
    this.save();
  }

  getAuditLogs(): AuditLog[] {
    return this.store.auditLogs;
  }
}

export const db = new JsonDatabase();
