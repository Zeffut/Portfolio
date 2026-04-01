# Portfolio Redesign — Glassmorphism Dark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the existing portfolio into a cohesive glassmorphism dark design with animated background, scroll animations, and improved layout — staying vanilla HTML/CSS/JS.

**Architecture:** 4 files impacted: `style.css` gets new glassmorphism utilities, blob animations, grid layouts, and scroll animation classes. `index.html` is restructured (hero, skills grid, projects grid). `services.html` gets unified glassmorphism cards. `script.js` gains an IntersectionObserver for scroll animations.

**Tech Stack:** HTML5, CSS3 (backdrop-filter, CSS Grid, keyframe animations), Vanilla JS (IntersectionObserver API)

---

### Task 1: CSS Foundation — Glassmorphism utilities, blob background, scroll animation classes

**Files:**
- Modify: `style.css` (full file — add new utility classes, remove old slider/sphere styles)

- [ ] **Step 1: Add glassmorphism utility styles and blob background at the top of style.css (after the existing `*` and `body` rules)**

Replace the existing `body` and `.noise` rules, and add new foundational styles:

```css
body {
    background-color: #0a0a0a;
    margin: 0;
    align-items: center;
    min-width: 320px;
    max-width: 100vw;
    overflow-x: hidden;
    z-index: 1;
    position: relative;
}

/* Animated blob background */
.blob-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
}

.blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;
}

.blob-1 {
    width: 400px;
    height: 400px;
    background: #9C83FF;
    top: -100px;
    left: -100px;
    animation: blob-move-1 15s ease-in-out infinite alternate;
}

.blob-2 {
    width: 350px;
    height: 350px;
    background: #FF9051;
    bottom: -50px;
    right: -50px;
    animation: blob-move-2 18s ease-in-out infinite alternate;
}

.blob-3 {
    width: 300px;
    height: 300px;
    background: #9C83FF;
    top: 50%;
    left: 50%;
    animation: blob-move-3 20s ease-in-out infinite alternate;
}

@keyframes blob-move-1 {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(200px, 150px) scale(1.2); }
}

@keyframes blob-move-2 {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(-150px, -200px) scale(1.3); }
}

@keyframes blob-move-3 {
    from { transform: translate(-50%, -50%) scale(1); }
    to { transform: translate(-30%, -70%) scale(0.8); }
}

/* Glassmorphism card */
.glass-card {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
}

/* Scroll animations */
.fade-in-section {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-section.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Staggered children animation */
.stagger-children .fade-in-child {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.stagger-children.visible .fade-in-child {
    opacity: 1;
    transform: translateY(0);
}

/* Smooth scroll */
html {
    scroll-behavior: smooth;
}
```

- [ ] **Step 2: Remove old .noise, .sphere, .bitmoji, slider styles from style.css**

Delete these blocks entirely:
- `.noise` rule (lines ~18-26)
- `.sphere` rule (lines ~87-94)
- `.bitmoji` rule (lines ~96-100)
- `.skills-slider`, `.skills-slider::before`, `.skills-slider::after`, `.skills-slider-track`, `@keyframes slideshow`, `.skill`, `.skill img`, `.skill p` rules (lines ~445-505)

- [ ] **Step 3: Verify by opening index.html in browser**

