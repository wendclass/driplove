# ÉTAPE 4 : MAQUETTES FONCTIONNELLES HAUTE-FIDÉLITÉ
## Plateforme « Dr IPLOVE » — Club CJ de l'IPERMIC (UJKZ, Ouagadougou)

---

## 1. PRINCIPES ERGONOMIQUES ET EXPÉRIENCE UTILISATEUR

> **Message directeur :**  
> *« Ici, tu parles librement. Personne ne saura que c'est toi. »*

Les maquettes respectent deux logiques ergonomiques distinctes :
1. **Espace Étudiant (Mobile-First strict — Largeur type 390px)** :
   - Interface dépouillée, inspirée des messageries instantanées sécurisées.
   - Pouce dominant (zones d'action en bas d'écran).
   - Signaux de réassurance discrets mais constants (cadenas, mentions de confidentialité).
2. **Espace Administrateur Back-Office (Desktop / Tablette — Largeur type 1200px+)** :
   - Densité d'information optimisée pour le traitement fluide d'une file partagée.
   - Système anti-collision temps réel visible au premier coup d'œil.
   - Séparation stricte entre les notes internes d'équipe et la réponse officielle signée « Dr IPLOVE ».

---

## 2. MAQUETTES DE L'ESPACE ÉTUDIANT (MOBILE)

---

### Écran E01 : Page d'Accueil & Sas de Découverte (Mobile 390px)

```
+---------------------------------------------------+
| [Logo Club CJ]  Dr IPLOVE                 [Theme] |
+---------------------------------------------------+
|                                                   |
|   Club CJ • IPERMIC • Université Joseph Ki-Zerbo  |
|                                                   |
|   « Ici, tu parles librement.                     |
|     Personne ne saura que c'est toi. »            |
|                                                   |
|   Une écoute bienveillante, confidentielle et     |
|   gratuite pour toutes tes questions de cœur,     |
|   d'amitié ou de doutes personnels.               |
|                                                   |
|   +---------------------------------------------+ |
|   |  [Pencil]  Écrire au Dr IPLOVE (Anonyme)    | |  <-- Bouton Primaire (Émeraude #1E3A2F)
|   +---------------------------------------------+ |
|                                                   |
|   +---------------------------------------------+ |
|   |  [MessageSquare]  Suivre mon message        | |  <-- Bouton Secondaire (Bordure Lin)
|   +---------------------------------------------+ |
|                                                   |
|   ---------------------------------------------   |
|   NOS 3 ENGAGEMENTS ABSOLUS                       |
|                                                   |
|   [ShieldCheck] 100% Anonyme                      |
|   Aucun nom, aucun numéro. Un pseudonyme suffit.  |
|                                                   |
|   [Users] Écoute Humaine                          |
|   Pas de robot ni d'IA. Une équipe d'étudiants    |
|   formés et liés par serment.                     |
|                                                   |
|   [Trash2] Droit à l'Oubli                        |
|   Suppression de ta conversation en 1 clic        |
|   ou purge automatique sous 30 jours.             |
|                                                   |
|   ---------------------------------------------   |
|   [HeartPulse] Besoin d'aide urgente ?            |
|   Urgences médicales & écoute locale Ouaga >      |
|                                                   |
+---------------------------------------------------+
|  [Home]       [Message]      [Book]       [Help]  |  <-- Mobile Tab Bar (64px)
|  Accueil      Échanges     Chroniques     Aide    |
+---------------------------------------------------+
```

- **Microcopie d'accueil** : Directe, déculpabilisante, sans fioritures romantiques.
- **Accès urgence** : Toujours visible sans défilement excessif.

---

### Écran E02 : Sas d'Accès Club & Inscription Anonyme (Mobile 390px)

