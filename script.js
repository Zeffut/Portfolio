document.getElementById('fr-flag').addEventListener('click', function() {
    switchLanguage('en');
});

document.getElementById('en-flag').addEventListener('click', function() {
    switchLanguage('fr');
});

function switchLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(function(element) {
        if (element.getAttribute('data-lang') === lang) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });

    if (lang === 'fr') {
        document.getElementById('fr-flag').classList.remove('hidden');
        document.getElementById('en-flag').classList.add('hidden');
    } else {
        document.getElementById('fr-flag').classList.add('hidden');
        document.getElementById('en-flag').classList.remove('hidden');
    }
}

// Initial language setup
switchLanguage('fr');

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