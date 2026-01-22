document.addEventListener('DOMContentLoaded', function() {

  // --- MOBILE NAVIGATION ---
  const mobileNavToggleButtons = document.querySelectorAll('.mobile-nav-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
  const body = document.body;

  const openMobileNav = () => {
    mobileNavDrawer.classList.add('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileNavBackdrop.classList.add('is-open');
    body.classList.add('no-scroll');
  };

  const closeMobileNav = () => {
    mobileNavDrawer.classList.remove('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileNavBackdrop.classList.remove('is-open');
    body.classList.remove('no-scroll');
  };

  mobileNavToggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (mobileNavDrawer.classList.contains('is-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  });

  mobileNavBackdrop.addEventListener('click', closeMobileNav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer.classList.contains('is-open')) {
      closeMobileNav();
    }
  });

  // --- STICKY HEADER ---
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100); // Stagger effect
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
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
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // --- LIGHTBOX GALLERY ---
  const lightbox = document.getElementById('lightbox');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');
  let currentIndex = 0;
  const galleryImages = Array.from(lightboxTriggers).map(trigger => ({ src: trigger.href, alt: trigger.querySelector('img').alt }));

  function showImage(index) {
    const img = galleryImages[index];
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    currentIndex = index;
  }

  function openLightbox(e) {
    e.preventDefault();
    const index = Array.from(lightboxTriggers).indexOf(e.currentTarget);
    showImage(index);
    lightbox.classList.add('is-visible');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-visible');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function showPrevImage() {
    const newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage(newIndex);
  }

  function showNextImage() {
    const newIndex = (currentIndex + 1) % galleryImages.length;
    showImage(newIndex);
  }

  if (lightbox) {
    lightboxTriggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-visible')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    });
  }

  // --- STICKY CTA BAR ---
  const stickyCtaBar = document.getElementById('sticky-cta-bar');
  if (stickyCtaBar) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (scrolled past it)
        if (!entry.isIntersecting && window.scrollY > 200) {
          stickyCtaBar.classList.add('is-visible');
          stickyCtaBar.setAttribute('aria-hidden', 'false');
        } else {
          stickyCtaBar.classList.remove('is-visible');
          stickyCtaBar.setAttribute('aria-hidden', 'true');
        }
      });
    }, { threshold: 0 });

    const heroSection = document.querySelector('.hero, .page-hero');
    if (heroSection) {
      ctaObserver.observe(heroSection);
    }
  }

});