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
  // Animated M-pattern background
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

    // M-pattern lines animation
    let offset = 0;
    const lines = [];
    const numberOfLines = 5;
    
    // Create M-pattern lines
    for (let i = 0; i < numberOfLines; i++) {
      lines.push({
        y: (i * canvas.height) / numberOfLines,
        speed: 0.2 + Math.random() * 0.3,
        amplitude: 100 + Math.random() * 50
      });
    }

    function drawMPattern() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 2;

      lines.forEach((line, index) => {
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 10) {
          // Create M pattern: down, up, down, up
          const segment = (x + offset * line.speed) % 400;
          let y = line.y;
          
          if (segment < 100) {
            // First downstroke of M
            y += (segment / 100) * line.amplitude;
          } else if (segment < 200) {
            // First upstroke of M
            y += line.amplitude - ((segment - 100) / 100) * line.amplitude;
          } else if (segment < 300) {
            // Second downstroke of M
            y += ((segment - 200) / 100) * line.amplitude;
          } else {
            // Second upstroke of M
            y += line.amplitude - ((segment - 300) / 100) * line.amplitude;
          }
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      });

      offset += 0.5;
      requestAnimationFrame(drawMPattern);
    }

    drawMPattern();
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
