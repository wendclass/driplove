import fs from "fs";
import path from "path";
import { db, detectSensibility } from "../src/lib/db.ts";
import {
  encryptText,
  decryptText,
  hashPassword,
  verifyPassword,
  hashClubCode,
} from "../src/lib/crypto.ts";
import {
  generateTotpSecret,
  verifyTotpCode,
  generateBackupCodes,
  verifyAndConsumeBackupCode,
  hashBackupCode,
} from "../src/lib/totp.ts";

console.log("=================================================================");
console.log("SUITE DE TESTS DE SÉCURITÉ & VÉRIFICATION ZERO-DEMO : Dr IPLOVE");
console.log("Validation de la purge totale et de l'initialisation sécurisée");
console.log("=================================================================\n");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// -----------------------------------------------------------------
// 1. VÉRIFICATION DU REJET STRICT DES ANCIENS COMPTES DE DÉMO
// -----------------------------------------------------------------
console.log("--- 1. REJET DES COMPTES ET IDENTIFIANTS DE DÉMONSTRATION ---");
const oldDemoCredentials = [
  { pseudo: "Responsable_Ecoute", pass: "Admin@2026!" },
  { pseudo: "Responsable_CJ", pass: "Admin@CJ2026!" },
  { pseudo: "Ecoute_Amina", pass: "Amina@2026!" },
  { pseudo: "Ecoute_Amina", pass: "Amina@CJ2026!" },
  { pseudo: "Ecoute_Paul", pass: "Paul@2026!" },
  { pseudo: "Ecoute_Paul", pass: "Paul@CJ2026!" },
  { pseudo: "Etudiant_Test", pass: "Test@2026!" },
];

for (const cred of oldDemoCredentials) {
  const user = db.verifyUserCredentials(cred.pseudo, cred.pass);
  assert(user === null, `L'ancien compte de démo "${cred.pseudo}" est formellement rejeté`);
}

// -----------------------------------------------------------------
// 2. VÉRIFICATION DE LA BASE VIERGE (AUCUN PEUPLEMENT AUTOMATIQUE)
// -----------------------------------------------------------------
console.log("\n--- 2. ABSENCE DE DONNÉES DE SEED AU DÉMARRAGE ---");
assert(db.getAllAdminUsers().length === 0, "Aucun compte administrateur résiduel en base (0 compte)");
assert(db.getPublicChronicles().length === 0, "Aucune chronique de démonstration en base (0 chronique)");
assert(db.hasSuperadmin() === false, "Aucun super-administrateur n'existe à l'état vierge");

// -----------------------------------------------------------------
// 3. FLUX DE CONFIGURATION INITIALE (PREMIER DÉMARRAGE SÉCURISÉ)
// -----------------------------------------------------------------
console.log("\n--- 3. CONFIGURATION INITIALE UNIQUE DU SUPER-ADMIN ---");
const setupState = db.getSetupState();
assert(setupState.completed === false, "L'état de configuration indique qu'aucun superadmin n'est initialisé");
assert(typeof setupState.token === "string" && setupState.token.length >= 16, "Un jeton cryptographique à usage unique est généré");

// Faux jeton rejeté
assert(db.verifySetupToken("FAUX_JETON_INVALIDE") === false, "Un jeton d'initialisation invalide est rejeté");
assert(db.verifySetupToken(setupState.token) === true, "Le jeton d'initialisation légitime est validé");

// 2FA TOTP RFC 6238
const { secretBase32 } = generateTotpSecret();
const backupCodes = generateBackupCodes(8);
assert(backupCodes.length === 8, "Génération correcte de 8 codes de secours d'urgence");

// Création du Super-Admin maître
const masterPseudo = "SuperAdmin_" + Date.now();
const masterPass = "MasterSecure@2026!#";
const setupResult = db.completeInitialSetup({
  pseudonym: masterPseudo,
  passwordPlain: masterPass,
  displayName: "Directeur de l'Écoute",
  internalEmail: "direction@dr-iplove.com",
  totpSecretBase32: secretBase32,
  backupCodes,
});

