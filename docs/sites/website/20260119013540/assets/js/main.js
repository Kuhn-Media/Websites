document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.contains('open');
    if (isOpen) {
        mainNav.classList.add('closing');
        mainNav.addEventListener('animationend', () => {
            mainNav.classList.remove('open', 'closing');
        }, { once: true });
    } else {
        mainNav.classList.add('open');
    }
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', !isOpen);
  });

  // --- Scroll Reveal Animation ---
  const revealItems = document.querySelectorAll('.reveal-item');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.revealDelay) || 0;
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    observer.observe(item);
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.hidden = false;
        cookieBanner.classList.add('visible');
    }, 1000);
  }

  const handleConsent = (consent) => {
    localStorage.setItem('cookieConsent', consent);
    cookieBanner.classList.remove('visible');
    setTimeout(() => { cookieBanner.hidden = true; }, 500);
  };

  if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
  if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

  // --- Lightbox --- 
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
  let currentIndex = 0;

  if (lightbox && galleryItems.length > 0) {
      const lightboxImg = lightbox.querySelector('img');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');

      const images = Array.from(galleryItems).map(item => item.href);

      function showImage(index) {
          if (index < 0 || index >= images.length) return;
          currentIndex = index;
          lightboxImg.src = images[currentIndex];
          lightbox.style.display = 'flex';
          document.body.style.overflow = 'hidden';
      }

      function hideLightbox() {
          lightbox.style.display = 'none';
          document.body.style.overflow = 'auto';
      }

      galleryItems.forEach((item, index) => {
          item.addEventListener('click', (e) => {
              e.preventDefault();
              showImage(index);
          });
      });

      closeBtn.addEventListener('click', hideLightbox);
      prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
      nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

      lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) hideLightbox();
      });

      document.addEventListener('keydown', (e) => {
          if (lightbox.style.display === 'flex') {
              if (e.key === 'Escape') hideLightbox();
              if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
              if (e.key === 'ArrowRight') showImage(currentIndex + 1);
          }
      });
  }

});