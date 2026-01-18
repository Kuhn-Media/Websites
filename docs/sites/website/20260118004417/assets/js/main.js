document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const body = document.body;

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isOpen);
      mobileNavToggle.classList.toggle('active');
      mobileNavDrawer.classList.toggle('open');
      mobileNavOverlay.classList.toggle('active');
      body.style.overflow = isOpen ? '' : 'hidden';
    });

    const closeNav = () => {
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNavToggle.classList.remove('active');
      mobileNavDrawer.classList.remove('open');
      mobileNavOverlay.classList.remove('active');
      body.style.overflow = '';
    };

    mobileNavOverlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
        closeNav();
      }
    });
  }

  // --- Sticky Header --- //
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

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${index * 100}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-controls .next');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const dotsNav = document.querySelector('.carousel-controls .dots');
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(i));
      dotsNav.appendChild(dot);
    });
    const dots = Array.from(dotsNav.children);

    const moveToSlide = (index) => {
      carousel.style.transform = 'translateX(-' + index * 100 + '%)';
      dots[currentIndex].classList.remove('active');
      dots[index].classList.add('active');
      currentIndex = index;
    };

    nextButton.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      moveToSlide(nextIndex);
    });

    prevButton.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      moveToSlide(prevIndex);
    });

    // Touch/Swipe support
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextButton.click();
        if (touchendX > touchstartX) prevButton.click();
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1000);
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineButton) {
    declineButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Sticky CTA Bar --- //
  const stickyBar = document.getElementById('sticky-cta-bar');
  if (stickyBar) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show bar if footer is NOT visible
              if (!entry.isIntersecting && window.scrollY > 300) {
                  stickyBar.classList.add('visible');
              } else {
                  stickyBar.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });

      const footer = document.querySelector('.site-footer');
      if (footer) {
          ctaObserver.observe(footer);
      }
  }

});