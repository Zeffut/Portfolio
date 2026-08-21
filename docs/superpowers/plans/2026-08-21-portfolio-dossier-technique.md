# Refonte « Dossier technique » — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruire le portfolio en un site statique mis en page comme un dossier technique, orienté recrutement, en corrigeant les quatorze défauts de l'audit du 2026-08-21.

**Architecture:** Site statique d'une page. Trois fichiers réécrits intégralement (`index.html`, `style.css`, `script.js`), plus `robots.txt`, `sitemap.xml` et une image de partage générée au navigateur. Le CSS porte un système de jetons à deux thèmes ; le JS est un IIFE unique découpé en modules internes (thème, langue, menu, sommaire, filtres, analytics). Aucun état partagé hors du DOM et de `localStorage`.

**Tech Stack:** HTML5, CSS3 (variables natives, `grid`, `clamp`), JavaScript ES5+ sans dépendance. Polices Google (Archivo, IBM Plex Sans, IBM Plex Mono). PostHog. Hébergement Vercel.

**Spec:** `docs/superpowers/specs/2026-08-21-portfolio-dossier-technique-design.md`

## Global Constraints

Valeurs reprises littéralement de la spec. Elles s'appliquent à **toutes** les tâches.

- **Aucune dépendance, aucun build, aucun framework.** Pas de `package.json`, pas de bundler.
- **Un seul fichier CSS, un seul fichier JS**, sectionnés par commentaires.
- **Règle de discipline** : chaque ornement porte de l'information. Tout élément graphique incapable de justifier sa présence par une information est supprimé.
- **Contraste** : ≥ 4.5:1 pour tout texte < 24 px, ≥ 3:1 pour ≥ 24 px gras — **dans les deux thèmes**.
- **Base d'espacement 8 px.** Toutes les valeurs en sont des multiples.
- **Trois familles de police**, graisses limitées à : Archivo 600/800, IBM Plex Sans 400/600, IBM Plex Mono 400/500. Chargement par `<link>` + `preconnect`, jamais par `@import`.
- **Budgets** : `style.css` < 30 Ko, `script.js` < 15 Ko, `og-image.png` < 150 Ko.
- **Jeton de version unique** : `?v=2026-08-21` sur `style.css` et `script.js`.
- **Aucun chiffre inventé** : ni étoiles GitHub, ni utilisateurs, ni téléchargements. Chiffres autorisés : 15 projets, 10 open-source, 5 privés.
- **L'établissement scolaire n'est jamais nommé** — ni contenu, ni métadonnées, ni JSON-LD. Le projet « ESIEE Salles » garde son nom propre.
- **`prefers-reduced-motion: reduce`** neutralise l'intégralité des animations.
- **Aucun push.** Le travail s'arrête au commit local.

### Palette de référence

| Jeton | Clair | Sombre |
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

### Navigation par bande

| Largeur | Sommaire de marge | Liens d'en-tête | Bouton de menu |
|---|---|---|---|
| ≥ 1200 px | visible | visibles | masqué |
| 900–1199 px | masqué | visibles | masqué |
| < 900 px | masqué | masqués | **visible** |

---

## Structure de fichiers

| Fichier | Responsabilité |
|---|---|
| `index.html` | Structure sémantique et contenu bilingue (FR dans le HTML servi, EN en attributs `data-en`) |
| `style.css` | Jetons, thèmes, grille, composants, réactivité, mouvement |
| `script.js` | Thème, langue, menu mobile, sommaire, filtres, analytics |
| `robots.txt` | Autorisation d'indexation + renvoi au sitemap |
| `sitemap.xml` | URL unique canonique |
| `og-image.png` | Image de partage 1200×630, générée par capture |
| `CLAUDE.md` | Documentation d'architecture pour les sessions futures |

**Outillage de vérification** (hors dépôt, dans le scratchpad) : `contrast.py` pour la mesure de contraste, serveur `python3 -m http.server`, Playwright MCP pour le navigateur.

---

## Task 1: Socle — nettoyage, jetons, thèmes, squelette

**Files:**
- Delete: 28 fichiers orphelins de `ressources/`
- Create: `style.css` (réécrit — sections Jetons, Reset, Grille)
- Create: `index.html` (réécrit — `<head>` complet + points de repère vides)
- Create: `script.js` (réécrit — module Thème seul)

