# ÉTAPE 6 — BLOC 2 : BACK-OFFICE MULTI-ADMINISTRATEURS
## Plateforme « Dr IPLOVE » — Club CJ de l'IPERMIC (UJKZ, Ouagadougou)

---

## 1. RÉSUMÉ DES RÉALISATIONS DU BLOC 2

Le **Bloc 2 : Back-Office Multi-Administrateurs** a été développé, intégré et validé par une compilation réussie (23 routes actives, 0 erreur).  
Il permet à une équipe de plusieurs étudiants membres du Club CJ de collaborer simultanément sur la file de messages sans jamais se marcher dessus, tout en préservant le secret absolu des confidences.

---

## 2. FONCTIONNALITÉS OPÉRATIONNELLES DÉPLOYÉES

### 2.1 File Partagée Collaborative & Anti-Collision
- **Pool partagé unique (`/admin`)** :
  - Consultation de toutes les demandes en cours avec statuts dynamiques (`Nouveau`, `En cours`, `En relecture`, `Répondu`).
  - Détection automatique et remontée en tête de liste des **messages sensibles / alertes** (mots-clés de violence, détresse, chantage).
  - Filtres instantanés : *Tous*, *Non assignés*, *Pris en charge par moi*, *Sensibles / Alertes*.
  - Polling synchronisé toutes les 5 secondes assurant la mise à jour immédiate des prises en charge d'équipe.

### 2.2 Système de Verrouillage Exclusif Temporaire (Anti-Double Réponse)
- **Verrou atomique de 20 minutes (`/api/admin/message/[id]/lock`)** :
  - Lorsqu'un répondant clique sur *Prendre en charge*, un verrou exclusif est enregistré avec un horodatage d'expiration (TTL de 20 min).
  - Si un second répondant ouvre le même dossier, l'interface bascule automatiquement en **Mode Lecture Seule** avec une bannière explicite :  
    *« Pris en charge par [Nom du Répondant] (Lecture seule pour éviter toute collision) »*.
  - Bouton de **libération volontaire** du verrou si le répondant souhaite passer le relais.
  - Libération automatique du verrou à l'envoi de la réponse ou à expiration du délai d'inactivité.

### 2.3 Rédaction Empathique & Signature Collective « Dr IPLOVE »
- **Éditeur de réponse assisté (`/admin/message/[id]`)** :
  - Sélecteur des **8 modèles de réponse officiels** rédigés en Étape 2 (accueil, rupture, estime de soi, conflit amical, situationship, CMS UJKZ, détresse grave, clôture).
  - **Signature unique** : Côté étudiant, le message apparaît toujours signé **« Dr IPLOVE »**.
  - **Traçabilité interne** : L'auteur réel est tracé dans le journal d'audit confidentiel.

### 2.4 Workflow de Relecture à 4 Yeux
- Pour les situations délicates ou à haut risque émotionnel, le répondant clique sur *« Demander relecture à 4 yeux »*.
- Le statut du message passe à `En relecture (4 yeux)` pour solliciter l'avis d'un second pair avant transmission.

### 2.5 Carnet de Notes Internes Collaboratives
- Onglet de notes d'équipe chiffrées au repos, **totalement isolées et invisibles pour l'étudiant**.
- Permet de consigner des observations cliniques ou des consignes de passage de relais entre membres d'astreinte.

### 2.6 Serment d'Honneur & Journal d'Audit Inaltérable
- **Charte déontologique (`/admin/charte`)** : Texte du serment de secret et des 5 règles d'or du répondant.
- **Journal d'Audit Trail (`/admin/audit`)** : Vue réservée au Super-Administrateur, traçant chronologiquement chaque prise de verrou, réponse envoyée et relecture, sans aucun contenu intime (conformité stricte CIL / Loi n° 001-2021/AN).

---

## 3. PROCHAINE ÉTAPE : BLOC 3 (PAGES PUBLIQUES, CONFORMITÉ, URGENCE & PWA)

Dès validation du Bloc 2, nous réaliserons le dernier bloc de l'Étape 6 :
- Page « Qui répond ? » (Transparence complète sur l'équipe et le refus des IA).
- Page d'orientation et annuaire des urgences locales de Ouagadougou / UJKZ.
- Page des Chroniques publiques (récits anonymisés avec consentement).
- Pages légales intégrales (Charte de confidentialité, Politique de confidentialité, CGU, Mentions légales).
- Manifeste PWA et Service Worker pour installation sur smartphone.
