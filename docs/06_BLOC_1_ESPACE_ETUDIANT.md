# ÉTAPE 6 — BLOC 1 : ESPACE ÉTUDIANT & FONDATIONS APPLICATIVES
## Plateforme « Dr IPLOVE » — Club CJ de l'IPERMIC (UJKZ, Ouagadougou)

---

## 1. RÉSUMÉ DES RÉALISATIONS DU BLOC 1

Le **Bloc 1 : Espace Étudiant** a été intégralement développé, compilé et vérifié avec succès.  
L'application respecte les impératifs de confidentialité mathématique, d'ergonomie Mobile-First et de frugalité réseau.

### Performance Réseau Mesurée (Build Next.js) :
- **Budget de données 3G** : Seulement **103 Ko** de JavaScript partagé au premier chargement (largement sous le plafond de 150 Ko requis pour Ouagadougou).
- **Rendu hybride** : Pages publiques pré-rendues statiquement (`SSG`) et requêtes privées dynamiques et chiffrées (`SSR` / Server-Rendered).

---

## 2. COMPOSANTS ET PAGES DÉPLOYÉS DANS LE BLOC 1

### 2.1 Socle Fondamental & Sécurité
- **`src/lib/crypto.ts`** :
  - Chiffrement symétrique au repos **AES-256-GCM** (clé 256 bits, IV aléatoire de 96 bits unique par message, authTag d'intégrité).
  - Hachage de mots de passe par dérivation de clé `scrypt` avec sel cryptographique aléatoire.
  - Hachage normalisé du Pass Club en SHA-256.
- **`src/lib/db.ts`** :
  - Magasin de données complet assurant le découplage mathématique entre le Pass Club et les utilisateurs.
  - Détection lexicale des messages de détresse (alerte interne sans action punitive envers l'étudiant).
  - Gestion des verrous de prise en charge avec expiration automatique (TTL 20 minutes).
- **`src/lib/session.ts`** :
  - Cookies de session signés HMAC-SHA256 (`httpOnly`, `sameSite: lax`, `secure` en production).

### 2.2 Parcours Étudiant (Écrans & Routes)
1. **Accueil Public (`/`)** :
   - Message directeur : *« Ici, tu parles librement. Personne ne saura que c'est toi. »*
   - Badge d'ancrage Club CJ • IPERMIC • Université Joseph Ki-Zerbo.
   - Les 3 engagements phares (100% Anonyme, Écoute Humaine, Droit à l'oubli).
   - Accès direct aux urgences médicales et locales de Ouagadougou.
2. **Sas de Vérification Club (`/sas`)** :
   - Contrôle du Pass saisonnier partagé (`CJ-IPERMIC-2026`).
   - Aucune corrélation entre la carte d'étudiant et le profil créé.
3. **Création de Profil Anonyme (`/inscription`)** :
   - Générateur de pseudonymes bienveillants (*EtoileCalme*, *VentDoux*, etc.).
   - Mot de passe sécurisé avec bascule de visibilité.
   - E-mail de secours facultatif stocké de façon isolée et chiffrée.
4. **Connexion Sécurisée (`/connexion`)** :
   - Connexion rapide par pseudonyme + mot de passe.
   - Redirection automatique selon le rôle (`/etudiant` ou `/admin`).
5. **Onboarding Bienveillant (`/onboarding`)** :
   - Parcours en 3 étapes guidées (ce qu'on fait, nos interdits moraux, les pouvoirs de suppression).
6. **Tableau de Bord « Mes Échanges » (`/etudiant`)** :
   - Liste des conversations avec badges sémantiques (`Envoyé`, `En cours de réflexion`, `Réponse disponible`).
   - Rappel du délai moyen de réponse (24h à 48h).
   - État vide accueillant guidant vers la première question.
7. **Formulaire de Question (`/etudiant/nouvelle-question`)** :
   - Sélecteur de catégorie tactile (*Couple, Amitié, Famille, Estime de soi, Autre*).
   - Compteur de caractères (max 2000 car.) et brouillon local automatique en cas de coupure réseau.
   - Bannière cadenas de réassurance.
8. **Messagerie Privée Conversationnelle (`/etudiant/conversation/[id]`)** :
   - Bulles de messages asymétriques avec rayon `18px`.
   - Messages du Dr IPLOVE sous la signature collective avec icône cœur/émeraude.
   - Zone de relance pour continuer le dialogue.
   - Bouton de suppression immédiate avec modale de confirmation.
9. **Paramètres & Droit à l'Oubli (`/etudiant/parametres`)** :
   - Bascule de notifications discrètes (sans extrait textuel).
   - Bouton de suppression définitive de compte (`DELETE CASCADE` réel et purge de session).

---

## 3. PROCHAINE ÉTAPE : BLOC 2 (BACK-OFFICE MULTI-ADMINISTRATEURS)

Dès validation du Bloc 1, nous enchaînerons sur le **Bloc 2 : Back-office Multi-Administrateurs** :
- Connexion admin sécurisée avec contrôle de rôle.
- Sas d'engagement et serment de confidentialité horodaté.
- File partagée collaborative avec filtres avancés (prioritaires, sensibles, assignés).
- Système anti-collision temps réel (verrouillage temporaire exclusif 20 min, avertissement d'ouverture simultanée, libération automatique).
- Éditeur de réponse avec signature collective « Dr IPLOVE » et journalisation interne de l'auteur réel.
- Bibliothèque des 8 modèles de réponses pré-intégrés.
- Bloc de notes internes partagées entre répondants.
- Workflow de relecture obligatoire à 4 yeux pour les cas sensibles.
- Journal d'audit inaltérable pour le Super-administrateur.
