document.addEventListener('DOMContentLoaded', () => {

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      mainNav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
  }

  // Intersection Observer for animations
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, delay * 100); // delay in ms
        observer.unobserve(entry.target);
      }
    });
  }, { 
    rootMargin: '0px 0px -10% 0px'
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });

});