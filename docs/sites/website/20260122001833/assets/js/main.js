document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-scrolled', !entry.isIntersecting);
    }, { rootMargin: '200px 0px 0px 0px' });
    scrollObserver.observe(document.body);

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
        lastScrollY = window.scrollY;
    });
  }

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavContainer = document.querySelector('.mobile-nav__container');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');

  if (mobileNavToggle && mobileNavContainer) {
    const openMenu = () => {
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      mobileNavContainer.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');
      mobileNav.querySelector('a, button').focus();
    };

    const closeMenu = () => {
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNavContainer.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
      mobileNavToggle.focus();
    };

    mobileNavToggle.addEventListener('click', openMenu);
    mobileNavClose.addEventListener('click', closeMenu);
    mobileNavContainer.addEventListener('click', (e) => {
      if (e.target === mobileNavContainer) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavContainer.classList.contains('is-open')) closeMenu();
    });
  }

  // --- Scroll Animations --- //
  const revealItems = document.querySelectorAll('.reveal-item');
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
  revealItems.forEach(item => revealObserver.observe(item));

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // --- Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver(([entry]) => {
      // Show when hero is NOT intersecting (user has scrolled past it)
      stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
    }, { rootMargin: '-20vh 0px 0px 0px', threshold: 0 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      ctaObserver.observe(heroSection);
    }
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
  if (lightbox && galleryItems.length > 0) {
    const lightboxImage = lightbox.querySelector('.lightbox__image');
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    const lightboxPrev = lightbox.querySelector('.lightbox__prev');
    const lightboxNext = lightbox.querySelector('.lightbox__next');
    let currentIndex = 0;

    const images = Array.from(galleryItems).map(item => item.href);

    const showImage = (index) => {
      currentIndex = index;
      lightboxImage.src = images[currentIndex];
      lightboxPrev.style.display = (currentIndex === 0) ? 'none' : 'flex';
      lightboxNext.style.display = (currentIndex === images.length - 1) ? 'none' : 'flex';
    };

    const openLightbox = (e) => {
      e.preventDefault();
      const index = images.indexOf(e.currentTarget.href);
      lightbox.classList.add('is-visible');
      lightbox.setAttribute('aria-hidden', 'false');
      showImage(index);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-visible');
      lightbox.setAttribute('aria-hidden', 'true');
    };

    galleryItems.forEach(item => item.addEventListener('click', openLightbox));
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', () => {
      if (currentIndex > 0) showImage(currentIndex - 1);
    });

    lightboxNext.addEventListener('click', () => {
      if (currentIndex < images.length - 1) showImage(currentIndex + 1);
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('is-visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
        if (e.key === 'ArrowRight' && currentIndex < images.length - 1) showImage(currentIndex + 1);
      }
    });
  }

});