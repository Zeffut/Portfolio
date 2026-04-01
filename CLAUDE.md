# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio personnel de Thomas De Sousa — site statique (HTML/CSS/JS vanilla), sans framework ni build system.

## Architecture

- `index.html` — page principale (présentation, à propos, skills, projets)
- `services.html` — page listant les services self-hosted (N8N, Ollama, Rybbit, etc.)
- `style.css` — feuille de style unique, partagée entre les deux pages
- `script.js` — logique de switch FR/EN via attributs `data-lang`
- `ressources/` — images, icônes SVG, logos des skills

## Development

Pas de build, pas de dépendances. Ouvrir `index.html` dans un navigateur ou servir avec :

```
python3 -m http.server
```

L'iframe Spline (globe 3D) nécessite une connexion internet.

## Key Patterns

- **Internationalisation** : chaque élément traduit porte `data-lang="fr"` ou `data-lang="en"`. Les éléments EN ont `style="display: none;"` par défaut. `switchLanguage()` dans `script.js` toggle la visibilité.
- **Skills slider** : animation CSS infinie (`slideshow` keyframes). Les items sont dupliqués dans le HTML pour créer l'effet de boucle.
- **Design** : fond noir, police Poppins, gradient signature `#9C83FF → #FF9051` pour les accents.
- **Analytics** : script Rybbit (`tracking.zeffut.fr`) inclus sur `index.html` uniquement.
- **Responsive** : media queries `max-width: 768px` pour mobile, principalement dans la section projets et services.
