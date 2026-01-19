document.addEventListener('DOMContentLoaded', function() {

  // --- STICKY HEADER --- //
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- MOBILE NAVIGATION --- //
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpened = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isOpened);
      menuToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
      mainNav.classList.toggle('active');
      document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });
  }

  // --- SCROLL REVEAL ANIMATIONS --- //
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.classList.contains('reveal-stagger') ? index * 100 : 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- IMAGE COMPARISON SLIDER --- //
  function initCompSlider() {
    const containers = document.querySelectorAll('.img-comp-container');
    containers.forEach(container => {
      const overlay = container.querySelector('.img-comp-overlay');
      let clicked = 0;

      function slide(x) {
        overlay.style.width = x + 'px';
        const slider = container.querySelector('.img-comp-slider');
        if (slider) slider.style.left = (overlay.offsetWidth - (slider.offsetWidth / 2)) + 'px';
      }

      function slideReady(e) {
        e.preventDefault();
        clicked = 1;
        window.addEventListener('mousemove', slideMove);
        window.addEventListener('touchmove', slideMove);
      }

      function slideFinish() {
        clicked = 0;
      }

      function slideMove(e) {
        if (clicked == 0) return false;
        let pos = getCursorPos(e);
        if (pos < 0) pos = 0;
        if (pos > container.offsetWidth) pos = container.offsetWidth;
        slide(pos);
      }

      function getCursorPos(e) {
        e = (e.changedTouches) ? e.changedTouches[0] : e;
        const a = container.getBoundingClientRect();
        let x = e.pageX - a.left;
        x = x - window.pageXOffset;
        return x;
      }

      overlay.addEventListener('mousedown', slideReady);
      window.addEventListener('mouseup', slideFinish);
      overlay.addEventListener('touchstart', slideReady);
      window.addEventListener('touchend', slideFinish);
    });
  }
  initCompSlider();

  // --- LIGHTBOX GALLERY --- //
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  let currentIndex = 0;

  if (galleryItems.length > 0 && lightbox) {
    const images = Array.from(galleryItems).map(item => {
      return {
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt,
        caption: item.querySelector('.gallery-caption').innerHTML
      };
    });

    function showLightbox(index) {
      const imgData = images[index];
      lightboxImg.src = imgData.src;
      lightboxImg.alt = imgData.alt;
      lightboxCaption.innerHTML = imgData.caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      currentIndex = index;
    }

    function hideLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      showLightbox(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showLightbox(currentIndex);
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => showLightbox(index));
    });

    closeBtn.addEventListener('click', hideLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) hideLightbox();
    });

    document.addEventListener('keydown', e => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') hideLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      }
    });
  }

  // --- COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieAccepted')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }

});