document.documentElement.classList.add('js');

// Scroll Reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger delay based on index if multiple elements appear at once
      setTimeout(() => {
        entry.target.classList.add('active');
      }, 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Sticky Header
const header = document.getElementById('header');
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

// Mobile Menu
const burger = document.getElementById('burger');
const nav = document.querySelector('.nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });
}

// Cookie Banner
const cookieBanner = document.getElementById('cookieBanner');

if (!localStorage.getItem('cookieConsent')) {
  setTimeout(() => {
    cookieBanner.classList.add('active');
  }, 2000);
}

window.acceptCookies = function() {
  localStorage.setItem('cookieConsent', 'all');
  cookieBanner.classList.remove('active');
};

window.acceptNecessary = function() {
  localStorage.setItem('cookieConsent', 'necessary');
  cookieBanner.classList.remove('active');
};

// Lightbox for Gallery
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length > 0) {
  const lightbox = document.createElement('div');
  lightbox.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000;
    display: flex; align-items: center; justify-content: center; opacity: 0;
    pointer-events: none; transition: opacity 0.3s;
  `;
  lightbox.innerHTML = '<img style="max-width: 90%; max-height: 90vh; border-radius: 8px;">';
  document.body.appendChild(lightbox);

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      lightbox.querySelector('img').src = src;
      lightbox.style.opacity = '1';
      lightbox.style.pointerEvents = 'all';
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.style.opacity = '0';
    lightbox.style.pointerEvents = 'none';
  });
}