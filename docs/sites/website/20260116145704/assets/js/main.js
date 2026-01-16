document.addEventListener('DOMContentLoaded', function() {

  // --- STICKY HEADER ---
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
  }

  // --- MOBILE NAVIGATION ---
  const navToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('main-nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('is-open');
      navMenu.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal-item, .reveal-group');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- TESTIMONIAL CAROUSEL ---
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;

    let currentIndex = 0;

    const moveToSlide = (targetIndex) => {
      track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
      currentIndex = targetIndex;
      updateDots(targetIndex);
      updateArrows();
    };

    // Create dots
    if (dotsNav) {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(dot);
        });
        updateDots(0);
    }

    function updateDots(index) {
        const dots = Array.from(dotsNav.children);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function updateArrows() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;
    }

    nextButton.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        moveToSlide(currentIndex + 1);
      }
    });

    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        moveToSlide(currentIndex - 1);
      }
    });

    // Handle resize
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + newSlideWidth * currentIndex + 'px)';
    });

    updateArrows();
  }

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // --- STICKY CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const showAt = 800; // Pixels from top to show the CTA
      let isVisible = false;

      window.addEventListener('scroll', () => {
          if (window.scrollY > showAt && !isVisible) {
              stickyCTA.hidden = false;
              setTimeout(() => stickyCTA.classList.add('is-visible'), 10); 
              isVisible = true;
          } else if (window.scrollY <= showAt && isVisible) {
              stickyCTA.classList.remove('is-visible');
              isVisible = false;
          }
      });
  }

});