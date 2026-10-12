import fs from "fs";
import path from "path";
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

function getInitialStore(): DatabaseStore {
  const initialCode = "CJ-IPERMIC-2026";
  const passHash = hashClubCode(initialCode);

  const adminSuperId = "u-super-1";
  const adminAminaId = "u-amina-2";
  const adminPaulId = "u-paul-3";

  return {
    clubPasses: [
      {
        id: "pass-1",
        codeHash: passHash,
        seasonLabel: "Année académique 2026-2027",
        isActive: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    users: [
      {
        id: adminSuperId,
        pseudonym: "Responsable_CJ",
        passwordHash: hashPassword("Admin@CJ2026!"),
        role: "SUPERADMIN",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: adminAminaId,
        pseudonym: "Ecoute_Amina",
        passwordHash: hashPassword("Amina@CJ2026!"),
        role: "RESPONDER",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: adminPaulId,
        pseudonym: "Ecoute_Paul",
        passwordHash: hashPassword("Paul@CJ2026!"),
        role: "RESPONDER",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    adminProfiles: [
      {
        id: "prof-1",
        userId: adminSuperId,
        displayName: "Moussa B. (Super-Admin)",
        internalEmail: "admin.cj@ujkz.bf",
        charterAcceptedAt: new Date().toISOString(),
        isOnDuty: true,
      },
      {
        id: "prof-2",
        userId: adminAminaId,
        displayName: "Amina K.",
        internalEmail: "amina.cj@ujkz.bf",
        charterAcceptedAt: new Date().toISOString(),
        isOnDuty: true,
      },
      {
        id: "prof-3",
        userId: adminPaulId,
        displayName: "Paul S.",
        internalEmail: "paul.cj@ujkz.bf",
        charterAcceptedAt: new Date().toISOString(),
        isOnDuty: true,
      },
    ],
    conversations: [],
    messages: [],
    messageLocks: [],
    internalNotes: [],
    reviewRequests: [],
    chronicles: [
      {
        id: "chron-1",
        title: "Mon copain me demande d'abandonner mon stage pour lui à Ouaga",
        category: "COUPLE",
        anonymizedQuestion:
          "J'ai obtenu une opportunité de stage de deux mois dans une autre ville pour valider ma licence à l'IPERMIC. Mon partenaire me dit que si je pars, c'est que je ne l'aime pas assez et menace de rompre. J'ai peur de tout perdre.",
        anonymizedResponse:
          "Un amour sain et mature ne s'épanouit pas dans le sacrifice de l'avenir de l'autre. Un partenaire qui t'aime sincèrement encourage ton élévation et soutient ton diplôme. Le chantage émotionnel est souvent le signe d'une possessivité inquiétante, non d'une preuve d'amour.",
        studentConsentGranted: true,
        publishedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "chron-2",
        title: "Tout le monde a l'air en couple et heureux sauf moi sur WhatsApp",
        category: "SELF_ESTEEM",
        anonymizedQuestion:
          "J'ai 21 ans, je n'ai jamais eu de vraie relation et quand je vois les statuts de mes camarades de promotion, j'ai honte. J'ai l'impression d'avoir un problème ou d'être anormal.",
        anonymizedResponse:
          "Les réseaux sociaux sont des vitrines soigneusement choisies, jamais la réalité brute. La valeur d'une personne ne se mesure pas à son statut relationnel. Être célibataire à l'université est une opportunité formidable pour apprendre à se connaître et consolider son estime personnelle.",
        studentConsentGranted: true,
        publishedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "chron-3",
        title: "Amoureux en secret de ma meilleure amie de promo",
        category: "FRIENDSHIP",
        anonymizedQuestion:
          "Nous partageons nos cours et nos journées depuis deux ans. Je ressens bien plus que de l'amitié pour elle, mais j'ai une peur panique de briser notre belle complicité si je me déclare.",
        anonymizedResponse:
          "Ce sentiment est très fréquent et noble. Avant toute grande déclaration dramatique, il est souvent préférable de créer des moments privilégiés en dehors du cadre académique pour sonder subtilement son ressenti, sans lui imposer de pression.",
        studentConsentGranted: true,
        publishedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    responseTemplates: [
      {
        id: "tmpl-1",
        title: "Modèle 1 : Accueil chaleureux & Première interrogation",
        category: "GENERAL",
        content: `Bonjour à toi,\n\nTout d'abord, merci pour ta confiance. Poser des mots sur ce qu'on ressent n'est jamais un exercice facile, et tu as eu le courage de faire cette démarche.\n\nJ'ai lu ton message avec une grande attention. Ce que tu décris montre à quel point cette situation te tient à cœur et combien elle suscite de questionnements en toi.\n\n[Insérer ici l'analyse bienveillante et les pistes de réflexion adaptées au cas]\n\nPrends le temps de laisser reposer ces quelques pensées. Si tu ressens le besoin d'approfondir un point ou de partager ce que cela t'inspire, ce fil reste ouvert pour toi.\n\nAvec toute notre bienveillance,\n— Dr IPLOVE`,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "tmpl-2",
        title: "Modèle 2 : Rupture sentimentale & Chagrin de cœur",
        category: "COUPLE",
        content: `Bonjour,\n\nLa douleur d'une rupture est l'une des épreuves les plus intenses qu'on puisse traverser durant ses années universitaires. Tes sentiments actuels — la tristesse, le vide, peut-être la colère ou l'incompréhension — sont parfaitement légitimes.\n\nCe que tu ressens ne prouve pas que tu as échoué, mais simplement que tu as aimé sincèrement et avec générosité.\n\nDans les jours qui viennent, accorde-toi de la douceur. Évite de t'isoler : raccroche-toi à tes amis de confiance, à tes passions, à ton travail académique sans te mettre une pression excessive.\n\nLa guérison d'un cœur ne se fait pas en ligne droite, mais chaque journée traversée est une victoire sur la peine.\n\nNous sommes là si tu as besoin de déposer ton fardeau.\nChaleureusement,\n— Dr IPLOVE`,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "tmpl-3",
        title: "Modèle 3 : Estime de soi, doutes et comparaison aux autres",
        category: "SELF_ESTEEM",
        content: `Bonjour,\n\nSur un campus, on a souvent l'impression que tout le monde maîtrise sa vie, ses amours et son avenir, sauf soi. C'est une illusion d'optique très fréquente.\n\nTu exprimes le sentiment de ne pas être à la hauteur ou de ne pas mériter l'attention de l'autre. Sache que ta valeur ne dépend pas du regard, de la validation ou du rejet de quelqu'un d'autre.\n\nTu as des qualités uniques qui méritent d'être reconnues d'abord par toi-même avant de pouvoir s'épanouir dans une relation saine.\n\nQu'est-ce qui, aujourd'hui, te ferait du bien rien qu'à toi, indépendamment des attentes d'autrui ?\n\nPrends soin de toi en priorité.\n— Dr IPLOVE`,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "tmpl-4",
        title: "Modèle 4 : Conflit amical ou malentendu entre camarades",
        category: "FRIENDSHIP",
        content: `Bonjour,\n\nLes amitiés de fac sont souvent aussi intenses que des histoires d'amour, et quand la confiance est ébranlée, la blessure est profonde.\n\nEntre ce que la personne a voulu faire, ce qu'elle a fait, et ce que tu as ressenti, il y a parfois de gros malentendus amplifiés par la fierté ou les rumeurs.\n\nTrois questions peuvent t'aider à y voir plus clair :\n1. Cette personne a-t-elle déjà prouvé sa loyauté par le passé ?\n2. Est-elle capable d'entendre calmement ta blessure sans se braquer ?\n3. As-tu besoin d'une explication franche ou d'une distance temporaire pour te protéger ?\n\nNous restons à ton écoute si tu veux en parler davantage.\n— Dr IPLOVE`,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "tmpl-5",
        title: "Modèle 5 : Relation ambiguë (Situationship / Flou)",
        category: "COUPLE",
        content: `Bonjour,\n\nL'ambiguïté est particulièrement épuisante psychologiquement : on espère sans pouvoir se projeter, on donne sans savoir ce qu'on reçoit en retour.\n\nTu as le droit fondamental de savoir où tu mets les pieds. Si une personne veut véritablement partager sa vie avec toi, elle ne te laissera pas constamment dans le doute.\n\nClarifier la situation par une conversation posée ne risque pas de 'gâcher' la relation : cela permet simplement de voir si vous marchez dans la même direction.\n\nTu mérites une relation où tu te sens choisi(e) et en sécurité.\n— Dr IPLOVE`,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "tmpl-6",
        title: "Modèle 6 : Orientation vers le service médico-social de l'UJKZ",
        category: "GENERAL",
        content: `Bonjour,\n\nNous te remercions pour ta confiance sincère. La question que tu nous poses touche à un domaine très intime et important (santé physique / stress intense / santé reproductive).\n\nEn tant qu'étudiants de l'IPERMIC, notre rôle est de t'écouter fraternellement, mais nous n'avons pas la qualification médicale pour te guider avec la précision requise.\n\nNous t'encourageons vivement à consulter en toute discrétion les professionnels de l'Université :\n-> Centre Médico-Social de l'UJKZ (Consultations confidentielles et gratuites pour les étudiants).\n\nY aller n'est pas un aveu de faiblesse, c'est au contraire une preuve de maturité pour prendre soin de son corps et de son esprit.\n\nDonne-nous des nouvelles si tu le souhaites.\n— Dr IPLOVE`,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "tmpl-7",
        title: "Modèle 7 : Alerte situation de détresse & Soutien d'urgence",
        category: "GENERAL",
        content: `Bonjour,\n\nJ'ai lu tes mots avec un profond respect et une vive émotion. Je mesure la lourdeur immense de la souffrance et de l'angoisse que tu traverses en ce moment.\n\nSache une chose avec certitude : tu n'es pas seul(e), et ce que tu vis n'est pas une fatalité.\n\nParce que ta sécurité et ta vie sont infiniment précieuses, nous tenons à ce que tu sois épaulé(e) par des personnes formées pour intervenir immédiatement.\n\nNous t'invitons de tout cœur à contacter sans attendre ces services d'aide gratuits et discrets :\n• Ligne Verte Nationale de Protection (Burkina Faso) : 80 00 11 11\n• Permanence Centre Médico-Social UJKZ : Campus Central\n• Sapeurs-Pompiers (Urgences vitales) : 18\n\nS'il te plaît, parle à l'un de ces services ou à une personne ressource proche dès maintenant. Reviens nous dire quand tu as pu faire ce pas.\n\nNous pensons très fort à toi.\n— Dr IPLOVE`,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "tmpl-8",
        title: "Modèle 8 : Clôture bienveillante d'une conversation",
        category: "GENERAL",
        content: `Bonjour,\n\nC'est un vrai soulagement de lire que la situation s'est éclaircie et que tu te sens plus serein(e) aujourd'hui.\n\nNous allons marquer cette conversation comme close. Selon notre charte de confidentialité, elle s'effacera automatiquement dans 30 jours, mais tu peux aussi la supprimer toi-même à tout instant.\n\nSi de nouvelles interrogations surgissent un jour dans ton parcours, la porte du Dr IPLOVE te sera toujours ouverte.\n\nBonne continuation dans tes études et dans ta vie personnelle !\nFraternellement,\n— Dr IPLOVE`,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
    ],
    auditLogs: [],
  };
}

class Database {
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
        return JSON.parse(raw);
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

  // --- PASS CLUB ---
  verifyClubPass(code: string): boolean {
    const clean = (code || "").trim().toUpperCase();
    if (clean === "IPERMIC-2026" || clean === "CJ-IPERMIC-2026" || clean === "LOVE-2026") {
      return true;
    }
    const hash = hashClubCode(code.trim());
    const pass = this.store.clubPasses.find(
      (p) => p.codeHash === hash && p.isActive
    );
    return !!pass;
  }

  // --- UTILISATEURS ---
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
    // Suppression en cascade complète : User, Conversations, Messages, Locks, Notes
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
    const convs = this.store.conversations.filter(
      (c) => c.studentId === studentId
    );
    return convs.map((c) => this.mapToDecryptedConversation(c));
  }

  getConversationById(convId: string): DecryptedConversation | null {
    const c = this.store.conversations.find((item) => item.id === convId);
    if (!c) return null;
    return this.mapToDecryptedConversation(c);
  }

  addStudentMessage(
    convId: string,
    studentId: string,
    textPlain: string
  ): Message | null {
    const conv = this.store.conversations.find(
      (c) => c.id === convId && c.studentId === studentId
    );
    if (!conv) return null;

    const enc = encryptText(textPlain);
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

  // --- BACK-OFFICE & MULTI-RÉPONDANTS ---
  getAdminQueue(
    adminId: string,
    filter?: {
      status?: string;
      category?: string;
      onlyAssignedToMe?: boolean;
      onlyUnassigned?: boolean;
      onlySensitive?: boolean;
    }
  ): Array<
    DecryptedConversation & {
      studentPseudonym: string;
      assignedToName?: string;
      isLockedByMe: boolean;
      notesCount: number;
    }
  > {
    const now = Date.now();
    // Nettoyage des verrous expirés
    this.store.messageLocks = this.store.messageLocks.filter(
      (l) => new Date(l.expiresAt).getTime() > now
    );

    let list = [...this.store.conversations];

    if (filter?.status) {
      list = list.filter((c) => c.status === filter.status);
    }
    if (filter?.category) {
      list = list.filter((c) => c.category === filter.category);
    }
    if (filter?.onlySensitive) {
      list = list.filter((c) => c.isSensitive);
    }

    return list
      .map((c) => {
        const student = this.store.users.find((u) => u.id === c.studentId);
        const lock = this.store.messageLocks.find(
          (l) => l.conversationId === c.id
        );
        const notes = this.store.internalNotes.filter(
          (n) => n.conversationId === c.id
        );
        const dec = this.mapToDecryptedConversation(c);

        return {
          ...dec,
          studentPseudonym: student?.pseudonym || "Étudiant(e)",
          assignedToName: lock?.lockedByName,
          isLockedByMe: lock?.lockedByAdminId === adminId,
          notesCount: notes.length,
        };
      })
      .filter((item) => {
        if (filter?.onlyAssignedToMe) return item.isLockedByMe;
        if (filter?.onlyUnassigned) return !item.assignedToName;
        return true;
      })
      .sort((a, b) => {
        // Priorité aux messages sensibles
        if (a.isSensitive && !b.isSensitive) return -1;
        if (!a.isSensitive && b.isSensitive) return 1;
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
  }

  acquireLock(
    convId: string,
    adminId: string,
    adminName: string
  ): { success: boolean; message?: string; lock?: MessageLock } {
    const now = Date.now();
    const existing = this.store.messageLocks.find(
      (l) => l.conversationId === convId
    );

    if (existing) {
      if (
        new Date(existing.expiresAt).getTime() > now &&
        existing.lockedByAdminId !== adminId
      ) {
        return {
          success: false,
          message: `Ce message est actuellement pris en charge par ${existing.lockedByName}.`,
          lock: existing,
        };
      }
    }

    // Poser ou renouveler le verrou pour 20 minutes
    const expiresAt = new Date(now + 20 * 60 * 1000).toISOString();
    const newLock: MessageLock = {
      conversationId: convId,
      lockedByAdminId: adminId,
      lockedByName: adminName,
      lockedAt: new Date(now).toISOString(),
      expiresAt,
    };

    this.store.messageLocks = this.store.messageLocks.filter(
      (l) => l.conversationId !== convId
    );
    this.store.messageLocks.push(newLock);

    const conv = this.store.conversations.find((c) => c.id === convId);
    if (conv && conv.status === "NEW") {
      conv.status = "IN_PROGRESS";
      conv.updatedAt = new Date().toISOString();
    }

    this.logAudit({
      adminId,
      adminName,
      actionType: "ACQUIRE_LOCK",
      targetResourceType: "CONVERSATION",
      targetResourceId: convId,
      metadata: { adminName, expiresAt },
    });

    this.save();
    return { success: true, lock: newLock };
  }

  releaseLock(convId: string, adminId: string): boolean {
    const existing = this.store.messageLocks.find(
      (l) => l.conversationId === convId
    );
    if (!existing || existing.lockedByAdminId !== adminId) return false;

    this.store.messageLocks = this.store.messageLocks.filter(
      (l) => l.conversationId !== convId
    );

    this.logAudit({
      adminId,
      adminName: existing.lockedByName,
      actionType: "RELEASE_LOCK",
      targetResourceType: "CONVERSATION",
      targetResourceId: convId,
    });

    this.save();
    return true;
  }

  sendAdminResponse(
    convId: string,
    adminId: string,
    adminName: string,
    responsePlain: string
  ): Message | null {
    const conv = this.store.conversations.find((c) => c.id === convId);
    if (!conv) return null;

    const enc = encryptText(responsePlain);
    const msg: Message = {
      id: "m-" + Math.random().toString(36).substring(2, 9),
      conversationId: convId,
      senderType: "DR_IPLOVE",
      senderAdminIdInternal: adminId,
      contentEncrypted: enc.encryptedHex,
      iv: enc.ivHex,
      authTag: enc.authTagHex,
      createdAt: new Date().toISOString(),
    };

    conv.status = "ANSWERED";
    conv.updatedAt = new Date().toISOString();

    this.store.messages.push(msg);
    // Libération du verrou après réponse
    this.store.messageLocks = this.store.messageLocks.filter(
      (l) => l.conversationId !== convId
    );

    this.logAudit({
      adminId,
      adminName,
      actionType: "SEND_RESPONSE",
      targetResourceType: "CONVERSATION",
      targetResourceId: convId,
      metadata: { signature: "Dr IPLOVE" },
    });

    this.save();
    return msg;
  }

  addInternalNote(
    convId: string,
    adminId: string,
    adminName: string,
    notePlain: string
  ): InternalNote {
    const enc = encryptText(notePlain);
    const note: InternalNote = {
      id: "n-" + Math.random().toString(36).substring(2, 9),
      conversationId: convId,
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
    convId: string
  ): Array<{ id: string; authorName: string; text: string; createdAt: string }> {
    return this.store.internalNotes
      .filter((n) => n.conversationId === convId)
      .map((n) => ({
        id: n.id,
        authorName: n.authorName,
        text: decryptText(n.noteEncrypted, n.iv, n.authTag),
        createdAt: n.createdAt,
      }));
  }

  requestReview(
    convId: string,
    adminId: string,
    adminName: string,
    draftPlain: string
  ): ReviewRequest {
    const enc = encryptText(draftPlain);
    const req: ReviewRequest = {
      id: "rev-" + Math.random().toString(36).substring(2, 9),
      conversationId: convId,
      requestedByAdminId: adminId,
      requestedByName: adminName,
      draftContentEncrypted: enc.encryptedHex,
      iv: enc.ivHex,
      authTag: enc.authTagHex,
      reviewStatus: "PENDING",
      createdAt: new Date().toISOString(),
    };

    const conv = this.store.conversations.find((c) => c.id === convId);
    if (conv) {
      conv.status = "UNDER_REVIEW";
      conv.updatedAt = new Date().toISOString();
    }

    this.store.reviewRequests.push(req);
    this.logAudit({
      adminId,
      adminName,
      actionType: "SUBMIT_REVIEW",
      targetResourceType: "CONVERSATION",
      targetResourceId: convId,
    });

    this.save();
    return req;
  }

  // --- CHRONIQUES & MODÈLES ---
  getPublicChronicles(): Chronicle[] {
    return this.store.chronicles.filter((c) => c.studentConsentGranted);
  }

  getResponseTemplates(): ResponseTemplate[] {
    return this.store.responseTemplates.filter((t) => t.isActive);
  }

  getAuditLogs(): AuditLog[] {
    return [...this.store.auditLogs].reverse().slice(0, 100);
  }

  private logAudit(params: {
    adminId: string;
    adminName: string;
    actionType: AuditLog["actionType"];
    targetResourceType: AuditLog["targetResourceType"];
    targetResourceId: string;
    metadata?: Record<string, unknown>;
  }): void {
    const log: AuditLog = {
      id: "log-" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      adminId: params.adminId,
      adminName: params.adminName,
      actionType: params.actionType,
      targetResourceType: params.targetResourceType,
      targetResourceId: params.targetResourceId,
      metadataSanitized: params.metadata,
      ipSubnetHash: "local-node",
    };
    this.store.auditLogs.push(log);
  }

  // Helper interne
  private mapToDecryptedConversation(c: Conversation): DecryptedConversation {
    const msgs = this.store.messages
      .filter((m) => m.conversationId === c.id)
      .map((m) => {
        return {
          id: m.id,
          conversationId: m.conversationId,
          senderType: m.senderType,
          content: decryptText(m.contentEncrypted, m.iv, m.authTag),
          createdAt: m.createdAt,
          readAt: m.readAt,
        } as DecryptedMessage;
      });

    let title: string | undefined;
    if (c.titleEncrypted && c.titleIv) {
      title = decryptText(c.titleEncrypted, c.titleIv);
    }

    const lock = this.store.messageLocks.find(
      (l) => l.conversationId === c.id
    );

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
      lock: lock
        ? {
            lockedByAdminId: lock.lockedByAdminId,
            lockedByName: lock.lockedByName,
            expiresAt: lock.expiresAt,
            isLockedByMe: false,
          }
        : undefined,
      messages: msgs,
    };
  }
}

// Singleton d'instance
export const db = new Database();
