document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.querySelector('.mobile-nav-menu');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (mobileNavToggle && mobileNavMenu && mobileNavClose) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavMenu.classList.add('is-open');
      mobileNavMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
      mobileNavMenu.classList.remove('is-open');
      mobileNavMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    mobileNavClose.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // Sticky Header
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieAccepted')) {
      cookieBanner.classList.add('is-visible');
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.classList.remove('is-visible');
    });
  }

});