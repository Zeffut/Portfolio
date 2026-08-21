/* ==========================================================================
   Thomas De Sousa — Portfolio « dossier technique »
   Un IIFE, des modules internes, aucun état partagé hors DOM/localStorage.
   ========================================================================== */
(function () {
    'use strict';

    var root = document.documentElement;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------------------
       Analytics — tolérant à l'absence de PostHog (bloqueur, hors-ligne)
       --------------------------------------------------------------------- */
    function track(name, props) {
        if (window.posthog && typeof window.posthog.capture === 'function') {
            try { window.posthog.capture(name, props || {}); } catch (e) {}
        }
    }

    /* ---------------------------------------------------------------------
       Thème — clair par défaut, sombre disponible, choix persisté
       --------------------------------------------------------------------- */
    var THEME_KEY = 'tds-theme';
    var themeBtn = document.getElementById('theme-btn');

    function currentTheme() {
        var set = root.getAttribute('data-theme');
        if (set) return set;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (themeBtn) {
            var dark = theme === 'dark';
            themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
            themeBtn.setAttribute('aria-label',
                dark ? 'Basculer en thème clair' : 'Basculer en thème sombre');
        }
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    }

    applyTheme(currentTheme());

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var next = currentTheme() === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            track('theme_switch', { theme: next });
        });
    }

    /* ---------------------------------------------------------------------
       Langue — le français est le contenu servi (indispensable au SEO),
       mémorisé au démarrage ; seul l'anglais vit dans un attribut.
       --------------------------------------------------------------------- */
    var LANG_KEY = 'tds-lang';
    var i18nNodes = [];

    Array.prototype.forEach.call(document.querySelectorAll('[data-en]'), function (el) {
        var isMeta = el.tagName === 'META';
        i18nNodes.push({
            el: el,
            meta: isMeta,
            fr: isMeta ? el.getAttribute('content') : el.innerHTML,
            en: el.getAttribute('data-en')
        });
    });

    var titleFr = document.title;
    var titleEn = root.getAttribute('data-i18n-title') || titleFr;

    function applyLang(lang) {
        var en = lang === 'en';
        root.lang = lang;
        document.title = en ? titleEn : titleFr;

        i18nNodes.forEach(function (n) {
            var val = en ? n.en : n.fr;
            if (n.meta) { n.el.setAttribute('content', val); }
            else { n.el.innerHTML = val; }
        });

        Array.prototype.forEach.call(document.querySelectorAll('.lang-btn'), function (b) {
            b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
        });

        try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    }

    Array.prototype.forEach.call(document.querySelectorAll('.lang-btn'), function (btn) {
        btn.addEventListener('click', function () {
            var lang = btn.getAttribute('data-lang');
            applyLang(lang);
            track('language_switch', { lang: lang });
        });
    });

    var storedLang = 'fr';
    try { storedLang = localStorage.getItem(LANG_KEY) || 'fr'; } catch (e) {}
    if (storedLang === 'en') applyLang('en');

    /* ---------------------------------------------------------------------
       Menu mobile — clavier et lecteurs d'écran compris
       --------------------------------------------------------------------- */
    var menuBtn = document.getElementById('menu-btn');
    var nav = document.getElementById('nav-main');

    function setMenu(open) {
        if (!nav || !menuBtn) return;
        nav.classList.toggle('is-open', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    }

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            setMenu(nav.classList.contains('is-open') === false);
        });

        // Un choix dans le menu le referme
        Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
            a.addEventListener('click', function () { setMenu(false); });
        });

        // Échap ferme et rend le focus au déclencheur
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                setMenu(false);
                menuBtn.focus();
            }
        });

        // Clic à l'extérieur
        document.addEventListener('click', function (e) {
            if (!nav.classList.contains('is-open')) return;
            if (nav.contains(e.target) || menuBtn.contains(e.target)) return;
            setMenu(false);
        });
    }

    /* ---------------------------------------------------------------------
       En-tête — le filet inférieur apparaît au défilement
       --------------------------------------------------------------------- */
    var hdr = document.getElementById('hdr');

    /* ---------------------------------------------------------------------
       Sommaire actif — par ligne de référence.
       L'ancien seuil unique de 0.5 ne se déclenchait jamais sur une section
       plus haute que deux fois la fenêtre : tous les parcours mobiles
       étaient absents de PostHog. Une ligne de référence est déterministe
       quelle que soit la hauteur de la section.
       --------------------------------------------------------------------- */
    var sections = Array.prototype.slice.call(document.querySelectorAll('main .section'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-main a, .toc a'));
    var seenSections = {};
    var activeId = null;
    var ticking = false;

    function updateActive() {
        ticking = false;

        if (hdr) hdr.classList.toggle('is-scrolled', window.scrollY > 8);

        var line = window.scrollY + window.innerHeight * 0.3;
        var current = sections[0];

        for (var i = 0; i < sections.length; i++) {
            var top = sections[i].getBoundingClientRect().top + window.scrollY;
            if (top <= line) current = sections[i];
        }
        if (!current) return;

        var id = current.id;
        if (id === activeId) return;
        activeId = id;

        navLinks.forEach(function (a) {
            var match = a.getAttribute('href') === '#' + id;
            if (match) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
        });

        if (!seenSections[id]) {
            seenSections[id] = true;
            track('section_view', { section: id });
        }
    }

    function onScroll() {
        if (!ticking) { ticking = true; window.requestAnimationFrame(updateActive); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateActive();

    /* ---------------------------------------------------------------------
       Révélation au défilement
       --------------------------------------------------------------------- */
    var revealEls = document.querySelectorAll('.reveal, .stagger');

    if (reduced || !('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('is-in'); });
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
        Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
    }

    /* ---------------------------------------------------------------------
       Tracé du filet du hero — une seule fois, jamais rejoué
       --------------------------------------------------------------------- */
    var heroRule = document.getElementById('hero-rule');
    if (heroRule) {
        if (reduced) { heroRule.classList.add('is-drawn'); }
        else { window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () { heroRule.classList.add('is-drawn'); });
        }); }
    }

    /* ---------------------------------------------------------------------
       Filtres — agissent simultanément sur les fiches et sur l'index
       --------------------------------------------------------------------- */
    var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filters button'));
    var filterables = Array.prototype.slice.call(
        document.querySelectorAll('.sheet[data-cat], .index-table tbody tr[data-cat]'));

    function applyFilter(cat) {
        filterables.forEach(function (el) {
            var show = cat === 'all' || el.getAttribute('data-cat') === cat;
            el.classList.toggle('is-hidden', !show);
        });
    }

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var cat = btn.getAttribute('data-filter');
            filterBtns.forEach(function (b) {
                b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
            });
            applyFilter(cat);
            track('project_filter', { filter: cat });
        });
    });

    /* ---------------------------------------------------------------------
       Événements de contenu
       --------------------------------------------------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll('.sheet'), function (sheet) {
        sheet.addEventListener('click', function () {
            var h = sheet.querySelector('h3');
            track('project_click', {
                project: h ? h.textContent.trim() : null,
                category: sheet.getAttribute('data-cat'),
                source: 'sheet'
            });
        });
    });

    Array.prototype.forEach.call(document.querySelectorAll('.index-table .col-name a'), function (a) {
        a.addEventListener('click', function () {
            track('project_click', { project: a.textContent.trim(), source: 'index' });
        });
    });

    Array.prototype.forEach.call(document.querySelectorAll('a[href^="mailto:"]'), function (a) {
        a.addEventListener('click', function () { track('contact_click', { method: 'email' }); });
    });

    Array.prototype.forEach.call(document.querySelectorAll('a[href*="github.com"]'), function (a) {
        a.addEventListener('click', function () {
            track('outbound_click', { destination: 'github', url: a.getAttribute('href') });
        });
    });

    Array.prototype.forEach.call(document.querySelectorAll('.nav-main a, .toc a'), function (a) {
        a.addEventListener('click', function () {
            track('nav_click', { target: a.getAttribute('href') });
        });
    });
})();
