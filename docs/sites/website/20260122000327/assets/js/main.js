document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Sticky Header & Scroll Effects ---
  const header = document.querySelector('.site-header');
  const stickyCta = document.getElementById('sticky-cta');
  
  if (header) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-scrolled', entry.boundingClientRect.top < 0);
    }, { threshold: [1] });
    headerObserver.observe(header);

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        header.classList.add('is-scrolled');
        if (stickyCta) stickyCta.classList.add('is-visible');
      } else {
        header.classList.remove('is-scrolled');
        if (stickyCta) stickyCta.classList.remove('is-visible');
      }
      lastScrollY = window.scrollY;
    });
  }

  // --- 2. Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const navLinks = document.querySelectorAll('.mobile-nav-drawer a');

  function openMobileNav() {
    document.body.classList.add('nav-open');
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    mobileNavDrawer.classList.add('is-visible');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileNavBackdrop.classList.add('is-visible');
    mobileNavDrawer.querySelector('a').focus();
  }

  function closeMobileNav() {
    document.body.classList.remove('nav-open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavDrawer.classList.remove('is-visible');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileNavBackdrop.classList.remove('is-visible');
    mobileNavToggle.focus();
  }

  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      isExpanded ? closeMobileNav() : openMobileNav();
    });

    mobileNavClose.addEventListener('click', closeMobileNav);
    mobileNavBackdrop.addEventListener('click', closeMobileNav);
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.href.includes('#')) {
            e.preventDefault();
            closeMobileNav();
            // Allow time for nav to close before scrolling
            setTimeout(() => {
                const target = document.querySelector(link.hash);
                if(target) target.scrollIntoView({ behavior: 'smooth' });
            }, 350);
        } else {
            closeMobileNav();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        closeMobileNav();
      }
    });
  }

  // --- 3. Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-right, .reveal-fade-left, .reveal-stagger');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-stagger')) {
            entry.target.style.transitionDelay = `${index * 80}ms`;
          }
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // --- 4. Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieBanner.classList.add('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }, 1000);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // --- 5. Carousel ---
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(carousel => {
    const slides = carousel.querySelector('.carousel-slides');
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let slideItems = Array.from(slides.children);
    let currentIndex = 0;

    if (slideItems.length <= 1) return;

    // Create dots
    slideItems.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Gehe zu Folie ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    function updateCarousel() {
      slides.scrollTo({ left: slideItems[currentIndex].offsetLeft, behavior: 'smooth' });
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % slideItems.length;
      updateCarousel();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + slideItems.length) % slideItems.length;
      updateCarousel();
    }

    nextButton.addEventListener('click', showNext);
    prevButton.addEventListener('click', showPrev);

    updateCarousel();
  });

  // --- 6. Lightbox --- 
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxContent = lightbox.querySelector('.lightbox-content img');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    let galleryItems = [];
    let currentIndex = 0;

    document.querySelectorAll('[data-lightbox="gallery"]').forEach((item, index) => {
      galleryItems.push(item.href);
      item.addEventListener('click', e => {
        e.preventDefault();
        currentIndex = index;
        openLightbox();
      });
    });

    function updateImage() {
      lightboxContent.src = galleryItems[currentIndex];
    }

    function openLightbox() {
      updateImage();
      lightbox.classList.add('is-visible');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-visible');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateImage();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateImage();
    }

    closeButton.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    nextButton.addEventListener('click', showNext);
    prevButton.addEventListener('click', showPrev);

    document.addEventListener('keydown', e => {
      if (lightbox.classList.contains('is-visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      }
    });
  }
});