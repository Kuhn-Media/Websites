document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    const scrollThreshold = 50;
    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavContainer = document.getElementById('mobile-nav');
  if (mobileNavToggle && mobileNavContainer) {
    const mobileNav = mobileNavContainer.querySelector('.mobile-nav');
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNavContainer.setAttribute('aria-hidden', isExpanded);
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    mobileNavContainer.addEventListener('click', (e) => {
        if (e.target === mobileNavContainer) {
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavContainer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavToggle.getAttribute('aria-expanded') === 'true') {
        mobileNavToggle.click();
      }
    });
  }

  // --- Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-stagger-item');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Use a custom delay if provided
          const delay = parseInt(entry.target.style.getPropertyValue('--delay'));
          if(delay) entry.target.style.transitionDelay = `${delay}ms`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', (event) => {
      if (item.open) {
        // Optional: close other accordions
        // faqItems.forEach(otherItem => {
        //   if (otherItem !== item) {
        //     otherItem.open = false;
        //   }
        // });
      }
    });
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && acceptButton && declineButton) {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      cookieBanner.setAttribute('aria-hidden', 'false');
      cookieBanner.classList.add('active');
    }

    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('active');
      setTimeout(() => cookieBanner.setAttribute('aria-hidden', 'true'), 500);
    });

    declineButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('active');
      setTimeout(() => cookieBanner.setAttribute('aria-hidden', 'true'), 500);
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const heroSection = document.querySelector('.hero, .page-hero');
      const ctaThreshold = heroSection ? heroSection.offsetHeight : 400;

      window.addEventListener('scroll', () => {
          if (window.scrollY > ctaThreshold) {
              stickyCTA.classList.add('visible');
              stickyCTA.setAttribute('aria-hidden', 'false');
          } else {
              stickyCTA.classList.remove('visible');
              stickyCTA.setAttribute('aria-hidden', 'true');
          }
      });
  }

  // --- Lightbox Gallery --- //
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const images = Array.from(galleryItems).map(item => ({
        src: item.href,
        alt: item.querySelector('img').alt
    }));

    function showImage(index) {
        const imgData = images[index];
        lightboxImg.src = imgData.src;
        lightboxImg.alt = imgData.alt;
        currentIndex = index;
    }

    function openLightbox(index) {
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        showImage(index);
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(newIndex);
    });

    lightboxNext.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % images.length;
        showImage(newIndex);
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        }
    });
  }

});