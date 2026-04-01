# Portfolio Redesign — Glassmorphism Dark

## Contexte

Portfolio personnel statique (HTML/CSS/JS vanilla) de Thomas De Sousa. Objectif : polish professionnel du design existant sans changer de stack. Carte de visite polyvalente.

## Principes directeurs

- Rester en HTML/CSS/JS vanilla, pas de build system
- Pas d'avatar (bitmoji supprimé)
- Suppression de l'iframe Spline (globe 3D) — remplacé par un fond animé CSS
- Glassmorphism cohérent desktop/mobile comme langage visuel unifié
- Animations subtiles au scroll via IntersectionObserver
- Conserver l'i18n FR/EN existante (data-lang)
- Conserver le gradient signature #9C83FF -> #FF9051

## Section 1 : Hero

- Suppression du bitmoji/sphère et de l'iframe Spline
- **Fond animé** : 2-3 blobs flous (filter: blur(100px)) en violet #9C83FF et orange #FF9051, positionnés en absolute, animés lentement (~15s, CSS keyframes, déplacement + scale)
- **Titre** : "Thomas De Sousa" en 60-70px, gradient animé sur le texte (background-size: 200%, animation de background-position)
- **Sous-titre** : "Développeur Full-Stack & Passionné d'Infrastructure" (FR) / "Full-Stack Developer & Infrastructure Enthusiast" (EN) — remplace "Je Code"
- **CTA** : bouton "Me Contacter" en glassmorphism (background: rgba(255,255,255,0.08), backdrop-filter: blur(12px), border semi-transparent)
- **Entrance** : fade-in + translateY au chargement (~0.6s, CSS animation)
- Language switcher conservé en haut à droite

## Section 2 : A propos

- Titre conservé : "A PROPOS DE MOI"
- Sous-titre gradient changé : "ME DECOUVRIR" -> "MON PARCOURS" / "MY JOURNEY"
- **Texte reecrit** :
  - FR : "Etudiant en ecole d'ingenieur et developpeur autodidacte, je construis des outils concrets — du scraping d'offres d'emploi a la transcription vocale locale. Je gere aussi ma propre infrastructure : deploiement, monitoring, automatisation, le tout self-hosted."
  - EN : "Engineering student and self-taught developer, I build practical tools — from job scraping to local voice transcription. I also manage my own infrastructure: deployment, monitoring, automation, all self-hosted."
- Section wrappée dans une **carte glassmorphism**
- **Animation au scroll** : fade-in + translateY via IntersectionObserver
- Spacing augmenté entre titre et paragraphe (margin-top: 40px)
- max-width: 600px conservé

## Section 3 : Experience / Skills

- Slider infini supprimé, remplacé par une **grille statique**
- Sous-titre : "MES SKILLS" -> "CE QUE J'UTILISE" / "MY TOOLKIT"
- Paragraphe en dessous supprimé
- Chaque skill dans une **mini-carte glassmorphism** : icone + nom
- **Hover** : box-shadow glow avec le gradient signature
- **Animation** : staggered fade-in (delay 0.1s entre chaque carte, déclenché par IntersectionObserver)
- Suppression de la duplication HTML des skills
- Layout : 4 colonnes desktop, 2 colonnes mobile

## Section 4 : Projets

- Layout : **grille 2 colonnes** desktop, 1 colonne mobile
- Toutes les cartes en **glassmorphism uniforme** (extension du style mobile actuel au desktop)
- Image de preview pleine largeur en haut de chaque carte (remplace l'icone 50x50 dans carré blanc)
- **Hover** : scale(1.02) + border glow gradient
- Le lien "Mon GitHub" sort des cartes projet, devient un **CTA bouton** séparé sous la grille
- Projets : Esiee-Paris-Salles, BetterFasterWhisper, JobScraper — textes conservés
- **Animation** : staggered fade-in comme les skills

## Section 5 : Footer / Credits

- Texte credits conservé, centré dans une barre glassmorphism discrète
- Padding augmenté, font-size légèrement réduit

## Elements globaux

- **Smooth scroll** : html { scroll-behavior: smooth }
- **Scroll animations** : un seul IntersectionObserver dans script.js, classe .fade-in-section sur chaque section, ajout de .visible quand la section entre dans le viewport
- **services.html** : même traitement glassmorphism unifié sur les cartes de services
- **Typographie** : Poppins conservé partout, contraste de taille augmenté (titres 50px, body 16px)
- **Script Rybbit** : conservé tel quel sur index.html

## Elements supprimes

- iframe Spline (globe 3D)
- Bitmoji + sphère grise (.sphere, .bitmoji)
- Duplication des skills dans le slider HTML
- Animation CSS slideshow (keyframes)
- Paragraphe sous les skills

## Fichiers impactes

- `index.html` — restructuration hero, skills en grille, projets en grille, suppression iframe/bitmoji
- `services.html` — unification glassmorphism sur les cartes
- `style.css` — nouveaux styles glassmorphism, blobs animés, grilles, scroll animations, suppression styles slider/sphere
- `script.js` — ajout IntersectionObserver pour scroll animations, conservation de l'i18n existante
