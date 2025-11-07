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
    canvas.height = window.innerHeight;    // Resize canvas on window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateGearPositions();
    });    // Create 3 gears: 2 on left side, 1 large on right side
    // All gears have 7 teeth (uniform design)
    const gears = [
      // Top left - small gear
      { x: 0, y: 0, radius: 160, baseRadius: 160, teeth: 7, rotation: 0, speed: 0.0003, direction: 1 },
      // Bottom left - bigger
      { x: 0, y: 0, radius: 220, baseRadius: 220, teeth: 7, rotation: 0, speed: 0.00027, direction: -1 },
      // Right side - large gear
      { x: 0, y: 0, radius: 320, baseRadius: 320, teeth: 7, rotation: 0, speed: 0.00022, direction: 1 }
    ];

    // Update gear positions and sizes based on screen size
    function updateGearPositions() {
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // Mobile: SMALLER gears to prevent overlapping
        gears[0].radius = gears[0].baseRadius * 0.65; // 65% size on mobile
        gears[1].radius = gears[1].baseRadius * 0.65;
        gears[2].radius = gears[2].baseRadius * 0.65;
        
        gears[0].x = canvas.width * 0.18;
        gears[0].y = canvas.height * 0.22;
        gears[1].x = canvas.width * 0.22;
        gears[1].y = canvas.height * 0.78;
        gears[2].x = canvas.width * 0.82;
        gears[2].y = canvas.height * 0.5;
      } else {
        // Desktop: full size, bottom-left MORE TO THE RIGHT (middle)
        gears[0].radius = gears[0].baseRadius;
        gears[1].radius = gears[1].baseRadius;
        gears[2].radius = gears[2].baseRadius;
        
        gears[0].x = canvas.width * 0.15;
        gears[0].y = canvas.height * 0.28;
        gears[1].x = canvas.width * 0.35; // MOVED MORE RIGHT (was 0.28)
        gears[1].y = canvas.height * 0.72;
        gears[2].x = canvas.width * 0.82;
        gears[2].y = canvas.height * 0.5;
      }
    }

    updateGearPositions();    function drawGear(x, y, radius, teeth, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const innerRadius = radius * 0.7; // Gear body
      const toothHeight = radius * 0.28; // CHUNKY teeth - stick out more
      const outerRadius = innerRadius + toothHeight;
      const cornerRadius = 6; // More corner rounding for flowy look
      
      ctx.beginPath();
      
      // Draw gear with PERFECTLY STRAIGHT teeth (using cartesian coordinates for parallel sides)
      for (let i = 0; i < teeth; i++) {
        const angleStep = (Math.PI * 2) / teeth;
        const currentAngle = i * angleStep;
        const nextAngle = (i + 1) * angleStep;
        
        const toothWidth = angleStep * 0.58; // WIDER teeth for 7 teeth (58% tooth, 42% gap)
        
        // Get the base positions at inner radius
        const innerLeftAngle = currentAngle;
        const innerRightAngle = currentAngle + toothWidth;
        
        // Calculate ACTUAL cartesian width at inner radius
        const innerLeftX = Math.cos(innerLeftAngle) * innerRadius;
        const innerLeftY = Math.sin(innerLeftAngle) * innerRadius;
        const innerRightX = Math.cos(innerRightAngle) * innerRadius;
        const innerRightY = Math.sin(innerRightAngle) * innerRadius;
        
        // Calculate the STRAIGHT direction vector (perpendicular to radius at tooth center)
        const toothCenterAngle = currentAngle + toothWidth / 2;
        const radialDirX = Math.cos(toothCenterAngle);
        const radialDirY = Math.sin(toothCenterAngle);
        
        // Calculate the tooth width vector (tangent direction at inner radius)
        const tangentX = -Math.sin(toothCenterAngle);
        const tangentY = Math.cos(toothCenterAngle);
        
        // Get cartesian distance between inner corners
        const innerWidth = Math.sqrt(
          Math.pow(innerRightX - innerLeftX, 2) + 
          Math.pow(innerRightY - innerLeftY, 2)
        );
        
        // Create PARALLEL outer corners by moving straight outward (same width)
        const outerLeftX = innerLeftX + radialDirX * toothHeight;
        const outerLeftY = innerLeftY + radialDirY * toothHeight;
        const outerRightX = innerRightX + radialDirX * toothHeight;
        const outerRightY = innerRightY + radialDirY * toothHeight;
        
        // Start at inner left
        if (i === 0) {
          ctx.moveTo(innerLeftX, innerLeftY);
        } else {
          ctx.lineTo(innerLeftX, innerLeftY);
        }
        
        // Left edge - STRAIGHT line
        ctx.lineTo(outerLeftX, outerLeftY);
        
        // Top-left corner (rounded)
        ctx.arcTo(outerLeftX, outerLeftY, outerRightX, outerRightY, cornerRadius);
        
        // Top edge - STRAIGHT line to near right corner
        ctx.lineTo(outerRightX, outerRightY);
        
        // Top-right corner (rounded)
        ctx.arcTo(outerRightX, outerRightY, innerRightX, innerRightY, cornerRadius);
        
        // Right edge - STRAIGHT line
        ctx.lineTo(innerRightX, innerRightY);
        
        // Gap arc (smooth curve between teeth)
        ctx.arc(0, 0, innerRadius, innerRightAngle, nextAngle, false);
      }
      
      ctx.closePath();
      
      // ONE SOLID GREY COLOR ONLY (no outline like reference image)
      ctx.fillStyle = 'rgba(128, 128, 128, 0.25)'; // Single solid grey, more visible
      ctx.fill();
      
      // Draw center hole
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Dark center hole
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
