/*
 * Morobo Website — script.js v2
 * Three.js abstract background · GSAP scroll animations · 3D card tilt
 */

document.addEventListener('DOMContentLoaded', () => {

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

  // ── THREE.JS ABSTRACT BACKGROUND ─────────────────────────────
  const canvas = document.getElementById('backgroundCanvas');

  if (canvas && typeof THREE !== 'undefined') {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 9;

    // Create three floating wireframe shapes
    const shapes = [
      { geo: new THREE.IcosahedronGeometry(2.2, 1), color: 0xa855f7, opacity: 0.055, pos: [-4, 0.5, -2] },
      { geo: new THREE.OctahedronGeometry(1.4, 0),  color: 0xffffff, opacity: 0.028, pos: [ 4, -1,  -1] },
      { geo: new THREE.TorusGeometry(2.4, 0.35, 9, 28), color: 0xffffff, opacity: 0.022, pos: [0.5, 1.5, -3] },
    ];

    const meshes = shapes.map(({ geo, color, opacity, pos }) => {
      const mat  = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      scene.add(mesh);
      return mesh;
    });

    // Subtle mouse parallax
    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const clock = new THREE.Clock();

    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      meshes.forEach((mesh, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        mesh.rotation.x = t * 0.07 * dir;
        mesh.rotation.y = t * 0.11 * dir;
      });

      camera.position.x += (mx * 1.2 - camera.position.x) * 0.025;
      camera.position.y += (-my * 0.8 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  } else if (canvas) {
    // Fallback: simple purple particle field
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.12 + 0.03,
    }));

    (function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${p.o})`;
        ctx.fill();
      });
    })();
  }

  // ── GSAP SCROLL ANIMATIONS ───────────────────────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (document.querySelector('.hero-label'))    heroTimeline.fromTo('.hero-label',    { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, 0.2);
    if (document.querySelector('.hero-headline')) heroTimeline.fromTo('.hero-headline', { opacity: 0, y: 55 }, { opacity: 1, y: 0, duration: 1.2 }, 0.38);
    if (document.querySelector('.hero-sub'))      heroTimeline.fromTo('.hero-sub',      { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0 }, 0.65);
    if (document.querySelector('.hero-actions'))  heroTimeline.fromTo('.hero-actions',  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.85);
    if (document.querySelector('.hero-scroll'))   heroTimeline.fromTo('.hero-scroll',   { opacity: 0 },        { opacity: 1, duration: 0.8 }, 1.1);

    // Scroll reveal for .gsap-fade-up elements
    // Group by parent section to stagger within each group
    const fadeEls = gsap.utils.toArray('.gsap-fade-up');
    fadeEls.forEach((el, i) => {
      const siblings = el.parentElement ? [...el.parentElement.querySelectorAll('.gsap-fade-up')] : [];
      const idx = siblings.indexOf(el);
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.85,
          ease: 'power3.out',
          delay: idx * 0.09,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // Parallax section numbers
    gsap.utils.toArray('.section-number').forEach(el => {
      gsap.to(el, {
        y: -70,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        }
      });
    });

    // Statement section
    const stmt = document.querySelector('.statement-text');
    if (stmt) {
      gsap.fromTo(stmt, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: stmt, start: 'top 82%' }
      });
    }

    // Legacy .reveal elements
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
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
