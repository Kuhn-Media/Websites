document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavContainer = document.querySelector('.mobile-nav__container');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');

  const openMobileNav = () => {
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    mobileNavContainer.classList.add('is-open');
    mobileNavContainer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mobile-nav-open');
    mobileNav.querySelector('a').focus();
  };

  const closeMobileNav = () => {
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavContainer.classList.remove('is-open');
    mobileNavContainer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mobile-nav-open');
    mobileNavToggle.focus();
  };

  if (mobileNavToggle && mobileNavContainer) {
    mobileNavToggle.addEventListener('click', openMobileNav);
    mobileNavClose.addEventListener('click', closeMobileNav);
    mobileNavContainer.addEventListener('click', (e) => {
      if (e.target === mobileNavContainer) {
        closeMobileNav();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavContainer.classList.contains('is-open')) {
        closeMobileNav();
      }
    });
  }

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.display = 'grid'; // Make it visible for transition
      } 
    });
  });

  if (document.querySelector('[data-open-all]')) {
      faqItems.forEach(item => {
          const question = item.querySelector('.faq-question');
          question.setAttribute('aria-expanded', 'true');
      });
  }

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger effect
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // --- Smooth Scrolling for Anchor Links --- //
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
  });

});