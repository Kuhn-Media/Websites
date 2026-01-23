document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
  }

  // Sticky Header
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
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
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('show'), 100);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });
  }

  // Back to Top Button
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    const handleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTopButton.hidden = false;
        setTimeout(() => backToTopButton.classList.add('show'), 10);
      } else {
        backToTopButton.classList.remove('show');
        setTimeout(() => backToTopButton.hidden = true, 300);
      }
    };

    window.addEventListener('scroll', handleBackToTop, { passive: true });
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});