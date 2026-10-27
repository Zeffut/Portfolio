(function () {
  'use strict';
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var q = document.getElementById('q');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var cat = 'all';

  function track(name, props) {
    try { if (window.posthog) window.posthog.capture(name, props); } catch (e) {}
  }

  function apply() {
    var t = q.value.trim().toLowerCase(), n = 0;
    cards.forEach(function (c) {
      var ok = (cat === 'all' || c.dataset.cat === cat) && (!t || c.textContent.toLowerCase().indexOf(t) > -1);
      c.hidden = !ok;
      if (ok) n++;
    });
    count.textContent = n + (n > 1 ? ' projets' : ' projet');
    empty.hidden = n > 0;
  }

  q.addEventListener('input', apply);
  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      cat = b.dataset.f;
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      apply();
    });
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="http"]');
    if (a) track('outbound_click', { destination: a.hostname === 'github.com' ? 'github' : a.hostname, url: a.getAttribute('href') });
  });
})();
