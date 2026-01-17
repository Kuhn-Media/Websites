document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const body = document.body;

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('mobile-menu-open');
      mobileMenu.setAttribute('aria-hidden', isExpanded);
      body.style.overflow = isExpanded ? '' : 'hidden';
    });
  }

  // --- Sticky Header ---
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      let lastScrollY = window.scrollY;
      let isVisible = false;

      window.addEventListener('scroll', () => {
          const currentScrollY = window.scrollY;
          const shouldBeVisible = currentScrollY > 400;

          if (shouldBeVisible !== isVisible) {
              stickyCTA.classList.toggle('show', shouldBeVisible);
              stickyCTA.setAttribute('aria-hidden', !shouldBeVisible);
              isVisible = shouldBeVisible;
          }
          lastScrollY = currentScrollY;
      });
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger');

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.style.getPropertyValue('--stagger-delay')) || 0;
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, {
    rootMargin: '0px',
    threshold: 0.1
  });

  revealElements.forEach((el, index) => {
    if (el.classList.contains('reveal-stagger')) {
        const delay = (index % 3) * 150; // Stagger delay for grids
        el.style.transitionDelay = `${delay}ms`;
    }
    observer.observe(el);
  });

  const staggeredChildrenObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.split-content > *, .split-image');
        children.forEach((child, index) => {
          child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          child.style.transitionDelay = `${index * 100}ms`;
          child.style.opacity = '0';
          child.style.transform = 'translateY(20px)';
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, 50);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal-stagger-children').forEach(el => {
    staggeredChildrenObserver.observe(el);
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    // Check if cookie was already accepted
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.setAttribute('aria-hidden', 'false');
      cookieBanner.classList.add('show');
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      setTimeout(() => {
        cookieBanner.setAttribute('aria-hidden', 'true');
      }, 500);
    });
  }

  // --- Demo Contact Form ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Vielen Dank für Ihre Nachricht! Dies ist eine Demo, es wurde keine E-Mail gesendet.');
      contactForm.reset();
    });
  }

});