document.addEventListener('DOMContentLoaded', function() {

  // --- STICKY HEADER ---
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '10px 0px 0px 0px' });
    
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    document.body.prepend(sentinel);
    scrollObserver.observe(sentinel);
  }

  // --- MOBILE NAVIGATION ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav .nav-list');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('is-active');
      navToggle.classList.toggle('is-active');
      document.body.classList.toggle('nav-open');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // --- TESTIMONIAL CAROUSEL ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.childNodes.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function createDots() {
      if (!dotsContainer) return;
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
      });
    }

    createDots();
    updateCarousel();
  }

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.hidden = false;
    setTimeout(() => cookieBanner.classList.add('visible'), 100);
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (declineButton) {
    declineButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- STICKY CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver(([entry]) => {
      stickyCta.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0 });
    const heroSection = document.querySelector('.hero');
    if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- MAGNETIC BUTTON ---
  const magneticButton = document.querySelector('.magnetic-button');
  if (magneticButton && window.matchMedia('(pointer: fine)').matches) {
    magneticButton.addEventListener('mousemove', (e) => {
      const { offsetX, offsetY, target } = e;
      const { clientWidth, clientHeight } = target;
      const x = (offsetX / clientWidth - 0.5) * 30;
      const y = (offsetY / clientHeight - 0.5) * 30;
      target.style.transform = `translate(${x}px, ${y}px)`;
    });
    magneticButton.addEventListener('mouseleave', () => {
      magneticButton.style.transform = 'translate(0, 0)';
    });
  }

  // --- PARALLAX BACKGROUND ---
  const parallaxBg = document.querySelector('.parallax-bg-image');
  if (parallaxBg) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      const elementPosition = parallaxBg.parentElement.offsetTop;
      if (scrollPosition > elementPosition - window.innerHeight && scrollPosition < elementPosition + parallaxBg.parentElement.offsetHeight) {
        const yPos = (scrollPosition - elementPosition) * 0.3;
        parallaxBg.style.backgroundPosition = `center ${yPos}px`;
      }
    });
  }

});