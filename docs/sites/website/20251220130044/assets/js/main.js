document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
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

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.getElementById('main-nav-list');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -15% 0px' });
  revealElements.forEach(el => observer.observe(el));

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show CTA when the footer is NOT in view
        stickyCTA.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0.1 });
    const footer = document.querySelector('.site-footer-main');
    if (footer) ctaObserver.observe(footer);
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookiesBtn) {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Accordion (FAQ) ---
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
    });
  });

  // --- Carousel ---
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(wrapper => {
    const carousel = wrapper.querySelector('.carousel');
    const prevBtn = wrapper.querySelector('.carousel-prev');
    const nextBtn = wrapper.querySelector('.carousel-next');
    const dotsContainer = wrapper.querySelector('.carousel-dots');
    if (!carousel) return;

    const slides = Array.from(carousel.children);
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      updateDots();
    };

    const createDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      });
    };

    const updateDots = () => {
      if (!dotsContainer) return;
      Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        updateCarousel();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
      });
    }
    
    createDots();
    updateCarousel();
  });

  // --- Lightbox Gallery ---
  const galleries = document.querySelectorAll('.lightbox-gallery');
  if (galleries.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
      <div class='lightbox-content'>
        <button class='lightbox-close'>&times;</button>
        <button class='lightbox-prev'>&lt;</button>
        <img src='' alt=''>
        <button class='lightbox-next'>&gt;</button>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentImageIndex;
    let images = [];

    galleries.forEach(gallery => {
      const links = gallery.querySelectorAll('a');
      images = Array.from(links).map(link => link.href);
      links.forEach((link, index) => {
        link.addEventListener('click', e => {
          e.preventDefault();
          currentImageIndex = index;
          updateLightboxImage();
          lightbox.classList.add('active');
        });
      });
    });

    const updateLightboxImage = () => {
      lightboxImg.src = images[currentImageIndex];
    };

    const closeLightbox = () => lightbox.classList.remove('active');
    const showPrev = () => {
      currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : images.length - 1;
      updateLightboxImage();
    };
    const showNext = () => {
      currentImageIndex = (currentImageIndex < images.length - 1) ? currentImageIndex + 1 : 0;
      updateLightboxImage();
    };

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    const style = document.createElement('style');
    style.innerHTML = `
      #lightbox { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s; }
      #lightbox.active { opacity: 1; visibility: visible; }
      .lightbox-content { position: relative; max-width: 90%; max-height: 90%; }
      .lightbox-content img { max-width: 100%; max-height: 80vh; }
      .lightbox-close, .lightbox-prev, .lightbox-next { position: absolute; background: rgba(0,0,0,0.5); color: white; border: none; font-size: 2rem; cursor: pointer; padding: 0.5rem 1rem; }
      .lightbox-close { top: 10px; right: 10px; }
      .lightbox-prev { top: 50%; left: 10px; transform: translateY(-50%); }
      .lightbox-next { top: 50%; right: 10px; transform: translateY(-50%); }
    `;
    document.head.appendChild(style);
  }

});