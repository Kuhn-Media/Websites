document.addEventListener('DOMContentLoaded', () => {

  // Mobile Navigation
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mainNavList = document.getElementById('main-nav-list');
  const iconOpen = document.querySelector('.icon-open');
  const iconClose = document.querySelector('.icon-close');

  if (mobileNavToggle && mainNavList) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mainNavList.classList.toggle('open');
      document.body.classList.toggle('nav-open');
      iconOpen.style.display = isExpanded ? 'block' : 'none';
      iconClose.style.display = isExpanded ? 'none' : 'block';
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
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.style.display = 'flex';
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // Sticky CTA
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const handleCtaScroll = () => {
        // Show after scrolling down 1 viewport height
        if (window.scrollY > window.innerHeight * 0.8) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', handleCtaScroll, { passive: true });
  }

});