**Interfaces:**
- Produces: jetons CSS de la palette (§Global Constraints), classes `.wrap`, `.section`, `.rule`, `.mono`, `.label` ; attribut racine `data-theme="light|dark"` ; clé `localStorage` `tds-theme`.

- [ ] **Step 1: Supprimer les ressources orphelines**

Les 28 fichiers listés par l'audit ne sont référencés nulle part. Seuls `favicon.ico`, `france.svg`, `uk.svg`, `github.svg` survivent.

```bash
cd /Users/zeffut/Desktop/Projets/Portfolio
git rm -q -r ressources/skills
git rm -q ressources/beehappy.png ressources/bitmoji.png ressources/chess.png \
  ressources/esiee_salles.png ressources/figma.png ressources/linkedin_ico.png \
  ressources/project_journaliste.svg ressources/project_minecraft.svg \
  ressources/project_neuranote.svg ressources/project_observer.svg \
  ressources/project_saas.svg ressources/superwhisper_logo.jpg \
  ressources/tiktok.png ressources/vinted.png
```

- [ ] **Step 2: Vérifier qu'il ne reste que les quatre fichiers utiles**

Run: `git ls-files ressources/`
Expected: exactement `favicon.ico`, `france.svg`, `github.svg`, `uk.svg`.

- [ ] **Step 3: Écrire les jetons et les deux thèmes**

Le thème clair est le défaut sur `:root`. Le sombre est redéfini deux fois — sous `prefers-color-scheme` gardé par `:not([data-theme="light"])`, et sous `[data-theme="dark"]` — pour que la bascule explicite gagne dans les deux sens.

```css
:root {
  --bg:#FAFAF7; --bg-alt:#F2F2EC; --ink:#14140F; --ink-2:#4A4A42; --ink-3:#75756A;
  --rule:#DEDED6; --rule-strong:#C4C4B8;
  --accent:#D6402C; --accent-soft:rgba(214,64,44,.10); --status:#3F7A4E;
  --page-max:1240px; --margin-col:180px; --gutter:24px;
  --f-display:'Archivo',system-ui,sans-serif;
  --f-body:'IBM Plex Sans',system-ui,sans-serif;
  --f-mono:'IBM Plex Mono',ui-monospace,monospace;
  --ease:cubic-bezier(.2,.7,.3,1);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* jetons sombres */ }
}
:root[data-theme="dark"] { /* mêmes jetons sombres */ }
```

- [ ] **Step 4: Écrire l'échelle typographique**

Fluide, en `clamp`. Valeurs reprises littéralement de la spec §3.2 :

```css
h1        { font:800 clamp(2.75rem,8.5vw,6.5rem)/.92 var(--f-display); letter-spacing:-.035em }
h2        { font:800 clamp(1.6rem,4vw,2.6rem)/1.05 var(--f-display) }
h3        { font:600 1.15rem/1.3 var(--f-display) }
body      { font:400 1rem/1.65 var(--f-body) }
.lede     { font-size:clamp(1.05rem,1.6vw,1.25rem) }
.label    { font:500 .75rem/1 var(--f-mono); letter-spacing:.09em; text-transform:uppercase }
.annot    { font:400 .6875rem/1.4 var(--f-mono) }
```

- [ ] **Step 5: Écrire le `<head>` complet**

Polices en `<link>` (jamais `@import`), `preconnect` vers `fonts.googleapis.com` et `fonts.gstatic.com`, `display=swap`. PostHog conservé, **Rybbit retiré**. Ressources versionnées `?v=2026-08-21`.

Un script inline **avant** la feuille de style applique le thème mémorisé, pour éviter le flash de thème clair au chargement en mode sombre.

- [ ] **Step 6: Écrire le module Thème dans `script.js`**

```js
var THEME_KEY = 'tds-theme';
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem(THEME_KEY, t); } catch(e){}
}
```

- [ ] **Step 7: Vérifier les contrastes des deux thèmes**