```
+---------------------------------------------------+
| [< Retour]        Créer mon accès secret          |
+---------------------------------------------------+
|                                                   |
|   ÉTAPE 1 : CLÉ DU CLUB CJ                        |
|   Le service est réservé aux membres de l'IPERMIC.|
|                                                   |
|   Pass saisonnier du Club :                       |
|   +---------------------------------------------+ |
|   | [Key] CJ-IPERMIC-2026                       | |  <-- Code partagé diffusé au club
|   +---------------------------------------------+ |
|   (Vérifié sans corrélation avec ton identité)    |
|                                                   |
|   ---------------------------------------------   |
|   ÉTAPE 2 : TON PSEUDONYME                        |
|                                                   |
|   Choisis un pseudonyme :                         |
|   +---------------------------------------------+ |
|   | [User] Etoile_Calme                         | |
|   +---------------------------------------------+ |
|   [Sparkles] Me suggérer un pseudo doux           |  <-- Générateur de pseudonymes neutres
|                                                   |
|   Mot de passe :                                  |
|   +---------------------------------------------+ |
|   | [Lock] ••••••••••••••                  [Eye]| |
|   +---------------------------------------------+ |
|   (Min. 8 caractères - mémorise-le bien)          |
|                                                   |
|   E-mail de secours (Optionnel & Chiffré) :       |
|   +---------------------------------------------+ |
|   | [Mail] secours@exemple.com                  | |
|   +---------------------------------------------+ |
|   (Sert uniquement si tu oublies ton mot de     |
|    passe. Stocké de façon isolée et scellée.)     |
|                                                   |
|   +---------------------------------------------+ |
|   |  [Lock]  Créer mon compte en toute sécurité | |
|   +---------------------------------------------+ |
|                                                   |
|   [Lock] Tes données ne seront jamais vendues.    |
|   En t'inscrivant, tu acceptes la Charte privée.  |
|                                                   |
+---------------------------------------------------+
```

---

### Écran E03 : Onboarding en 3 Écrans (Mobile 390px — Vue Écran 2)

```
+---------------------------------------------------+
|  Passer                              [ •  *  • ]  |  <-- Indicateur de progression 2/3
+---------------------------------------------------+
|                                                   |
|                 [Illustration SVG]                |
|             (Deux silhouettes douces              |
|              adossées à un baobab)                |
|                                                   |
|             ZÉRO JUGEMENT, ZÉRO ESPIONNAGE        |
|                                                   |
|   • Nous ne sommes pas des juges de tes choix.    |
|   • Nous n'espionnons personne et refusons de     |
|     surveiller des couples.                       |
|   • Nous ne transmettons jamais tes écrits.       |
|                                                   |
|   Tes confidences restent scellées entre          |
|   toi et l'équipe d'écoute Dr IPLOVE.             |
|                                                   |
|                                                   |
|   +---------------------------------------------+ |
|   |  Continuer                             [->] | |
|   +---------------------------------------------+ |
|                                                   |
+---------------------------------------------------+
```

---

### Écran E04 : Nouvelle Conversation / Poser une Question (Mobile 390px)

```
+---------------------------------------------------+
| [< Retour]     Nouvelle Question     [Aide ?]     |
+---------------------------------------------------+
|                                                   |
|   CHOISIS LE THÈME DE TA QUESTION :               |
|   [ (•) Couple ]  [ ( ) Amitié ]  [ ( ) Famille ] |  <-- Badges de catégories tactiles
|   [ ( ) Estime de soi ]  [ ( ) Autre ]            |
|                                                   |
|   TITRE OU SUJET COURT (Facultatif) :             |
|   +---------------------------------------------+ |
|   | Comment lui dire ce que je ressens vraiment | |
|   +---------------------------------------------+ |
|                                                   |
|   TON MESSAGE EN TOUTE CONFIANCE :                |
|   +---------------------------------------------+ |
|   | Bonjour Dr IPLOVE,                          | |
|   | Cela fait plusieurs semaines que je n'arrive| |
|   | plus à me concentrer sur mes cours parce    | |
|   | que...                                      | |
|   |                                             | |
|   |                                             | |
|   |                                             | |
|   |                           248 / 2000 car.   | |
|   +---------------------------------------------+ |
|                                                   |
|   [Lock] Protégé : Ton pseudonyme "Etoile_Calme"  |
|   est le seul élément visible par l'équipe.       |
|                                                   |
|   +---------------------------------------------+ |
|   |  [Send]  Confier mon message au Dr IPLOVE   | |
|   +---------------------------------------------+ |
|                                                   |
|   Délai de réponse indicatif : 24h à 48h.         |
|   Brouillon sauvegardé automatiquement.           |
|                                                   |
+---------------------------------------------------+
```

