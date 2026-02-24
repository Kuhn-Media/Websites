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
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.getElementById('mobile-nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- Scroll Animations --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, index * 100); // Staggered delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
    });
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  const cookieConsent = localStorage.getItem('cookie_consent');

  if (!cookieConsent && cookieBanner) {
    cookieBanner.classList.add('show');
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'accepted');
      cookieBanner.style.display = 'none';
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'declined');
      cookieBanner.style.display = 'none';
    });
  }

  // --- Global Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImage = document.getElementById('km-lightbox-image');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  let currentImageIndex = 0;
  const galleryImages = Array.from(lightboxTriggers).map(img => ({ src: img.dataset.kmImage, alt: img.alt }));

  function openLightbox(index) {
    if (!lightbox || !lightboxImage || galleryImages.length === 0) return;
    currentImageIndex = index;
    const relativePath = lightboxImage.src.includes('/leistungen/') || lightboxImage.src.includes('/ueber-uns/') ? '../' : '';
    lightboxImage.src = relativePath + galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleLightboxKeydown);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleLightboxKeydown);
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    openLightbox(currentImageIndex);
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentImageIndex);
  }

  function handleLightboxKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  }

  lightboxTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => openLightbox(index));
  });

  if (lightbox) {
    lightbox.querySelector('.km-lightbox-backdrop').addEventListener('click', closeLightbox);
    lightbox.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.km-lightbox-next').addEventListener('click', showNextImage);
    lightbox.querySelector('.km-lightbox-prev').addEventListener('click', showPrevImage);
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show CTA when hero is NOT intersecting (scrolled past)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });

      const heroSection = document.querySelector('.hero, .hero-subpage');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});