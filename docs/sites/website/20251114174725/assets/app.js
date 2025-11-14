document.addEventListener('DOMContentLoaded', () => {

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Close mobile nav when a link is clicked
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (document.body.classList.contains('nav-open')) {
              document.body.classList.remove('nav-open');
              navToggle.setAttribute('aria-expanded', 'false');
          }
      });
  });

  // Intersection Observer for scroll animations
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    animatedElements.forEach(el => {
        el.classList.add('is-visible');
    });
  }

});