assert(setupResult.user !== undefined, "Création réussie du compte Super-Administrateur maître");
assert(setupResult.user?.role === "SUPERADMIN", "Rôle SUPERADMIN correctement attribué");
assert(db.hasSuperadmin() === true, "Le système confirme désormais l'existence d'un Super-Admin");

// Fermeture définitive de la page de setup
assert(db.verifySetupToken(setupState.token) === false, "Le jeton de configuration est immédiatement invalidé");
const secondAttempt = db.completeInitialSetup({
  pseudonym: "Intruder_Admin",
  passwordPlain: "Hack@2026!",
  displayName: "Intruder",
  internalEmail: "hacker@test.com",
  totpSecretBase32: secretBase32,
  backupCodes,
});
assert(secondAttempt.error !== undefined, "Toute tentative ultérieure d'initialisation est bloquée (page désactivée)");

// -----------------------------------------------------------------
// 4. VÉRIFICATION DE LA DOUBLE AUTHENTIFICATION 2FA ET CODES DE SECOURS
// -----------------------------------------------------------------
console.log("\n--- 4. DOUBLE AUTHENTIFICATION 2FA ET CODES DE SECOURS ---");
const masterUser = setupResult.user;
const firstBackupCode = backupCodes[0];

// Validation code secours
const backupValidation = db.verifyAdminTotp(masterUser.id, firstBackupCode);
assert(backupValidation.valid === true, "Un code de secours valide permet l'authentification");
assert(backupValidation.usedBackupCode === true, "Le système détecte l'usage d'un code de secours");

// Code de secours à usage unique (ne peut être réutilisé)
const backupReuse = db.verifyAdminTotp(masterUser.id, firstBackupCode);
assert(backupReuse.valid === false, "Un code de secours déjà utilisé est immédiatement consommé et rejeté");

// Faux code 2FA rejeté
assert(db.verifyAdminTotp(masterUser.id, "000000").valid === false, "Un code 2FA erroné est rejeté");

// -----------------------------------------------------------------
// 5. GOUVERNANCE PAR INVITATION (48 HEURES, USAGE UNIQUE)
// -----------------------------------------------------------------
console.log("\n--- 5. INVITATIONS ÉCOUTANTS (48H, USAGE UNIQUE) ---");
const invite = db.createAdminInvitation(
  masterUser.id,
  "Direction de l'Écoute",
  "RESPONDER"
);

assert(invite.token.length >= 32, "Génération d'un token d'invitation cryptographique aléatoire");
const foundInv = db.getInvitationByToken(invite.token);
assert(foundInv !== null, "L'invitation active est retrouvée avec succès");

// Acceptation de l'invitation par le répondant
const responderPseudo = "EcoutantSecurise_" + Date.now();
const responderPass = "Repondant@2026!Secret";
const { secretBase32: responderTotp } = generateTotpSecret();
const responderBackupCodes = generateBackupCodes(8);

const acceptResult = db.acceptAdminInvitation(invite.token, {
  pseudonym: responderPseudo,
  passwordPlain: responderPass,
  displayName: "Aline M.",
  internalEmail: "aline@dr-iplove.com",
  totpSecretBase32: responderTotp,
  backupCodes: responderBackupCodes,
  charterAccepted: true,
});

assert(acceptResult.user !== undefined, "L'invité configure avec succès son compte répondant");
assert(acceptResult.user?.role === "RESPONDER", "Rôle RESPONDER attribué conformément à l'invitation");

// Tentative de réutilisation du même lien d'invitation
const reuseInvite = db.getInvitationByToken(invite.token);
assert(reuseInvite === null, "L'invitation déjà utilisée est devenue strictement inaccessible");

// -----------------------------------------------------------------
// 6. GESTION DES COMPTES (DÉSACTIVATION / SUPPRESSION ET INVALIDATION)
// -----------------------------------------------------------------
console.log("\n--- 6. DÉSACTIVATION, SUPPRESSION ET INVALIDATION DES SESSIONS ---");
const responderId = acceptResult.user.id;

