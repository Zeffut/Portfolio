# CLAUDE.md

Guide pour Claude Code sur ce dépôt.

## Vue d'ensemble

Portfolio de Thomas De Sousa, **inspiré de neal.fun** : une page, une grille de
cartes colorées, une carte par projet **public** (description, techno, URL
GitHub). HTML/CSS/JS vanilla, **aucune dépendance, aucun build**.

Production : **https://zeffut.fr** (Vercel). **Tout push sur `main` déploie en production.**

Objectif : le visiteur finit sur `github.com/Zeffut`. Les cartes sont des liens
directs ; l'événement PostHog `outbound_click` porte `destination: 'github'`.

## Fichiers

- `index.html` : page unique, 27 cartes statiques (lisible sans JS).
- `style.css` : thèmes clair/sombre (`prefers-color-scheme`), grille, cartes.
- `script.js` : recherche, filtres par domaine, événement `outbound_click`.
- `404.html` · `vercel.json` (CSP, en-têtes, caches).

## Ajouter un projet

Dupliquer un `<a class="card">` dans `index.html` : `data-cat` (`ia`, `auto`,
`web`, `outils`, `mc`), `data-c` (`c1`–`c12`), emoji, nom, description, techno,
URL. Mettre à jour le compteur (méta description, `og:description`, sous-titre)
et le jeton `?v=AAAA-MM-JJ`, identique pour `style.css` et `script.js`.

## Règles

- **Seuls les dépôts publics** figurent sur le site.
- **Aucun chiffre inventé** (étoiles, utilisateurs…). Descriptions factuelles.
- **L'établissement scolaire n'est jamais nommé** (contenu, métadonnées, fichiers
  servis). « ESIEE Salles » reste le nom du projet.
- **Pas de CV ni de numéro de téléphone** publiés.
- **CSP sans `'unsafe-inline'`** : le seul script inline (snippet PostHog) est
  autorisé par empreinte SHA-256 dans `vercel.json`; le modifier impose de la recalculer.
- Pas de style inline (`style-src 'self'`) : passer par des classes.
- Analytics : PostHog seul, super-propriété `app: 'portfolio'` à conserver.

## Vérification

`python3 -m http.server 8017`, puis contrôle au navigateur : console sans
erreur, thèmes clair et sombre, mobile et bureau, recherche, filtres, `/404`.
