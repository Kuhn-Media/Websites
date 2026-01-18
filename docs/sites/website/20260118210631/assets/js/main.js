document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (mobileNavToggle && mobileNav) {
    const toggleNav = (isOpen) => {
      mobileNavToggle.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    };

    mobileNavToggle.addEventListener('click', () => toggleNav(true));
    mobileNavClose.addEventListener('click', () => toggleNav(false));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        toggleNav(false);
      }
    });
  }

  // --- Sticky Header ---
  const header = document.getElementById('site-header');
  if (header) {
    const observer = new IntersectionObserver(([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '100px 0px 0px 0px' });
    observer.observe(document.body);
  }

  // --- Scroll Animations ---
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.revealDelay || 0;
        const staggerChildren = el.querySelectorAll('[data-reveal-stagger]');
        if (staggerChildren.length > 0) {
            staggerChildren.forEach((child, index) => {
                child.style.transitionDelay = `${index * 100}ms`;
                child.classList.add('is-visible');
            });
        } else {
            setTimeout(() => {
              el.classList.add('is-visible');
            }, parseInt(delay));
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-dots');

    const slideWidth = slides[0].getBoundingClientRect().width;
    const setSlidePosition = (slide, index) => {
      slide.style.left = slideWidth * index + 'px';
    };
    // slides.forEach(setSlidePosition);

    let currentIndex = 0;

    const moveToSlide = (targetIndex) => {
      track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
      currentIndex = targetIndex;
      updateControls();
    };

    const updateControls = () => {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= slides.length - getVisibleSlides();
        updateDots();
    };

    const getVisibleSlides = () => {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    };

    // Dots
    slides.forEach((_, index) => {
      const button = document.createElement('button');
      button.classList.add('carousel-dot');
      button.addEventListener('click', () => moveToSlide(index));
      dotsNav.appendChild(button);
    });
    const dots = Array.from(dotsNav.children);
    const updateDots = () => {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    };

    nextButton.addEventListener('click', () => {
      const newIndex = Math.min(currentIndex + 1, slides.length - getVisibleSlides());
      moveToSlide(newIndex);
    });

    prevButton.addEventListener('click', () => {
      const newIndex = Math.max(currentIndex - 1, 0);
      moveToSlide(newIndex);
    });

    // Touch controls
    let touchstartX = 0;
    let touchendX = 0;

    track.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextButton.click();
        if (touchendX > touchstartX) prevButton.click();
    });

    updateControls();
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        moveToSlide(currentIndex); // Recalculate position on resize
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    cookieBanner.hidden = false;
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.hidden = true;
    });
  }

  if (declineBtn) {
      declineBtn.addEventListener('click', () => {
          localStorage.setItem('cookiesAccepted', 'false');
          cookieBanner.hidden = true;
      });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver(([entry]) => {
          // Show when hero is NOT visible
          stickyCTA.hidden = entry.isIntersecting;
      }, { threshold: 0.1 });
      const heroSection = document.querySelector('.hero, .page-hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});