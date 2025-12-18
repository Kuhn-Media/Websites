document.documentElement.classList.add('js');

// 1. Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger effect
      setTimeout(() => {
        entry.target.classList.add('active');
      }, index * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// 2. Sticky Header
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// 3. Mobile Menu
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });
}

// 4. Cookie Banner
const cookieBanner = document.getElementById('cookieBanner');
if (cookieBanner && !localStorage.getItem('cookieConsent')) {
  setTimeout(() => {
    cookieBanner.classList.add('active');
  }, 2000);
}

window.acceptCookies = function(type) {
  localStorage.setItem('cookieConsent', type);
  cookieBanner.classList.remove('active');
};

// 5. Gallery Lightbox (Simple)
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length > 0) {
  const lightbox = document.createElement('div');
  lightbox.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 3000;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none; transition: opacity 0.3s;
  `;
  lightbox.innerHTML = '<img src="" style="max-width:90%; max-height:90%; border-radius:8px;">';
  document.body.appendChild(lightbox);

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightbox.querySelector('img').src = img.src;
      lightbox.style.opacity = '1';
      lightbox.style.pointerEvents = 'all';
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.style.opacity = '0';
    lightbox.style.pointerEvents = 'none';
  });
}