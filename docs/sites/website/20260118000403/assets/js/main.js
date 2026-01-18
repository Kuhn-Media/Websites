document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header.sticky');
  if (header) {
    const scrollHandler = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach((el, index) => {
      // Staggered delay for elements in a grid
      if (el.parentElement.classList.contains('grid-3') || el.parentElement.classList.contains('grid-4') || el.parentElement.classList.contains('process-steps')) {
        el.style.transitionDelay = `${index * 100}ms`;
      }
      observer.observe(el);
    });
  }

  // --- Carousel --- //
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(wrapper => {
    const carousel = wrapper.querySelector('.carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = wrapper.querySelector('.carousel-btn.prev');
    const nextBtn = wrapper.querySelector('.carousel-btn.next');
    const dotsContainer = wrapper.querySelector('.carousel-dots');
    if (!carousel || slides.length === 0) return;

    let currentIndex = 0;
    let slideWidth = slides[0].clientWidth;

    const createDots = () => {
        if (!dotsContainer) return;
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    };

    const updateDots = () => {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    const goToSlide = (index) => {
        currentIndex = index;
        carousel.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        updateDots();
    };

    const showNextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    };

    const showPrevSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
    };

    if (nextBtn) nextBtn.addEventListener('click', showNextSlide);
    if (prevBtn) prevBtn.addEventListener('click', showPrevSlide);

    window.addEventListener('resize', () => {
        slideWidth = slides[0].clientWidth;
        goToSlide(currentIndex);
    });

    createDots();
  });

  // --- Lightbox --- //
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const showImage = (index) => {
        currentIndex = index;
        lightboxImg.src = galleryItems[index].href;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const hideLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showImage(index);
        });
    });

    closeBtn.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) hideLightbox();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showImage(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        showImage(currentIndex);
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') hideLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      const ctaScrollHandler = () => {
          if (window.scrollY > window.innerHeight * 0.8) {
              stickyCta.classList.add('visible');
          } else {
              stickyCta.classList.remove('visible');
          }
      };
      window.addEventListener('scroll', ctaScrollHandler, { passive: true });
  }

});