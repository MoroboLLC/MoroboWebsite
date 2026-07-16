/*
 * Morobo Website — script.js v2
 * Three.js abstract background · GSAP scroll animations · 3D card tilt
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── ONE COMMITTED LIGHT THEME (v4) ───────────────────────────
  document.documentElement.removeAttribute('data-theme');
  try { localStorage.removeItem('morobo-theme'); } catch (e) {}

  // ── FAVICON ──────────────────────────────────────────────────
  const ensureFavicon = () => {
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = '/favicon.ico';

    let touch = document.querySelector('link[rel="apple-touch-icon"]');
    if (!touch) {
      touch = document.createElement('link');
      touch.rel = 'apple-touch-icon';
      document.head.appendChild(touch);
    }
    touch.href = '/apple-touch-icon.png';
  };
  ensureFavicon();

  // ── YEAR ─────────────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── MOBILE NAV BURGER ────────────────────────────────────────
  const burger  = document.getElementById('navBurger');
  const navTabs = document.getElementById('navTabs') || document.querySelector('.nav-tabs');
  if (burger && navTabs) {
    burger.addEventListener('click', () => navTabs.classList.toggle('open'));
    // Close on link click
    navTabs.querySelectorAll('.nav-tab').forEach(link => {
      link.addEventListener('click', () => navTabs.classList.remove('open'));
    });
  }

  // ── NAVBAR SCROLL GLASS ──────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── v4 AMBIENT BACKGROUND (blobs + dot grid, injected) ───────
  const oldCanvas = document.getElementById('backgroundCanvas');
  if (oldCanvas) oldCanvas.style.display = 'none';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.querySelector('.bgfx')) {
    const fx = document.createElement('div');
    fx.className = 'bgfx';
    fx.setAttribute('aria-hidden', 'true');
    fx.innerHTML = '<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="dg"></div>';
    document.body.prepend(fx);
  }

  // background drift with scroll (matches the homepage feel)
  if (!reducedMotion) {
    const b1 = document.querySelector('.bgfx .b1');
    const b2 = document.querySelector('.bgfx .b2');
    const b3 = document.querySelector('.bgfx .b3');
    const dg = document.querySelector('.bgfx .dg');
    let cur = 0;
    const drift = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const target = window.scrollY / max;
      cur += (target - cur) * 0.08;
      const p = cur;
      if (b1) b1.style.transform = `translate(${-160 * p}px, ${720 * p}px) scale(${1 + 0.35 * p})`;
      if (b2) b2.style.transform = `translate(${-220 * p}px, ${-560 * p}px) scale(${1 + 0.2 * p})`;
      if (b3) b3.style.transform = `translate(${180 * p}px, ${-700 * p}px) scale(${1 + 0.25 * p})`;
      if (dg) dg.style.transform = `translateY(${-420 * p}px)`;
      requestAnimationFrame(drift);
    };
    requestAnimationFrame(drift);
  }

  // ── THE SCROLL ORB — colour-leaking companion in the gutter ──
  if (!reducedMotion && !document.querySelector('.scroll-orb')) {
    const orb = document.createElement('div');
    orb.className = 'scroll-orb';
    orb.setAttribute('aria-hidden', 'true');
    document.body.appendChild(orb);

    let ox = -120, oy = -120, shown = false;
    const orbLoop = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const size = vw <= 640 ? 60 : 96;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, window.scrollY / max));

      if (!shown) { orb.style.opacity = '0.9'; shown = true; }
      // dramatic full-width weave: edge → edge as the reader scrolls,
      // gliding behind the content layer so it never blocks anything
      const margin = Math.max(28, vw * 0.04);
      const tx = vw / 2 + Math.sin(p * Math.PI * 4) * (vw / 2 - margin - size / 2) - size / 2;
      const ty = 70 + p * (vh - 210) + Math.sin(p * Math.PI * 7) * 46;
      ox += (tx - ox) * 0.07;
      oy += (ty - oy) * 0.07;
      orb.style.transform = `translate(${ox}px, ${oy}px) scale(${0.8 + 0.45 * Math.sin(p * Math.PI)})`;
      orb.style.filter = `blur(5px) hue-rotate(${p * 360}deg) saturate(${1.1 + 0.5 * Math.sin(p * Math.PI * 2)})`;
      requestAnimationFrame(orbLoop);
    };
    requestAnimationFrame(orbLoop);
  }

  // ── GSAP SCROLL ANIMATIONS ───────────────────────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // ── Hero entrance — staggered word-by-word on headline ──
    const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } });

    if (document.querySelector('.hero-label')) {
      heroTL.fromTo('.hero-label',
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.7 }, 0.1
      );
    }

    // Split hero headline into lines and animate each
    const heroHL = document.querySelector('.hero-headline');
    if (heroHL) {
      // Animate each child node / text line with stagger
      const lines = heroHL.querySelectorAll('br') ? [...heroHL.childNodes].filter(n => n.nodeName === 'BR' || n.nodeName !== 'BR') : [];
      heroTL.fromTo(heroHL,
        { opacity: 0, y: 70, skewY: 1.5 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.1 }, 0.25
      );
    }

    if (document.querySelector('.hero-sub')) {
      heroTL.fromTo('.hero-sub',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.85 }, 0.55
      );
    }
    if (document.querySelector('.hero-actions')) {
      heroTL.fromTo('.hero-actions',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 }, 0.72
      );
    }
    if (document.querySelector('.hero-scroll')) {
      heroTL.fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.0);
    }

    // ── Eyebrow labels — clip wipe left-to-right ──
    gsap.utils.toArray('.section-eyebrow').forEach(el => {
      gsap.fromTo(el,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)', opacity: 1,
          duration: 0.7, ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 92%' }
        }
      );
    });

    // ── Section titles — slide up with skew ──
    gsap.utils.toArray('.section-title').forEach(el => {
      // Don't double-animate if inside hero
      if (el.closest('.hero')) return;
      gsap.fromTo(el,
        { opacity: 0, y: 48, skewY: 1.2 },
        {
          opacity: 1, y: 0, skewY: 0,
          duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        }
      );
    });

    // ── gsap-fade-up — stagger siblings ──
    gsap.utils.toArray('.gsap-fade-up').forEach(el => {
      const siblings = el.parentElement ? [...el.parentElement.querySelectorAll('.gsap-fade-up')] : [];
      const idx = siblings.indexOf(el);
      gsap.fromTo(el,
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'power3.out',
          delay: idx * 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });

    // ── Card grids — pop+stagger ──
    document.querySelectorAll('.apps-grid, .portfolio-grid, .process-grid, .portfolio-section .portfolio-grid').forEach(grid => {
      const cards = gsap.utils.toArray(grid.children);
      cards.forEach((card, i) => {
        if (card.classList.contains('gsap-fade-up') || card.classList.contains('gsap-pop')) return;
        gsap.fromTo(card,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.75, ease: 'back.out(1.3)',
            delay: i * 0.07,
            scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' }
          }
        );
      });
    });

    // ── Parallax section numbers ──
    gsap.utils.toArray('.section-number').forEach(el => {
      gsap.to(el, {
        y: -80, ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.section') || el.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: 1.5
        }
      });
    });

    // ── Statement — dramatic entrance ──
    const stmt = document.querySelector('.statement-text');
    if (stmt) {
      gsap.fromTo(stmt,
        { opacity: 0, y: 60, skewY: 1 },
        {
          opacity: 1, y: 0, skewY: 0,
          duration: 1.3, ease: 'power4.out',
          scrollTrigger: { trigger: stmt, start: 'top 80%' }
        }
      );
    }
    const stmtLink = document.querySelector('.statement-link');
    if (stmtLink) {
      gsap.fromTo(stmtLink,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: stmtLink, start: 'top 88%' } }
      );
    }

    // ── Section lines (accent underline) ──
    gsap.utils.toArray('.section-line').forEach(el => {
      gsap.to(el, {
        width: '48px', duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    // ── Contact grid — slide from sides ──
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form');
    if (contactInfo) {
      gsap.fromTo(contactInfo,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: contactInfo, start: 'top 85%' } }
      );
    }
    if (contactForm) {
      gsap.fromTo(contactForm,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: contactForm, start: 'top 85%' } }
      );
    }

    // ── Portfolio cards on websites page ──
    gsap.utils.toArray('.portfolio-section .portfolio-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 36, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, ease: 'power3.out',
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' }
        }
      );
    });

    // ── App detail cards ──
    gsap.utils.toArray('.app-detail-card').forEach((card, i) => {
      const dir = i % 2 === 0 ? -40 : 40;
      gsap.fromTo(card,
        { opacity: 0, x: dir },
        {
          opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' }
        }
      );
    });

    // ── Legacy .reveal ──
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });

  } else {
    // Fallback: IntersectionObserver
    const allReveal = document.querySelectorAll('.gsap-fade-up, .reveal, .gsap-fade-in');
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    allReveal.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      obs.observe(el);
    });
  }

  // ── 3D CARD TILT ─────────────────────────────────────────────
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x  = e.clientX - rect.left;
      const y  = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -9;
      const ry = ((x - cx) / cx) *  9;

      card.style.transform   = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(14px)`;
      card.style.transition  = 'transform 0.08s ease';

      // Glow follow
      card.style.setProperty('--mouse-x', `${(x / rect.width)  * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, box-shadow 0.35s';
    });
  });

  // ── PORTFOLIO CARD MOUSE GLOW ─────────────────────────────────
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width)  * 100}%`);
      card.style.setProperty('--mouse-y', `${((e.clientY - rect.top)  / rect.height) * 100}%`);
    });
  });

  // ── SWIPER (inner pages) ──────────────────────────────────────
  if (typeof Swiper !== 'undefined') {
    const initSwiper = selector => {
      if (!document.querySelector(selector)) return;
      return new Swiper(selector, {
        loop: true,
        spaceBetween: 20,
        slidesPerView: 1,
        pagination: { el: `${selector} .swiper-pagination`, clickable: true },
        navigation: {
          nextEl: `${selector} .swiper-button-next`,
          prevEl: `${selector} .swiper-button-prev`,
        },
        breakpoints: {
          640:  { slidesPerView: 1 },
          768:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    };
    initSwiper('.apps-swiper');
    initSwiper('.websites-swiper');
    initSwiper('.products-swiper');
  }

});