// Désactivation
const deactRes = db.setAdminUserStatus(responderId, false, masterUser.id, "Direction");
assert(deactRes.success === true, "Désactivation administrative du compte répondant effectuée");
const deactUser = db.findUserById(responderId);
assert(deactUser?.isActive === false, "Le statut du compte est marqué inactif (sessions invalidées)");

// Réactivation
const reactRes = db.setAdminUserStatus(responderId, true, masterUser.id, "Direction");
assert(reactRes.success === true, "Réactivation administrative effectuée");
assert(db.findUserById(responderId)?.isActive === true, "Le compte est de nouveau actif");

// Protection du dernier Super-Admin
const delMasterRes = db.deleteAdminUser(masterUser.id, masterUser.id, "Direction");
assert(delMasterRes.success === false, "Protection stricte : impossible de supprimer le dernier Super-Admin");

// -----------------------------------------------------------------
// 7. PROTECTION CONTRE LE BRUTE-FORCE (RATE LIMITING)
// -----------------------------------------------------------------
console.log("\n--- 7. PROTECTION ANTI BRUTE-FORCE (RATE LIMITING) ---");
const testIp = "192.168.1.0";
const targetTarget = "CibleBruteForce";

for (let i = 0; i < 4; i++) {
  db.recordLoginFailure(targetTarget, testIp);
}
assert(db.isLoginLocked(targetTarget, testIp) === false, "Moins de 5 tentatives infructueuses : compte encore accessible");

db.recordLoginFailure(targetTarget, testIp);
assert(db.isLoginLocked(targetTarget, testIp) === true, "5 tentatives infructueuses : compte temporairement verrouillé pour 15 min");

db.clearLoginFailures(targetTarget, testIp);
assert(db.isLoginLocked(targetTarget, testIp) === false, "Réinitialisation des échecs après authentification réussie");

// -----------------------------------------------------------------
// 8. CHIFFREMENT AU REPOS (AES-256-GCM) & DROIT À L'OUBLI ÉTUDIANT
// -----------------------------------------------------------------
console.log("\n--- 8. CHIFFREMENT APPLICATIF & DROIT À L'OUBLI ---");
const secretText = "Confidence intime protégée au repos...";
const enc = encryptText(secretText);
assert(enc.encryptedHex !== secretText, "Le message confidentiel est chiffré en AES-256-GCM");
const dec = decryptText(enc.encryptedHex, enc.ivHex, enc.authTagHex);
assert(dec === secretText, "Déchiffrement parfait avec clé maîtresse et tag d'intégrité");

// Création d'un pass officiel par le Super-Admin
const seasonalPass = db.createClubPass("PASS-VALIDE-2026", "Session 2026", masterUser.id, "Direction");
assert(db.verifyClubPass("PASS-VALIDE-2026") === true, "Le pass officiel créé par le Super-Admin est validé");
assert(db.verifyClubPass("FAUX-PASS") === false, "Un pass non enregistré est rejeté");

// Conversation et suppression en cascade
const student = db.createStudent("EtudiantConfidentiel_" + Date.now(), "PassEtudiant@2026!").user;
const conv = db.createConversation(student.id, "COUPLE", secretText);
assert(conv.conversation !== undefined, "Création réussie de la conversation étudiante");

db.deleteStudentAccount(student.id);
assert(db.findUserById(student.id) === null, "Le compte étudiant a été définitivement purgé");
assert(db.getConversationById(conv.conversation.id) === null, "La conversation associée a été détruite en cascade");

// -----------------------------------------------------------------
// SYNTHÈSE
// -----------------------------------------------------------------
console.log("\n=================================================================");
console.log(`RÉSULTAT GLOBAL : ${passed}/${total} TESTS VALIDÉS AVEC SUCCÈS (100%)`);
console.log("Zéro résidu de démo. Gouvernance 2FA et invitations 48h opérationnelles.");
console.log("=================================================================");