Run: `python3 <scratchpad>/contrast.py`
Expected: chaque couple `--ink|--ink-2|--ink-3|--accent` sur `--bg` et `--bg-alt` ≥ 4.5:1 dans les deux thèmes. Tout échec impose d'ajuster le jeton **avant** de continuer.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "refactor: socle du dossier technique — jetons, thèmes, nettoyage des ressources"
```

---

## Task 2: §00 En-tête, sommaire de marge, menu mobile, langue

**Files:**
- Modify: `index.html` (en-tête, sommaire, squelette des six sections)
- Modify: `style.css` (en-tête, sommaire, menu, bascules)
- Modify: `script.js` (modules Langue, Menu, Sommaire)

**Interfaces:**
- Consumes: jetons et `applyTheme` de la Task 1.
- Produces: `applyLang(lang)` ; identifiants de section `#identite`, `#synthese`, `#realisations`, `#competences`, `#methode`, `#contact` ; classe `.is-open` sur le menu ; clé `localStorage` `tds-lang`.

- [ ] **Step 0: Acter deux suppressions structurelles**

Deux mécanismes de l'ancien site ne sont pas réécrits mais **supprimés**, et rien
ne doit les réintroduire par habitude :

- **`scroll-snap-type: y mandatory`** — il tronque le contenu sous 800 px de haut
  (`overflow:hidden` sur des sections en `100svh`), casse le clavier et empêche la
  relecture. Aucune règle `scroll-snap-*` ne doit exister dans le nouveau CSS
  (défaut n° 11).
- **Les attributs `data-tip-fr` / `data-tip-en` codés en dur** — systématiquement
  écrasés par le dictionnaire `SKILL_TIPS` du JS, et déjà divergents (« scraping de
  données » côté HTML contre « scraping » côté JS). Les infobulles disparaissent
  entièrement : l'information passe dans le tableau de compétences de la Task 5,
  où elle est lisible sans survol — donc utilisable au clavier et au doigt
  (défaut n° 6).

Vérification en fin de Task 8 : `grep -c 'scroll-snap\|data-tip' index.html style.css` doit renvoyer `0`.

- [ ] **Step 1: Écrire l'en-tête et le lien d'évitement**

Ordre du DOM : lien d'évitement, `header > nav`, `main`, `footer`. Le lien d'évitement est visible au focus.

- [ ] **Step 2: Remplacer les bascules par de vrais boutons**

Le sélecteur actuel est fait de deux `<img>` porteuses d'un `click` : ni focusable, ni annoncé. Il devient :

```html
<button type="button" class="lang-btn" data-lang="fr" aria-pressed="true">FR</button>
<button type="button" class="lang-btn" data-lang="en" aria-pressed="false">EN</button>
<button type="button" id="theme-btn" aria-pressed="false" aria-label="Basculer en thème sombre">…</button>
```

- [ ] **Step 3: Écrire le menu mobile**

`aria-expanded`, `aria-controls`, fermeture par `Échap` et par clic extérieur, restitution du focus au déclencheur.

```js
function closeMenu(){
  menu.classList.remove('is-open');
  toggle.setAttribute('aria-expanded','false');
  toggle.focus();
}
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
});
```

- [ ] **Step 4: Écrire le sommaire de marge et son scrollspy**

Le seuil unique `0.5` actuel ne se déclenche jamais sur une section plus haute que deux fois la fenêtre — d'où l'absence totale de `section_view` sur mobile. Remplacé par des seuils multiples et une sélection par ratio maximal :

```js
var spy = new IntersectionObserver(onSpy, {
  threshold: [0, .15, .35, .6, .85],
  rootMargin: '-72px 0px -45% 0px'
});
```

- [ ] **Step 5: Étendre la bascule de langue aux métadonnées**

`applyLang` met aussi à jour `document.title`, `<meta name="description">` et `documentElement.lang` — ce que la version actuelle omet.

- [ ] **Step 6: Vérifier au navigateur les trois bandes**

Serveur : `python3 -m http.server 8017`
Playwright : `browser_resize` à 1440×900, 1024×800, 390×844, puis `browser_take_screenshot` à chaque largeur.
Expected: à 1440 sommaire + liens ; à 1024 liens seuls ; à 390 bouton de menu fonctionnel. **Aucune largeur sans moyen de navigation.**

- [ ] **Step 7: Vérifier le parcours clavier**

