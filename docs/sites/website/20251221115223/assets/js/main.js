document.addEventListener('DOMContentLoaded', function() {

  // Mobile Menu
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('is-active');
      mainNav.classList.toggle('is-active');
      document.body.style.overflow = mainNav.classList.contains('is-active') ? 'hidden' : '';
      menuToggle.setAttribute('aria-expanded', mainNav.classList.contains('is-active'));
    });
  }

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

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal-stagger');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 90); // Stagger delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true' || false;
      header.setAttribute('aria-expanded', !expanded);
      const panel = header.nextElementSibling;
      // Optional: close other accordions
      // accordionHeaders.forEach(h => { if (h !== header) { h.setAttribute('aria-expanded', 'false'); } });
    });
  });

  // Interactive House Infographic
  const hotspots = document.querySelectorAll('.hotspot');
  const infoBox = document.getElementById('house-info-box');
  if (hotspots.length > 0 && infoBox) {
    hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        infoBox.textContent = hotspot.getAttribute('data-info');
      });
       hotspot.addEventListener('keypress', (e) => {
         if (e.key === 'Enter') {
            infoBox.textContent = hotspot.getAttribute('data-info');
         }
      });
    });
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }, { rootMargin: '0px 0px -100% 0px' }); // Trigger when hero is fully out of view
      const heroSection = document.getElementById('home-hero');
      if(heroSection) ctaObserver.observe(heroSection);
  }

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
    let currentIndex = 0;

    const showImage = (index) => {
      const item = galleryItems[index];
      const imgSrc = item.getAttribute('href');
      const imgAlt = item.querySelector('img').getAttribute('alt');
      lightbox.querySelector('img').setAttribute('src', imgSrc);
      lightbox.querySelector('img').setAttribute('alt', imgAlt);
      currentIndex = index;
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        showImage(index);
      });
    });

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    const showNext = () => showImage((currentIndex + 1) % galleryItems.length);
    const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      }
    });
  }
});