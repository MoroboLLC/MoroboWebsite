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
    });

    // Create multiple gears with different sizes and positions
    const gears = [
      { x: canvas.width * 0.15, y: canvas.height * 0.25, radius: 150, teeth: 20, rotation: 0, speed: 0.002, direction: 1 },
      { x: canvas.width * 0.45, y: canvas.height * 0.6, radius: 200, teeth: 24, rotation: 0, speed: 0.0015, direction: -1 },
      { x: canvas.width * 0.75, y: canvas.height * 0.35, radius: 120, teeth: 16, rotation: 0, speed: 0.0025, direction: 1 },
      { x: canvas.width * 0.85, y: canvas.height * 0.75, radius: 180, teeth: 22, rotation: 0, speed: 0.001, direction: -1 },
      { x: canvas.width * 0.25, y: canvas.height * 0.8, radius: 100, teeth: 14, rotation: 0, speed: 0.003, direction: 1 }
    ];

    function drawGear(x, y, radius, teeth, rotation, opacity = 0.08) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Draw gear teeth
      ctx.beginPath();
      const toothDepth = radius * 0.2;
      const toothWidth = (Math.PI * 2) / teeth / 2;
      
      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
        
        // Outer tooth edge
        const x1 = Math.cos(angle) * (radius + toothDepth);
        const y1 = Math.sin(angle) * (radius + toothDepth);
        const x2 = Math.cos(angle + toothWidth) * (radius + toothDepth);
        const y2 = Math.sin(angle + toothWidth) * (radius + toothDepth);
        
        // Inner tooth edge
        const x3 = Math.cos(angle + toothWidth) * radius;
        const y3 = Math.sin(angle + toothWidth) * radius;
        const x4 = Math.cos(nextAngle - toothWidth) * radius;
        const y4 = Math.sin(nextAngle - toothWidth) * radius;
        
        if (i === 0) {
          ctx.moveTo(x1, y1);
        } else {
          ctx.lineTo(x1, y1);
        }
        
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
      }
      
      ctx.closePath();
      ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw inner circle
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.7})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw center circle
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${opacity * 0.5})`;
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
