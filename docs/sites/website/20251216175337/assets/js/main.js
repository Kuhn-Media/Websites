document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const toggle = document.querySelector('.mobile-toggle');
  const navList = document.querySelector('.nav-list');
  const body = document.body;

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      navList.style.display = isExpanded ? '' : 'flex';
      if (!isExpanded) {
        navList.style.flexDirection = 'column';
        navList.style.position = 'fixed';
        navList.style.top = '80px';
        navList.style.left = '0';
        navList.style.width = '100%';
        navList.style.height = 'calc(100vh - 80px)';
        navList.style.background = '#f9f8f6';
        navList.style.padding = '2rem';
        navList.style.zIndex = '999';
        body.classList.add('mobile-menu-open');
      } else {
        navList.style = '';
        body.classList.remove('mobile-menu-open');
      }
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    if (!header) return;
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100 && currentScroll > lastScroll) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }
    lastScroll = currentScroll;
  });

  // Scroll Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .bento-card, .hero__content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add class for CSS transition
  const style = document.createElement('style');
  style.innerHTML = `
    .is-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
});