/*
 * Morobo Website JavaScript
 *
 * This script powers the interactive features of the Morobo website. It
 * creates a subtle particle animation background, initializes the Swiper 
 * sliders for the various showcase sections, updates the copyright year in 
 * the footer, and triggers reveal animations when sections come into view.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Subtle white particles background
  const canvas = document.getElementById('backgroundCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    });
    
    // Particle system
    const particles = [];
    const particleCount = 80; // Subtle amount
    const maxSpeed = 0.5;
    const minSpeed = 0.2;
    
    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5; // Very small, subtle particles
        this.speedX = (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed;
        this.speedY = (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed;
        this.opacity = Math.random() * 0.3 + 0.1; // Very subtle opacity (0.1 to 0.4)
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }
    
    // Initialize particles
    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    
    initParticles();
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
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

  // Scroll-based nav highlighting disabled.
  // The automatic scroll-sync was causing inconsistent active states.
  // We keep click/navigation behavior (links use their hrefs), but avoid
  // programmatically changing `.nav-tab.active` on scroll.
  // If you want this re-enabled later, restore the block above.
});
