document.addEventListener('DOMContentLoaded', () => {

  // --- Header Logic ---
  const header = document.querySelector('.site-header');
  if (header) {
    const headerScrollObserver = new IntersectionObserver(([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '100px 0px 0px 0px' });
    headerScrollObserver.observe(document.body);
  }

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  const openMobileMenu = () => {
    mobileNavToggle.classList.add('open');
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    mobileNavDrawer.classList.add('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileNavBackdrop.classList.add('open');
    document.body.classList.add('no-scroll');
    mobileNavDrawer.querySelector('a').focus();
  };

  const closeMobileMenu = () => {
    mobileNavToggle.classList.remove('open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavDrawer.classList.remove('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileNavBackdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
    mobileNavToggle.focus();
  };

  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      if (mobileNavDrawer.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileNavClose.addEventListener('click', closeMobileMenu);
    mobileNavBackdrop.addEventListener('click', closeMobileMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
    
    const navLinks = mobileNavDrawer.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileMenu, 150);
        });
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Hero Title Animation ---
  const heroTitle = document.querySelector('[data-animate="hero-title"]');
  if (heroTitle) {
    setTimeout(() => {
      heroTitle.classList.add('animate-in');
    }, 300);
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieBanner.classList.add('visible');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }, 2000);
  }

  const handleConsent = (consent) => {
    localStorage.setItem('cookieConsent', consent);
    cookieBanner.classList.remove('visible');
    cookieBanner.setAttribute('aria-hidden', 'true');
  };

  if (acceptButton) acceptButton.addEventListener('click', () => handleConsent('accepted'));
  if (declineButton) declineButton.addEventListener('click', () => handleConsent('declined'));

  // --- Lightbox Logic ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  let currentImageIndex = 0;

  if (lightbox && lightboxImage && lightboxTriggers.length > 0) {
    const images = Array.from(lightboxTriggers).map(el => el.href);

    const showImage = (index) => {
      currentImageIndex = index;
      lightboxImage.src = images[index];
      lightboxImage.alt = lightboxTriggers[index].querySelector('img').alt;
    };

    const openLightbox = (e) => {
      e.preventDefault();
      const index = images.indexOf(e.currentTarget.href);
      showImage(index);
      lightbox.classList.add('visible');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    const nextImage = () => showImage((currentImageIndex + 1) % images.length);
    const prevImage = () => showImage((currentImageIndex - 1 + images.length) % images.length);

    lightboxTriggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver(([entry]) => {
          stickyCTA.classList.toggle('visible', !entry.isIntersecting);
          stickyCTA.setAttribute('aria-hidden', entry.isIntersecting);
      }, { threshold: 0.1, rootMargin: '-20% 0px 0px 0px' });
      
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});