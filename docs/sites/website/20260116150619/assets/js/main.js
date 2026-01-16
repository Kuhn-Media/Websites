document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '50px 0px 0px 0px', threshold: 1 });
    // Create a dummy element to observe
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    document.body.prepend(sentinel);
    headerObserver.observe(sentinel);
  }

  // --- 2. Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainMenu = document.getElementById('main-menu');
  if (navToggle && mainMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');

      if (!document.querySelector('.nav-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => closeNav());
      }
    });

    const closeNav = () => {
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        closeNav();
      }
    });
  }

  // --- 3. Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-stagger')) {
            entry.target.style.transitionDelay = `${index * 100}ms`;
          }
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- 4. Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
      currentIndex = index;
      updateControls();
    };

    const updateControls = () => {
      // Dots
      dotsContainer.querySelectorAll('button').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
      // Buttons
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slides.length - 1;
    };

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Gehe zu Bewertung ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Update on scroll
    carousel.addEventListener('scroll', () => {
      const newIndex = Math.round(carousel.scrollLeft / slides[0].offsetWidth);
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateControls();
      }
    });

    goToSlide(0); // Initial setup
  }

  // --- 5. FAQ Accordion --- //
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
    });
  });

  // --- 6. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  if (cookieBanner && acceptButton) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    } else {
      cookieBanner.hidden = true;
    }
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // --- 7. Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver(([entry]) => {
          // Show when the hero section is NOT intersecting (i.e., scrolled past it)
          stickyCTA.classList.toggle('visible', !entry.isIntersecting);
      }, { rootMargin: '-200px 0px 0px 0px' });

      const heroSection = document.querySelector('.hero, .hero-subpage');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});