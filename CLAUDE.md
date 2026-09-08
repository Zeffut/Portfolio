# CLAUDE.md

Guide pour Claude Code (claude.ai/code) sur ce dépôt.

## Vue d'ensemble

Portfolio personnel de Thomas De Sousa. Site statique d'une page —
HTML/CSS/JS vanilla, **aucune dépendance, aucun build, aucun framework**.

Production : **https://zeffut.fr** (Vercel). **Tout push sur `main` déploie
en production.** Il n'y a pas d'environnement de préproduction.

## Concept : « dossier technique »

Le site est mis en page comme un dossier d'ingénierie : sections numérotées
`§01`–`§06`, sommaire de marge, filets, croix de calage, annotations, fiches
projet normalisées.

### Règle de discipline — elle arbitre tout désaccord esthétique

> **Chaque ornement porte de l'information.**
> Un filet sépare · un numéro localise · une annotation explique · une cotation mesure.

Tout élément graphique incapable de justifier sa présence par une information
est supprimé. Cette règle a écarté, entre autres, blobs floutés, glassmorphisme,
gradients sur les titres et grilles bento — le vocabulaire par défaut des
portfolios de développeurs, dont ce site s'écarte volontairement.

### Objectif du site — il arbitre les questions de conversion

> **Le visiteur doit finir sur les dépôts GitHub.**

Le portfolio n'est pas la destination, c'est le chemin. Une fiche projet
convainc, le code prouve. Toute décision qui ajoute un pas entre le lecteur
et `github.com/Zeffut` doit se justifier ; toute décision qui en retire un
est bonne par défaut.

Cinq points d'entrée vers le profil, répartis sur la descente de page :
la cotation **DÉPÔTS** de la fiche signalétique (§01), le **rappel de fin
de §03** — placé juste après l'index, là où l'intention est au plus haut —,
le bouton de §06, la porte « Open-source » de §06, et le pied de page.
S'y ajoutent les 32 liens vers un dépôt précis (5 fiches + 27 entrées
d'index). Dans l'index, les 27 entrées cliquables portent un chevron `↗` et
les 14 privées un `•` : sans ce marquage, le lecteur ne sait pas lesquelles
des 41 mènent quelque part.

PostHog mesure déjà tout cela — l'événement `outbound_click` porte
`destination: 'github'`. C'est le chiffre à regarder pour juger d'une
modification, pas l'impression esthétique.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure et contenu. Le **français est le texte servi** ; l'anglais vit dans les attributs `data-en`. |
| `style.css` | `@font-face` locaux, jetons, thèmes, grille, composants, réactivité. |
| `script.js` | IIFE unique : thème, langue, menu, sommaire, filtres, analytics. |
| `fonts/` | 8 fichiers woff2 servis localement. |
| `og-image.png` | Image de partage 1200×630, **générée au navigateur**. |
| `favicon.svg` · `favicon.ico` · `apple-touch-icon.png` | Jeu d'icônes. |
| `404.html` | Page d'erreur, même vocabulaire graphique, `noindex`. |
| `vercel.json` | En-têtes de sécurité (dont la CSP) et politiques de cache. |
| `site.webmanifest` | Nom, icônes, couleurs pour l'ajout à l'écran d'accueil. |
| `robots.txt` · `sitemap.xml` | Référencement. |

Un seul CSS, un seul JS : sans build, découper coûterait des requêtes sans
bénéfice à cette échelle.

## Conventions

### Thèmes
Clair « papier » par défaut, sombre « blueprint » disponible. Les jetons sombres
sont déclarés **deux fois** — sous `prefers-color-scheme` gardé par
`:not([data-theme="light"])`, et sous `[data-theme="dark"]` — pour que la
bascule explicite l'emporte dans les deux sens. Un script inline dans le `<head>`
applique le thème mémorisé avant le rendu, ce qui évite le flash de thème clair.

### La classe `js`
Ce même script inline pose `js` sur `<html>`. **Tout masquage au défilement est
conditionné à cette classe** (`.js .reveal { opacity: 0 }`). Sans JavaScript,
rien n'est caché et la page reste entièrement lisible. Ne jamais écrire un
`.reveal { opacity: 0 }` non conditionné : la page deviendrait blanche si le
script échoue.

### Ne pas animer l'entrée du hero
`§01` ne porte aucune classe `reveal` : la section est visible au chargement.
La masquer en attendant le JavaScript repoussait le Largest Contentful Paint
de 3 secondes pour une animation que personne ne voit.

### Internationalisation
Le français est le contenu du HTML (indispensable au référencement) ; il est
mémorisé au démarrage. Seul l'anglais est déclaré, en `data-en`. La bascule met
aussi à jour `<title>` (via `data-i18n-title` sur `<html>`), la méta description
et `documentElement.lang`.

