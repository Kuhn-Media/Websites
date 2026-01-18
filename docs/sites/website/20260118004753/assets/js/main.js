document.addEventListener('DOMContentLoaded', function() {

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

  // --- Mobile Menu ---
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    menuClose.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- Scroll Reveal Animation ---
  const revealItems = document.querySelectorAll('.reveal-item');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealItems.forEach(item => {
    observer.observe(item);
  });

  // --- Image Comparison Slider ---
  function initCompSlider() {
    const containers = document.getElementsByClassName('img-comp-container');
    for (let i = 0; i < containers.length; i++) {
      compareImages(containers[i]);
    }
    function compareImages(img) {
      let slider, clicked = 0, w, h;
      w = img.offsetWidth;
      h = img.offsetHeight;
      img.style.height = h + 'px';
      const overlay = img.getElementsByClassName('img-comp-overlay')[0];
      overlay.style.width = (w / 2) + 'px';
      
      slider = document.createElement('DIV');
      slider.setAttribute('class', 'img-comp-slider');
      slider.innerHTML = '↔';
      img.appendChild(slider);
      slider.style.top = (h / 2) - (slider.offsetHeight / 2) + 'px';
      slider.style.left = (w / 2) - (slider.offsetWidth / 2) + 'px';

      slider.addEventListener('mousedown', slideReady);
      window.addEventListener('mouseup', slideFinish);
      slider.addEventListener('touchstart', slideReady);
      window.addEventListener('touchend', slideFinish);

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
        let pos;
        if (clicked == 0) return false;
        pos = getCursorPos(e)
        if (pos < 0) pos = 0;
        if (pos > w) pos = w;
        slide(pos);
      }
      function getCursorPos(e) {
        let a, x = 0;
        e = (e.changedTouches) ? e.changedTouches[0] : e;
        a = img.getBoundingClientRect();
        x = e.pageX - a.left;
        x = x - window.pageXOffset;
        return x;
      }
      function slide(x) {
        overlay.style.width = x + 'px';
        slider.style.left = overlay.offsetWidth - (slider.offsetWidth / 2) + 'px';
      }
    }
  }
  initCompSlider();

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('visible');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 800) {
        stickyCTA.classList.add('visible');
      } else {
        stickyCTA.classList.remove('visible');
      }
    });
  }

  // --- Lightbox Gallery ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const galleryLinks = document.querySelectorAll('.gallery-link');
  let currentImageIndex = 0;
  let images = [];

  if (lightbox) {
    galleryLinks.forEach((link, index) => {
      images.push({ 
        src: link.getAttribute('data-lightbox-src'), 
        title: link.getAttribute('data-lightbox-title') 
      });
      link.addEventListener('click', (e) => {
        e.preventDefault();
        currentImageIndex = index;
        showImage(currentImageIndex);
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    function showImage(index) {
      lightboxImg.src = images[index].src;
      lightboxTitle.textContent = images[index].title;
    }

    function closeLightbox() {
      lightbox.classList.remove('visible');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    function showNext() {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      showImage(currentImageIndex);
    }

    function showPrev() {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      showImage(currentImageIndex);
    }

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      }
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

});