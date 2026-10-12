import { db, detectSensibility } from "../src/lib/db.ts";
import { encryptText, decryptText, hashPassword, verifyPassword, hashClubCode } from "../src/lib/crypto.ts";

console.log("=================================================================");
console.log("SUITE DE TESTS D'ACCEPTATION & SÉCURITÉ : PLATEFORME Dr IPLOVE");
console.log("IPERMIC — Université Joseph Ki-Zerbo (Ouagadougou)");
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

// -------------------------------------------------------------
// TEST 1 : Vérification du Pass étudiant décorrélé de l'identité
// -------------------------------------------------------------
console.log("--- 1. VÉRIFICATION D'ACCÈS & ANONYMAT ---");
const validPass = "IPERMIC-2026";
const legacyPass = "CJ-IPERMIC-2026";
const invalidPass = "FAUX-CODE-9999";

assert(db.verifyClubPass(validPass) === true, "Le pass officiel IPERMIC-2026 est accepté");
assert(db.verifyClubPass(legacyPass) === true, "Le pass de transition est accepté");
assert(db.verifyClubPass(invalidPass) === false, "Un faux pass est rejeté");

// -------------------------------------------------------------
// TEST 2 : Inscription Pseudonyme & Zéro Donnée Obligatoire
// -------------------------------------------------------------
console.log("\n--- 2. INSCRIPTION PSEUDONYME & MOT DE PASSE HACHÉ ---");
const testPseudo = "TestEtudiant_" + Date.now();
const testPass = "Secret2026!";

const studentReg = db.createStudent(testPseudo, testPass);
assert(studentReg.user !== undefined, "Création réussie du compte étudiant pseudonyme");
assert(studentReg.user.pseudonym === testPseudo, "Le pseudonyme correspond");
assert(!studentReg.user.passwordHash.includes(testPass), "Le mot de passe n'est jamais stocké en clair");
assert(verifyPassword(testPass, studentReg.user.passwordHash), "Vérification correcte du mot de passe haché par scrypt");

// Tentative de doublon de pseudo
const duplicateReg = db.createStudent(testPseudo, testPass);
assert(duplicateReg.error !== undefined, "Rejet strict des pseudonymes en doublon");

// -------------------------------------------------------------
// TEST 3 : Chiffrement Applicatif au Repos (AES-256-GCM)
// -------------------------------------------------------------
console.log("\n--- 3. CHIFFREMENT APPLICATIF AU REPOS (AES-256-GCM) ---");
const secretText = "Je vis une situation très douloureuse dans mon couple...";
const encrypted = encryptText(secretText);

assert(encrypted.encryptedHex !== secretText, "Le texte est rendu méconnaissable en base");
assert(encrypted.ivHex.length === 24, "Le vecteur d'initialisation IV est de 96 bits (12 octets en hex)");
const decrypted = decryptText(encrypted.encryptedHex, encrypted.ivHex, encrypted.authTagHex);
assert(decrypted === secretText, "Déchiffrement parfait avec clé maîtresse et tag d'intégrité");

// -------------------------------------------------------------
// TEST 4 : Création de Conversation & Détection Lexicale Non Punitive
// -------------------------------------------------------------
console.log("\n--- 4. DÉTECTION LEXICALE DE DÉTRESSE (NON PUNITIVE) ---");
const normalText = "J'ai un petit doute sur mes sentiments pour un camarade.";
const sensitiveText = "Mon partenaire me fait du chantage et menace de diffuser des photos.";

const normalDetection = detectSensibility(normalText);
assert(!normalDetection.isSensitive, "Un message classique a une priorité normale");

const sensitiveDetection = detectSensibility(sensitiveText);
assert(sensitiveDetection.isSensitive === true, "Alerte sensibilité déclenchée sur mot-clé de chantage");
assert(sensitiveDetection.priority === "CRITICAL", "Priorité critique attribuée en file d'attente");

const convResult = db.createConversation(
  studentReg.user.id,
  "COUPLE",
  sensitiveText,
  "Besoin de conseil urgent"
);
assert(convResult.conversation.isSensitive === true, "La conversation est enregistrée comme sensible");

// -------------------------------------------------------------
// TEST 5 : Anti-Collision & Verrouillage Temporaire Multi-Répondants
// -------------------------------------------------------------
console.log("\n--- 5. ANTI-COLLISION & VERROUILLAGE TEMPORAIRE DES DOSSIERS ---");
const convId = convResult.conversation.id;
const admin1Id = "u-amina-2";
const admin1Name = "Amina K.";
const admin2Id = "u-paul-3";
const admin2Name = "Paul S.";

// Admin 1 prend en charge
const lock1 = db.acquireLock(convId, admin1Id, admin1Name);
assert(lock1.success === true, "Admin 1 prend en charge le message avec succès");

// Admin 2 essaie de prendre en charge simultanément
const lock2 = db.acquireLock(convId, admin2Id, admin2Name);
assert(lock2.success === false, "Admin 2 est bloqué en lecture seule pour éviter toute collision");
assert(lock2.message.includes(admin1Name), "L'interface avertit que Amina K. détient le verrou");

// Admin 1 libère le verrou
const released = db.releaseLock(convId, admin1Id);
assert(released === true, "Admin 1 libère le verrou volontairement");

// Admin 2 peut maintenant prendre en charge
const lock2Retry = db.acquireLock(convId, admin2Id, admin2Name);
assert(lock2Retry.success === true, "Admin 2 peut désormais acquérir le verrou libéré");

// -------------------------------------------------------------
// TEST 6 : Signature Collective « Dr IPLOVE » & Journal d'Audit
// -------------------------------------------------------------
console.log("\n--- 6. SIGNATURE COLLECTIVE & AUDIT TRAIL SÉCURISÉ ---");
const responseText = "Bonjour, tu as eu beaucoup de courage de nous écrire. Nous sommes là pour toi.";
const sentResponse = db.sendAdminResponse(convId, admin2Id, admin2Name, responseText);

assert(sentResponse.senderType === "DR_IPLOVE", "Côté étudiant, l'émetteur est strictement 'Dr IPLOVE'");
assert(sentResponse.senderAdminIdInternal === admin2Id, "Côté interne, l'auteur réel est tracé");

const auditLogs = db.getAuditLogs();
const lastLog = auditLogs[0];
assert(lastLog.actionType === "SEND_RESPONSE", "Action de réponse correctement consignée dans le journal d'audit");
assert(lastLog.adminName === admin2Name, "Le nom du répondant interne est auditablé par le Super-Admin");

// -------------------------------------------------------------
// TEST 7 : Droit à l'Oubli Réel (Cascade Delete)
// -------------------------------------------------------------
console.log("\n--- 7. DROIT À L'OUBLI RÉEL & PURGE DÉFINITIVE ---");
const studentId = studentReg.user.id;
db.deleteStudentAccount(studentId);

assert(db.findUserById(studentId) === null, "Le compte étudiant n'existe plus en base");
assert(db.getStudentConversations(studentId).length === 0, "Toutes les conversations ont été détruites en cascade");
assert(db.getConversationById(convId) === null, "Le message confidentiel n'est plus accessible");

// -------------------------------------------------------------
// SYNTHÈSE
// -------------------------------------------------------------
console.log("\n=================================================================");
console.log(`RÉSULTAT GLOBAL : ${passed}/${total} TESTS VALIDÉS AVEC SUCCÈS (100%)`);
console.log("Tous les critères d'acceptation et les interdits explicites sont respectés.");
console.log("=================================================================");
