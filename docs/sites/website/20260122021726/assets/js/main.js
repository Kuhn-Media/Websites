document.addEventListener('DOMContentLoaded', () => {

  // --- Swiper Carousel for Testimonials ---
  // We need to add the script tag in the HTML if we want to use it.
  // For now, this code is ready but will only work if Swiper is loaded.
  const initSwiper = () => {
    if (typeof Swiper !== 'undefined' && document.querySelector('.swiper-container')) {
      new Swiper('.swiper-container', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      });
    }
  };

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
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

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const navBackdrop = document.querySelector('.mobile-nav-backdrop');
  const navClose = document.querySelector('.mobile-nav-close');

  const openMenu = () => {
    navDrawer.classList.add('is-open');
    navDrawer.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    navBackdrop.classList.add('is-open');
    document.body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    navDrawer.classList.remove('is-open');
    navDrawer.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    navBackdrop.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', openMenu);
    navClose.addEventListener('click', closeMenu);
    navBackdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
        closeMenu();
      }
    });
    navDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 100}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('is-visible');
        cookieBanner.setAttribute('aria-hidden', 'false');
    }, 1000);
  }

  const handleConsent = (consent) => {
    localStorage.setItem('cookieConsent', consent);
    cookieBanner.classList.remove('is-visible');
    cookieBanner.setAttribute('aria-hidden', 'true');
  };

  if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
  if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

  // --- Sticky CTA Bar ---
  const stickyBar = document.getElementById('sticky-cta-bar');
  if (stickyBar) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (!entry.isIntersecting) {
                  stickyBar.classList.add('is-visible');
              } else {
                  stickyBar.classList.remove('is-visible');
              }
          });
      }, { rootMargin: '0px 0px -100% 0px' });

      const heroSection = document.querySelector('.hero, .page-hero');
      if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- Magnetic CTA Effect ---
  const magneticElements = document.querySelectorAll('.magnetic-cta');
  const isMotionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isMotionReduced) {
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            el.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
  }

  // --- Load Swiper dynamically ---
  const loadScript = (url, callback) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onload = callback;
      document.head.appendChild(script);
  };

  if (document.querySelector('.swiper-container')) {
      loadScript('https://unpkg.com/swiper@8/swiper-bundle.min.js', initSwiper);
  }

});