Playwright : `Tab` répété depuis le haut de page.
Expected: lien d'évitement → liens de nav → bascules langue → bascule thème → contenu. Contour visible à chaque arrêt. `Échap` ferme le menu et rend le focus au bouton.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: en-tête, sommaire de marge, menu mobile accessible, bascules langue et thème"
```

---

## Task 3: §01 Identité et §02 Synthèse

**Files:**
- Modify: `index.html`, `style.css`, `script.js` (module Révélation)

**Interfaces:**
- Consumes: grille et jetons des Tasks 1–2.
- Produces: classes `.reveal`, `.is-in`, `.corner` (croix de calage), `.annot` (annotation de marge).

- [ ] **Step 1: Écrire §01 Identité**

Contient : `§01`, titre `h1` en Archivo 800, fonction, chapô, **indicateur de disponibilité**, deux CTA (« Voir les réalisations », « Me contacter »), et le bloc CV **commenté** avec sa consigne d'activation.

```html
<!-- CV : déposer cv.pdf à la racine du dépôt, puis décommenter.
     Laissé inactif tant que le fichier n'existe pas : un lien mort
     coûte plus cher qu'un bouton absent.
<a class="btn" href="/cv.pdf" download>CV ↓</a>
-->
```

- [ ] **Step 2: Écrire §02 Synthèse**

Faits scannables **cotés** : `15` projets, `10` open-source, `4` domaines. Aucun autre chiffre — la contrainte « aucun chiffre inventé » s'applique. Le site actuel annonce « 16+ » à tort ; la valeur exacte est 15.

- [ ] **Step 3: Écrire la révélation au défilement**

`translateY(8px)` + opacité, 320 ms, décalage 40 ms — au lieu des 28 px / 700 ms actuels qui donnent l'impression d'un site qui peine.

- [ ] **Step 4: Écrire le tracé des filets**

Au premier rendu du hero uniquement, `scaleX` 0→1 sur 500 ms. Une seule fois, jamais rejoué.

- [ ] **Step 5: Vérifier le mouvement réduit**

Playwright : `browser_evaluate` avec émulation `prefers-reduced-motion: reduce`.
Expected: contenu entièrement visible, aucune transformation résiduelle, aucun filet à `scaleX(0)`.

- [ ] **Step 6: Vérifier la hauteur réduite**

Playwright : `browser_resize` à 1280×620 — le format que le scroll-snap actuel tronque.
Expected: aucun contenu coupé, aucun débordement horizontal.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: §01 identité et §02 synthèse, révélation sobre, tracé des filets"
```

---

## Task 4: §03 Réalisations — fiches, index, filtres

**Files:**
- Modify: `index.html`, `style.css`, `script.js` (module Filtres)

