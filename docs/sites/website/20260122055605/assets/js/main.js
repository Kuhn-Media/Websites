document.addEventListener('DOMContentLoaded', () => {

  // --- Reduced Motion Check ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-sticky');
      } else {
        header.classList.remove('is-sticky');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelectorAll('.mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileNavToggle.length && mobileNav) {
    const openMenu = () => {
      mobileNav.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      const firstFocusable = mobileNav.querySelector('a, button');
      if(firstFocusable) firstFocusable.focus();
    };
    const closeMenu = () => {
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      document.querySelector('.mobile-nav-toggle').focus();
    };

    mobileNavToggle.forEach(toggle => {
      toggle.addEventListener('click', () => {
        if (mobileNav.classList.contains('is-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    });

    mobileNav.querySelector('.mobile-nav__backdrop').addEventListener('click', closeMenu);
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- Scroll Reveal Animations ---
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.staggerDelay || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- Carousel ---
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(wrapper => {
    const carousel = wrapper.querySelector('.carousel');
    const prevBtn = wrapper.querySelector('.carousel-prev');
    const nextBtn = wrapper.querySelector('.carousel-next');
    const dotsContainer = wrapper.querySelector('.carousel-dots');
    if (!carousel) return;

    let currentIndex = 0;
    const slides = Array.from(carousel.children);
    const totalSlides = slides.length;

    const updateCarousel = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    };

    const updateDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
    }
    
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    carousel.addEventListener('touchend', (e) => {
        let touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) { nextBtn.click(); }
        if (touchEndX - touchStartX > 50) { prevBtn.click(); }
    });

    updateCarousel();
    window.addEventListener('resize', updateCarousel);
  });

  // --- Lightbox ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length && lightbox) {
    const lightboxImage = lightbox.querySelector('.lightbox__image');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.href);

    const showImage = (index) => {
      lightboxImage.src = images[index];
      currentIndex = index;
    };

    const openLightbox = (e) => {
      e.preventDefault();
      const index = images.indexOf(e.currentTarget.href);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      showImage(index);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
    };

    galleryItems.forEach(item => item.addEventListener('click', openLightbox));
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + images.length) % images.length));
    nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % images.length));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieBanner.classList.add('is-visible');
      }, 2000);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
    });
  }

  // --- Sticky CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when the hero is NOT intersecting (user has scrolled past it)
            if (!entry.isIntersecting) {
                stickyCta.classList.add('is-visible');
            } else {
                stickyCta.classList.remove('is-visible');
            }
        });
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero, .page-hero');
    if (heroSection) ctaObserver.observe(heroSection);
  }

});