---

### Écran E05 : Fil de Discussion / Messagerie Privée (Mobile 390px)

```
+---------------------------------------------------+
| [<]  Dr IPLOVE                       [MoreVertical]|
|      [Lock] Conversation 100% Confidentielle      |
+---------------------------------------------------+
|                 Lundi 12 Octobre                  |
|                                                   |
|                           +---------------------+ |
|                           | [Etoile_Calme]      | |
|                           | Bonjour Dr IPLOVE,  | |
|                           | voilà ce qui me     | |
|                           | pèse aujourd'hui... | |
|                           |        14:15  [vv]  | |
|                           +---------------------+ |
|                                                   |
|   +---------------------------------------------+ |
|   | [ShieldHeart] Dr IPLOVE                     | |
|   | Bonjour Etoile_Calme,                       | |
|   |                                             | |
|   | Merci pour ta confiance. Poser des mots     | |
|   | sur ce qu'on traverse demande du courage.   | |
|   |                                             | |
|   | Ce que tu ressens est tout à fait naturel.  | |
|   | As-tu envisagé d'en parler calmement en     | |
|   | tête-à-tête sans pression ?                 | |
|   |                                             | |
|   | Prends le temps de respirer. Ce fil reste   | |
|   | ouvert si tu veux poursuivre.               | |
|   |                                             | |
|   | -- Dr IPLOVE                 16:42          | |
|   +---------------------------------------------+ |
|                                                   |
|   ---------------------------------------------   |
|   [Sparkles] PARTAGER CETTE LEÇON ?               |
|   Cette discussion pourrait aider d'autres élèves.|
|   [Lire la proposition anonymisée et donner mon accord] |
|                                                   |
+---------------------------------------------------+
| [ + ] Répondre au Dr IPLOVE...             [Send] |
+---------------------------------------------------+
```

---

### Écran E06 : Modale de Consentement & Relecture Chronique (Mobile 390px)

```
+---------------------------------------------------+
|                 ACORD DE PUBLICATION              |
|                                                   |
|   Nous avons transformé ta situation en une leçon |
|   collective pour les Chroniques du Club.         |
|                                                   |
|   VOICI LA VERSION EXACTE QUI SERAIT PUBLIÉE :    |
|   +---------------------------------------------+ |
|   | « Un étudiant de l'IPERMIC se demandait     | |
|   | comment aborder une discussion sincère sans | |
|   | braquer son partenaire... »                 | |
|   +---------------------------------------------+ |
|                                                   |
|   [Check] Tous les noms, dates et détails intimes |
|           ont été entièrement supprimés.          |
|                                                   |
|   +---------------------------------------------+ |
|   |  [Check] J'accepte la publication anonyme   | |
|   +---------------------------------------------+ |
|                                                   |
|   +---------------------------------------------+ |
|   |  [X] Non, je préfère garder cela privé      | |  <-- Aucun impact sur la qualité du suivi
|   +---------------------------------------------+ |
|                                                   |
|   Ton refus est respecté immédiatement et sans    |
|   la moindre justification.                       |
+---------------------------------------------------+
```

---

### Écran E07 : Paramètres & Suppression Définitive du Compte (Mobile 390px)

