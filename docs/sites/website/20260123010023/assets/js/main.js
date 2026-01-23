document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE NAVIGATION ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.querySelector('.mobile-nav-menu');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (mobileNavToggle && mobileNavMenu) {
    const openMenu = () => {
      mobileNavMenu.classList.add('is-open');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-nav-open');
      mobileNavMenu.setAttribute('aria-hidden', 'false');
      mobileNavClose.focus();
    };

    const closeMenu = () => {
      mobileNavMenu.classList.remove('is-open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-nav-open');
      mobileNavMenu.setAttribute('aria-hidden', 'true');
      mobileNavToggle.focus();
    };

    mobileNavToggle.addEventListener('click', openMenu);
    mobileNavClose.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- STICKY HEADER ---
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 100}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- TESTIMONIALS CAROUSEL ---
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let intervalId;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
      updateDots();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });

    const nextSlide = () => goToSlide((currentIndex + 1) % slides.length);
    const prevSlide = () => goToSlide((currentIndex - 1 + slides.length) % slides.length);

    nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

    const startInterval = () => {
      intervalId = setInterval(nextSlide, 7000);
    };

    const resetInterval = () => {
      clearInterval(intervalId);
      startInterval();
    };

    goToSlide(0);
    startInterval();
  }

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // --- STICKY CTA BAR ---
  const stickyCtaBar = document.getElementById('sticky-cta-bar');
  if (stickyCtaBar) {
    const handleCtaScroll = () => {
      // Show after scrolling past the hero section (approx 80% of viewport height)
      if (window.scrollY > window.innerHeight * 0.8) {
        stickyCtaBar.classList.add('is-visible');
        stickyCtaBar.setAttribute('aria-hidden', 'false');
      } else {
        stickyCtaBar.classList.remove('is-visible');
        stickyCtaBar.setAttribute('aria-hidden', 'true');
      }
    };
    window.addEventListener('scroll', handleCtaScroll, { passive: true });
  }

});