/* ── script.js — Senative Villa ── */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initMobileMenu();
  initHeroSlider();
  initGallery();
  initFaq();
  initFab();
});

/* ── 1. Sticky nav highlight ────────────────────────────────────────────── */
function initStickyNav() {
  const nav = document.querySelector('.site-nav');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 30);

    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) cur = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  });
}

/* ── 2. Mobile Menu ─────────────────────────────────────────────────────── */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.querySelector('.nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* ── 3. Hero Background Slider ──────────────────────────────────────────── */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let idx = 0;

  function goTo(i) {
    slides[idx].classList.remove('active');
    dots[idx]?.classList.remove('active');
    idx = i;
    slides[idx].classList.add('active');
    dots[idx]?.classList.add('active');
  }

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  setInterval(() => goTo((idx + 1) % slides.length), 5500);
}

/* ── 4. Gallery Filter + Lightbox ───────────────────────────────────────── */
let visibleItems = [];
let lbIdx = 0;

function initGallery() {
  const grid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.gf-btn');
  const items = Array.from(document.querySelectorAll('.g-item'));
  const lb       = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbCap    = document.getElementById('lb-cap');
  const lbCount  = document.getElementById('lb-count');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');

  visibleItems = items;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat.includes(cat);
        item.style.display = show ? '' : 'none';
      });

      visibleItems = items.filter(i => i.style.display !== 'none');
    });
  });

  // Open lightbox
  items.forEach(item => {
    item.addEventListener('click', () => {
      lbIdx = visibleItems.indexOf(item);
      if (lbIdx === -1) lbIdx = 0;
      showLb();
    });
  });

  function showLb() {
    const item = visibleItems[lbIdx];
    const img  = item.querySelector('img');
    const h4   = item.querySelector('.g-item-cap h4')?.textContent || 'Senative Villa';
    const span = item.querySelector('.g-item-cap span')?.textContent || '';

    lbImg.src = img.src;
    lbCap.textContent = h4;
    lbCount.textContent = `${lbIdx + 1} / ${visibleItems.length}`;

    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  lbClose?.addEventListener('click', closeLb);
  lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });

  lbPrev?.addEventListener('click', () => {
    lbIdx = (lbIdx - 1 + visibleItems.length) % visibleItems.length;
    showLb();
  });
  lbNext?.addEventListener('click', () => {
    lbIdx = (lbIdx + 1) % visibleItems.length;
    showLb();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') { lbIdx = (lbIdx - 1 + visibleItems.length) % visibleItems.length; showLb(); }
    if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % visibleItems.length; showLb(); }
  });
}

/* ── 5. FAQ Accordion ───────────────────────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ── 6. Floating WhatsApp Speed-Dial ────────────────────────────────────── */
function initFab() {
  const trigger = document.querySelector('.fab-trigger');
  const menu    = document.querySelector('.fab-menu');
  if (!trigger || !menu) return;

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !trigger.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
}
