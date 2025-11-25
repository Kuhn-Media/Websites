// JS code
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer für Scroll-Animationen
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    }
  );

  document.querySelectorAll('[data-fade]').forEach(el => {
    observer.observe(el);
  });

  // Mobile Nav Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMain = document.querySelector('.nav-main');

  if (navToggle && navMain) {
    navToggle.addEventListener('click', () => {
      // This is a placeholder for a real implementation. 
      // For now, we'll just log to console.
      console.log('Mobile nav toggled. Implement visibility logic here.');
      // Example: navMain.classList.toggle('is-open');
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      
      e.preventDefault();
      try {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } catch (error) {
        console.error('Could not find element for smooth scroll:', href);
      }
    });
  });

  // Jahr im Footer
  const yearEl = document.getElementById('year');
  if(yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});