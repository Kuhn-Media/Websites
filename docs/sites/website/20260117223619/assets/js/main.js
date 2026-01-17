document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    }
  });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-stagger-group');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-stagger-group')) {
          const children = entry.target.children;
          for (let i = 0; i < children.length; i++) {
            children[i].style.transitionDelay = (i * 100) + 'ms';
            children[i].classList.add('is-visible');
          }
        } else {
          entry.target.classList.add('is-visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieAccepted')) {
      cookieBanner.classList.add('show');
    }
    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > window.innerHeight * 0.5) {
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
      });
  }

  // --- Contact Form Logic ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
      const urlParams = new URLSearchParams(window.location.search);
      const anliegen = urlParams.get('anliegen');
      const subjectSelect = contactForm.querySelector('#subject');
      if (anliegen && subjectSelect) {
          if (anliegen === 'beratung') {
              subjectSelect.value = 'Beratung für Hausbesitzer';
          } else if (anliegen === 'partner') {
              subjectSelect.value = 'Anfrage als Fachpartner';
          }
      }

      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          // Placeholder for form submission logic
          alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
          contactForm.reset();
      });
  }

});