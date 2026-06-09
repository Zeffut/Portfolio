/* ============================================================
   Portfolio — interactions
   ============================================================ */
(function () {
    'use strict';

    /* ---------- PostHog tracking helper ---------- */
    function track(name, props) {
        if (window.posthog && typeof window.posthog.capture === 'function') {
            try { window.posthog.capture(name, props || {}); } catch (e) {}
        }
    }

    /* ---------- i18n ---------- */
    var langFr = document.getElementById('lang-fr');
    var langEn = document.getElementById('lang-en');

    function applyLang(lang) {
        document.documentElement.lang = lang;

        // text content
        document.querySelectorAll('[data-fr]').forEach(function (el) {
            var val = el.getAttribute('data-' + lang);
            if (val !== null) el.textContent = val;
        });

        // tooltips (data-tip-fr / data-tip-en -> data-tip)
        document.querySelectorAll('[data-tip-fr]').forEach(function (el) {
            var val = el.getAttribute('data-tip-' + lang);
            if (val !== null) el.setAttribute('data-tip', val);
        });

        if (langFr && langEn) {
            langFr.classList.toggle('active', lang === 'fr');
            langEn.classList.toggle('active', lang === 'en');
        }

        try { localStorage.setItem('lang', lang); } catch (e) {}
    }

    /* ---------- Tooltips de tous les skills ---------- */
    var SKILL_TIPS = {
        "Python":          ["Scripting, scraping, bots, IA — mon langage principal", "Scripting, scraping, bots, AI — my main language"],
        "JavaScript":      ["Interactivité web et logique front-end", "Web interactivity and front-end logic"],
        "TypeScript":      ["JavaScript typé — packages npm, nodes n8n", "Typed JavaScript — npm packages, n8n nodes"],
        "Java":            ["Plugins Minecraft et projets académiques", "Minecraft plugins and academic projects"],
        "Swift":           ["App macOS BetterFasterWhisper", "macOS app BetterFasterWhisper"],
        "C":               ["Programmation bas niveau et algorithmes", "Low-level programming and algorithms"],
        "SQL":             ["Requêtes et modélisation de bases de données", "Database queries and modeling"],
        "Bash":            ["Scripts shell et automatisation système", "Shell scripting and system automation"],
        "HTML5":           ["Structure et sémantique des pages web", "Web page structure and semantics"],
        "CSS3":            ["Design responsive, animations et layouts", "Responsive design, animations and layouts"],
        "Responsive design": ["Interfaces adaptées à tous les écrans", "Interfaces for every screen size"],
        "APIs REST":       ["Conception et consommation d'APIs REST", "Designing and consuming REST APIs"],
        "JSON":            ["Échange et stockage de données structurées", "Structured data exchange and storage"],
        "Flask":           ["APIs REST et backends web en Python", "REST APIs and Python web backends"],
        "Selenium":        ["Automatisation web et scraping", "Web automation and scraping"],
        "BeautifulSoup":   ["Parsing HTML et scraping de données", "HTML parsing and data scraping"],
        "Pandas":          ["Manipulation et analyse de données", "Data manipulation and analysis"],
        "SQLite":          ["Base de données légère embarquée", "Lightweight embedded database"],
        "Bots Telegram":   ["Bots et alertes via l'API Telegram", "Bots and alerts via the Telegram API"],
        "WhisperKit":      ["Transcription vocale locale (Apple)", "Local voice transcription (Apple)"],
        "CoreML":          ["Modèles ML on-device sur Apple", "On-device ML on Apple platforms"],
        "OpenCV":          ["Vision par ordinateur (ChessBot)", "Computer vision (ChessBot)"],
        "Ollama":          ["Exécution de modèles IA en local", "Running AI models locally"],
        "OCR / Tesseract": ["Reconnaissance de texte sur images", "Text recognition from images"],
        "n8n":             ["Automatisation de workflows et intégrations", "Workflow automation and integrations"],
        "FFmpeg":          ["Traitement audio et vidéo", "Audio and video processing"],
        "Docker":          ["Conteneurisation et déploiement d'apps", "App containerization and deployment"],
        "Git":             ["Versioning et collaboration sur le code", "Code versioning and collaboration"],
        "GitHub":          ["Hébergement de code et open-source", "Code hosting and open-source"],
        "Linux":           ["Administration et déploiement serveur", "Server administration and deployment"],
        "VS Code":         ["Mon éditeur de code principal", "My main code editor"],
        "Claude Code":     ["Développement assisté par IA", "AI-assisted development"],
        "Figma":           ["Design et prototypage d'interfaces", "Interface design and prototyping"],
        "Notion":          ["Organisation, docs et gestion de projets", "Organization, docs and project management"]
    };
    document.querySelectorAll('.chip').forEach(function (chip) {
        var tip = SKILL_TIPS[chip.textContent.trim()];
        if (tip) {
            chip.setAttribute('data-tip-fr', tip[0]);
            chip.setAttribute('data-tip-en', tip[1]);
        }
    });

    var stored = 'fr';
    try { stored = localStorage.getItem('lang') || 'fr'; } catch (e) {}

    if (langFr) langFr.addEventListener('click', function () { applyLang('fr'); track('language_switch', { lang: 'fr' }); });
    if (langEn) langEn.addEventListener('click', function () { applyLang('en'); track('language_switch', { lang: 'en' }); });

    applyLang(stored);

    /* ---------- Nav shadow on scroll ---------- */
    var nav = document.getElementById('nav');
    if (nav) {
        var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 12); };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- Scroll reveal ---------- */
    var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window && revealEls.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- Navigation par section (smooth) ---------- */
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var root = document.documentElement;
    var animating = false;

    // Native smooth scroll fights CSS scroll-snap in some browsers (it snaps back),
    // so we animate the scroll ourselves and disable snap while the animation runs.
    function smoothScrollTo(toY) {
        var startY = window.scrollY;
        var dist = toY - startY;
        if (Math.abs(dist) < 2) return;
        var dur = Math.min(1000, Math.max(450, Math.abs(dist) * 0.5));
        var t0 = null;
        animating = true;
        root.style.scrollSnapType = 'none';

        function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }

        function step(ts) {
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            window.scrollTo({ top: startY + dist * ease(p), behavior: 'instant' });
            if (p < 1) {
                requestAnimationFrame(step);
            } else {
                root.style.scrollSnapType = '';
                animating = false;
            }
        }
        requestAnimationFrame(step);
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href');
            var target = (id === '#' || id === '#top') ? document.body : document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            track('nav_click', { target: id });
            var toY = (id === '#' || id === '#top') ? 0 : target.getBoundingClientRect().top + window.scrollY;
            if (prefersReduced) { window.scrollTo({ top: toY, behavior: 'instant' }); }
            else { smoothScrollTo(toY); }
        });
    });

    /* ---------- Scrollspy : lien de nav actif selon la section ---------- */
    var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    var spyTargets = navAnchors
        .map(function (a) { return document.querySelector(a.getAttribute('href')); })
        .filter(Boolean);

    if ('IntersectionObserver' in window && spyTargets.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = '#' + entry.target.id;
                    navAnchors.forEach(function (a) {
                        a.classList.toggle('active', a.getAttribute('href') === id);
                    });
                    track('section_view', { section: entry.target.id });
                }
            });
        }, { threshold: 0.5 });
        spyTargets.forEach(function (t) { spy.observe(t); });
    }

    /* ---------- Project filters (cross-fade smooth) ---------- */
    var filters = document.querySelectorAll('.filter');
    var bento = document.getElementById('bento');
    var cards = document.querySelectorAll('#bento .proj');

    function applyFilter(f) {
        cards.forEach(function (card) {
            var show = (f === 'all' || card.getAttribute('data-cat') === f);
            card.classList.toggle('hide', !show);
        });
    }

    if (filters.length && cards.length && bento) {
        filters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (btn.classList.contains('active')) return;
                filters.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var f = btn.getAttribute('data-filter');
                track('project_filter', { filter: f });

                if (prefersReduced) { applyFilter(f); return; }

                // fade out → re-layout → fade in
                bento.classList.add('filtering');
                setTimeout(function () {
                    applyFilter(f);
                    requestAnimationFrame(function () { bento.classList.remove('filtering'); });
                }, 220);
            });
        });
    }

    /* ---------- Clics projets ---------- */
    document.querySelectorAll('#bento .proj').forEach(function (card) {
        card.addEventListener('click', function () {
            var titleEl = card.querySelector('h3');
            track('project_click', {
                project: titleEl ? titleEl.textContent.trim() : null,
                category: card.getAttribute('data-cat'),
                is_private: card.tagName.toLowerCase() !== 'a',
                href: card.getAttribute('href') || null
            });
        });
    });

    /* ---------- CTA & liens sortants ---------- */
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.addEventListener('click', function () { track('contact_click', { method: 'email' }); });
    });
    document.querySelectorAll('a[href*="github.com"]').forEach(function (a) {
        a.addEventListener('click', function () { track('outbound_click', { destination: 'github', url: a.getAttribute('href') }); });
    });

    /* ---------- Survols de skills (1x par skill / session de page) ---------- */
    var hoveredSkills = {};
    document.querySelectorAll('.chip').forEach(function (chip) {
        chip.addEventListener('mouseenter', function () {
            var name = chip.textContent.trim();
            if (hoveredSkills[name]) return;
            hoveredSkills[name] = true;
            track('skill_hover', { skill: name });
        });
    });
})();
