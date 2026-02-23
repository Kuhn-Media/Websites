document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const body = document.body;

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      body.classList.toggle('nav-open');
      const isExpanded = body.classList.contains('nav-open');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close nav on overlay click
    body.addEventListener('click', (e) => {
        if (body.classList.contains('nav-open') && e.target === body) {
            body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
  }

  // 2. Sticky Header
  const header = document.getElementById('site-header');
  if (header) {
    const scrollObserver = new IntersectionObserver(([entry]) => {
        // A dummy element at the top of the page to observe
    }, { rootMargin: '-150px 0px 0px 0px' });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    });
  }

  // 3. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    let staggerIndex = 0;
    revealElements.forEach(el => {
        // Apply stagger to elements in a list-like structure
        if (el.parentElement.classList.contains('grid-3') || el.parentElement.classList.contains('services-grid') || el.parentElement.classList.contains('process-steps') || el.parentElement.classList.contains('usp-list')) {
            el.style.transitionDelay = `${staggerIndex * 150}ms`;
            staggerIndex++;
        }
        if(el.parentElement.classList.contains('section-intro')) staggerIndex = 0; // reset for next section

        revealObserver.observe(el);
    });
  }

  // 4. Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && acceptButton && declineButton) {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      cookieBanner.hidden = false;
    }

    const handleConsent = (consentValue) => {
        localStorage.setItem('cookieConsent', consentValue);
        cookieBanner.style.display = 'none'; // Use style for fade-out later
    }

    acceptButton.addEventListener('click', () => handleConsent('accepted'));
    declineButton.addEventListener('click', () => handleConsent('declined'));
  }

  // 5. Sticky Contextual CTA
  const contextCta = document.getElementById('context-cta');
  if(contextCta) {
      window.addEventListener('scroll', () => {
          if(window.scrollY > window.innerHeight * 0.8) {
              contextCta.hidden = false;
              contextCta.classList.add('is-visible');
          } else {
              contextCta.classList.remove('is-visible');
          }
      }, { passive: true });
  }

  // 6. Smooth scroll for anchor links
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