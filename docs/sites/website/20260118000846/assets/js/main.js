document.addEventListener('DOMContentLoaded', function() {

  // --- STICKY HEADER --- //
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

  // --- MOBILE NAVIGATION --- //
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navMenu.classList.toggle('is-open');
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });
  }

  // --- SCROLL REVEAL ANIMATION --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100); // Staggered delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          answer.style.gridTemplateRows = '1fr';
        } else {
          answer.style.gridTemplateRows = '0fr';
        }
      });
    }
  });

  // --- COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const COOKIE_CONSENT_KEY = 'bw_haustechnik_cookie_consent';

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
      cookieBanner.hidden = false;
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
      cookieBanner.style.transform = 'translateY(200%)';
      setTimeout(() => {
        cookieBanner.hidden = true;
      }, 600);
    });
  }

  // --- STICKY CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show sticky CTA when hero is NOT intersecting (scrolled past it)
        if (!entry.isIntersecting && window.scrollY > 200) {
          stickyCta.hidden = false;
        } else {
          stickyCta.hidden = true;
        }
      });
    }, { threshold: 0 });

    const heroSection = document.querySelector('.hero');
    if(heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

});