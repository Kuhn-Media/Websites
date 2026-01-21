document.addEventListener('DOMContentLoaded', function() {

  // --- Reduced Motion Check ---
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches === true;

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-scrolled', !entry.isIntersecting);
    }, { rootMargin: '200px 0px 0px 0px' });
    scrollObserver.observe(document.body);

    // Set header height for scroll margin
    const setHeaderHeight = () => {
      const headerHeight = header.offsetHeight;
      document.documentElement.style.setProperty('--header-h', `${headerHeight}px`);
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
  }

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavContainer = document.querySelector('.mobile-nav-container');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (mobileNavToggle && mobileNavContainer) {
    const openMenu = () => {
      mobileNavContainer.classList.add('is-open');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileNavContainer.classList.remove('is-open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    mobileNavToggle.addEventListener('click', openMenu);
    mobileNavClose.addEventListener('click', closeMenu);
    mobileNavContainer.querySelector('.mobile-nav-backdrop').addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavContainer.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- Scroll Reveal Animation ---
  if (!isReduced) {
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  } else {
      document.querySelectorAll('.reveal-item').forEach(item => item.classList.add('is-visible'));
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
    });
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

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    updateCarousel();
  }

  // --- Cookie Banner ---
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

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver(([entry]) => {
          // Show when the hero section is NOT intersecting (i.e., scrolled past it)
          if (!entry.isIntersecting) {
              stickyCTA.hidden = false;
              setTimeout(() => stickyCTA.classList.add('is-visible'), 10);
          } else {
              stickyCTA.classList.remove('is-visible');
              setTimeout(() => stickyCTA.hidden = true, 400);
          }
      }, { rootMargin: '-200px 0px 0px 0px' });

      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});