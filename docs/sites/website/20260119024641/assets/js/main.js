document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
      const isOpen = navMenu.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Sticky Header
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

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-stagger')) {
            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, index * 90); // Stagger delay
        }
        else {
            entry.target.classList.add('is-visible');
        }
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
    }, 1500);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.style.display = 'none';
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.style.display = 'none';
    });
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      let lastScrollY = window.scrollY;
      let heroHeight = document.querySelector('.hero')?.offsetHeight || 500;

      window.addEventListener('scroll', () => {
          if (window.scrollY > heroHeight && window.scrollY > lastScrollY) {
              stickyCTA.classList.add('visible');
          } else if (window.scrollY < heroHeight || window.scrollY < lastScrollY) {
              stickyCTA.classList.remove('visible');
          }
          lastScrollY = window.scrollY;
      }, { passive: true });
  }

});