Les **`aria-label` en français portent un `data-en-label`** et basculent avec
le reste ; les étiquettes qu'aucun nœud de texte ne porte (bouton de thème,
bouton de menu, compte rendu de filtre) vivent dans le dictionnaire `LABELS`
de `script.js`. Une étiquette restée française en mode EN est un défaut :
elle n'est visible qu'au lecteur d'écran, donc invisible à la relecture.

**Tout texte visible ajouté doit porter son `data-en`.** Le contrôle ci-dessous
liste aussi les noms propres — projets, technologies, « GitHub » — qui n'ont
légitimement pas à être traduits. Ce qu'il faut y chercher, ce sont les mots
français traduisibles, y compris ceux sans accent : c'est ainsi qu'« IA » avait
échappé à une première vérification fondée sur les caractères accentués.

```bash
# Éléments de texte visibles dépourvus de data-en (candidats à traduire)
python3 - <<'EOF'
import re, io
h = io.open('index.html', encoding='utf-8').read()
body = h[h.index('<body>'):]
for m in re.finditer(r'<(h1|h2|h3|p|dt|dd|td|th|span|a|button)\b([^>]*)>([^<>]{3,})</\1>', body):
    attrs, texte = m.group(2), m.group(3).strip()
    if 'data-en' not in attrs and re.search(r'[A-Za-zÀ-ÿ]{3,}', texte):
        print('  %-8s %s' % (m.group(1), texte[:60]))
EOF
```

### Invalidation du cache
Un **jeton unique et daté**, identique sur toutes les ressources versionnées :
`style.css?v=AAAA-MM-JJ` et `script.js?v=AAAA-MM-JJ`. À chaque déploiement
modifiant l'un de ces fichiers, mettre les deux à la date du jour. Ne jamais
revenir à deux compteurs séparés — ils s'étaient désynchronisés (`?v=2` contre
`?v=3`).

### Index des réalisations (§03) — en colonnes, jamais en lignes
Quarante et un projets empilés en tableau faisaient **1 250 px** : la section
écrasait la page. L'index est une **grille `auto-fill`** (3 colonnes ≥ 1200 px,
2 à partir de 768, 1 sur téléphone) qui tient la même liste en **560 px**. Ne
pas revenir à une ligne par projet.

Chaque entrée porte sa référence `P.nn`, son nom et sa techno. Un dépôt public
est un lien terminé par `↗` ; un projet privé est un `<span>` terminé par `•`
et grisé — la différence se voit **avant** le clic. Le filtre agit sur les
`li[data-cat]` et sur les fiches détaillées simultanément.

### Compétences (§04) — aucune auto-notation
Les jauges de niveau ont été **retirées**. Une note qu'on s'attribue soi-même
n'est vérifiable par personne : elle ne porte donc aucune information, et la
règle de discipline la condamne au même titre qu'un dégradé décoratif. Le
tableau ne garde que deux colonnes — **la compétence et le projet où elle a
servi**. Ne pas les réintroduire, sous aucune forme : ni barres, ni étoiles,
ni pourcentages, ni « 8/10 ».

### Sécurité et en-têtes — `vercel.json`
CSP, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP,
`X-Frame-Options`, plus les durées de cache.

**La CSP interdit `'unsafe-inline'` : les deux scripts inline sont autorisés
par leur empreinte SHA-256.** Modifier l'un d'eux, ne serait-ce que d'un
espace, le rend inexécutable en production — thème appliqué après le rendu
(flash de thème clair) et analytics muettes. Après toute retouche d'un
`<script>` inline d'`index.html` ou de `404.html`, recalculer et reporter
les empreintes dans `vercel.json` :

```bash
python3 - <<'EOF'
import re, io, hashlib, base64, json
declarees = json.load(io.open('vercel.json'))['headers'][0]['headers'][0]['value']
for f in ('index.html', '404.html'):
    for corps in re.findall(r'<script>\n(.*?)\n</script>', io.open(f, encoding='utf-8').read(), re.S):
        e = base64.b64encode(hashlib.sha256(('\n'+corps+'\n').encode()).digest()).decode()
        print('%-11s %-14s sha256-%s' % (f, 'OK' if e in declarees else 'À REPORTER', e))
EOF
```

Les ressources versionnées (`style.css`, `script.js`) sont servies `immutable`
sur un an : c'est le jeton `?v=` qui les renouvelle. Les icônes et l'image de
partage, qui n'en portent pas, restent à un jour de cache.

### Contenu — règle de véracité
**Aucun chiffre inventé** : ni étoiles GitHub, ni utilisateurs, ni
téléchargements. Le champ `PREUVE` des fiches n'énonce que des propriétés
techniques vérifiables. Chiffres exacts en vigueur : **41 projets, dont 27
publics et 14 privés**, répartis en **5 domaines** (IA 7 · Automatisation 6 ·
Web 5 · Outils 5 · Minecraft 18).

