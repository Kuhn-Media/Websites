document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navList = document.querySelector('.nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navList.classList.toggle('open');
      document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : '';
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
    }

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });

    // Swipe functionality
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextButton.click();
        if (touchendX > touchstartX) prevButton.click();
    }, { passive: true });

    updateCarousel();
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.hidden = false;
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.hidden = true;
    });
  }

  if (declineButton) {
    declineButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.hidden = true;
    });
  }

  // --- Sticky CTA Bar --- //
  const stickyBar = document.getElementById('sticky-cta-bar');
  if (stickyBar) {
      let lastScrollY = window.scrollY;
      window.addEventListener('scroll', () => {
          if (window.scrollY > 300 && window.scrollY > lastScrollY) {
              stickyBar.classList.add('visible');
          } else if (window.scrollY < lastScrollY) {
              stickyBar.classList.remove('visible');
          }
          lastScrollY = window.scrollY;
      });
  }

});