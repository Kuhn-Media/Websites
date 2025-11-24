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
    navMain.classList.toggle('is-open');
  });
  
  // Schließen bei Link-Click
  navMain.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMain.classList.remove('is-open');
    });
  });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Jahr im Footer
document.getElementById('year').textContent = new Date().getFullYear();
