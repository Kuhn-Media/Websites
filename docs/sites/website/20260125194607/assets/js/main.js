document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  const body = document.body;

  if (mobileNavToggle && mobileNavMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileNavToggle.classList.toggle('is-active');
      mobileNavToggle.setAttribute('aria-expanded', isOpen);
      mobileNavMenu.classList.toggle('is-open');
      mobileNavMenu.setAttribute('aria-hidden', !isOpen);
      body.classList.toggle('no-scroll', isOpen);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavToggle.classList.contains('is-active')) {
        mobileNavToggle.click();
      }
    });
  }

  // --- Sticky Header --- //
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // --- Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || '0';
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    // Check if cookie was already accepted
    if (!localStorage.getItem('khsUlmCookieAccepted')) {
      cookieBanner.classList.add('show');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('khsUlmCookieAccepted', 'true');
      cookieBanner.classList.remove('show');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

});