Ces 41 viennent des **47 dépôts** de `user:Zeffut` (API GitHub, 2026-09-09),
moins les **5 archivés** (Jarvis, auto-stun-slam, screencap, UltraFastPregen,
MinecraftPotato) et `desktop-tutorial`, artefact du tutoriel GitHub Desktop.
**Décisions de Thomas, 2026-09-09** : les dépôts privés sont tous nommés — le
site en montrait déjà cinq, le principe était posé ; les archivés sont exclus.
Le chiffre doit être **recompté à la source** avant d'être modifié, jamais
estimé — cinq endroits l'affichent (méta description, `og`/`twitter`, fiche
signalétique §01, cotations §02, titre et index §03, preuve « Git » §04,
rappel de fin de §03, porte « Open-source » §06).

**L'établissement scolaire n'est jamais nommé** — ni contenu, ni métadonnées,
ni JSON-LD, **ni fichier servi depuis le domaine** (un PDF déposé à la racine
contourne la règle aussi sûrement qu'une ligne de HTML). Le projet
« ESIEE Salles » garde son nom propre, qui est celui du projet.

### Analytics
**PostHog seul.** Rybbit a été retiré : deux traceurs pour la même donnée.
Le script est chargé **en fin de `body`** pour rester hors du chemin critique ;
un `preconnect` en `<head>` ouvre la connexion à `eu-assets.i.posthog.com`
d'avance, ce qui rend la résolution DNS et la poignée TLS gratuites au moment
où le script part.
La super-propriété `app: 'portfolio'` permet de multiplexer plusieurs sites sur
l'unique projet qu'ouvre l'offre gratuite — ne pas la retirer.

Session replay, sondages, dead clicks et capture d'exceptions sont désactivés :
superflus ici et coûteux en quota partagé.

## Vérification

Aucune modification n'est considérée terminée sans contrôle au navigateur.

```bash
python3 -m http.server 8017

npx lighthouse http://localhost:8017/ --view \
  --chrome-flags="--headless=new" \
  --only-categories=performance,accessibility,best-practices,seo
```

**Référence à ne pas régresser** (revérifiée le 2026-09-09) :
Performance **98** · Accessibilité **100** · Bonnes pratiques **100** · SEO **100**.

Si le CDN de PostHog est injoignable (réseau restreint, bloqueur), la requête
échouée compte comme une erreur console et « Bonnes pratiques » tombe à 96.
C'est un artefact de l'environnement, pas une régression : le vérifier en
relançant l'audit sur une copie de la page privée de son bloc analytics.

Points de contrôle : les cinq formats dont **1280×620** (hauteur réduite), les
deux thèmes, les deux langues, la console sans erreur, le parcours clavier
complet, les contrastes ≥ 4.5:1 (texte < 24 px) dans **les deux thèmes**,
**l'aperçu avant impression** (§23 de `style.css`) et **la page `/404`**.

Le serveur de test ci-dessus n'envoie pas les en-têtes de `vercel.json` : la
CSP n'y est donc pas éprouvée. Pour la vérifier avant déploiement, servir le
site avec ces en-têtes et ouvrir la console — un script inline dont
l'empreinte ne correspond plus y apparaît en « Refused to execute ».

### Budgets
`style.css` < 38 000 octets · `script.js` < 16 000 octets ·
`og-image.png` < 150 000 octets. **Seuils en octets** : « Ko » avait deux
lectures possibles (1 000 ou 1 024), et le CSS s'est retrouvé deux fois
juste des deux côtés de la limite selon la lecture retenue.
Le seuil du CSS a d'abord été relevé de 30 à 34 Ko en intégrant les
`@font-face` locaux, qui remplacent une feuille externe de 11,7 Ko : le total
transféré diminue malgré un fichier plus gros. Il passe ensuite à 38 000 octets pour la
feuille d'impression (§23), l'utilitaire `.vh` et le rappel de fin de §03 ;
celui du JS à 16 000 octets pour l'internationalisation des `aria-label` et
le compte rendu de filtre.

Ces seuils portent sur le fichier brut ; c'est le transféré qui compte au
chargement. Mesures en vigueur (2026-09-09, index à 41 projets) :
`style.css` 36 757 o · `script.js` 15 356 o · `index.html` 43 314 o.

## Points en attente

- **Bouton CV** : présent mais commenté dans `index.html`. **Décision de
  Thomas, 2026-09-08 : ne pas publier le CV** — le laisser commenté. Deux
  raisons, toutes deux vérifiées sur le fichier fourni : le CV porte son
  numéro de téléphone personnel, qu'un dépôt public rendrait définitivement
  indexable et aspirable ; et il nomme l'établissement scolaire, ce que la
  règle ci-dessus interdit sur ce domaine. Ne pas rouvrir le sujet sans que
  Thomas le demande, et ne jamais déposer un `cv.pdf` de sa propre initiative.
- **LinkedIn** : aucun lien, aucune URL connue. À ajouter si Thomas la fournit.

## Généré

`docs/superpowers/specs/2026-08-21-portfolio-dossier-technique-design.md` — spécification.
`docs/superpowers/plans/2026-08-21-portfolio-dossier-technique.md` — plan d'implémentation.
