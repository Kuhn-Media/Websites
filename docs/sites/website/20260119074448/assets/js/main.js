document.addEventListener('DOMContentLoaded', () => {

  // Sticky Header
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

  // Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const navOverlay = document.querySelector('.mobile-nav-overlay');

  if (navToggle && navDrawer && navOverlay) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navDrawer.classList.toggle('open');
      navOverlay.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navOverlay.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navDrawer.classList.remove('open');
        navOverlay.classList.remove('open');
        document.body.style.overflow = '';
    });
  }

  // Scroll Reveal Animations
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-fade-in, .reveal-fade-up').forEach(el => {
    revealObserver.observe(el);
  });

  document.querySelectorAll('.reveal-stagger-container').forEach(container => {
    const children = container.querySelectorAll(':scope > *');
    children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 100}ms`;
    });
    revealObserver.observe(container);
  });

  // Cookie Banner
  const cookieBanner = document.querySelector('.cookie-banner');
  const acceptBtn = document.querySelector('.cookie-accept');
  const declineBtn = document.querySelector('.cookie-decline');

  if (cookieBanner && acceptBtn && declineBtn) {
    const cookieStatus = localStorage.getItem('cookie_status');
    if (!cookieStatus) {
        cookieBanner.removeAttribute('hidden');
        setTimeout(() => cookieBanner.classList.add('visible'), 100);
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_status', 'accepted');
      cookieBanner.classList.remove('visible');
    });

    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_status', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // Carousel
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-button.next');
        const prevButton = carousel.querySelector('.carousel-button.prev');
        const dotsNav = carousel.querySelector('.carousel-dots');

        if (slides.length === 0) return;

        const slideWidth = slides[0].getBoundingClientRect().width;

        let dots = [];
        if (dotsNav) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.addEventListener('click', () => {
                    track.scrollTo({ left: i * slideWidth, behavior: 'smooth' });
                    updateDots(i);
                });
                dotsNav.appendChild(dot);
                dots.push(dot);
            });
        }

        const updateDots = (currentIndex) => {
            if (!dotsNav) return;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };
        
        const getCurrentIndex = () => {
            return Math.round(track.scrollLeft / slideWidth);
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                track.scrollBy({ left: slideWidth, behavior: 'smooth' });
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
            });
        }

        track.addEventListener('scroll', () => {
            updateDots(getCurrentIndex());
        });
        
        updateDots(0);
    });

    // Lightbox
    const lightbox = document.querySelector('.lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
    let currentImageIndex = 0;
    const galleryImages = Array.from(lightboxTriggers).map(img => img.src);

    function showImage(index) {
        if (!lightboxImg) return;
        lightboxImg.src = galleryImages[index];
        currentImageIndex = index;
    }

    function openLightbox(index) {
        if (!lightbox) return;
        lightbox.removeAttribute('hidden');
        lightbox.classList.add('visible');
        showImage(index);
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('visible');
        setTimeout(() => lightbox.setAttribute('hidden', true), 300);
        document.body.style.overflow = '';
    }

    lightboxTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => e.target === lightbox && closeLightbox());
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => showImage((currentImageIndex - 1 + galleryImages.length) % galleryImages.length));
    if (lightboxNext) lightboxNext.addEventListener('click', () => showImage((currentImageIndex + 1) % galleryImages.length));

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('visible')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        }
    });

    // Sticky CTA
    const stickyCTA = document.querySelector('.sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                    stickyCTA.removeAttribute('hidden');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});