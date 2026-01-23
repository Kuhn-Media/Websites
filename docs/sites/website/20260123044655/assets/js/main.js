document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
  }

  // --- Scroll Reveal Animations ---
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
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
    revealObserver.observe(item);
  });

  // --- Before/After Slider ---
  const sliders = document.querySelectorAll('.before-after-slider');
  sliders.forEach(slider => {
    const input = slider.querySelector('.ba-slider');
    const afterImage = slider.querySelector('.ba-after-img');
    if (input && afterImage) {
      input.addEventListener('input', (e) => {
        afterImage.style.clipPath = `inset(0 0 0 ${e.target.value}%)`;
      });
    }
  });

  // --- Lightbox Gallery ---
  const lightbox = document.getElementById('lightbox');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  const galleryItems = Array.from(lightboxTriggers);
  let currentIndex = 0;

  if (lightbox && lightboxTriggers.length > 0) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    const showImage = (index) => {
      const item = galleryItems[index];
      const imgSrc = item.getAttribute('href');
      const imgAlt = item.querySelector('img').getAttribute('alt');
      lightboxImage.setAttribute('src', imgSrc);
      lightboxImage.setAttribute('alt', imgAlt);
      currentIndex = index;
    };

    const openLightbox = (e, index) => {
      e.preventDefault();
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      showImage(index);
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    const showPrev = () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
      showImage(currentIndex);
    };

    const showNext = () => {
      currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
      showImage(currentIndex);
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => openLightbox(e, index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (cookieBanner && acceptBtn && rejectBtn) {
    const cookieConsent = localStorage.getItem('cookie_consent');
    if (!cookieConsent) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('visible'), 100);
    }

    const handleConsent = (consentValue) => {
        localStorage.setItem('cookie_consent', consentValue);
        cookieBanner.classList.remove('visible');
        setTimeout(() => cookieBanner.hidden = true, 500);
    }

    acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    rejectBtn.addEventListener('click', () => handleConsent('rejected'));
  }

});