/* ---------- language toggle (persisted per browser) ---------- */
(function () {
  var html = document.documentElement, btn = document.getElementById('lang');
  var saved = null;
  try { saved = localStorage.getItem('ndad-lang'); } catch (e) {}
  // English is the primary language; Vietnamese is the secondary option
  html.lang = (saved === 'vi' || saved === 'en') ? saved : 'en';
  function sync() { if (btn) btn.textContent = html.lang === 'vi' ? 'EN' : 'VI'; }
  sync();
  if (btn) btn.addEventListener('click', function () {
    html.lang = html.lang === 'vi' ? 'en' : 'vi';
    try { localStorage.setItem('ndad-lang', html.lang); } catch (e) {}
    sync();
  });
})();

/* ---------- mobile menu ---------- */
(function () {
  var b = document.getElementById('burger'), n = document.getElementById('nav');
  if (!b || !n) return;
  function close() { n.hidden = true; b.setAttribute('aria-expanded', 'false'); }
  function apply() { if (window.innerWidth <= 940) close(); else { n.hidden = false; } }
  apply();
  window.addEventListener('resize', apply);
  b.addEventListener('click', function () {
    var open = n.hidden;
    n.hidden = !open;
    b.setAttribute('aria-expanded', String(open));
  });
  n.addEventListener('click', function (e) { if (e.target.closest('a') && window.innerWidth <= 940) close(); });
})();

/* ---------- scroll reveal ---------- */
(function () {
  var els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  els.forEach(function (el) { io.observe(el); });
  // safety net: never leave content invisible if the observer misses
  window.addEventListener('load', function () {
    setTimeout(function () {
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
      });
    }, 900);
  });
})();

/* ---------- active nav link ---------- */
(function () {
  var links = [].slice.call(document.querySelectorAll('.nlinks a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  var map = {};
  links.forEach(function (a) {
    var s = document.querySelector(a.getAttribute('href'));
    if (s) map[s.id] = a;
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        links.forEach(function (a) { a.classList.remove('on'); });
        if (map[en.target.id]) map[en.target.id].classList.add('on');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  // at the very top of the page no section is "current" — clear the highlight
  window.addEventListener('scroll', function () {
    if (window.scrollY < 120) links.forEach(function (a) { a.classList.remove('on'); });
  }, { passive: true });
})();

/* ---------- lightbox ---------- */
(function () {
  var lb = document.getElementById('lb'), img = document.getElementById('lbi');
  if (!lb || !img) return;
  // collect, in document order: gallery links and any image marked data-lb-src
  var shots = [].slice.call(document.querySelectorAll('[data-lb], img[data-lb-src]')), i = 0;
  function srcOf(el) { return el.tagName === 'IMG' ? el.currentSrc || el.src : el.getAttribute('href'); }
  function show(k) { i = (k + shots.length) % shots.length; img.src = srcOf(shots[i]); }
  function open(k) { show(k); lb.hidden = false; document.body.style.overflow = 'hidden'; }
  function close() { lb.hidden = true; img.src = ''; document.body.style.overflow = ''; }
  shots.forEach(function (a, k) {
    if (a.tagName === 'IMG') a.style.cursor = 'zoom-in';
    a.addEventListener('click', function (e) { e.preventDefault(); open(k); });
  });
  document.getElementById('lbx').addEventListener('click', close);
  document.getElementById('lbp').addEventListener('click', function (e) { e.stopPropagation(); show(i - 1); });
  document.getElementById('lbn').addEventListener('click', function (e) { e.stopPropagation(); show(i + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();
