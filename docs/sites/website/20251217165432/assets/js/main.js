document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation
  const toggle = document.querySelector('.mobile-toggle');
  const header = document.querySelector('.site-header');
  
  if (toggle && header) {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      header.classList.toggle('mobile-nav-open');
    });
  }

  // Sticky Header Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        header.classList.remove('mobile-nav-open');
        if(toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Simple Fade-in Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section, .hero, .card').forEach(el => {
    el.classList.add('fade-in-up'); // Add class via JS to ensure visibility if JS fails
    observer.observe(el);
  });
});
