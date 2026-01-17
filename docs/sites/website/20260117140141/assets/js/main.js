document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // --- Scroll Reveal Animations ---
  const revealItems = document.querySelectorAll('.reveal-item, .reveal-stagger-group');
  if (revealItems.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const delay = parseInt(entry.target.dataset.delay, 10) || 0;
          if (delay > 0) {
            entry.target.style.transitionDelay = `${delay}ms`;
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
      observer.observe(item);
    });
  }

  // --- Testimonial Carousel ---
  const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
  if (carouselWrapper) {
    const carousel = carouselWrapper.querySelector('.testimonial-carousel');
    const slides = Array.from(carousel.children);
    const nextButton = carouselWrapper.querySelector('.carousel-next');
    const prevButton = carouselWrapper.querySelector('.carousel-prev');
    const dotsNav = carouselWrapper.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;

    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const button = document.createElement('button');
      button.addEventListener('click', () => moveToSlide(i));
      dotsNav.appendChild(button);
    });
    const dots = Array.from(dotsNav.children);

    const setSlidePosition = (slide, index) => {
      slide.style.transform = `translateX(${index * 100}%)`;
    };
    // slides.forEach(setSlidePosition);

    const moveToSlide = (targetIndex) => {
      carousel.style.transform = `translateX(-${targetIndex * slideWidth}px)`;
      currentIndex = targetIndex;
      updateControls();
    };

    const updateControls = () => {
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === slides.length - 1;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    nextButton.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) moveToSlide(currentIndex - 1);
    });

    // Touch controls
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      if (touchendX < touchstartX && currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
      if (touchendX > touchstartX && currentIndex > 0) moveToSlide(currentIndex - 1);
    });

    // Initial setup
    carousel.style.transition = 'transform 0.4s ease-in-out';
    updateControls();
    window.addEventListener('resize', () => moveToSlide(currentIndex)); // Recalculate on resize
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && acceptButton && declineButton) {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('visible'), 100);
    }

    const handleConsent = (value) => {
      localStorage.setItem('cookie_consent', value);
      cookieBanner.classList.remove('visible');
      setTimeout(() => { cookieBanner.hidden = true; }, 500);
    };

    acceptButton.addEventListener('click', () => handleConsent('accepted'));
    declineButton.addEventListener('click', () => handleConsent('declined'));
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (scrolled past)
        if (!entry.isIntersecting) {
          stickyCTA.hidden = false;
          setTimeout(() => stickyCTA.classList.add('visible'), 10);
        } else {
          stickyCTA.classList.remove('visible');
          setTimeout(() => { stickyCTA.hidden = true; }, 400);
        }
      });
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      ctaObserver.observe(heroSection);
    }
  }

});