'use strict';

document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Navigation ---
  const mobileToggle = document.querySelector('.site-header__mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');
  const mobileNavBackdrop = document.querySelector('.mobile-nav__backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__links a');

  if (mobileToggle && mobileNav) {
    const openMenu = () => {
      document.body.classList.add('mobile-nav-open', 'no-scroll');
      mobileNav.setAttribute('aria-hidden', 'false');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileNavLinks[0].focus();
    };

    const closeMenu = () => {
      document.body.classList.remove('mobile-nav-open', 'no-scroll');
      mobileNav.setAttribute('aria-hidden', 'true');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.focus();
    };

    mobileToggle.addEventListener('click', openMenu);
    mobileNavClose.addEventListener('click', closeMenu);
    mobileNavBackdrop.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
        closeMenu();
      }
    });

    // Basic focus trap
    const focusableElements = mobileNav.querySelectorAll('button, [href]');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    mobileNav.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    });
  }

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
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
    }, { rootMargin: '0px 0px -10% 0px' });

    revealElements.forEach(el => {
      observer.observe(el);
    });

    // Staggered group animations
    const revealGroups = document.querySelectorAll('.reveal-group');
    revealGroups.forEach(group => {
        const groupObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('.reveal');
                    children.forEach((child, index) => {
                        const delay = parseInt(child.dataset.revealDelay) || (index * 100);
                        setTimeout(() => {
                            child.classList.add('is-visible');
                        }, delay);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
        groupObserver.observe(group);
    });
  }

  // --- Lightbox --- 
  const lightbox = document.getElementById('lightbox');
  const lightboxGallery = document.querySelector('.lightbox-gallery');
  if (lightbox && lightboxGallery) {
      const lightboxImage = lightbox.querySelector('.lightbox__image');
      const lightboxClose = lightbox.querySelector('.lightbox__close');
      const lightboxPrev = lightbox.querySelector('.lightbox__prev');
      const lightboxNext = lightbox.querySelector('.lightbox__next');
      const galleryItems = Array.from(lightboxGallery.querySelectorAll('a'));
      let currentIndex = 0;

      const showImage = (index) => {
          currentIndex = index;
          lightboxImage.src = galleryItems[currentIndex].href;
          lightboxImage.alt = galleryItems[currentIndex].querySelector('img').alt;
          lightboxPrev.style.display = (currentIndex === 0) ? 'none' : 'flex';
          lightboxNext.style.display = (currentIndex === galleryItems.length - 1) ? 'none' : 'flex';
      };

      const openLightbox = (e, index) => {
          e.preventDefault();
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.classList.add('no-scroll');
          showImage(index);
          lightboxClose.focus();
      };

      const closeLightbox = () => {
          lightbox.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('no-scroll');
          galleryItems[currentIndex].focus();
      };

      galleryItems.forEach((item, index) => {
          item.addEventListener('click', (e) => openLightbox(e, index));
      });

      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox.querySelector('.lightbox__backdrop')) closeLightbox();
      });

      lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
      lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));

      document.addEventListener('keydown', (e) => {
          if (lightbox.getAttribute('aria-hidden') === 'false') {
              if (e.key === 'Escape') closeLightbox();
              if (e.key === 'ArrowLeft' && currentIndex > 0) lightboxPrev.click();
              if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) lightboxNext.click();
          }
      });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner) {
    setTimeout(() => {
      if (!localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('is-visible');
      }
    }, 1000);

    const hideBanner = () => cookieBanner.classList.remove('is-visible');

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      hideBanner();
    });

    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      hideBanner();
    });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  const ctaTriggerSection = document.querySelector('.section-services-teaser'); // Trigger after this section

  if (stickyCTA && ctaTriggerSection) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when the trigger section is NOT intersecting (i.e., scrolled past)
              if (!entry.isIntersecting && window.scrollY > entry.boundingClientRect.height) {
                  stickyCTA.classList.add('is-visible');
              } else {
                  stickyCTA.classList.remove('is-visible');
              }
          });
      }, { rootMargin: '0px 0px 0px 0px' });
      ctaObserver.observe(ctaTriggerSection);
  }

});