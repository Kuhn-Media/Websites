document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // Sticky Header
  const header = document.querySelector('.site-header');
  if (header) {
    const headerObserver = new IntersectionObserver(([entry]) => {
        // A bit of a hack to use the observer. We just care about scroll position.
    }, { threshold: [1] });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${index * 100}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // Accordion (FAQ)
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (header && content) {
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', !isExpanded);
        content.hidden = isExpanded;
      });
    }
  });

  // Testimonial Carousel
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
        if (!dotsContainer) return;
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

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    updateDots();
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    setTimeout(() => {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }
    }, 1000);

    cookieAcceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.hidden = true;
    });
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  const heroSection = document.querySelector('.hero');
  if (stickyCTA && heroSection) {
      const ctaObserver = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) {
              stickyCTA.hidden = false;
              setTimeout(() => stickyCTA.classList.add('visible'), 10);
          } else {
              stickyCTA.classList.remove('visible');
              setTimeout(() => stickyCTA.hidden = true, 300);
          }
      }, { threshold: 0.1 });
      ctaObserver.observe(heroSection);
  }

});