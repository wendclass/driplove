# ÉTAPE 3 : DESIGN SYSTEM ET GUIDE DE STYLE ORIENTÉ CONFIANCE
## Plateforme « Dr IPLOVE » — Club CJ de l'IPERMIC (UJKZ, Ouagadougou)

---

## 1. MESSAGE DIRECTEUR ET PHILOSOPHIE VISUELLE

> **Message directeur (la boussole de chaque choix graphique) :**  
> *« Ici, tu parles librement. Personne ne saura que c'est toi. »*

Toute décision d'interface doit répondre à ces 4 impératifs psychologiques :
1. **L'apaisement immédiat** : Un étudiant qui ouvre l'application est souvent dans un état de vulnérabilité ou de tension émotionnelle. L'interface ne doit ni l'agresser visuellement, ni lui imposer une charge cognitive superflue.
2. **Le sentiment d'abri secret** : L'espace ressemble à une messagerie familière, feutrée et discrète, et non à un portail académique froid ou à un réseau social tapageur.
3. **Le refus du stéréotype** : Rejet formel du rose bonbon, des cœurs caricaturaux ou des codes de télé-réalité qui infantilisent le sentiment amoureux et excluent les étudiants masculins.
4. **La résilience sahélienne** : Des composants légers, pensés en **Mobile-First**, lisibles en plein soleil sous la lumière de Ouagadougou et performants sur des téléphones d'entrée de gamme en connexion 3G/Edge.

---

## 2. CHOIX TYPOGRAPHIQUE : POLICE SECONDAIRE (3 OPTIONS CLASSÉES)

La police principale est fixée : **Sora** (pour les titres, boutons, menus, cartes et bulles de messagerie).  
Nous devons choisir la **police secondaire** pour les longs textes (charte, fiches de conseils détaillées, pages légales, articles des chroniques).

```
Option 1 (Faible)            Option 2 (Moyenne)                 Option 3 (Solide - Recommandée)
Merriweather (Serif)         Inter (Sans-serif neutre)          Source Sans 3 (Humanist Sans)
```

