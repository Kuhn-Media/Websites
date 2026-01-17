document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER ---
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

  // --- 2. MOBILE NAVIGATION ---
  const navToggle = document.getElementById('mobile-nav-toggle');
  const navPanel = document.getElementById('mobile-nav-panel');
  const navClose = document.getElementById('mobile-nav-close');

  if (navToggle && navPanel) {
    const openMenu = () => {
      navPanel.classList.add('is-open');
      navPanel.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      navPanel.classList.remove('is-open');
      navPanel.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', openMenu);
    navClose.addEventListener('click', closeMenu);
    navPanel.addEventListener('click', (e) => {
        if (e.target === navPanel) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navPanel.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- 3. SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
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

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // --- 4. COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && acceptBtn && declineBtn) {
    setTimeout(() => {
      if (!localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('is-visible');
        cookieBanner.setAttribute('aria-hidden', 'false');
      }
    }, 1000);

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('is-visible');
        cookieBanner.setAttribute('aria-hidden', 'true');
    }

    acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    declineBtn.addEventListener('click', () => handleConsent('declined'));
  }

  // --- 5. STICKY CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past it)
              if (!entry.isIntersecting && window.scrollY > 300) {
                  stickyCTA.classList.add('is-visible');
                  stickyCTA.setAttribute('aria-hidden', 'false');
              } else {
                  stickyCTA.classList.remove('is-visible');
                  stickyCTA.setAttribute('aria-hidden', 'true');
              }
          });
      }, { threshold: 0.1 });
      
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

  // --- 6. CAROUSEL ---
  const carousel = document.getElementById('projects-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector('.carousel-button-next');
    const prevButton = carousel.querySelector('.carousel-button-prev');
    const dotsNav = carousel.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;

    const setSlidePosition = (slide, index) => {
      slide.style.left = slideWidth * index + 'px';
    };
    // slides.forEach(setSlidePosition);

    const moveToSlide = (currentSlide, targetSlide) => {
      track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
      currentSlide.classList.remove('is-selected');
      targetSlide.classList.add('is-selected');
    };

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('is-selected');
        targetDot.classList.add('is-selected');
    }

    // Create dots
    slides.forEach((slide, i) => {
        const button = document.createElement('button');
        button.classList.add('carousel-dot');
        if (i === 0) button.classList.add('is-selected');
        button.addEventListener('click', () => {
            const currentSlide = track.querySelector('.is-selected');
            const currentDot = dotsNav.querySelector('.is-selected');
            moveToSlide(currentSlide, slides[i]);
            updateDots(currentDot, button);
        });
        dotsNav.appendChild(button);
    });
    const dots = Array.from(dotsNav.children);

    nextButton.addEventListener('click', e => {
      const currentSlide = track.querySelector('.is-selected');
      const nextSlide = currentSlide.nextElementSibling || slides[0];
      const currentDot = dotsNav.querySelector('.is-selected');
      const nextDot = currentDot.nextElementSibling || dots[0];
      moveToSlide(currentSlide, nextSlide);
      updateDots(currentDot, nextDot);
    });

    prevButton.addEventListener('click', e => {
      const currentSlide = track.querySelector('.is-selected');
      const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
      const currentDot = dotsNav.querySelector('.is-selected');
      const prevDot = currentDot.previousElementSibling || dots[dots.length - 1];
      moveToSlide(currentSlide, prevSlide);
      updateDots(currentDot, prevDot);
    });

    // Recalculate on resize
    const handleResize = () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        slides.forEach((slide, index) => {
            slide.style.left = newSlideWidth * index + 'px';
        });
        const currentSlide = track.querySelector('.is-selected');
        track.style.transition = 'none'; // disable transition for instant move
        track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
        setTimeout(() => { track.style.transition = ''; }, 0);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // initial call
  }

  // --- 7. LIGHTBOX ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            if (!item) return;
            const imageSrc = item.getAttribute('href');
            const imageAlt = item.querySelector('img')?.getAttribute('alt') || '';
            lightboxImage.setAttribute('src', imageSrc);
            lightboxImage.setAttribute('alt', imageAlt);
            currentIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % galleryItems.length;
            showImage(nextIndex);
        });
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(prevIndex);
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
                if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
            }
        });
    }

});