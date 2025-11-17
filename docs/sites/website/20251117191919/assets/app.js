document.addEventListener('DOMContentLoaded', function() {

  // 1. Sticky Header with 'scrolled' class
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollThreshold = 50;
    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      let href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return; // Ignore empty or single hash links

      let target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Close mobile nav if open
        if(navMenu && navMenu.classList.contains('is-open')) {
            navMenu.classList.remove('is-open');
        }
      }
    });
  });

  // 3. Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.main-nav');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
    });
  }

});