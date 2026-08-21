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

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure et contenu. Le **français est le texte servi** ; l'anglais vit dans les attributs `data-en`. |
| `style.css` | `@font-face` locaux, jetons, thèmes, grille, composants, réactivité. |
| `script.js` | IIFE unique : thème, langue, menu, sommaire, filtres, analytics. |
| `fonts/` | 8 fichiers woff2 servis localement. |
| `og-image.png` | Image de partage 1200×630, **générée au navigateur**. |
| `favicon.svg` · `favicon.ico` · `apple-touch-icon.png` | Jeu d'icônes. |
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

### Contenu — règle de véracité
**Aucun chiffre inventé** : ni étoiles GitHub, ni utilisateurs, ni
téléchargements. Le champ `PREUVE` des fiches n'énonce que des propriétés
techniques vérifiables. Chiffres exacts en vigueur : **15 projets, dont 10
open-source et 5 privés**.

**L'établissement scolaire n'est jamais nommé** — ni contenu, ni métadonnées,
ni JSON-LD. Le projet « ESIEE Salles » garde son nom propre, qui est celui du
projet.

### Analytics
**PostHog seul.** Rybbit a été retiré : deux traceurs pour la même donnée.
Le script est chargé **en fin de `body`** pour rester hors du chemin critique.
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

**Référence à ne pas régresser** (2026-08-21) :
Performance **98** · Accessibilité **100** · Bonnes pratiques **100** · SEO **100**.

Points de contrôle : les cinq formats dont **1280×620** (hauteur réduite), les
deux thèmes, les deux langues, la console sans erreur, le parcours clavier
complet, et les contrastes ≥ 4.5:1 (texte < 24 px) dans **les deux thèmes**.

### Budgets
`style.css` < 34 Ko · `script.js` < 15 Ko · `og-image.png` < 150 Ko.
Le seuil du CSS a été relevé de 30 à 34 Ko en intégrant les `@font-face`
locaux, qui remplacent une feuille externe de 11,7 Ko : le total transféré
diminue malgré un fichier plus gros.

## Points en attente

- **Niveaux de compétence** (§04) : inférés du contenu, à valider par Thomas.
- **Bouton CV** : présent mais commenté dans `index.html`. Déposer `cv.pdf` à
  la racine et décommenter.
- **LinkedIn** : aucun lien, aucune URL connue. À ajouter si Thomas la fournit.

## Généré

`docs/superpowers/specs/2026-08-21-portfolio-dossier-technique-design.md` — spécification.
`docs/superpowers/plans/2026-08-21-portfolio-dossier-technique.md` — plan d'implémentation.
