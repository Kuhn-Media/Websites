document.addEventListener('DOMContentLoaded', () => {

  // 1. INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
  const fadeElements = document.querySelectorAll('[data-fade]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeElements.forEach(el => observer.observe(el));

  // 2. SCROLL PROGRESS BAR
  const progressBar = document.querySelector('.km-progress-bar');
  const updateProgressBar = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    if (progressBar) {
      progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
    }
  };
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateProgressBar);
  });

  // 3. PARALLAX FOR HERO IMAGE
  const heroImg = document.querySelector('.km-hero__img');
  const heroSection = document.querySelector('.km-section--hero');
  const updateParallax = () => {
    if (!heroImg || !heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    const scrollY = window.scrollY;
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const speed = -0.2;
      const yPos = (rect.top * speed);
      heroImg.style.transform = `translateY(${yPos}px) scale(1.1)`;
    }
  };
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateParallax);
  });
  if (heroImg) heroImg.style.transform = 'scale(1.1)'; // Initial scale

  // 4. MOBILE NAVIGATION
  const navToggle = document.querySelector('.km-nav-toggle');
  const navMenu = document.querySelector('.km-nav');
  const navLinks = document.querySelectorAll('.km-nav a');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-active');
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-active');
      });
    });
  }

  // 5. SMOOTH SCROLL
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
         e.preventDefault();
         const targetElement = document.querySelector(href);
         const headerOffset = document.querySelector('.km-header')?.offsetHeight || 70;
         const elementPosition = targetElement.getBoundingClientRect().top;
         const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

         window.scrollTo({
           top: offsetPosition,
           behavior: 'smooth'
         });
      }
    });
  });

  // 6. CUSTOM CURSOR
  const cursor = document.querySelector('.km-cursor');
  const interactiveElements = document.querySelectorAll('a, button, summary, .km-card');

  if (window.matchMedia('(hover: hover)').matches && cursor) {
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });
  }

  // 7. YEAR IN FOOTER
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});