document.addEventListener('DOMContentLoaded', function() {

  // Mobile Menu
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu-drawer');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Sticky Header
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

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 400) {
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
      });
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-stagger');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach((el, index) => {
      el.style.setProperty('--stagger-index', index);
      observer.observe(el);
    });
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // Carousel
  const carousel = document.getElementById('insights-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carousel.parentElement.querySelector('.next');
    const prevButton = carousel.parentElement.querySelector('.prev');
    const dotsNav = carousel.parentElement.querySelector('.carousel-dots');

    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const moveToSlide = (targetIndex) => {
      track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
      currentIndex = targetIndex;
      updateControls();
    };

    const updateControls = () => {
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === slides.length - 1;
      if (dotsNav) {
        Array.from(dotsNav.children).forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      }
    };

    if (dotsNav) {
      slides.forEach((_, index) => {
        const button = document.createElement('button');
        button.classList.add('carousel-dot');
        button.addEventListener('click', () => moveToSlide(index));
        dotsNav.appendChild(button);
      });
    }

    nextButton.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        moveToSlide(currentIndex + 1);
      }
    });

    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        moveToSlide(currentIndex - 1);
      }
    });

    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + newSlideWidth * currentIndex + 'px)';
    });

    updateControls();
  }

  // Basic form submission prevention for demo
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Vielen Dank für Ihre Nachricht! (Dies ist eine Demo)');
      contactForm.reset();
    });
  }

});