```
+---------------------------------------------------+
| [< Retour]             Paramètres                 |
+---------------------------------------------------+
|                                                   |
|   MON COMPTE SECRET                               |
|   Pseudonyme : Etoile_Calme                       |
|   Inscrit le : 12/10/2026                         |
|                                                   |
|   [Key] Modifier mon mot de passe                 |
|   [Mail] Modifier mon e-mail de secours           |
|                                                   |
|   ---------------------------------------------   |
|   NOTIFICATIONS & CONFIDENTIALITÉ                 |
|   [x] Notification discrète sans texte sensible   |
|   [x] Thème sombre nocturne                       |
|                                                   |
|   ---------------------------------------------   |
|   ZONE DE CONTRÔLE ABSOLU                         |
|                                                   |
|   [AlertTriangle] Suppression des données         |
|   Tu peux effacer une conversation individuelle   |
|   ou détruire l'intégralité de ton profil.        |
|                                                   |
|   +---------------------------------------------+ |
|   |  [Trash]  Supprimer mon compte définitivement| | <-- Bouton Danger (#DC2626)
|   +---------------------------------------------+ |
|                                                   |
|   (Cette action détruit immédiatement tes         |
|    messages, tes accès et toutes métadonnées.     |
|    Aucune restauration ne sera possible.)         |
|                                                   |
+---------------------------------------------------+
```

---

## 3. MAQUETTES DE L'ESPACE ADMINISTRATEUR (DESKTOP BACK-OFFICE)

---

### Écran A01 : Tableau de Bord & File Partagée Anti-Collision (Desktop 1200px)

```
+-----------------------------------------------------------------------------------------------------------------------+
|  Dr IPLOVE • BACK-OFFICE    [Recherche...]              [Alerte: 2 prioritaires]  [Admin: Paul S.] [En service v]      |
+-----------------------------------------------------------------------------------------------------------------------+
|  MENU LATÉRAL      |  FILE DES MESSAGES EN ATTENTE (Pool partagé)                                                     |
|                    |                                                                                                 |
|  [Inbox] File (14) |  Filtres : [Tous] [Non assignés (6)] [Assignés à moi (3)] [Sensibles (2)] [En relecture (2)]     |
|  [Check] Mes suivis|  Trier par : [Ancienneté v]  Catégorie : [Toutes v]                                              |
|  [Book] Chroniques |                                                                                                 |
|  [Users] Équipe (5)|  +----+-----------+-----------------------------------+----------+-----------+----------------+------+
|  [File] Audit Log  |  |STAT| PRIORITÉ  | SUJET & EXTRAIT ANONYME           | CATÉG.   | REÇU      | ASSIGNÉ À      |ACTION|
|  [Settings] Modèles|  +----+-----------+-----------------------------------+----------+-----------+----------------+------+
|                    |  |Novo| [! SENSIB]| #142 "Je ne dors plus, tout m'écr.| Couple   | Il y a 1h | [Non assigné]  |[PREN]|
|  STATUT ÉQUIPE     |  |Novo| Normale   | #141 "Peur de déclarer ma flamme" | Amitié   | Il y a 3h | [Non assigné]  |[PREN]|
|  • Paul (Moi): En sv|  |En tr| Normale   | #140 "Mon copain veut mon stage.."| Couple   | Il y a 5h | Amina K. [Lock]| [VOIR]|
|  • Amina: En serv. |  |Relec| [! AVIS]  | #139 "Situation de violence verb."| Couple   | Il y a 8h | Relire (de Paul|[RELI]|
|  • Moussa: En pause|  |Répon| Normale   | #138 "Doutes sur mon orientation" | Estime   | Il y a 24h| Paul S.        | [VOIR]|
|                    |  +----+-----------+-----------------------------------+----------+-----------+----------------+------+
|  [Déconnexion]     |  Affichage de 1 à 5 sur 14 demandes • Règle des 4 yeux active sur les cas sensibles             |
+-----------------------------------------------------------------------------------------------------------------------+
```

- **Mécanisme du bouton `[PREN]` (Prendre en charge)** : Un clic pose un verrou exclusif sur la ligne. La ligne passe en surbrillance ambre pour tous les autres administrateurs connectés en WebSocket.

---

