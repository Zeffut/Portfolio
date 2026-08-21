# Portfolio « Dossier technique » — spécification de refonte

**Date** : 2026-08-21
**Statut** : approuvé
**Remplace** : `2026-04-01-portfolio-redesign-design.md`
**Production** : https://zeffut.fr (Vercel, déploiement automatique sur `main`)

---

## 1. Contexte et objectifs

Le portfolio actuel est un site statique d'une page (HTML/CSS/JS vanilla, sans build).
Sa refonte d'avril 2026 a adopté le langage visuel dominant des portfolios de
développeurs — fond noir, blobs floutés, glassmorphisme, grille bento, gradient sur
les titres. Ce vocabulaire est devenu un template : il ne distingue plus.

L'audit du 2026-08-21 a par ailleurs relevé 14 défauts, dont trois bloquants
(navigation mobile inexistante, `CLAUDE.md` obsolète, sélecteur de langue
inaccessible au clavier).

### Objectifs

1. Un design **original, pratique, lisible et impressionnant**, qui ne ressemble à
   aucun autre portfolio de développeur.
2. Une hiérarchie au service du **recrutement d'abord**, sans fermer les portes
   freelance et open-source.
3. La correction de **l'intégralité** des 14 défauts relevés.

### Cadrage validé

- **Cible prioritaire** : recruteurs et RH. Cibles secondaires : porteurs de projet
  (freelance) et pairs développeurs (open-source).
- **Parcours** : étudiant. **L'établissement n'est jamais nommé** — ni dans le
  contenu, ni dans les métadonnées. Le projet « ESIEE Salles » conserve son nom
  propre, qui est celui du projet, pas une mention de parcours.
- **Contraintes techniques** : aucune dépendance, aucun build, aucun framework.
  HTML/CSS/JS vanilla servi statiquement.

---

## 2. Concept

Le portfolio est mis en page comme un **dossier technique** : un document
d'ingénierie relié.

On emprunte la *structure* du document technique — numérotation, index, marges
d'annotation, filets, fiches normalisées — jamais sa complexité ni son aridité.
Ce n'est pas du skeuomorphisme : la page ne simule pas du papier, elle en adopte
la grammaire.

### Règle de discipline

> **Chaque ornement porte de l'information.**
> Un filet sépare. Un numéro localise. Une annotation explique. Une cotation mesure.

Tout élément graphique incapable de justifier sa présence par une information est
supprimé. C'est cette règle qui empêche le concept de dériver vers le gadget, et
c'est elle qui arbitre tout désaccord esthétique pendant l'implémentation.

### Pourquoi ce concept pour ce profil

Thomas livre des outils qui fonctionnent. Un dossier technique bien tenu est la
forme documentaire de la rigueur : le contenant dit la même chose que le contenu.
Un recruteur y scanne une structure familière ; un pair développeur y trouve la
densité qu'il attend.

---

## 3. Système visuel

### 3.1 Palette

Deux thèmes complets. **Le clair est le défaut** — un portfolio de développeur en
mode clair est en soi un écart à la norme. Le premier chargement respecte
`prefers-color-scheme` ; le choix explicite est persisté en `localStorage`.

| Rôle | Clair — « papier technique » | Sombre — « blueprint » |
|---|---|---|
| `--bg` | `#FAFAF7` | `#0C1220` |
| `--bg-alt` | `#F2F2EC` | `#111A2C` |
| `--ink` | `#14140F` | `#E8ECF5` |
| `--ink-2` | `#4A4A42` | `#A8B2C4` |
| `--ink-3` | `#75756A` | `#7C8798` |
| `--rule` | `#DEDED6` | `rgba(232,236,245,.14)` |
| `--rule-strong` | `#C4C4B8` | `rgba(232,236,245,.26)` |
| `--accent` | `#D6402C` | `#FF6B4A` |
| `--accent-soft` | `rgba(214,64,44,.10)` | `rgba(255,107,74,.14)` |
| `--status` | `#3F7A4E` | `#4ADE80` |

**Le vermillon d'annotation** (`#D6402C`) remplace le gradient lime/teal. C'est le
rouge du stylo de relecture et du tampon : le code couleur natif du document
annoté. Il est quasi absent des portfolios de développeurs — uniformément bleus,
violets ou lime — et il tranche franchement sur le papier.

**Emploi de l'accent** : il ne sert qu'à *pointer*. Numéros de section, état actif,
liens au survol, croix de calage, ponctuation typographique. Jamais en aplat de
fond large, jamais en gradient.

