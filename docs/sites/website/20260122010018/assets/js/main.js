document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // --- 2. Mobile Navigation --- //
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileNav = document.querySelector('.mobile-nav');
  const navBackdrop = document.querySelector('.mobile-nav__backdrop');
  const closeMenuButton = document.querySelector('.close-menu');
  const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  const openMenu = () => {
    if (!mobileNav || !navBackdrop) return;
    burgerMenu.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    navBackdrop.classList.add('open');
    document.body.classList.add('no-scroll');
    mobileNavLinks[0]?.focus();
  };

  const closeMenu = () => {
    if (!mobileNav || !navBackdrop) return;
    burgerMenu.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    navBackdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
    burgerMenu.focus();
  };

  if (burgerMenu) {
    burgerMenu.addEventListener('click', openMenu);
  }
  if (closeMenuButton) {
    closeMenuButton.addEventListener('click', closeMenu);
  }
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }
  mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });

  // --- 3. Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  if (revealItems.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay) || 0;
          const staggerChildren = entry.target.querySelectorAll('[data-reveal-stagger]');
          if (staggerChildren.length > 0) {
            staggerChildren.forEach(childContainer => {
                const children = childContainer.children;
                const staggerDelay = parseInt(childContainer.dataset.revealStagger) || 100;
                Array.from(children).forEach((child, index) => {
                    child.style.transitionDelay = `${delay + index * staggerDelay}ms`;
                    child.classList.add('is-visible');
                });
            });
          } else {
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('is-visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealItems.forEach(item => {
        // If an item has stagger children, we observe the container
        if (item.querySelector('[data-reveal-stagger]')) {
            observer.observe(item);
        } else {
            // Otherwise, we observe the item itself and its direct children if it's a stagger container
            if (item.dataset.revealStagger) {
                Array.from(item.children).forEach(child => observer.observe(child));
            } else {
                observer.observe(item);
            }
        }
    });
  }

  // --- 4. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieBanner.classList.add('visible');
        cookieBanner.setAttribute('aria-hidden', 'false');
      }, 1500);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // --- 5. Sticky Context CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when the main CTA banner is NOT visible
              if (!entry.isIntersecting && window.scrollY > 400) {
                  stickyCTA.classList.add('visible');
                  stickyCTA.setAttribute('aria-hidden', 'false');
              } else {
                  stickyCTA.classList.remove('visible');
                  stickyCTA.setAttribute('aria-hidden', 'true');
              }
          });
      }, { threshold: 0.1 });

      const mainCtaBanner = document.querySelector('.cta-banner');
      if (mainCtaBanner) {
          ctaObserver.observe(mainCtaBanner);
      }
  }

  // --- 6. Lightbox Gallery --- //
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
  let currentImageIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    const lightboxPrev = lightbox.querySelector('.lightbox__prev');
    const lightboxNext = lightbox.querySelector('.lightbox__next');
    const lightboxBackdrop = lightbox.querySelector('.lightbox__backdrop');

    const images = Array.from(galleryItems).map(item => item.href);

    const showImage = (index) => {
        lightboxImg.src = images[index];
        currentImageIndex = index;
    };

    const openLightbox = (e) => {
        e.preventDefault();
        const index = images.indexOf(e.currentTarget.href);
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        showImage(index);
        lightboxClose.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        galleryItems[currentImageIndex].focus();
    };

    const showPrevImage = () => {
        const newIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage(newIndex);
    };

    const showNextImage = () => {
        const newIndex = (currentImageIndex + 1) % images.length;
        showImage(newIndex);
    };

    galleryItems.forEach(item => item.addEventListener('click', openLightbox));
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('visible')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
  }

});