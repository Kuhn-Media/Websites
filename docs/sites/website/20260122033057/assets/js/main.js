document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  const openMenu = () => {
    document.body.classList.add('nav-open');
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    const firstFocusable = mobileNavDrawer.querySelector('a, button');
    if (firstFocusable) firstFocusable.focus();
  };

  const closeMenu = () => {
    document.body.classList.remove('nav-open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileNavToggle.focus();
  };

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      isExpanded ? closeMenu() : openMenu();
    });
  }

  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMenu);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeMenu();
    }
  });

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-sticky');
      } else {
        header.classList.remove('is-sticky');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
        const children = entry.target.children;
        if (children.length > 0 && delay > 0) {
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('is-visible');
                }, index * delay);
            });
        } else {
            entry.target.classList.add('is-visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieBanner.classList.add('is-visible');
      }, 1000);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
    });
  }

  // --- Carousel --- //
  const carousel = document.getElementById('milestones-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.parentElement.querySelector('.carousel-btn--prev');
    const nextBtn = carousel.parentElement.querySelector('.carousel-btn--next');
    const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      const scrollAmount = slides[currentIndex].offsetLeft - carousel.offsetLeft;
      carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      updateDots();
    };

    const updateDots = () => {
      Array.from(dotsContainer.children).forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.ariaLabel = `Go to slide ${index + 1}`;
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });

    updateDots();
  }

  // --- Lightbox --- //
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox__caption');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');
    let currentIndex = 0;

    const images = Array.from(galleryItems).map(item => ({
      src: item.href,
      alt: item.dataset.alt
    }));

    const showImage = (index) => {
      const img = images[index];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      currentIndex = index;
    };

    const openLightbox = (index) => {
      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      showImage(index);
    };

    const closeLightbox = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.classList.remove('is-visible');
      document.body.style.overflow = '';
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + images.length) % images.length));
    nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % images.length));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('is-visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if(stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show CTA when the hero section is NOT intersecting (i.e., scrolled past it)
            if (!entry.isIntersecting) {
                stickyCTA.classList.add('is-visible');
            } else {
                stickyCTA.classList.remove('is-visible');
            }
        });
    }, { threshold: 0 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

});