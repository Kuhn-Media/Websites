document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Navigation --- //
  const initMobileNav = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navMenu.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
  };

  // --- 2. Sticky Header --- //
  const initStickyHeader = () => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const observer = new IntersectionObserver(([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '100px 0px 0px 0px', threshold: 1 });
    
    // Create a dummy element to observe
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    document.body.prepend(sentinel);
    observer.observe(sentinel);
  };

  // --- 3. Scroll Reveal Animation --- //
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay) || 0;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  };

  // --- 4. Testimonial Carousel --- //
  const initCarousel = () => {
    const carousel = document.getElementById('testimonial-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    if (slides.length <= 1) {
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
        return;
    }

    const updateCarousel = () => {
      const offset = -currentIndex * slides[0].offsetWidth;
      carousel.style.transform = `translateX(${offset}px)`;
      updateDots();
    };

    const updateDots = () => {
      dotsContainer.childNodes.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    updateCarousel();
  };

  // --- 5. Sticky CTA --- //
  const initStickyCTA = () => {
    const cta = document.getElementById('sticky-cta');
    if (!cta) return;

    const observer = new IntersectionObserver(([entry]) => {
      cta.classList.toggle('visible', entry.boundingClientRect.top < -300);
    }, { threshold: [0, 1] });

    const target = document.querySelector('.hero'); // Observe the hero section
    if (target) observer.observe(target);
  };

  // --- 6. Cookie Banner --- //
  const initCookieBanner = () => {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    if (!banner || !acceptBtn || !declineBtn) return;

    const cookieStatus = localStorage.getItem('cookie_status');
    if (!cookieStatus) {
      banner.classList.add('visible');
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_status', 'accepted');
      banner.classList.remove('visible');
    });

    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_status', 'declined');
      banner.classList.remove('visible');
    });
  };

  // --- 7. Global Lightbox --- //
  const initLightbox = () => {
    const lightbox = document.getElementById('km-lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    let galleryItems = [];
    let currentIndex = -1;

    const openLightbox = (index) => {
      if (index < 0 || index >= galleryItems.length) return;
      currentIndex = index;
      const item = galleryItems[currentIndex];
      lightboxImg.src = item.href;
      lightboxImg.alt = item.querySelector('img')?.alt || 'Großansicht';
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      prevBtn.style.display = galleryItems.length > 1 ? 'flex' : 'none';
      nextBtn.style.display = galleryItems.length > 1 ? 'flex' : 'none';
      closeBtn.focus();
    };

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
      document.body.style.overflow = '';
    };

    const showPrev = () => openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);
    const showNext = () => openLightbox((currentIndex + 1) % galleryItems.length);

    document.addEventListener('click', (e) => {
      const galleryLink = e.target.closest('.gallery-item');
      if (galleryLink) {
        e.preventDefault();
        const galleryContainer = galleryLink.closest('.gallery-grid');
        galleryItems = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
        const index = galleryItems.indexOf(galleryLink);
        openLightbox(index);
      }
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display !== 'flex') return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  };

  // Initialize all modules
  initMobileNav();
  initStickyHeader();
  initScrollReveal();
  initCarousel();
  initStickyCTA();
  initCookieBanner();
  initLightbox();
});