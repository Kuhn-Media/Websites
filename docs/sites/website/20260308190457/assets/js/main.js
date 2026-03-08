document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  function openMobileNav() {
    if (mobileNav && mobileNavToggle) {
      mobileNav.classList.add('open');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      mobileNav.setAttribute('aria-hidden', 'false');
    }
  }

  function closeMobileNav() {
    if (mobileNav && mobileNavToggle) {
      mobileNav.classList.remove('open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  }

  if (mobileNavToggle && mobileNav) {
    mobileNavToggle.addEventListener('click', openMobileNav);
  }
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  // --- Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  setTimeout(() => {
    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
      cookieBanner.style.display = 'flex';
    }
  }, 2000);

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'false');
      cookieBanner.style.display = 'none';
    });
  }

  // --- Contact Form Simulation --- //
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formStatus = document.getElementById('form-status');
      formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird gesendet...';
      formStatus.style.color = 'var(--color-primary)';

      setTimeout(() => {
        formStatus.textContent = 'Nachricht erfolgreich gesendet. Wir melden uns in Kürze.';
        formStatus.style.color = 'var(--color-accent2)';
        contactForm.reset();
      }, 2000);
    });
  }

  // --- Global Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImage = document.getElementById('km-lightbox-image');
  const lightboxTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
  let currentIndex = 0;

  function showLightbox(index) {
    if (!lightbox || !lightboxImage || lightboxTriggers.length === 0) return;
    currentIndex = index;
    const trigger = lightboxTriggers[currentIndex];
    const imagePath = trigger.getAttribute('data-km-image') || trigger.src;
    const altText = trigger.alt || 'Detailansicht';
    
    // Adjust path for subdirectories
    const relativePath = window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../';
    lightboxImage.src = relativePath + imagePath;
    lightboxImage.alt = altText;
    
    lightbox.style.display = 'flex';
    setTimeout(() => lightbox.classList.add('visible'), 10);
    document.body.classList.add('no-scroll');
    addLightboxEventListeners();
  }

  function hideLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('visible');
    setTimeout(() => {
      lightbox.style.display = 'none';
      lightboxImage.src = '';
    }, 300);
    document.body.classList.remove('no-scroll');
    removeLightboxEventListeners();
  }

  function showNextImage() {
    const nextIndex = (currentIndex + 1) % lightboxTriggers.length;
    showLightbox(nextIndex);
  }

  function showPrevImage() {
    const prevIndex = (currentIndex - 1 + lightboxTriggers.length) % lightboxTriggers.length;
    showLightbox(prevIndex);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') hideLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  }

  function addLightboxEventListeners() {
    document.addEventListener('keydown', handleKeyDown);
  }

  function removeLightboxEventListeners() {
    document.removeEventListener('keydown', handleKeyDown);
  }

  if (lightbox) {
    lightboxTriggers.forEach((trigger, index) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        showLightbox(index);
      });
    });

    lightbox.querySelector('.km-lightbox-close').addEventListener('click', hideLightbox);
    lightbox.querySelector('.km-lightbox-next').addEventListener('click', showNextImage);
    lightbox.querySelector('.km-lightbox-prev').addEventListener('click', showPrevImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) hideLightbox();
    });
  }

  // --- Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (scrolled past hero)
        if (!entry.isIntersecting && window.scrollY > 300) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

});