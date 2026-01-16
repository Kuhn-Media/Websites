document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
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

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.querySelector('.mobile-nav-menu');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (mobileNavToggle && mobileNavMenu) {
    const openMenu = () => {
      mobileNavMenu.classList.add('is-open');
      mobileNavMenu.setAttribute('aria-hidden', 'false');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileNavMenu.classList.remove('is-open');
      mobileNavMenu.setAttribute('aria-hidden', 'true');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    mobileNavToggle.addEventListener('click', openMenu);
    mobileNavClose.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
    });
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieConsent = localStorage.getItem('cookieConsent');

  if (!cookieConsent && cookieBanner) {
    cookieBanner.classList.add('is-visible');
    cookieBanner.setAttribute('aria-hidden', 'false');
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const heroSection = document.querySelector('.hero');
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                stickyCTA.classList.add('is-visible');
                stickyCTA.setAttribute('aria-hidden', 'false');
            } else {
                stickyCTA.classList.remove('is-visible');
                stickyCTA.setAttribute('aria-hidden', 'true');
            }
        });
    }, { threshold: 0 });

    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

  // --- Lightbox Gallery --- //
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
  let currentIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    const images = Array.from(galleryItems).map(item => ({
      src: item.href,
      alt: item.querySelector('img').alt
    }));

    const showImage = (index) => {
      const img = images[index];
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      currentIndex = index;
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        showImage(index);
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
    };

    const showNext = () => showImage((currentIndex + 1) % images.length);
    const showPrev = () => showImage((currentIndex - 1 + images.length) % images.length);

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('is-open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      }
    });
  }

});