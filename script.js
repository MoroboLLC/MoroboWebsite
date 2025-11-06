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
    });    // Create 4 minimalist gears positioned to never overlap
    // Positioned in corners and edges for maximum separation
    const gears = [
      { x: canvas.width * 0.15, y: canvas.height * 0.2, radius: 180, teeth: 8, rotation: 0, speed: 0.0002, direction: 1 },
      { x: canvas.width * 0.85, y: canvas.height * 0.25, radius: 150, teeth: 6, rotation: 0, speed: 0.00025, direction: -1 },
      { x: canvas.width * 0.25, y: canvas.height * 0.75, radius: 200, teeth: 7, rotation: 0, speed: 0.00018, direction: 1 },
      { x: canvas.width * 0.75, y: canvas.height * 0.8, radius: 160, teeth: 6, rotation: 0, speed: 0.00022, direction: -1 }
    ];    function drawGear(x, y, radius, teeth, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const innerRadius = radius * 0.7; // Body of gear
      const outerRadius = radius; // Tip of teeth
      
      // Draw minimalist gear outline only (no fill)
      ctx.beginPath();
      
      // Draw teeth as simple trapezoids
      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
        const toothWidth = 0.35; // Narrower teeth for minimalist look
        
        // Inner arc segment
        const innerStart = angle + toothWidth * 0.3;
        const innerEnd = nextAngle - toothWidth * 0.3;
        
        // Outer tooth segment
        const outerStart = angle + toothWidth * 0.5;
        const outerEnd = angle + toothWidth * 1.5;
        
        // Draw path for this tooth
        ctx.lineTo(Math.cos(innerStart) * innerRadius, Math.sin(innerStart) * innerRadius);
        ctx.lineTo(Math.cos(outerStart) * outerRadius, Math.sin(outerStart) * outerRadius);
        ctx.lineTo(Math.cos(outerEnd) * outerRadius, Math.sin(outerEnd) * outerRadius);
        ctx.lineTo(Math.cos(innerEnd) * innerRadius, Math.sin(innerEnd) * innerRadius);
      }
      
      ctx.closePath();
      
      // Very light grey stroke only - minimalist
      ctx.strokeStyle = 'rgba(160, 160, 160, 0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Optional: very subtle fill
      ctx.fillStyle = 'rgba(128, 128, 128, 0.03)';
      ctx.fill();
      
      // Draw center circle (outline only)
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(160, 160, 160, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
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
