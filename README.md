# 🖤 Dr IPLOVE • Plateforme d'Écoute Confidentielle & Anonyme

> **« Ici, tu parles librement. Personne ne saura que c'est toi. »**

Dr IPLOVE est une plateforme web d'écoute sentimentale, amicale et relationnelle bienveillante et **100% anonyme**, conçue pour les smartphones et les réseaux à faible débit (3G).

---

## 🔒 Principes Directeurs & Garanties de Sécurité

1. **Anonymat Mathématique Absolu** : Aucun nom civil, aucun numéro de téléphone, aucune adresse IP enregistrée. Un simple pseudonyme suffit. L'accès est validé par un pass saisonnier (`IPERMIC-2026`) décorrélé de l'identité des comptes.
2. **Écoute 100% Humaine** : Aucun robot ni intelligence artificielle. Une cellule d'écoutants formés à l'écoute active et au respect, soumise à une charte de secret absolu.
3. **Chiffrement au Repos (AES-256-GCM)** : Les messages sont scellés avec un vecteur d'initialisation unique (IV 96 bits) et tag d'intégrité. Même en cas d'accès direct à la base de données, les textes restent illisibles.
4. **Conservation Limitée à 30 Jours** : Purge automatique irréversible de toute conversation après 30 jours d'inactivité, avec suppression immédiate en un clic à la demande de l'utilisateur.
5. **Back-Office Multi-Répondants Protégé** :
   - File partagée avec détection lexicale de détresse (non punitive, simple alerte interne).
   - Système anti-collision en temps réel avec verrouillage temporaire (20 min).
   - Signature unique côté étudiant : **« Dr IPLOVE »** (traçabilité de l'écoutant uniquement dans le journal d'audit interne inaltérable).
   - Protocole de relecture à 4 yeux pour les situations délicates.

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & Rendu** : [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Langage** : TypeScript (Strict mode)
- **Typographie** : Font stack système natif (0ms latence externe, aucune requête Google CDN)
- **Poids initial JS partagé** : **103 kB** (strictement sous le seuil d'austérité réseau 3G)
- **Sécurité cryptographique** : Web Crypto API & Node.js `crypto` (AES-256-GCM, scrypt, HMAC-SHA256)

---

## 🚀 Démarrage Rapide

### 1. Installation
```bash
npm install
```

### 2. Lancement en Développement
```bash
npm run dev
# Ou avec écoute sur tout le réseau local :
npm run dev -- -H 0.0.0.0
```
L'application est disponible sur [http://localhost:3000](http://localhost:3000).

### 3. Tests d'Acceptation & Sécurité (27 tests)
```bash
npm test
```

### 4. Compilation & Production
```bash
npm run build
npm run start
```

---

## 🔑 Identifiants Pré-Configurés

| Espace | URL | Identifiants | Rôle |
| :--- | :--- | :--- | :--- |
| **Pass d'accès** | `/sas` | Code : `IPERMIC-2026` | Sas d'accès étudiant |
| **Étudiant (démo)** | `/connexion` | `Etudiant_Test` / `Test@2026!` | Compte pseudonyme |
| **Super-Admin** | `/connexion` | `Responsable_IPERMIC` / `Admin@CJ2026!` | Super-administrateur (gestion, audit) |
| **Écoutante 1** | `/connexion` | `Ecoute_Amina` / `Amina@CJ2026!` | Répondante interne |
| **Écoutant 2** | `/connexion` | `Ecoute_Paul` / `Paul@CJ2026!` | Répondant interne |

---

## 🌐 Déploiement & Hébergement

### Option A : Vercel (Recommandé - Déploiement en 1 Clic)
1. Pousser ce projet sur GitHub.
2. Importer le dépôt sur [Vercel](https://vercel.com).
3. Configurer la variable d'environnement optionnelle :
   - `APP_SECRET` : Clé secrète hexadécimale de 64 caractères (générée automatiquement si absente).
4. Cliquer sur **Deploy**.

### Option B : Serveur VPS / Docker
Un `Dockerfile` autonome peut être utilisé avec n'importe quel conteneur Node 20+ ou service type Railway, Render ou Fly.io.

---

## 📄 Licence & Cadre Légal
Développé dans le respect de la **Loi n° 001-2021/AN du 30 mars 2021 portant protection des données à caractère personnel au Burkina Faso** et des recommandations de la **CIL**.
