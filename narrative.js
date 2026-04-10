/* ============================================
   POWER NETWORKS — Simple, reliable narrative engine
   Fade-in cards on scroll + progress bar + nav
   ============================================ */

(function () {
  'use strict';

  // ── SCROLL REVEAL ──
  // Fade in step cards and other elements as they enter viewport

  function setupScrollReveal() {
    var elements = document.querySelectorAll(
      '.step-card, .matters-card, .system-step, .thread-card, .tier'
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add active to parent .step if it's a step-card
          var step = entry.target.closest('.step');
          if (step) step.classList.add('active');

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ── PROGRESS BAR ──

  function setupProgressBar() {
    var bar = document.getElementById('progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ── NAV SCROLL STATE ──

  function setupNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── SMOOTH SCROLL ──

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset = 60;
          var y = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  // ── INIT ──

  function init() {
    setupScrollReveal();
    setupProgressBar();
    setupNav();
    setupSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
