'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // Mobile Navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('is-open');
      navMenu.classList.toggle('is-open');
      document.body.style.overflow = navMenu.classList.contains('is-open') ? 'hidden' : '';
    });
  }

  // Sticky Header
  const header = document.querySelector('.site-header');
  if (header) {
    const observer = new IntersectionObserver(([e]) => e.target.classList.toggle('is-scrolled', e.intersectionRatio < 1), { threshold: [1] });
    observer.observe(header);
  }

  // Scroll Animations
  const animatedElements = document.querySelectorAll('.animate-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookiesBtn) {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }
    acceptCookiesBtn.addEventListener('click', () => {
      cookieBanner.classList.remove('show');
      localStorage.setItem('cookiesAccepted', 'true');
    });
  }

  // Sticky CTA
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        stickyCta.classList.add('show');
      } else {
        stickyCta.classList.remove('show');
      }
    });
  }

  // Testimonial Carousel
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function createDots() {
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

    if (slides.length > 0) {
      createDots();
      updateCarousel();
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
    
    // Swipe functionality
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextBtn.click();
        if (touchendX > touchstartX) prevBtn.click();
    });
  }

});