**Interfaces:**
- Consumes: `.reveal`, `.corner` de la Task 3.
- Produces: `applyFilter(cat)` ; attribut `data-cat` valant `ia|auto|web|mc` ; classes `.sheet` (fiche) et `.index-row` (ligne d'index).

- [ ] **Step 1: Écrire les cinq fiches normalisées**

Champs **identiques** pour les cinq — c'est la normalisation qui produit l'effet « dossier » et permet la lecture en colonne : `RÔLE`, `STACK`, `ÉTAT`, `PREUVE`, lien.

Projets : BetterFasterWhisper, ClipGenius, JobScraper, ESIEE Salles, n8n-nodes-plaud.

`PREUVE` n'énonce que des faits vérifiables — propriété technique du projet, ou affirmation déjà présente sur le site actuel. Exemple autorisé pour BetterFasterWhisper : « Fonctionne hors-ligne, sans aucun serveur ». Exemple **interdit** : « 1 200 téléchargements ».

- [ ] **Step 2: Écrire l'index des quinze en tableau sémantique**

`<table>` avec `<caption>`, `<th scope="col">`. Colonnes : `RÉF.`, `PROJET`, `DOMAINE`, `STACK`, `ÉTAT`.

Les cinq projets privés — SaaS Factory, Observer, NeuraNote, JournalisteIA, Zeffut SMP — sont des lignes **inertes** : aucun lien, aucune URL morte, état `Privé`.

- [ ] **Step 3: Écrire les filtres**

Boutons réels avec `aria-pressed`, agissant **simultanément** sur les fiches et sur les lignes d'index.

- [ ] **Step 4: Vérifier chaque filtre au navigateur**

Playwright : cliquer `Tout`, `IA`, `Automatisation`, `Web`, `Minecraft` ; après chaque clic, compter les fiches et les lignes visibles via `browser_evaluate`.
Expected: cohérence stricte entre le nombre de fiches et de lignes affichées pour une même catégorie ; `Tout` restitue 15 lignes.

- [ ] **Step 5: Vérifier les dix liens publics**

Run: boucle `curl -o /dev/null -w '%{http_code}'` sur les dix URL GitHub du HTML.
Expected: `200` pour les dix. Aucun lien sur les cinq lignes privées.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: §03 réalisations — fiches normalisées, index des quinze, filtres"
```

---

## Task 5: §04 Compétences, §05 Méthode, §06 Contact, pied de page

**Files:**
- Modify: `index.html`, `style.css`

**Interfaces:**
- Consumes: composants de tableau de la Task 4.
- Produces: classe `.skill-level` (trois crans).

- [ ] **Step 1: Écrire le tableau de compétences**

Trois crans uniquement — `Courant`, `Opérationnel`, `Notions`. La colonne « utilisé dans » relie chaque compétence à des projets réellement présents dans §03, ce qui convertit une affirmation en démonstration.

Les niveaux sont inférés du contenu actuel du site (Python « mon langage principal » → Courant ; Swift, une application → Opérationnel ; C « bas niveau et algorithmes » → Notions). **À signaler à Thomas pour ajustement** — personne d'autre ne peut les valider.

- [ ] **Step 2: Écrire §05 Méthode**

Bande compacte, quatre étapes : cadrer → prototyper → livrer → mesurer. Courte par construction : elle différencie sans remplir.

- [ ] **Step 3: Écrire §06 Contact et le pied de page**

Trois portes explicites — recrutement, freelance, open-source — vers `mailto:tom77ds@gmail.com` et GitHub.

**Aucun lien LinkedIn** : aucune URL n'existe dans le code actuel, et aucune n'est inventée. À signaler à la livraison.

- [ ] **Step 4: Recâbler les événements PostHog**

Un helper unique, tolérant à l'absence de PostHog (bloqueur de publicité) :

```js
function track(name, props){
  if (window.posthog && typeof posthog.capture === 'function') {
    try { posthog.capture(name, props || {}); } catch(e){}
  }
}
```

Événements attendus : `language_switch`, **`theme_switch`** (nouveau), `nav_click`,
`section_view`, `project_filter`, `project_click`, `contact_click`,
`outbound_click`. La super-propriété `app: 'portfolio'` est conservée — c'est elle
qui permet de multiplexer plusieurs sites sur l'unique projet PostHog gratuit.

`section_view` est désormais alimenté par le scrollspy à seuils multiples de la
Task 2 : les parcours mobiles, aujourd'hui totalement absents de PostHog,
redeviennent visibles (défaut n° 9).

- [ ] **Step 5: Vérifier la sémantique des tableaux**

Playwright `browser_evaluate` : chaque `<table>` possède un `<caption>` et des `<th scope>`.
Expected: `true` pour les deux tableaux.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: §04 compétences qualifiées, §05 méthode, §06 contact"
```

---

## Task 6: Référencement, métadonnées, image de partage

**Files:**
- Modify: `index.html` (métas, JSON-LD)
- Create: `robots.txt`, `sitemap.xml`, `og-image.png`
- Temporary: `og-source.html` (supprimé après capture)

- [ ] **Step 1: Compléter les métadonnées**

Ajouter : `canonical` vers `https://zeffut.fr/`, `og:title`, `og:description`, `og:url`, `og:type`, `og:locale` + `og:locale:alternate`, `og:image` (absolue), `twitter:card: summary_large_image`.

- [ ] **Step 2: Écrire le JSON-LD `Person`**

`name`, `jobTitle`, `url`, `sameAs` (GitHub uniquement), `knowsAbout`. **Aucune propriété `alumniOf`** — l'établissement n'est jamais nommé.

- [ ] **Step 3: Générer l'image de partage**

Créer `og-source.html` reprenant le système visuel, la capturer en 1200×630 via Playwright, l'enregistrer en `og-image.png`, puis supprimer la source.

Expected: fichier < 150 Ko.

- [ ] **Step 4: Écrire `robots.txt` et `sitemap.xml`**

```
User-agent: *
Allow: /
Sitemap: https://zeffut.fr/sitemap.xml
```

- [ ] **Step 5: Vérifier la présence de chaque métadonnée**

Run: `grep -c` sur `canonical`, `og:image`, `og:url`, `twitter:card`, `application/ld+json`.
Expected: `1` pour chacune. `python3 -c "import json…"` valide le JSON-LD.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: référencement complet, JSON-LD, image de partage générée"
```

---

## Task 7: Vérification navigateur complète

**Files:** aucun ajout — correctifs sur les trois fichiers selon les constats.

- [ ] **Step 1: Matrice de rendus**

Cinq formats × deux thèmes : 1440×900, 1280×800, 768×1024, 390×844, **1280×620**.
Capture systématique. Expected: aucun débordement horizontal, aucun contenu tronqué, aucun chevauchement.

- [ ] **Step 2: Matrice langue**

FR et EN sur trois sections au moins. Expected: aucun texte anglais résiduel en FR et réciproquement ; aucune mise en page cassée par la longueur des chaînes.

- [ ] **Step 3: Console propre**

Playwright `browser_console_messages`. Expected: **zéro** erreur, zéro avertissement.

- [ ] **Step 4: Contrastes mesurés sur le rendu réel**

`browser_evaluate` relève les couleurs calculées des textes clés dans les deux thèmes ; mesure au script.
Expected: tout ≥ 4.5:1 (< 24 px) ou ≥ 3:1 (≥ 24 px gras).

- [ ] **Step 5: Parcours clavier de bout en bout**

Expected: chaque élément interactif atteignable, contour visible, ordre logique, aucun piège au focus.

- [ ] **Step 6: Budgets**

Run: `wc -c style.css script.js og-image.png`
Expected: < 30 720, < 15 360, < 153 600 octets.

- [ ] **Step 7: Corriger tout constat, puis rejouer les étapes 1–6**

Aucune affirmation de complétion sans la sortie ou la capture correspondante.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "fix: correctifs issus de la vérification navigateur"
```

---

## Task 8: Documentation et clôture

**Files:**
- Modify: `CLAUDE.md` (réécrit intégralement)

- [ ] **Step 1: Réécrire `CLAUDE.md`**

Le fichier actuel décrit un site qui n'existe plus : `services.html` supprimé, police Poppins, gradient `#9C83FF → #FF9051`, carrousel de compétences, i18n `data-lang`. Il induit activement en erreur toute session future.

Le nouveau documente : concept et règle de discipline, jetons et thèmes, structure des six sections, mécanisme i18n, **règle du jeton de version unique**, analytics PostHog seul, et la contrainte « ne jamais nommer l'établissement ».

- [ ] **Step 2: Vérifier la traçabilité des quatorze correctifs**

Reprendre le tableau §12 de la spec et confirmer chaque ligne par une preuve — extrait de code, sortie de commande ou capture.
Expected: quatorze lignes confirmées, zéro en suspens.

- [ ] **Step 3: Vérification finale de l'état du dépôt**

Run: `git status --porcelain` puis `git log --oneline -9`
Expected: arbre propre, historique lisible.

- [ ] **Step 4: Commit final — sans push**

```bash
git add -A && git commit -m "docs: CLAUDE.md réécrit pour le dossier technique"
```

**Le push est explicitement hors périmètre** : il déclenche le déploiement Vercel en production. Il attend l'accord de Thomas.

---

## Notes d'exécution

**Ce qui devra être signalé à Thomas à la livraison :**

1. Les **niveaux de compétence** sont inférés — lui seul peut les valider.
2. **Aucun lien LinkedIn** n'a été ajouté : aucune URL n'existe dans le code actuel.
3. Le **bouton CV est commenté** — à activer en déposant `cv.pdf` à la racine.
4. **Rybbit a été retiré** au profit de PostHog seul.
5. Le site n'est **pas déployé** : il attend l'accord de push.