Open `index.html` in a browser. The page will look broken (expected — HTML changes come in later tasks). Verify:
- No CSS errors in console
- The old slider/sphere styles are gone

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "feat: add glassmorphism utilities, blob background, scroll animation classes; remove old slider/sphere styles"
```

---

### Task 2: Animated gradient text and updated typography

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Replace the h1.name and h2.subtitle rules with animated gradient text**

Replace the existing `h1.name` rule:

```css
h1.name {
    font-size: 65px;
    margin-bottom: 0px;
    background: linear-gradient(270deg, #9C83FF, #FF9051, #9C83FF);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 4s ease-in-out infinite;
}

@keyframes gradient-shift {
    0% { background-position: 0% center; }
    50% { background-position: 100% center; }
    100% { background-position: 0% center; }
}
```

- [ ] **Step 2: Update general typography sizing**

Replace the existing `h1.about`, `h1.experience`, `h1.project` rules to use 50px:

```css
h1.about, h1.experience, h1.project {
    color: white;
    font-size: 50px;
    margin: 0px;
    margin-top: 75px;
}
```

Update paragraph base size — replace the existing `p` rule:

```css
p {
    font-size: 16px;
    color: rgb(0, 0, 0);
    background-color: rgba(255, 255, 255, 0);
}
```

- [ ] **Step 3: Add hero entrance animation**

```css
/* Hero entrance */
.top-page {
    animation: hero-entrance 0.8s ease-out;
}

@keyframes hero-entrance {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

- [ ] **Step 4: Update CTA button to glassmorphism style**

Replace the existing `div.contact_button_2` and hover rules:

```css
div.contact_button_2 {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 30px;
    justify-content: center;
    color: white;
    text-decoration: none;
    height: 55px;
    width: 187px;
    text-align: center;
    display: flex;
    align-items: center;
    transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}

div.contact_button_2:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}
```

- [ ] **Step 5: Commit**

```bash
git add style.css
git commit -m "feat: animated gradient title, updated typography, glassmorphism CTA button, hero entrance animation"
```

---

### Task 3: Restructure index.html — Hero section

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add blob container right after `<body>` opening tag**

Add this immediately after `<body>`:

```html
<div class="blob-container">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
</div>
```

- [ ] **Step 2: Remove the iframe Spline**

Delete this line:
```html
<iframe src="https://my.spline.design/worldplanet-EIqzJpBAVlkmbGBPEyTG6tHM/" frameborder="0" width="100%" height="500px" class="noise"></iframe>
```

- [ ] **Step 3: Replace the hero section content (remove bitmoji, update text)**

Replace the entire `<section class="top-page">` content with:

```html
<section class="top-page">
    <div class="presentation">
        <div class="text">
            <h1 class="name" data-lang="fr">Thomas De Sousa</h1>
            <h1 class="name" data-lang="en" style="display: none;">Thomas De Sousa</h1>
            <h2 class="subtitle" data-lang="fr">Développeur Full-Stack & Passionné d'<span class="gradient_text">Infrastructure</span></h2>
            <h2 class="subtitle" data-lang="en" style="display: none;">Full-Stack Developer & <span class="gradient_text">Infrastructure</span> Enthusiast</h2>
            <p class="intro" data-lang="fr">Je construis des outils concrets et je gère ma propre infrastructure, le tout self-hosted.</p>
            <p class="intro" data-lang="en" style="display: none;">I build practical tools and manage my own infrastructure, all self-hosted.</p>
        </div>
        <div class="buttons-row">
            <a href="mailto:tom77ds@gmail.com">
                <div class="contact_button_2" data-lang="fr">
                    Me Contacter
                </div>
                <div class="contact_button_2" data-lang="en" style="display: none;">
                    Contact Me
                </div>
            </a>
        </div>
    </div>
</section>
```

- [ ] **Step 4: Verify in browser**

Open `index.html` — the hero should show:
- Animated blob background
- Gradient-animated name
- New subtitle with gradient accent
- Glassmorphism CTA button
- Fade-in entrance animation

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: restructure hero — remove Spline iframe and bitmoji, add blob background, update text"
```

---

### Task 4: Restructure index.html — About section

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the about section**

Replace the entire `<section class="about">` with:

```html
<section class="about fade-in-section">
    <h1 class="about" data-lang="fr">À PROPOS DE MOI</h1>
    <h1 class="about" data-lang="en" style="display: none;">ABOUT ME</h1>
    <span class="gradient_text" data-lang="fr">MON PARCOURS</span>
    <span class="gradient_text" data-lang="en" style="display: none;">MY JOURNEY</span>
    <div class="glass-card about-card">
        <p class="about" data-lang="fr">Étudiant en école d'ingénieur et développeur autodidacte, je construis des outils concrets — du scraping d'offres d'emploi à la transcription vocale locale. Je gère aussi ma propre infrastructure : déploiement, monitoring, automatisation, le tout self-hosted.</p>
        <p class="about" data-lang="en" style="display: none;">Engineering student and self-taught developer, I build practical tools — from job scraping to local voice transcription. I also manage my own infrastructure: deployment, monitoring, automation, all self-hosted.</p>
    </div>
</section>
```

- [ ] **Step 2: Add about-card style to style.css**

Add after the existing `p.about` rule:

```css
.about-card {
    padding: 30px 40px;
    margin-top: 30px;
    max-width: 600px;
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html style.css
git commit -m "feat: about section — glassmorphism card, updated text, scroll animation class"
```

---

### Task 5: Restructure index.html — Skills grid

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: Replace the experience section in index.html**

Replace the entire `<section class="experience">` with:

```html
<section class="experience fade-in-section">
    <h1 class="experience" data-lang="fr">EXPERIENCE</h1>
    <h1 class="experience" data-lang="en" style="display: none;">EXPERIENCE</h1>
    <span class="gradient_text" data-lang="fr">CE QUE J'UTILISE</span>
    <span class="gradient_text" data-lang="en" style="display: none;">MY TOOLKIT</span>
    <div class="skills-grid stagger-children">
        <div class="skill-card glass-card fade-in-child">
            <img src="ressources/skills/html.webp" alt="HTML5">
            <p>HTML5</p>
        </div>
        <div class="skill-card glass-card fade-in-child">
            <img src="ressources/skills/css.png" alt="CSS3">
            <p>CSS3</p>
        </div>
        <div class="skill-card glass-card fade-in-child">
            <img src="ressources/skills/javascript.png" alt="JavaScript">
            <p>JavaScript</p>
        </div>
        <div class="skill-card glass-card fade-in-child">
            <img src="ressources/skills/python.png" alt="Python">
            <p>Python</p>
        </div>
        <div class="skill-card glass-card fade-in-child">
            <img src="ressources/skills/git.png" alt="Git">
            <p>Git</p>
        </div>
        <div class="skill-card glass-card fade-in-child">
            <img src="ressources/skills/docker.webp" alt="Docker">
            <p>Docker</p>
        </div>
        <div class="skill-card glass-card fade-in-child">
            <img src="ressources/skills/notion.png" alt="Notion">
            <p>Notion</p>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Add skills grid styles to style.css**

Add after the experience section styles:

```css
/* Skills Grid */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    max-width: 600px;
    margin-top: 40px;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
}

.skill-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 10px;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.skill-card:hover {
    box-shadow: 0 0 20px rgba(156, 131, 255, 0.3), 0 0 40px rgba(255, 144, 81, 0.15);
    transform: translateY(-4px);
}

.skill-card img {
    width: 45px;
    height: 45px;
    margin-bottom: 10px;
}

.skill-card p {
    color: white;
    margin: 0;
    font-size: 14px;
}

@media (max-width: 768px) {
    .skills-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

- [ ] **Step 3: Remove old p.experience rule from style.css**

Delete:
```css
p.experience {
    margin-left: 15px;
    max-width: 600px;
    color: white;
    font-size: large;
    margin-top: 50px;
    text-align: center;
}
```

- [ ] **Step 4: Add stagger delays to CSS**

```css
.stagger-children.visible .fade-in-child:nth-child(1) { transition-delay: 0s; }
.stagger-children.visible .fade-in-child:nth-child(2) { transition-delay: 0.1s; }
.stagger-children.visible .fade-in-child:nth-child(3) { transition-delay: 0.2s; }
.stagger-children.visible .fade-in-child:nth-child(4) { transition-delay: 0.3s; }
.stagger-children.visible .fade-in-child:nth-child(5) { transition-delay: 0.4s; }
.stagger-children.visible .fade-in-child:nth-child(6) { transition-delay: 0.5s; }
.stagger-children.visible .fade-in-child:nth-child(7) { transition-delay: 0.6s; }
```

- [ ] **Step 5: Verify in browser**

Skills should appear as a 4-column grid of glassmorphism cards. On resize to mobile, they should become 2 columns.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css
git commit -m "feat: skills section — replace slider with glassmorphism grid, staggered scroll animation"
```

---

### Task 6: Restructure index.html — Projects grid

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: Replace the project section in index.html**

Replace the entire `<section class="project">` with:

```html
<section class="project fade-in-section">
    <h1 class="project" data-lang="fr">PROJETS</h1>
    <h1 class="project" data-lang="en" style="display: none;">PROJECTS</h1>
    <span class="gradient_text" data-lang="fr">DÉMONSTRATION</span>
    <span class="gradient_text" data-lang="en" style="display: none;">DEMONSTRATION</span>
    <div class="projects-grid stagger-children">
        <a href="https://github.com/Zeffut/Esiee-Paris-Salles" class="project-card glass-card fade-in-child" target="_blank">
            <div class="project-img-wrapper">
                <img src="ressources/esiee_salles.png" alt="Esiee-Paris-Salles">
            </div>
            <div class="project-info">
                <p class="card_title" data-lang="fr">Esiee-Paris-Salles</p>
                <p class="card_title" data-lang="en" style="display: none;">Esiee-Paris-Salles</p>
                <p class="card_desc" data-lang="fr">Une webapp permettant aux étudiants de trouver des salles libres dans l'école ESIEE PARIS.</p>
                <p class="card_desc" data-lang="en" style="display: none;">A webapp allowing students to find free rooms in the ESIEE PARIS school.</p>
            </div>
        </a>
        <a href="https://github.com/Zeffut/BetterFasterWhisper" class="project-card glass-card fade-in-child" target="_blank">
            <div class="project-img-wrapper">
                <img src="ressources/superwhisper_logo.jpg" alt="BetterFasterWhisper">
            </div>
            <div class="project-info">
                <p class="card_title" data-lang="fr">BetterFasterWhisper</p>
                <p class="card_title" data-lang="en" style="display: none;">BetterFasterWhisper</p>
                <p class="card_desc" data-lang="fr">Une application macOS gratuite et open-source de transcription vocale. Alternative à SuperWhisper, elle fonctionne entièrement en local grâce à WhisperKit et CoreML, sans abonnement ni collecte de données.</p>
                <p class="card_desc" data-lang="en" style="display: none;">A free, open-source macOS voice-to-text transcription app. An alternative to SuperWhisper, it runs entirely locally using WhisperKit and CoreML, with no subscriptions or data collection.</p>
            </div>
        </a>
        <a href="https://github.com/Zeffut/JobScraper" class="project-card glass-card fade-in-child" target="_blank">
            <div class="project-img-wrapper">
                <img src="ressources/linkedin_ico.png" alt="JobScraper">
            </div>
            <div class="project-info">
                <p class="card_title" data-lang="fr">JobScraper</p>
                <p class="card_title" data-lang="en" style="display: none;">JobScraper</p>
                <p class="card_desc" data-lang="fr">Un outil d'agrégation d'offres d'emploi qui recherche simultanément sur LinkedIn, HelloWork, France Travail, Welcome to the Jungle et Adzuna. Filtrage par localisation, type de contrat et export en JSON/CSV.</p>
                <p class="card_desc" data-lang="en" style="display: none;">A job aggregation tool that searches LinkedIn, HelloWork, France Travail, Welcome to the Jungle and Adzuna simultaneously. Filter by location, contract type and export to JSON/CSV.</p>
            </div>
        </a>
    </div>
    <a href="https://github.com/Zeffut" class="github-cta" target="_blank">
        <div class="contact_button_2" data-lang="fr">
            <img src="ressources/github.svg" alt="" class="github-cta-icon"> Mon GitHub
        </div>
        <div class="contact_button_2" data-lang="en" style="display: none;">
            <img src="ressources/github.svg" alt="" class="github-cta-icon"> My GitHub
        </div>
    </a>
</section>
```

- [ ] **Step 2: Add project grid and card styles to style.css**

Replace the old project card styles (`section.card`, `a.project-item`, `div.card`, `img.logos`, `div.description`, `a.card`, `p.card`, `p.card_title`, and their mobile media query overrides) with:

```css
/* Projects Grid */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    max-width: 750px;
    margin-top: 40px;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
}

.project-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    text-decoration: none;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.project-card:hover {
    transform: scale(1.02);
    box-shadow: 0 0 25px rgba(156, 131, 255, 0.2), 0 0 50px rgba(255, 144, 81, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
}

.project-img-wrapper {
    width: 100%;
    height: 140px;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px 16px 0 0;
}

.project-img-wrapper img {
    width: 70px;
    height: 70px;
    object-fit: contain;
    border-radius: 8px;
}

.project-info {
    padding: 20px;
}

.project-info .card_title {
    font-size: 20px;
    color: white;
    margin: 0 0 8px 0;
    font-weight: 600;
}

.project-info .card_desc {
    font-size: 14px;
    color: #aaaaaa;
    margin: 0;
    line-height: 1.5;
}

/* GitHub CTA */
.github-cta {
    text-decoration: none;
    margin-top: 40px;
}

.github-cta .contact_button_2 {
    gap: 10px;
}

.github-cta-icon {
    width: 20px;
    height: 20px;
    filter: invert(1);
}

@media (max-width: 768px) {
    .projects-grid {
        grid-template-columns: 1fr;
    }

    h1.project {
        font-size: 32px;
        margin-top: 40px;
    }
}
```

- [ ] **Step 3: Remove old project mobile media query styles**

Delete the old `@media (max-width: 768px)` block that targeted `section.project`, `section.card`, `a.project-item`, `div.card`, `img.logos`, `div.description`, `p.card_title`, `p.card` (lines ~323-401 in the original CSS).

- [ ] **Step 4: Verify in browser**

Projects should appear as a 2-column grid with glassmorphism cards. Each card has an image area on top and text below. "Mon GitHub" should be a button below the grid. On mobile, single column.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "feat: projects section — 2-column glassmorphism grid, GitHub CTA button"
```

---

### Task 7: Credits footer glassmorphism

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Update credits styles**

Replace the existing `section.credits` rule:

```css
section.credits {
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 25px auto;
    text-align: center;
    font-size: 12px;
    padding: 12px 24px;
    max-width: fit-content;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
}
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "feat: glassmorphism credits footer"
```

---

### Task 8: IntersectionObserver scroll animations in script.js

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add the IntersectionObserver after the existing language switch code**

Append to the end of `script.js`:

```javascript
// Scroll animations
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

document.querySelectorAll('.fade-in-section, .stagger-children').forEach((el) => {
    observer.observe(el);
});
```

- [ ] **Step 2: Verify in browser**

Scroll down the page. Each section should fade in and slide up as it enters the viewport. Skills and projects should appear with a staggered delay.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: add IntersectionObserver for scroll animations"
```

---

### Task 9: Update services.html — unified glassmorphism

**Files:**
- Modify: `services.html`

- [ ] **Step 1: Add blob container after `<body>` tag**

Add immediately after `<body>`:

```html
<div class="blob-container">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
</div>
```

- [ ] **Step 2: Add glass-card class to each service-item link**

Change each `<a ... class="service-item">` to `<a ... class="service-item glass-card">`.

There are 8 service items (N8N, ChatGptLike, Dockploy, Panel Beszel, API, Salles ESIEE, Ollama API, Rybbit).

- [ ] **Step 3: Update service-item CSS to work with glass-card**

Replace the existing `a.service-item` and hover rules in style.css:

```css
a.service-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    text-decoration: none;
}

a.service-item:hover {
    transform: translateX(10px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(156, 131, 255, 0.15);
}
```

- [ ] **Step 4: Update services h1 to match new sizing**

Add `h1.services` to the combined title rule created in Task 2:

```css
h1.about, h1.experience, h1.project, h1.services {
    color: white;
    font-size: 50px;
    margin: 0px;
    margin-top: 75px;
}
```

And delete the standalone `h1.services` rule.

- [ ] **Step 5: Verify services.html in browser**

The services page should have the blob background and glassmorphism cards with hover glow.

- [ ] **Step 6: Commit**

```bash
git add services.html style.css
git commit -m "feat: services page — unified glassmorphism cards, blob background"
```

---

### Task 10: Final cleanup and visual QA

**Files:**
- Modify: `style.css` (cleanup)
- Modify: `index.html` (cleanup)

- [ ] **Step 1: Remove any remaining unused CSS rules**

Check for and remove:
- `div.contact_button` (the old white contact button, not used anymore)
- `h3.logo`, `h6.logo` (unused)
- `a.mail` (unused)
- `a.card` (replaced by project-card)
- `@keyframes pulse` (unused, was commented out)

- [ ] **Step 2: Test mobile responsive at 375px width**

Resize browser to 375px width and verify:
- Hero text doesn't overflow
- Skills grid is 2 columns
- Projects grid is 1 column
- Services cards stack properly
- CTA buttons are centered
- Blobs don't cause horizontal scroll (overflow: hidden on blob-container)

- [ ] **Step 3: Test language switch**

Click the flag switcher on both pages. Verify all FR/EN elements toggle correctly — no orphaned elements, no broken layout.

- [ ] **Step 4: Commit**

```bash
git add style.css index.html
git commit -m "chore: remove unused CSS rules, final cleanup"
```
