document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE NAVIGATION ---
  const mobileNavContainer = document.getElementById('mobile-nav-container');
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navClose = document.querySelector('.mobile-nav-close');
  const navBackdrop = document.querySelector('.mobile-nav-backdrop');

  const openMenu = () => {
    mobileNavContainer.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscKey);
  };

  const closeMenu = () => {
    mobileNavContainer.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscKey);
  };

  const handleEscKey = (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (mobileNavContainer.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (navClose) navClose.addEventListener('click', closeMenu);
  if (navBackdrop) navBackdrop.addEventListener('click', closeMenu);

  // Close menu on link click
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // --- STICKY HEADER ---
  const header = document.getElementById('site-header');
  const scrollThreshold = 50;
  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-up, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });

  // --- SIGNATURE DIVIDER ANIMATION ---
  const dividerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.signature-divider').forEach(el => {
    dividerObserver.observe(el);
  });

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');
  const cookieConsent = localStorage.getItem('cookie_consent');

  if (!cookieConsent) {
    setTimeout(() => {
      cookieBanner.setAttribute('aria-hidden', 'false');
      cookieBanner.classList.add('is-visible');
    }, 1000);
  }

  const handleConsent = (consent) => {
    localStorage.setItem('cookie_consent', consent);
    cookieBanner.classList.remove('is-visible');
    cookieBanner.setAttribute('aria-hidden', 'true');
  };

  if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
  if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

  // --- STICKY CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past hero)
              if (!entry.isIntersecting) {
                  stickyCta.classList.add('is-visible');
                  stickyCta.setAttribute('aria-hidden', 'false');
              } else {
                  stickyCta.classList.remove('is-visible');
                  stickyCta.setAttribute('aria-hidden', 'true');
              }
          });
      }, { threshold: 0.1, rootMargin: '-20% 0px 0px 0px' });

      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

  // --- LIGHTBOX GALLERY ---
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  if (gallery && lightbox) {
    const galleryItems = gallery.querySelectorAll('.gallery-item');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const showImage = (index) => {
      const item = galleryItems[index];
      const imgSrc = item.getAttribute('href');
      const imgAlt = item.dataset.alt || '';
      lightboxImage.setAttribute('src', imgSrc);
      lightboxImage.setAttribute('alt', imgAlt);
      currentIndex = index;
    };

    const openLightbox = (e, index) => {
      e.preventDefault();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      showImage(index);
      document.addEventListener('keydown', handleLightboxKeys);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', handleLightboxKeys);
    };

    const showPrev = () => {
      const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      showImage(newIndex);
    };

    const showNext = () => {
      const newIndex = (currentIndex + 1) % galleryItems.length;
      showImage(newIndex);
    };

    const handleLightboxKeys = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => openLightbox(e, index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
  }

});