### Écran A02 : Détail du Message, Verrouillage & Éditeur de Réponse (Desktop 1200px)

```
+-----------------------------------------------------------------------------------------------------------------------+
|  [< Retour File]  Message #142 • Catégorie : Couple • Reçu il y a 1h 12m          [Verrouillé par MOI - Expire ds 18m] |
+-----------------------------------------------------------------------------------------------------------------------+
|  COLONNE GAUCHE (Message Étudiant)          |  COLONNE DROITE (Traitement & Réponse Dr IPLOVE)                        |
|                                             |                                                                         |
|  PSEUDONYME : Etoile_Calme                  |  ONGLETS : [ Réponse officielle ]  [ Notes internes d'équipe (1) ]       |
|  STATUT : Pris en charge (Priorité Haute)   |                                                                         |
|  HISTORIQUE : 1er message                   |  Modèle rapide : [ Sélectionner un modèle de réponse...             v] |
|                                             |  -> Choix : "Modèle 7 : Alerte détresse & soutien d'urgence"            |
|  MESSAGE REÇU :                             |                                                                         |
|  « Bonjour Dr IPLOVE,                       |  ÉDITEUR DE RÉPONSE (Brouillon auto-enregistré) :                       |
|    Je vous écris parce que je n'arrive plus |  +-------------------------------------------------------------------+  |
|    à dormir depuis une semaine. Mon copain  |  | Bonjour Etoile_Calme,                                             |  |
|    me menace de diffuser des photos intimes |  |                                                                   |  |
|    si je refuse de lui donner mes accès aux |  | J'ai lu tes mots avec un profond respect et une vive émotion.     |  |
|    comptes. J'ai honte et j'ai tellement    |  | Sache que tu n'es pas seule et que ce que tu subis est puni par   |  |
|    peur qu'on me voie sur le campus... »    |  | la loi. Tu n'as absolument rien à te reprocher.                   |  |
|                                             |  |                                                                   |  |
|  ANALYSE AUTOMATIQUE DE RISQUE :            |  | Nous t'orientons immédiatement vers les référents d'aide :        |  |
|  [! Chantage / Menace d'atteinte intime]    |  | - Ligne Verte Nationale d'écoute : 80 00 11 11                    |  |
|  Alerte interne déclenchée (Non punitif).   |  | - Cellule d'écoute UJKZ : Bâtiment CMS                            |  |
|                                             |  |                                                                   |  |
|  ACTIONS IMMÉDIATES :                       |  | -- Dr IPLOVE                                                      |  |
|  [Transférer à un pair]  [Libérer verrou]   |  +-------------------------------------------------------------------+  |
|                                             |                                                                         |
|  NOTE INTERNE COLLABORATIVE :               |  OPTIONS D'ENVOI :                                                      |
|  [Amina K. - 14:32]                         |  [ ] Demander une relecture obligatoire à un pair (Cas sensible)       |
|  "Chantage avéré. Ne pas moraliser,         |                                                                         |
|   donner la ligne verte et le CMS direct."  |  +---------------------------+  +------------------------------------+  |
|                                             |  | [Eye] Demander relecture  |  | [Send] Envoyer sous "Dr IPLOVE"    |  |
|                                             |  +---------------------------+  +------------------------------------+  |
+-----------------------------------------------------------------------------------------------------------------------+
```

---

### Écran A03 : Modale d'Anti-Collision (Alerte Ouverture Simultanée)

```
+-------------------------------------------------------------------------+
|                  ATTENTION : MESSAGE EN COURS DE TRAITEMENT             |
|                                                                         |
|   L'administrateur [ Amina K. ] a pris en charge ce message il y a 4m.  |
|   Un verrou de protection est actuellement actif sur ce fil.            |
|                                                                         |
|   Pour éviter toute double réponse contradictoire ou perte de temps :   |
|   • Vous consultez ce dossier en MODE LECTURE SEULE.                    |
|   • Si Amina reste inactive plus de 15 minutes, le verrou sera libéré.  |
|                                                                         |
|   +---------------------------------+  +----------------------------+   |
|   |  Contacter Amina par note       |  |  [<-] Retourner à la file  |   |
|   +---------------------------------+  +----------------------------+   |
+-------------------------------------------------------------------------+
```

