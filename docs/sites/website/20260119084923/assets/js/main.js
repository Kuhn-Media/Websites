document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
  }

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.querySelector('.mobile-nav-menu');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

  if (mobileNavToggle && mobileNavMenu) {
    const openMenu = () => {
      mobileNavMenu.classList.add('is-open');
      mobileNavMenu.setAttribute('aria-hidden', 'false');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileNavMenu.classList.remove('is-open');
      mobileNavMenu.setAttribute('aria-hidden', 'true');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    mobileNavToggle.addEventListener('click', openMenu);
    mobileNavClose.addEventListener('click', closeMenu);
    mobileNavOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        answer.hidden = isExpanded;
      });
    }
  });

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.scrollTo({
        left: slides[currentIndex].offsetLeft,
        behavior: 'smooth'
      });
      updateDots();
    };

    const updateDots = () => {
      if (!dotsContainer) return;
      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
      });
    }

    updateDots();
  }

  // --- Scroll Animations ---
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right, .reveal-stagger');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // --- Sticky CTA ---
  const stickyCTA = document.querySelector('.sticky-cta');
  if (stickyCTA) {
    const heroSection = document.querySelector('.hero');
    const footer = document.querySelector('.site-footer-main');
    
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting
        if (entry.target === heroSection && !entry.isIntersecting) {
          stickyCTA.classList.add('is-visible');
        }
        if (entry.target === heroSection && entry.isIntersecting) {
          stickyCTA.classList.remove('is-visible');
        }
        // Hide when footer IS intersecting
        if (entry.target === footer && entry.isIntersecting) {
          stickyCTA.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1 });

    if (heroSection) ctaObserver.observe(heroSection);
    if (footer) ctaObserver.observe(footer);
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('accept-cookies');
  const declineButton = document.getElementById('decline-cookies');

  if (cookieBanner && acceptButton && declineButton) {
    const cookieConsent = localStorage.getItem('cookie_consent');
    if (!cookieConsent) {
      cookieBanner.setAttribute('aria-hidden', 'false');
    } else {
      cookieBanner.remove();
    }

    const handleConsent = () => {
      localStorage.setItem('cookie_consent', 'true');
      cookieBanner.setAttribute('aria-hidden', 'true');
      setTimeout(() => cookieBanner.remove(), 500);
    };

    acceptButton.addEventListener('click', handleConsent);
    declineButton.addEventListener('click', handleConsent);
  }
});