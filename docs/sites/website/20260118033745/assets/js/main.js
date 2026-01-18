document.addEventListener('DOMContentLoaded', function() {

  // --- STICKY HEADER ---
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

  // --- MOBILE NAVIGATION ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100); // Staggered delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- TESTIMONIAL SLIDER ---
  const sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach(slider => {
    const slides = slider.querySelector('[data-slides]');
    const prevBtn = slider.parentElement.querySelector('[data-prev]');
    const nextBtn = slider.parentElement.querySelector('[data-next]');
    const dotsContainer = slider.parentElement.querySelector('[data-dots]');
    let currentIndex = 0;

    if (!slides || slides.children.length === 0) return;

    const items = Array.from(slides.children);
    const totalItems = items.length;

    function updateSlider() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      Array.from(dotsContainer.children).forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function createDots() {
      if (!dotsContainer) return;
      for (let i = 0; i < totalItems; i++) {
        const button = document.createElement('button');
        button.addEventListener('click', () => {
          currentIndex = i;
          updateSlider();
        });
        dotsContainer.appendChild(button);
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateSlider();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateSlider();
      });
    }
    
    createDots();
    updateSlider();
  });

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1500);
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // --- STICKY CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show CTA when hero section is NOT intersecting (i.e., scrolled past it)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('show');
              } else {
                  stickyCTA.classList.remove('show');
              }
          });
      }, { threshold: 0.1 });

      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});