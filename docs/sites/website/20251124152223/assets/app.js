// Intersection Observer for Scroll-Animationen
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
    navToggle.classList.toggle('is-active');
  });
  
  // Schließen bei Link-Click
  navMain.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMain.classList.remove('is-open');
      navToggle.classList.remove('is-active');
    });
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
      // Ignore invalid selectors like in href="#impressum"
      console.warn('Could not find element for smooth scroll:', href);
    }
  });
});

// Jahr im Footer
const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}