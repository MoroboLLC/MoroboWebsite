/*
 * Morobo Website JavaScript
 *
 * This script powers the interactive features of the Morobo website. It
 * initializes the Swiper sliders for the various showcase sections, updates
 * the copyright year in the footer, and triggers reveal animations when
 * sections come into view. Additional behaviours (like active navigation
 * highlighting) can be added here if needed.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Animated rotating gears background
  const canvas = document.getElementById('backgroundCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });    // Create 3 large gears positioned to not overlap
    const gears = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 250, teeth: 6, rotation: 0, speed: 0.0003, direction: 1 },
      { x: canvas.width * 0.65, y: canvas.height * 0.6, radius: 300, teeth: 5, rotation: 0, speed: 0.0002, direction: -1 },
      { x: canvas.width * 0.85, y: canvas.height * 0.25, radius: 200, teeth: 6, rotation: 0, speed: 0.00025, direction: 1 }
    ];

    function drawGear(x, y, radius, teeth, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const innerRadius = radius * 0.6;
      const toothHeight = radius * 0.15;
      const toothWidth = (Math.PI * 2) / (teeth * 2);
      
      // Draw filled gear shape
      ctx.beginPath();
      
      for (let i = 0; i < teeth; i++) {
        const angle1 = (i / teeth) * Math.PI * 2;
        const angle2 = ((i + 0.5) / teeth) * Math.PI * 2;
        const angle3 = ((i + 1) / teeth) * Math.PI * 2;
        
        // Outer edge of tooth
        const outerX1 = Math.cos(angle1 - toothWidth) * radius;
        const outerY1 = Math.sin(angle1 - toothWidth) * radius;
        const outerX2 = Math.cos(angle1 + toothWidth) * radius;
        const outerY2 = Math.sin(angle1 + toothWidth) * radius;
        
        // Inner edge between teeth
        const innerX1 = Math.cos(angle1 + toothWidth) * innerRadius;
        const innerY1 = Math.sin(angle1 + toothWidth) * innerRadius;
        const innerX2 = Math.cos(angle2 - toothWidth) * innerRadius;
        const innerY2 = Math.sin(angle2 - toothWidth) * innerRadius;
        const innerX3 = Math.cos(angle2 + toothWidth) * innerRadius;
        const innerY3 = Math.sin(angle2 + toothWidth) * innerRadius;
        
        if (i === 0) {
          ctx.moveTo(outerX1, outerY1);
        }
        
        // Draw tooth
        ctx.lineTo(outerX2, outerY2);
        ctx.lineTo(innerX1, innerY1);
        ctx.lineTo(innerX2, innerY2);
        ctx.lineTo(innerX3, innerY3);
        
        // Draw next tooth outer edge
        const nextOuterX = Math.cos(angle3 - toothWidth) * radius;
        const nextOuterY = Math.sin(angle3 - toothWidth) * radius;
        ctx.lineTo(nextOuterX, nextOuterY);
      }
      
      ctx.closePath();
      
      // Fill gear with light grey
      ctx.fillStyle = 'rgba(128, 128, 128, 0.08)';
      ctx.fill();
      
      // Draw center hole
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();
      
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw each gear
      gears.forEach(gear => {
        gear.rotation += gear.speed * gear.direction;
        drawGear(gear.x, gear.y, gear.radius, gear.teeth, gear.rotation);
      });
      
      requestAnimationFrame(animate);
    }

    animate();
  }

  // Update the footer year dynamically
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Helper to initialise a Swiper slider if the element exists
  const initSwiper = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return;
    return new Swiper(selector, {
      loop: true,
      spaceBetween: 24,
      slidesPerView: 1,
      centeredSlides: false,
      pagination: {
        el: `${selector} .swiper-pagination`,
        clickable: true,
      },
      navigation: {
        nextEl: `${selector} .swiper-button-next`,
        prevEl: `${selector} .swiper-button-prev`,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  };

  // Initialise sliders for each section
  initSwiper('.apps-swiper');
  initSwiper('.websites-swiper');
  initSwiper('.products-swiper');

  // Intersection observer for reveal animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
  });
  revealElements.forEach(el => revealObserver.observe(el));

  // Optional: highlight navigation links based on scroll position
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-tab');

  const setActiveLink = () => {
    let index = sections.length;
    while(--index && window.scrollY + 150 < sections[index].offsetTop) {}
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = navLinks[index];
    if (activeLink) {
      activeLink.classList.add('active');
    }
  };
  
  if (navLinks.length > 0) {
    setActiveLink();
    window.addEventListener('scroll', setActiveLink);
  }
});