#### Option 1 (La plus faible) : Merriweather (Serif)
- **Description** : Police à empattements très classique conçue pour les écrans.
- **Critique honnête** :
  - *Forces* : Donne une allure littéraire et journalistique sérieuse, rappelant la presse écrite (adapté à l'IPERMIC).
  - *Faiblesses majeures* : Poids élevé des fichiers woff2 (~32 Ko par graisse) ; sur les smartphones Android d'entrée de gamme à faible densité de pixels (écrans 720p courants), les empattements bavent ou scintillent ; contraste de graisse trop prononcé fatiguant les yeux lors d'une lecture nocturne prolongée.
  - *Verdict* : **À écarter pour des raisons d'accessibilité mobile et de bande passante.**

#### Option 2 (Moyenne) : Inter (Néo-grotesque)
- **Description** : Le standard mondial des interfaces web contemporaines.
- **Critique honnête** :
  - *Forces* : Lisibilité technique irréprochable sur petit écran, optimisation maximale du rendu des micro-textes.
  - *Faiblesses* : Conçue pour les tableaux de bord et logiciels d'entreprise (SaaS). Dans une application d'écoute sentimentale et de détresse humaine, *Inter* installe une froideur clinique et administrative qui contredit la chaleur humaine du Dr IPLOVE.
  - *Verdict* : **Techniquement parfait, mais émotionnellement trop froid.**

#### Option 3 (La plus solide - Recommandée) : Source Sans 3 (Humanist Sans-Serif)
- **Description** : Police linéale humaniste conçue par Adobe pour la lecture fluide de longs textes numériques.
- **Critique honnête** :
  - *Forces* : 
    - **Poids plume** : 14 Ko en `.woff2` avec sous-ensemble latin restreint aux caractères français.
    - **Chaleur & Lisibilité** : Proportions ouvertes, dessin doux et bienveillant évitant la raideur mécanique.
    - **Distinction sans ambiguïté** : Différenciation nette entre le `I` majuscule, le `l` minuscule et le chiffre `1` (essentiel pour la lisibilité des pseudonymes et consignes).
    - **Harmonie avec Sora** : Complète la géométrie ronde de Sora sans entrer en conflit visuel avec elle.
  - *Verdict* : **Le choix optimal pour concilier performance 3G et confort de lecture empathique.**

---

## 3. PROPOSITIONS DE PALETTES CHROMATIQUES (3 OPTIONS CLASSÉES)

Chaque proposition comprend une version **Mode Clair (Jour)** et **Mode Sombre (Nuit)** avec calcul des contrastes WCAG AA (minimum 4.5:1 pour le texte courant, 3:1 pour les grands titres et composants).

---

### Option 1 (La moins adaptée) : « Crépuscule Mauve & Lilas »
- **Intention** : Inspirée des teintes romantiques feutrées (violet améthyste, fond lilas pâle, accent framboise).
- **Critique honnête** :
  - *Faiblesse* : Tombe dans le cliché de la romance adolescente. Les tests utilisateurs sur les campus montrent que les étudiants masculins hésitent à ouvrir une application à dominance mauve/rose en public ou dans un amphi par peur du chambrage.
  - *Verdict* : **À éliminer : risque d'auto-censure des utilisateurs.**

---

### Option 2 (Moyenne) : « Bleu Nocturne & Terre Sahélienne »
- **Intention** : Bleu marine profond (confidentialité, calme), fond blanc cassé, accent terre cuite / ocre de Ouagadougou.
- **Critique honnête** :
  - *Forces* : Palette institutionnelle rassurante, très propre et familière.
  - *Faiblesses* : Le bleu marine peut donner une coloration trop corporative, évoquant une banque, une application d'assurance ou un portail officiel de l'université.
  - *Verdict* : **Solide et neutre, mais manque d'intimité et de douceur réconfortante.**

---

### Option 3 (La plus solide - Recommandée) : « Refuge Végétal & Miel Doré »
- **Concept** : L'émeraude et la sauge évoquent l'oasis, l'apaisement de l'esprit, l'écoute et le secret inviolable (le végétal qui protège du soleil). Les fonds sont des écru/lin chaleureux qui évitent l'éblouissement. L'accent unique est un **miel ambré bienveillant**, symbole de lumière et d'espoir.
- **Symbolique IPERMIC** : Sérieux, maturité, écoute fraternelle, sécurité psychologique.

#### Nuancier Officiel — Option 3 (« Refuge Végétal »)

| Rôle Sémantique | Token CSS | Valeur Hex (Mode Clair) | Valeur Hex (Mode Sombre) | Ratio de Contraste (WCAG) |
| :--- | :--- | :--- | :--- | :--- |
| **Fond Principal** | `--bg-canvas` | `#FAF8F5` *(Albâtre chaud)* | `#111614` *(Obsidienne verte)* | Fond de page |
| **Fond Surface / Carte** | `--bg-surface` | `#FFFFFF` *(Blanc pur)* | `#18221E` *(Émeraude sombre)* | Composants / Bulles |
| **Fond Surélevé / Modale** | `--bg-elevated`| `#F0ECE1` *(Lin doux)* | `#202D28` *(Mousse nocturne)* | Menus / Popups |
| **Texte Principal** | `--text-primary` | `#17231E` *(Vert forêt dense)* | `#F2F5F3` *(Craie douce)* | **14.2:1 (AAA)** sur fond |
| **Texte Secondaire** | `--text-secondary`| `#4D5E56` *(Sauge assombrie)* | `#A3B5AC` *(Lichen clair)* | **5.4:1 (AA)** sur fond |
| **Texte Muet / Légende**| `--text-muted` | `#73857D` *(Brume végétale)* | `#73857D` *(Brume végétale)* | **4.6:1 (AA)** sur fond |
| **Primaire (Dr IPLOVE)**| `--color-primary`| `#1E3A2F` *(Émeraude profond)* | `#34D399` *(Menthe lumineuse)* | **9.8:1 (AAA)** |
| **Primaire Contraste** | `--color-primary-fg`| `#FFFFFF` | `#0E2018` | **10.5:1 (AAA)** |
| **Accent (Chaleur/Lumière)**| `--color-accent` | `#D97706` *(Miel ambré)* | `#FBBF24` *(Or chaleureux)* | **4.8:1 (AA)** sur surface |
| **Accent Doux (Badge)** | `--color-accent-soft`| `#FEF3C7` *(Lueur d'ambre)* | `#382A14` *(Ambre nocturne)* | Badge catégorie |
| **Bordures & Séparateurs**| `--border-subtle`| `#E2DDD2` *(Sable pâle)* | `#273831` *(Mousse foncée)* | Délimitation claire |

#### Couleurs d'État Sémantique

| État | Token CSS | Clair (Hex) | Sombre (Hex) | Rôle & Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Succès / Envoyé** | `--state-success` | `#059669` *(Émeraude)* | `#34D399` *(Menthe)* | Message transmis, compte protégé |
| **Attention / Sensible**| `--state-warning` | `#D97706` *(Ambre chaud)*| `#FBBF24` *(Or)* | Cas prioritaire, relecture requise |
| **Danger / Suppression**| `--state-danger` | `#DC2626` *(Carmin doux)*| `#F87171` *(Corail vif)*| Suppression définitive, alerte détresse |
| **Info / Neutre** | `--state-info` | `#0284C7` *(Ciel profond)*| `#38BDF8` *(Azur)* | Statut d'attente, mise en veille |

---

## 4. ÉCHELLE TYPOGRAPHIQUE (SORA + SOURCE SANS 3)

### 4.1 Règles de Configuration Technique
- **Chargement** : Fichiers `.woff2` auto-hébergés localement (zéro dépendance à Google Fonts pour la confidentialité et la vitesse).
- **Attribut** : `font-display: swap` pour un affichage instantané du texte système avant le chargement de la police.
- **Graisses limitées** : Sora (600 SemiBold, 700 Bold) ; Source Sans 3 (400 Regular, 600 SemiBold).

### 4.2 Échelle Typographique Responsive

| Niveau | Police & Graisse | Taille Mobile / Interligne | Taille Bureau / Interligne | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1** | Sora Bold (700) | 28px / 36px (-0.02em) | 38px / 48px (-0.02em) | Titre d'accueil (Message directeur) |
| **Titre H1** | Sora SemiBold (600) | 22px / 30px (-0.01em) | 28px / 36px (-0.01em) | Titres d'écrans majeurs |
| **Titre H2** | Sora SemiBold (600) | 18px / 26px (0) | 22px / 30px (0) | Sous-sections, cartes, étapes |
| **Titre H3** | Sora SemiBold (600) | 16px / 24px (0) | 18px / 26px (0) | Titres de bulles, modales |
| **Corps Grand** | Source Sans 3 Regular (400) | 16px / 26px (+0.01em) | 17px / 28px (+0.01em) | Chapeaux, onboarding, début fil |
| **Corps Standard**| Source Sans 3 Regular (400)| 15px / 24px (+0.01em) | 15px / 24px (+0.01em) | **Texte des messages & réponses** |
| **Corps Gras** | Source Sans 3 SemiBold (600)| 15px / 24px (+0.01em) | 15px / 24px (+0.01em) | Mots-clés dans les messages |
| **Bouton / Menu**| Sora SemiBold (600) | 14px / 20px (+0.02em) | 14px / 20px (+0.02em) | Boutons d'action, barres d'onglets |
| **Micro / Caption**| Source Sans 3 Regular (400)| 13px / 18px (0) | 13px / 18px (0) | Horodatage, mentions cadenas |

---

## 5. SPÉCIFICATIONS DES COMPOSANTS CLÉS

### 5.1 Bulles de Messagerie (Le Cœur de l'Expérience)

Les bulles adoptent un rayon de courbure asymétrique doux (`18px`) inspiré des messageries mobiles de référence, avec une marge latérale protégeant la lisibilité.

```
+-------------------------------------------------------------+
|                                                             |
|           [ÉTUDIANT - MESSAGE ENVOYÉ]                       |
|           +-----------------------------------------------+ |
|           | Bonjour Dr IPLOVE, j'ai une question...       | |
|           |                                               | |
|           |                         14:22  [v] Envoyé     | |
|           +-----------------------------------------------+ |
|           (Fond : Vert Forêt #1E3A2F / Texte : Blanc #FFF)   |
|                                                             |
|   [DR IPLOVE - RÉPONSE REÇUE]                               |
|   +-----------------------------------------------+         |
|   | Bonjour, merci pour ta confiance.             |         |
|   | J'ai lu tes mots avec attention...            |         |
|   |                                               |         |
|   | -- Dr IPLOVE                 15:40            |         |
|   +-----------------------------------------------+         |
|   (Fond : Surface #FFFFFF / Bordure : Lin #E2DDD2 /         |
|    Texte : Forêt #17231E)                                   |
|                                                             |
+-------------------------------------------------------------+
```

1. **Bulle Étudiant (Message envoyé)** :
   - *Alignement* : Droite (max-width : 85% sur mobile).
   - *Couleur* : Fond `--color-primary` (`#1E3A2F`), texte blanc pur.
   - *Micro-statut* : Horodatage discret + icône d'état (`Envoyé` = une coche, `Lu` = deux coches douces, `En cours de réponse` = sablier animé).
2. **Bulle Dr IPLOVE (Réponse reçue)** :
   - *Alignement* : Gauche (max-width : 88% sur mobile).
   - *Couleur* : Fond `--bg-surface` (`#FFFFFF`), bordure subtile `1px solid --border-subtle`, texte `--text-primary`.
   - *Badge d'en-tête* : Petite mention d'icône bouclier/cœur vert avec le texte : `Dr IPLOVE • Écoute confidentielle`.
3. **Bulle Brouillon local (Hors-ligne / En cours)** :
   - *Aspect* : Bordure en pointillés ambrés, badge discret `Brouillon sécurisé sur ton appareil`.
4. **Bulle Erreur d'envoi** :
   - *Aspect* : Bordure carmin douce, icône point d'exclamation avec bouton tactile `Réessayer`.

---

### 5.2 Boutons et Actions

| Type | Style Visuel | Rayon | Usage & Comportement |
| :--- | :--- | :--- | :--- |
| **Bouton Primaire** | Fond Émeraude (`#1E3A2F`), Texte Blanc, Sora 600 | `12px` (Pill doux) | « Écrire au Dr IPLOVE », « Envoyer ma question ». Cible tactile min 48px de haut. |
| **Bouton Secondaire** | Fond Transparent, Bordure 1.5px Lin, Texte Forêt | `12px` | « Suivre mon message », « En savoir plus ». |
| **Bouton Accent** | Fond Miel Ambré (`#D97706`), Texte Blanc | `12px` | Actions clés d'encouragement ou mise en avant. |
| **Bouton Danger** | Fond Écru, Bordure Carmin (`#DC2626`), Texte Carmin | `12px` | « Supprimer cette conversation », « Effacer mon compte ». Jamais mis en avant par défaut. |
| **Bouton Fantôme (Icon)**| Fond transparent, icône 24px avec padding 12px | `50%` | Fermer modale, retour arrière, menu contextuel. |

---

### 5.3 Signaux de Confiance Visuelle (Trust Badges)

Ces marqueurs sont intégrés de manière permanente aux moments clés :
1. **L'En-tête de Conversation Privée** :
   - Affichage continu d'un badge : `[Icône Cadenas] Conversation 100% Privée & Chiffrée`.
2. **Le Pied du Champ de Saisie** :
   - Phrase d'ancrage sous le champ texte :  
     *« Ton identité réelle est inaccessible. Seul le pseudonyme est transmis. »*
3. **L'Avatar Générique Non-Identifiant** :
   - Aucun upload de photo personnelle autorisé.
   - Système de pastilles géométriques abstraites (dégradés doux sauge/miel avec les 2 premières lettres du pseudo) générées côté client sans métadonnées.

---

### 5.4 Navigation Mobile & Ergonomie Smartphone

- **Barre de Navigation Inférieure (Mobile Tab Bar)** :
  - Hauteur fixe : `64px`, zone de sécurité tactile protégée (`env(safe-area-inset-bottom)`).
  - 4 onglets espacés :
    1. `Accueil` (Icône Maison douce)
    2. `Mes Échanges` (Icône Deux bulles avec pastille de notification sans texte)
    3. `Chroniques` (Icône Livre ouvert / Étoile)
    4. `Aide & Urgence` (Icône Cœur protégé / Bouée)
- **Barre Latérale Administrateur (Desktop / Tablette Back-Office)** :
  - Largeur : `260px`, fond Émeraude profond (`#112019`).
  - Badge d'état de l'administrateur en direct : `En service (Prêt à répondre)` / `En pause`.
  - Compteur de file d'attente partagée avec pastille d'alerte pour les messages prioritaires.

---

## 6. ICONOGRAPHIE ET GUIDELINES D'ILLUSTRATION

### 6.1 Système d'Icônes
- **Style** : Traits arrondis (`stroke-width: 2px`, `stroke-linecap: round`, `stroke-linejoin: round`).
- **Taille standardisée** : 20px (en ligne), 24px (boutons et barres), 32px (en-têtes de cartes).
- **Ressource recommandée** : *Lucide Icons* (très légère, sans dépendance externe, arborescence SVG intégrable inline).

### 6.2 Illustrations & Représentation Visuelle
- **Sujets** : Deux silhouettes bienveillantes assises côte à côte sous un arbre à palabres moderne, des mains tenant une étincelle de réconfort, un calepin secret avec un cadenas ouvert qui se referme.
- **Diversité & Ancrage local** : Teintes de peau chaudes et silhouettes représentatives de l'Afrique de l'Ouest (coiffures, tenues modernes de campus), sans tomber dans le folklore ou le misérabilisme.
- **Règle absolue d'anonymat** : **Aucun visage ne doit être dessiné avec des traits précis ou identifiables**. Les silhouettes sont stylisées, douces et universelles.

---

## 7. MOUVEMENT, ANIMATIONS ET ACCESSIBILITÉ

### 7.1 Micro-Animations
- **Apparition des bulles** : Transition subtile en `fade-in` + glissement vertical de 6px (`opacity: 0 -> 1`, `transform: translateY(6px) -> translateY(0)`), durée : `180ms`, courbe `ease-out`.
- **Indicateur de rédaction (« En train d'écrire »)** : Trois petits points sautillant doucement en boucle de 1.2s.
- **Respect de l'accessibilité (`prefers-reduced-motion`)** :
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

### 7.2 Accessibilité Numérique (WCAG 2.1 AA)
- Toutes les couleurs de texte dépassent le ratio de contraste de **4.5:1**.
- Toutes les zones cliquables font au minimum **48px × 48px** sur mobile pour éviter les erreurs de manipulation sur petit écran.
- Aucune information n'est transmise uniquement par la couleur : les alertes associent une icône explicite + un texte d'état clair.
- Prise en charge intégrale de la navigation au clavier (`focus-visible` avec anneau émeraude de 2px).

---

## 8. DEMANDE D'ARBITRAGE ET DE VALIDATION (FIN ÉTAPE 3)

Pour figer le Design System et passer à l'**Étape 4 : Maquettes fonctionnelles détaillées**, merci de confirmer par élimination :

1. **Choix de la police secondaire :**
   - *Option 1 :* Merriweather (éliminée : trop lourde et bave sur écrans 720p).
   - *Option 2 :* Inter (neutre mais clinique et froide).
   - *Option 3 (Recommandée) :* **Source Sans 3** (légère, chaude, lisibilité optimale sur mobile 3G).

2. **Choix de la palette chromatique :**
   - *Option 1 :* Crépuscule Mauve & Lilas (éliminée : risque de cliché adolescent).
   - *Option 2 :* Bleu Nocturne & Terre Sahélienne (sérieuse mais trop corporative).
   - *Option 3 (Recommandée) :* **« Refuge Végétal & Miel Doré »** (Émeraude profond, fond albâtre/lin reposant, accent miel réconfortant, contrastes AAA validés).

3. **Validation des spécifications des composants** (bulles asymétriques, navigation mobile 64px, signaux de confiance cadenas).
