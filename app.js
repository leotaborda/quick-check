(function () {
  'use strict';

  // ── Navigation ──────────────────────────────────────────────────────────────
  const navLinks   = document.querySelectorAll('.nav-link[data-section]');
  const sections   = document.querySelectorAll('.section');
  const nav        = document.querySelector('.nav');

  function showSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));
    const target = document.getElementById(id);
    const link   = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (target) { target.classList.add('active'); window.scrollTo({ top: 0, behavior: 'instant' }); }
    if (link)   link.classList.add('active');
    // Kick animations
    setTimeout(observeAnimations, 60);
    setTimeout(observeCounters, 80);
  }

  navLinks.forEach(l => l.addEventListener('click', () => showSection(l.dataset.section)));
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => showSection(el.dataset.goto));
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  // ── Intersection Observer: fade-up & stagger ────────────────────────────────
  let animIO = null;
  function observeAnimations() {
    if (animIO) animIO.disconnect();
    animIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); animIO.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.section.active .fade-up, .section.active .stagger')
      .forEach(el => animIO.observe(el));
  }

  // ── Counter animation ────────────────────────────────────────────────────────
  let counterIO = null;
  function observeCounters() {
    if (counterIO) counterIO.disconnect();
    counterIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        const target   = parseFloat(el.dataset.count);
        const suffix   = el.dataset.suffix || '';
        const decimal  = el.dataset.count.includes('.');
        const dur      = 1400;
        const t0       = performance.now();
        const step = now => {
          const p = Math.min((now - t0) / dur, 1);
          const v = (1 - Math.pow(1 - p, 3)) * target;
          el.textContent = (decimal ? v.toFixed(1) : Math.round(v)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.section.active [data-count]')
      .forEach(el => counterIO.observe(el));
  }

  // ── Magnetic button effect ───────────────────────────────────────────────────
  document.querySelectorAll('.btn-accent, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ── Overview card routing ────────────────────────────────────────────────────
  document.querySelectorAll('.overview-card[data-goto]').forEach(card => {
    card.style.cursor = 'pointer';
  });

  // ── Init ────────────────────────────────────────────────────────────────────
  showSection('home');
}());