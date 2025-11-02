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
    ];    function drawGear(x, y, radius, teeth, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const innerRadius = radius * 0.65; // Body of gear
      const outerRadius = radius; // Tip of teeth
      const toothDepth = outerRadius - innerRadius;
      
      // Draw the main gear body (circle)
      ctx.beginPath();
      ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(128, 128, 128, 0.12)';
      ctx.fill();
      
      // Draw each tooth as a rounded rectangle extending from the body
      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const toothWidth = (Math.PI * 2) / teeth * 0.4; // 40% of the arc between teeth
        
        ctx.save();
        ctx.rotate(angle);
        
        // Draw rounded tooth
        ctx.beginPath();
        const toothStartX = -innerRadius * Math.sin(toothWidth / 2);
        const toothStartY = innerRadius * Math.cos(toothWidth / 2);
        const toothEndX = innerRadius * Math.sin(toothWidth / 2);
        const toothEndY = innerRadius * Math.cos(toothWidth / 2);
        
        // Create tooth shape with rounded corners
        ctx.moveTo(toothStartX, toothStartY);
        ctx.lineTo(-outerRadius * Math.sin(toothWidth / 2.2), outerRadius * Math.cos(toothWidth / 2.2));
        ctx.arcTo(0, outerRadius, outerRadius * Math.sin(toothWidth / 2.2), outerRadius * Math.cos(toothWidth / 2.2), outerRadius * 0.15);
        ctx.lineTo(outerRadius * Math.sin(toothWidth / 2.2), outerRadius * Math.cos(toothWidth / 2.2));
        ctx.lineTo(toothEndX, toothEndY);
        
        ctx.fillStyle = 'rgba(128, 128, 128, 0.12)';
        ctx.fill();
        
        ctx.restore();
      }
      
      // Draw center hole with gradient for depth
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.3);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
      
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Inner hole
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
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
