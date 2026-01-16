document.addEventListener('DOMContentLoaded', () => {

  // Sticky Header
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.getElementById('mobile-nav-drawer');
  const navOverlay = document.querySelector('.mobile-nav-overlay');
  const navClose = document.querySelector('.mobile-nav-close');

  if (navToggle && navDrawer && navOverlay && navClose) {
    const toggleNav = (isOpen) => {
      const expanded = isOpen ? 'true' : 'false';
      const hidden = isOpen ? 'false' : 'true';
      navToggle.setAttribute('aria-expanded', expanded);
      navDrawer.setAttribute('aria-hidden', hidden);
      navOverlay.classList.toggle('visible', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => toggleNav(navToggle.getAttribute('aria-expanded') === 'false'));
    navClose.addEventListener('click', () => toggleNav(false));
    navOverlay.addEventListener('click', () => toggleNav(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        toggleNav(false);
      }
    });
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
  }

  // Testimonial Slider
  const slider = document.getElementById('testimonial-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentIndex = 0;

    const goToSlide = (index) => {
      slider.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    };

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');
    goToSlide(0);

    prevBtn.addEventListener('click', () => goToSlide((currentIndex - 1 + slides.length) % slides.length));
    nextBtn.addEventListener('click', () => goToSlide((currentIndex + 1) % slides.length));
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && acceptBtn && declineBtn) {
    setTimeout(() => {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }
    }, 1000);

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('visible');
        cookieBanner.setAttribute('aria-hidden', 'true');
    }

    acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    declineBtn.addEventListener('click', () => handleConsent('declined'));
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const handleStickyCTAScroll = () => {
          if (window.scrollY > window.innerHeight * 0.8) {
              stickyCTA.classList.add('visible');
              stickyCTA.setAttribute('aria-hidden', 'false');
          } else {
              stickyCTA.classList.remove('visible');
              stickyCTA.setAttribute('aria-hidden', 'true');
          }
      };
      window.addEventListener('scroll', handleStickyCTAScroll, { passive: true });
  }
  
  // Lightbox Gallery
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length > 0 && lightbox) {
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const showImage = (index) => {
        const item = galleryItems[index];
        const imgSrc = item.href;
        const imgAlt = item.querySelector('img').alt;
        lightboxContent.innerHTML = `<img src='${imgSrc}' alt='${imgAlt}'>`;
        currentIndex = index;
    };

    const openLightbox = (index) => {
        showImage(index);
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
    nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('visible')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });
  }

});