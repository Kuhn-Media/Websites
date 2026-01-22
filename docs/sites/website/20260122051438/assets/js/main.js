document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY HEADER --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollHandler = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler(); // Initial check
  }

  // --- 2. MOBILE NAVIGATION --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavBackdrop = document.querySelector('.mobile-nav__backdrop');

  const openMenu = () => {
    if (!mobileNav || !mobileNavToggle) return;
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('body--no-scroll');
    mobileNav.querySelector('a, button').focus();
  };

  const closeMenu = () => {
    if (!mobileNav || !mobileNavToggle) return;
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('body--no-scroll');
    mobileNavToggle.focus();
  };

  if (mobileNavToggle && mobileNav) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      isExpanded ? closeMenu() : openMenu();
    });
    mobileNavClose.addEventListener('click', closeMenu);
    mobileNavBackdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.getAttribute('aria-hidden') === 'false') {
        closeMenu();
      }
    });
    
    // Submenu toggle
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const submenu = toggle.nextElementSibling;
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            submenu.classList.toggle('is-open');
        });
    });
  }

  // --- 3. SCROLL REVEAL ANIMATION --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- 4. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');

  if (cookieBanner && acceptCookiesBtn) {
    setTimeout(() => {
      if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.setAttribute('aria-hidden', 'false');
      }
    }, 1500);

    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // --- 5. CAROUSEL --- //
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(wrapper => {
    const carousel = wrapper.querySelector('.carousel');
    const prevBtn = wrapper.querySelector('.carousel-prev');
    const nextBtn = wrapper.querySelector('.carousel-next');
    const dotsContainer = wrapper.querySelector('.carousel-dots');
    const slides = carousel.querySelectorAll('.carousel-slide');
    if (!carousel || slides.length === 0) return;

    let currentIndex = 0;
    let dots = [];

    const updateCarousel = () => {
      const slideWidth = slides[0].offsetWidth;
      carousel.scrollTo({ left: currentIndex * slideWidth, behavior: 'smooth' });
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slides.length - 1;
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Handle scroll snapping to update active dot
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const slideWidth = slides[0].offsetWidth;
        currentIndex = Math.round(carousel.scrollLeft / slideWidth);
        updateCarousel();
      }, 150);
    });

    updateCarousel();
  });

  // --- 6. LIGHTBOX GALLERY --- //
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImage = lightbox.querySelector('.lightbox__image');
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    const lightboxPrev = lightbox.querySelector('.lightbox__prev');
    const lightboxNext = lightbox.querySelector('.lightbox__next');
    const lightboxBackdrop = lightbox.querySelector('.lightbox__backdrop');
    let currentIndex = 0;

    const images = Array.from(galleryItems).map(item => ({
      src: item.href,
      alt: item.querySelector('img').alt
    }));

    const showImage = (index) => {
      const img = images[index];
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      currentIndex = index;
      lightboxPrev.style.display = index === 0 ? 'none' : 'block';
      lightboxNext.style.display = index === images.length - 1 ? 'none' : 'block';
    };

    const openLightbox = (e, index) => {
      e.preventDefault();
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('body--no-scroll');
      showImage(index);
    };

    const closeLightbox = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('body--no-scroll');
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => openLightbox(e, index));
    });

    lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
    lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (lightbox.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
            if (e.key === 'ArrowRight' && currentIndex < images.length - 1) showImage(currentIndex + 1);
        }
    });
  }

  // --- 7. STICKY CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaScrollHandler = () => {
        // Show after scrolling 1 viewport height, but not if footer is visible
        const footer = document.querySelector('.site-footer');
        const footerVisible = footer.getBoundingClientRect().top < window.innerHeight;
        if (window.scrollY > window.innerHeight && !footerVisible) {
            stickyCta.classList.add('is-visible');
        } else {
            stickyCta.classList.remove('is-visible');
        }
    };
    window.addEventListener('scroll', ctaScrollHandler, { passive: true });
  }

});