**Exigence de contraste** : tout couple texte/fond des deux thèmes est vérifié
≥ 4.5:1 (texte < 24px) ou ≥ 3:1 (≥ 24px gras) avant livraison. C'est un critère de
complétion, pas une intention.

### 3.2 Typographie

Trois familles, chacune avec un rôle strict et non négociable.

| Famille | Rôle | Graisses chargées |
|---|---|---|
| **Archivo** | Titres et chiffres de mise en avant | 600, 800 |
| **IBM Plex Sans** | Corps de texte | 400, 600 |
| **IBM Plex Mono** | Labels, données, annotations, numéros, tableaux | 400, 500 |

Chargement par `<link>` dans le `<head>` avec `preconnect` et `display=swap` — et
**non** par `@import` CSS, qui sérialise les requêtes et annule le bénéfice du
preconnect (défaut n° 7 de l'audit).

**Échelle** (fluide, `clamp`) :

| Usage | Taille |
|---|---|
| Hero `h1` | `clamp(2.75rem, 8.5vw, 6.5rem)` — Archivo 800, `line-height: .92`, `letter-spacing: -.035em` |
| Titre de section `h2` | `clamp(1.6rem, 4vw, 2.6rem)` — Archivo 800 |
| Titre de fiche `h3` | `1.15rem` — Archivo 600 |
| Corps | `1rem` / `line-height: 1.65` — Plex Sans 400 |
| Chapô | `clamp(1.05rem, 1.6vw, 1.25rem)` — Plex Sans 400 |
| Label mono | `.75rem`, `letter-spacing: .09em`, capitales — Plex Mono 500 |
| Annotation de marge | `.6875rem` — Plex Mono 400 |

### 3.3 Grille et espacement

- Base d'espacement : **8 px**. Toutes les valeurs en sont des multiples.
- Largeur de page : `--page-max: 1240px`.
- **Colonne de marge** (≥ 1200 px) : `180px` réservés à gauche pour l'index et les
  annotations ; le contenu occupe le reste. Sous 1200 px, la marge se replie et ses
  annotations passent en ligne ou disparaissent.
- Gouttière : `24px`.
- Rythme vertical des sections : `clamp(72px, 9vw, 128px)` de padding vertical.

**Points de rupture** : `1200px` (marge), `900px` (colonnes), `640px` (mobile).

Comportement de la navigation par bande :

| Largeur | Sommaire de marge | Liens d'en-tête | Bouton de menu |
|---|---|---|---|
| ≥ 1200 px | visible | visibles | masqué |
| 900–1199 px | masqué | visibles | masqué |
| < 900 px | masqué | masqués | **visible** |

Aucune bande ne se retrouve sans moyen de navigation — c'est précisément le défaut
bloquant n° 1 de l'audit, où les liens disparaissaient sous 768 px sans remplacement.

### 3.4 Ornements

Chacun est justifié par la règle de discipline :

| Ornement | Information portée |
|---|---|
| `§00`–`§06` | Localise la section dans le dossier |
| Croix de calage `⊹` | Marque les angles des blocs de premier niveau (repère d'impression) |
| Filets 1 px | Séparent les strates d'information ; jamais plus épais |
| Cotations chiffrées | Mesurent — employées sur les statistiques de la synthèse |
| Annotations de marge | Commentent en Plex Mono gris : référence du dossier, état, dates |

---

## 4. Structure

Un recruteur dispose de quarante secondes. L'ordre suit sa lecture.

```
§00  EN-TÊTE       nav fine + index du dossier (marge gauche)
§01  IDENTITÉ      qui · quoi · disponibilité · 2 CTA
§02  SYNTHÈSE      résumé exécutif — faits scannables + positionnement
§03  RÉALISATIONS  a) 5 fiches normalisées   b) index des 15
§04  COMPÉTENCES   tableau qualifié : niveau + preuve
§05  MÉTHODE       idée → prototype → production (bande compacte)
§06  CONTACT       recrutement · freelance · open-source
```

### Suppression du scroll-snap

Le `scroll-snap-type: y mandatory` actuel tronque le contenu sous 800 px de hauteur
(`overflow: hidden` sur des sections en `100svh`), casse la navigation clavier et
empêche la relecture. Il est **supprimé**. Un dossier se feuillette librement.

L'effet de qualité vient du détail typographique et du tracé des filets, non d'un
mécanisme qui gêne la lecture.

### Navigation

- **En-tête** : fine, sticky, avec un filet inférieur qui s'affirme au défilement.
- **Index de marge** (≥ 1200 px) : sommaire vertical numéroté, la section courante
  marquée `aria-current="true"`.
- **Mobile** (< 900 px) : bouton de menu réel — `aria-expanded`, `aria-controls`,
  fermeture par `Échap` et par clic extérieur, restitution du focus au déclencheur.
  Corrige le défaut bloquant n° 1.

---

## 5. Composants

### 5.1 Fiche projet normalisée (§03a)

Cinq projets phares. Champs identiques pour toutes les fiches — c'est la
normalisation qui produit l'effet « dossier » et permet la lecture en colonne.

```
┌ P.01 ─────────────────────────────────────── ⊹
│  BETTERFASTERWHISPER
│  Transcription vocale 100 % locale sur macOS
│
│  RÔLE    Conception · développement · distribution
│  STACK   Swift · WhisperKit · CoreML
│  ÉTAT    ● Publié — open-source
│  PREUVE  Fonctionne hors-ligne, sans aucun serveur
│
│  → github.com/Zeffut/BetterFasterWhisper
└──────────────────────────────────────────── ⊹
```

**Champs** : `RÔLE`, `STACK`, `ÉTAT`, `PREUVE`, lien.

**Règle de véracité — contraignante.** Le champ `PREUVE` n'énonce que des faits
vérifiables : caractéristiques techniques du projet, ou affirmations déjà présentes
sur le site actuel. **Aucun chiffre inventé** : ni étoiles GitHub, ni nombre
d'utilisateurs, ni téléchargements. En l'absence de preuve factuelle, le champ
énonce une propriété technique.

### 5.2 Index des réalisations (§03b)

Les quinze projets en tableau HTML sémantique — le format documentaire par
excellence, et le plus pratique à parcourir.

Colonnes : `RÉF.` · `PROJET` · `DOMAINE` · `STACK` · `ÉTAT`.

Les cinq fiches détaillées y figurent aussi, pour que l'index reste exhaustif.

**Projets privés** : les cinq projets non publics ne portent aucun lien — ni ancre,
ni URL morte. Ils sont rendus en `<tr>` inerte, avec l'état `Privé` en colonne
`ÉTAT`. Leur présence documente le volume de travail sans promettre un code
consultable.

### 5.3 Filtres

`Tout · IA · Automatisation · Web · Minecraft`, agissant simultanément sur les
fiches et sur l'index. Boutons réels, `aria-pressed`, navigables au clavier.

### 5.4 Tableau de compétences (§04)

Les 34 puces à infobulle actuelles sont inexploitables pour un recruteur. Elles
deviennent un tableau reliant chaque compétence à sa **preuve** :

```
LANGAGES        NIVEAU            UTILISÉ DANS
Python          ▰▰▰ Courant       JobScraper · ChessBot · ClipGenius
Swift           ▰▰▱ Opérationnel  BetterFasterWhisper
C               ▰▱▱ Notions       Projets algorithmiques
```

**Trois crans seulement** — `Courant` / `Opérationnel` / `Notions`. S'auto-noter sur
dix n'est pas crédible ; sur trois, ça l'est. La colonne « utilisé dans » convertit
une affirmation en démonstration.

Les niveaux sont inférés du contenu actuel du site (« Python — mon langage
principal » → Courant ; Swift, une application → Opérationnel ; C, « bas niveau et
algorithmes » → Notions). **Ils sont signalés à Thomas pour ajustement à la
livraison** : personne d'autre que lui ne peut les valider.

### 5.5 Bascule de thème et de langue

Deux `<button>` dans l'en-tête, avec `aria-pressed` et libellé accessible.
Le sélecteur de langue actuel — deux `<img>` porteuses d'un `click` — est
inaccessible au clavier et invisible aux lecteurs d'écran (défaut bloquant n° 3).

---

## 6. Contenu

### 6.1 Projets

**Fiches détaillées (5)** : BetterFasterWhisper, ClipGenius, JobScraper,
ESIEE Salles, n8n-nodes-plaud.

**Index (15)** : les 5 ci-dessus, plus VintedScraper, ChessBot, BrawlStar-Bot,
TikTok IA Generator, NoteGenius (publics), et SaaS Factory, Observer, NeuraNote,
JournalisteIA, Zeffut SMP (privés).

Les dix liens GitHub publics ont été vérifiés : tous répondent en HTTP 200.

### 6.2 Cohérence chiffrée

Le site actuel annonce « 16+ projets open-source » alors qu'il présente 15 projets
dont 5 privés. Les chiffres sont réalignés sur la réalité : **15 projets, dont 10
open-source** (défaut n° 12).

### 6.3 Internationalisation

Le mécanisme attributaire est conservé — le texte français reste dans le HTML
servi, ce qui est indispensable au référencement. Améliorations :

- `data-fr` / `data-en` sur le texte simple (inchangé) ;
- la bascule met aussi à jour `<title>`, `<meta name="description">` et
  `document.documentElement.lang`, ce que la version actuelle omet ;
- **source unique** pour les infobulles : les attributs `data-tip-fr` codés en dur
  dans le HTML, systématiquement écrasés par le dictionnaire JS et déjà divergents,
  disparaissent (défaut n° 6).

### 6.4 Curriculum vitæ

Le bouton de téléchargement du CV est **présent mais commenté**, accompagné de sa
consigne d'activation. Le PDF n'existe pas et le parcours de Thomas ne peut pas
être inventé. Activation : déposer `cv.pdf` à la racine et décommenter le bloc.

### 6.5 LinkedIn

Aucune URL LinkedIn n'existe dans le code actuel — seule une icône orpheline
subsiste. Aucun lien n'est inventé ; le point est signalé à la livraison.

---

## 7. Interactions

Discipline identique : chaque interaction doit être utile.

| Interaction | Comportement |
|---|---|
| Révélation au défilement | `translateY(8px)` + opacité, **320 ms**, décalage 40 ms. L'actuel (28 px / 700 ms) donne l'impression d'un site qui peine. |
| Tracé des filets | Au premier rendu du hero, les filets se tracent (`scaleX` 0→1, 500 ms). Une seule fois. C'est le moment de signature. |
| Survol de fiche | Le filet passe en vermillon, les croix de calage s'affirment. Rien d'autre. |
| Filtrage | Transition d'opacité, sans saut de mise en page. |
| Sommaire | Section courante marquée en continu. |

**Aucun** curseur personnalisé, parallaxe, blob animé ni bibliothèque de défilement.

`prefers-reduced-motion: reduce` neutralise l'ensemble des animations.

---

## 8. Référencement et métadonnées

Absents aujourd'hui, tous ajoutés (défaut n° 8) :

- `canonical` → `https://zeffut.fr/`
- `og:title`, `og:description`, `og:url`, `og:type`, `og:locale` (+ `og:locale:alternate`)
- **`og:image`** → `og-image.png` 1200×630, **généré par capture navigateur** d'une
  page dédiée reprenant le système visuel, puis supprimée du livrable.
- `twitter:card: summary_large_image`
- JSON-LD `Person` : `name`, `jobTitle`, `url`, `sameAs` (GitHub), `knowsAbout`.
  **Aucune mention d'établissement scolaire.**
- `robots.txt` et `sitemap.xml`

---

## 9. Accessibilité

Cible : **WCAG 2.1 AA**, score Lighthouse Accessibilité de 100.

- Lien d'évitement vers le contenu principal.
- `:focus-visible` sur tous les éléments interactifs : contour 2 px vermillon,
  décalage 2 px. Jamais supprimé.
- Points de repère : `header`, `nav`, `main`, `footer`, avec `aria-label` distincts.
- Menu mobile : `aria-expanded`, `aria-controls`, `Échap`, restitution du focus.
- Bascules langue et thème : `<button>` + `aria-pressed`.
- Sommaire : `aria-current="true"` sur la section active.
- Tableaux compétences et index : `<table>` avec `<caption>`, `<th scope>`.
- Contrastes conformes dans **les deux thèmes** — corrige `--faint` à 2.95:1
  (défaut n° 10).
- SVG décoratifs : `aria-hidden="true"`.

---

## 10. Performance

- Aucune image de contenu : icônes en SVG inline.
- Polices en `<link>` + `preconnect`, graisses limitées à celles listées en §3.2.
- Budgets : CSS < 30 Ko, JS < 15 Ko, `og-image.png` < 150 Ko.
- **Suppression des 28 fichiers orphelins** de `ressources/` (~700 Ko versionnés
  pour rien) — seuls `favicon.ico`, `france.svg`, `uk.svg`, `github.svg` sont
  encore référencés (défaut n° 4).
- Cibles Lighthouse : Performance ≥ 95, Accessibilité 100, Bonnes pratiques ≥ 95,
  Référencement 100.

---

## 11. Analytics

**PostHog conservé seul.** Rybbit (`tracking.zeffut.fr`) est retiré : deux traceurs
pour la même donnée, alors que PostHog est déjà correctement instrumenté avec la
super-propriété `app=portfolio` (défaut n° 14).

Événements conservés et adaptés : `language_switch`, `theme_switch` (nouveau),
`nav_click`, `section_view`, `project_filter`, `project_click`, `contact_click`,
`outbound_click`.

**Correction du scrollspy** : le seuil unique `0.5` empêche tout déclenchement sur
les sections plus hautes que deux fois la fenêtre — les parcours mobiles sont
aujourd'hui invisibles dans PostHog. Remplacé par des seuils multiples et une
détection par ligne de référence (défaut n° 9).

---

## 12. Traçabilité des correctifs

Les quatorze défauts de l'audit, et où ils sont traités :

| N° | Défaut | Traitement |
|---|---|---|
| 1 | Aucune navigation mobile | §4 Navigation — menu réel |
| 2 | `CLAUDE.md` obsolète | §13 Livrables — réécriture intégrale |
| 3 | Sélecteur de langue inaccessible | §5.5 + §9 |
| 4 | 28 ressources orphelines | §10 |
| 5 | CSS mort (services, Lenis, `.section-pad`) | §13 — réécriture complète |
| 6 | Double source des infobulles | §6.3 |
| 7 | Polices bloquantes (`@import`) | §3.2 |
| 8 | Référencement incomplet | §8 |
| 9 | Scrollspy muet sur mobile | §11 |
| 10 | `--faint` à 2.95:1 | §3.1 + §9 |
| 11 | Contenu tronqué par le snap | §4 |
| 12 | Chiffres incohérents | §6.2 |
| 13 | Cache-busting manuel désynchronisé | §13 — jeton de version unique daté |
| 14 | Double analytics | §11 |

---

## 13. Livrables

| Fichier | Action |
|---|---|
| `index.html` | Réécrit intégralement |
| `style.css` | Réécrit intégralement |
| `script.js` | Réécrit intégralement |
| `CLAUDE.md` | Réécrit — le fichier actuel décrit un site qui n'existe plus |
| `robots.txt` | Créé |
| `sitemap.xml` | Créé |
| `og-image.png` | Généré par capture navigateur |
| `ressources/` | 28 fichiers orphelins supprimés |

**Un seul fichier CSS et un seul fichier JS**, sectionnés par commentaires. Sans
build, un découpage coûterait des requêtes sans bénéfice à cette échelle.

**Invalidation de cache.** Les suffixes actuels sont désynchronisés
(`style.css?v=2`, `script.js?v=3`) et doivent être incrémentés à la main sans que
rien ne le rappelle. Ils sont remplacés par un **jeton de version unique et daté**,
identique sur les deux ressources : `?v=2026-08-21`. La règle — un seul jeton, à
la date du déploiement, sur toutes les ressources versionnées — est inscrite dans
`CLAUDE.md` pour ne plus dépendre de la mémoire (défaut n° 13).

---

## 14. Vérification (critères de complétion)

La refonte n'est déclarée terminée qu'après contrôle **par navigateur réel** :

**Rendus** : 1440×900, 1280×800, 768×1024, 390×844, et **1280×620** — le format en
hauteur réduite que le scroll-snap actuel tronque.

**Combinaisons** : thème clair et sombre × langue FR et EN.

**Fonctionnel** : filtres, menu mobile, bascules thème et langue, sommaire actif,
ancres de navigation, liens sortants.

**Technique** : console sans erreur ni avertissement ; parcours clavier complet de
bout en bout ; contrastes mesurés dans les deux thèmes ; budgets de §10 respectés.

Aucune affirmation de complétion n'est faite sans la sortie de commande ou la
capture correspondante.

---

## 15. Hors périmètre (YAGNI)

Explicitement exclus :

- Pages de détail par projet — les fiches sont assez riches.
- Blog, section « articles ».
- Formulaire de contact avec backend — `mailto:` suffit, le site est statique.
- Outil de build, bundler, framework, gestionnaire de paquets.
- Retour de la page `services.html` supprimée en avril.
- Curseur personnalisé, bibliothèque de défilement, animations décoratives.
