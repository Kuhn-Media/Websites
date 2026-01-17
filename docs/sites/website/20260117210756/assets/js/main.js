document.addEventListener('DOMContentLoaded', function() {

  // Sticky Header
  const header = document.querySelector('.sticky-header');
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
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const navOverlay = document.querySelector('.nav-overlay');
  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navDrawer.classList.toggle('open');
      navOverlay.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navOverlay.addEventListener('click', () => {
        navToggle.click();
    });
  }

  // FAQ Accordion
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

  // Testimonial Carousel
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-controls .next');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const dotsContainer = document.querySelector('.carousel-controls .dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (index === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    updateCarousel();
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-stagger')) {
            entry.target.style.transitionDelay = `${index * 100}ms`;
        }
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }
  
  // Sticky CTA Bar
  const stickyCta = document.getElementById('sticky-cta-bar');
  if (stickyCta) {
      const showCtaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when the hero section is NOT intersecting (scrolled past it)
              if (!entry.isIntersecting) {
                  stickyCta.classList.add('show');
              } else {
                  stickyCta.classList.remove('show');
              }
          });
      }, { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' });

      const heroSection = document.querySelector('.hero, .hero-subpage');
      if (heroSection) {
          showCtaObserver.observe(heroSection);
      }
  }

});