document.addEventListener('DOMContentLoaded', () => {

  // Sticky Header
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

  // Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav-drawer');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Staggered items
        const staggerItems = entry.target.querySelectorAll('.stagger-item');
        if (staggerItems.length > 0) {
            staggerItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 120}ms`;
            });
        }
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
    });
  });

  // Testimonial Carousel
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    updateCarousel();
  }

  // Sticky CTA
  const stickyCTA = document.querySelector('.sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting
        stickyCTA.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) ctaObserver.observe(heroSection);
  }

  // Cookie Banner
  const cookieBanner = document.querySelector('.cookie-banner');
  const acceptButton = document.querySelector('.cookie-accept');
  const declineButton = document.querySelector('.cookie-decline');

  if (cookieBanner && acceptButton && declineButton) {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('visible'), 100);
    }

    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });

    declineButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });
  }

});