---

### Écran A04 : Journal d'Audit Inaltérable (Super-Administrateur — Desktop 1200px)

```
+-----------------------------------------------------------------------------------------------------------------------+
|  Dr IPLOVE • AUDIT TRAIL SÉCURISÉ (Lecture Seule - Conforme CIL)                         [Export chiffré]             |
+-----------------------------------------------------------------------------------------------------------------------+
|  DATE & HEURE (UTC)  | UTILISATEUR INTERNE | ACTION RÉALISÉE         | CIBLE (ANONYME) | RÉSULTAT / CONTEXTE          |
+----------------------+---------------------+-------------------------+-----------------+------------------------------+
|  12/10/2026 15:42:10 | Paul S. (Admin)     | Prise en charge message | Message #142    | Verrou exclusif 20 min posé  |
|  12/10/2026 15:38:02 | Amina K. (Admin)    | Consultation file       | File principale | Filtre: Prioritaires         |
|  12/10/2026 14:15:33 | SYSTEM              | Nouveau message déposé  | Message #142    | Catégorie: Couple • Alerte ON|
|  12/10/2026 11:20:19 | Paul S. (Admin)     | Réponse envoyée         | Message #138    | Signature: Dr IPLOVE         |
|  12/10/2026 10:05:44 | Moussa B. (Super)   | Modification modèle     | Template #7     | Mise à jour numéro vert      |
|  12/10/2026 09:12:00 | SYSTEM              | Purge automatique       | Conv #89 (Close)| Suppression 30j effectuée    |
+-----------------------------------------------------------------------------------------------------------------------+
```

---

## 4. MATRICE COMPLÈTE DES INTERACTIONS & TRANSITIONS

| Action Utilisateur | Déclencheur UI | Retour Visuel & Transition | État Système Côté Serveur |
| :--- | :--- | :--- | :--- |
| **Saisie Pass Club** | Champ texte E02 | Coche verte animée + apparition champs pseudo | Hash Argon2id validé en RAM (zéro log IP/nom) |
| **Envoi Message Étudiant**| Clic bouton E04 | Bouton désactivé $\rightarrow$ Spinner discret $\rightarrow$ Toast vert $\rightarrow$ Redirection E05 | Message chiffré AES-256 en BDD, statut `Nouveau` |
| **Ouverture Message Admin**| Clic `[PREN]` A01 | Badge passe à `Verrouillé par moi` avec compte à rebours 20m | Verrou écrit en table `message_locks` avec TTL |
| **2e Admin ouvre message**| Clic A01 | Modale A03 s'affiche immédiatement en superposition | Requête de lock rejetée, session en `Read-Only` |
| **Relecture 4 Yeux** | Clic `[Eye]` A02 | Statut passe à `En relecture`, modale de confirmation | Notification push interne envoyée aux pairs |
| **Envoi Réponse Officielle**| Clic `[Send]` A02 | Message archivé, retrait de la file en attente | Réponse chiffrée, libération du lock, audit loggé |
| **Suppression Compte** | Clic E07 + Confirm | Modale d'adieu sobre $\rightarrow$ Redirection Accueil P01 | `DELETE CASCADE` sur profil, tokens et messages |

---

## 5. DEMANDE DE VALIDATION FORMELLE (FIN ÉTAPE 4)

Les maquettes fonctionnelles et les wireframes de l'**Étape 4** sont prêts.  
Pour passer à l'**Étape 5 : Architecture Technique & Spécifications Backend/BDD**, merci de valider :
1. L'ergonomie Mobile-First de l'espace étudiant (E01 à E07).
2. L'organisation du Back-Office multi-administrateurs avec le système anti-collision (A01 à A04).
3. La modale de consentement pour les chroniques et le circuit de relecture à 4 yeux.
