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
      canvas.height = window.innerHeight;    });    // Create 3 gears: 2 on left side, 1 large on right side
    // Teeth: 7-8 per gear, straight edges, not too long
    const gears = [
      // Top left - small gear
      { x: canvas.width * 0.15, y: canvas.height * 0.28, radius: 160, teeth: 7, rotation: 0, speed: 0.0002, direction: 1 },
      // Bottom left - bigger, moved more center
      { x: canvas.width * 0.25, y: canvas.height * 0.72, radius: 220, teeth: 8, rotation: 0, speed: 0.00018, direction: -1 },
      // Right side - large gear, even bigger
      { x: canvas.width * 0.82, y: canvas.height * 0.5, radius: 320, teeth: 8, rotation: 0, speed: 0.00015, direction: 1 }
    ];    function drawGear(x, y, radius, teeth, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const innerRadius = radius * 0.75; // Gear body - closer to outer edge
      const toothHeight = radius * 0.15; // Shorter teeth (15% of radius, not too far)
      const outerRadius = innerRadius + toothHeight;
      
      ctx.beginPath();
      
      // Draw gear with STRAIGHT teeth (not angled)
      for (let i = 0; i < teeth; i++) {
        const angleStep = (Math.PI * 2) / teeth;
        const currentAngle = i * angleStep;
        const nextAngle = (i + 1) * angleStep;
        
        const toothWidth = angleStep * 0.4; // 40% tooth, 60% gap
        const gapWidth = angleStep * 0.6;
        
        // Draw the gap (inner circle arc)
        const gapStart = currentAngle + toothWidth;
        const gapEnd = nextAngle;
        
        // Tooth left edge (STRAIGHT line)
        ctx.lineTo(
          Math.cos(currentAngle) * innerRadius,
          Math.sin(currentAngle) * innerRadius
        );
        ctx.lineTo(
          Math.cos(currentAngle) * outerRadius,
          Math.sin(currentAngle) * outerRadius
        );
        
        // Tooth top (STRAIGHT line)
        ctx.lineTo(
          Math.cos(currentAngle + toothWidth) * outerRadius,
          Math.sin(currentAngle + toothWidth) * outerRadius
        );
        
        // Tooth right edge (STRAIGHT line)
        ctx.lineTo(
          Math.cos(currentAngle + toothWidth) * innerRadius,
          Math.sin(currentAngle + toothWidth) * innerRadius
        );
        
        // Gap arc (smooth curve between teeth)
        ctx.arc(0, 0, innerRadius, currentAngle + toothWidth, nextAngle, false);
      }
      
      ctx.closePath();
      
      // Fill with solid grey (one shade)
      ctx.fillStyle = 'rgba(128, 128, 128, 0.18)'; // Solid medium grey
      ctx.fill();
      
      // Darker outline stroke
      ctx.strokeStyle = 'rgba(80, 80, 80, 0.35)'; // Darker grey outline
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw center hole
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(128, 128, 128, 0.18)'; // Same grey as body
      ctx.fill();
      ctx.strokeStyle = 'rgba(80, 80, 80, 0.35)'; // Same darker outline
      ctx.lineWidth = 2;
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
