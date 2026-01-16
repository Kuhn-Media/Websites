document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
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

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('main-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('nav-open');
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
      }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
        }
    });
  }

  // --- Scroll Animations ---
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger-group > *');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.closest('.reveal-stagger-group') ? index * 100 : 0;
        setTimeout(() => {
            el.classList.add('is-visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // --- Testimonial Slider ---
  const slider = document.getElementById('testimonial-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentIndex = 0;

    const goToSlide = (index) => {
      slider.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
      updateDots();
    };

    const updateDots = () => {
      document.querySelectorAll('.slider-dots .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => goToSlide((currentIndex - 1 + slides.length) % slides.length));
    nextBtn.addEventListener('click', () => goToSlide((currentIndex + 1) % slides.length));

    goToSlide(0);
  }

  // --- Magnetic Button ---
  const magneticLinks = document.querySelectorAll('.magnetic-link');
  magneticLinks.forEach(link => {
    const strength = 30;
    link.addEventListener('mousemove', e => {
      const { left, top, width, height } = link.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * 0.5;
      const y = (e.clientY - top - height / 2) * 0.5;
      link.style.transform = `translate(${x}px, ${y}px)`;
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translate(0, 0)';
    });
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.hidden = false;
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.hidden = true;
    });
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.hidden = true;
    });
  }

  // --- Back to Top & Sticky CTA ---
  const backToTopBtn = document.getElementById('back-to-top');
  const stickyCta = document.getElementById('sticky-cta');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.hidden = false;
        backToTopBtn.classList.add('visible');
        if(stickyCta) stickyCta.hidden = true;
      } else {
        backToTopBtn.hidden = true;
        backToTopBtn.classList.remove('visible');
        if(stickyCta) stickyCta.hidden = false;
      }
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (stickyCta) {
      setTimeout(() => {
          if(window.scrollY < 300) stickyCta.hidden = false;
      }, 2000);
  }

  // --- Contact Form URL Params ---
  const urlParams = new URLSearchParams(window.location.search);
  const subjectParam = urlParams.get('subject') || urlParams.get('service');
  if (subjectParam) {
      const subjectField = document.getElementById('subject');
      if(subjectField) {
          subjectField.value = subjectParam.charAt(0).toUpperCase() + subjectParam.slice(1).replace('-', ' ');
      }
  }
});