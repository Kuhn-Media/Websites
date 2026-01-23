document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    const scrollHandler = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler(); // Initial check
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // --- Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.classList.contains('reveal-stagger')) {
            el.style.transitionDelay = `${index * 100}ms`;
          }
          el.classList.add('visible');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- FAQ Accordion --- //
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

  // --- Testimonials Carousel --- //
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let intervalId;

    const goToSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });

    const startInterval = () => {
      intervalId = setInterval(() => goToSlide(currentIndex + 1), 5000);
    };

    const resetInterval = () => {
      clearInterval(intervalId);
      startInterval();
    };

    prevButton.addEventListener('click', () => { goToSlide(currentIndex - 1); resetInterval(); });
    nextButton.addEventListener('click', () => { goToSlide(currentIndex + 1); resetInterval(); });

    goToSlide(0);
    startInterval();
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when the hero section is NOT intersecting (i.e., scrolled past it)
        stickyCTA.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      ctaObserver.observe(heroSection);
    }
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');

  if (cookieBanner && acceptButton) {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (cookieAccepted) {
      cookieBanner.classList.add('hidden');
    } else {
      cookieBanner.classList.remove('hidden');
    }

    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.classList.add('hidden');
    });
  }

});