document.addEventListener('DOMContentLoaded', () => {

  // 1. Sticky Header
  const header = document.querySelector('.site-header');
  if (header) {
    const observer = new IntersectionObserver(([e]) => header.classList.toggle('sticky-header', e.intersectionRatio < 1), { threshold: [1] });
    observer.observe(header);
  }

  // 2. Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const primaryNav = document.querySelector('#primary-navigation');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isVisible = primaryNav.getAttribute('data-visible') === 'true';
      primaryNav.setAttribute('data-visible', !isVisible);
      navToggle.setAttribute('aria-expanded', !isVisible);
      document.body.classList.toggle('nav-open');
    });
  }

  // 3. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 4. Sticky Context CTA
  const stickyCTA = document.querySelector('.sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver(([e]) => {
      if (e.boundingClientRect.top < -200) {
        stickyCTA.classList.add('visible');
      } else {
        stickyCTA.classList.remove('visible');
      }
    }, { threshold: [0, 1] });
    const heroSection = document.querySelector('.hero, .page-header');
    if (heroSection) ctaObserver.observe(heroSection);
  }

  // 5. Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    }
    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // 6. Carousel
  const carousel = document.querySelector('.carousel-track');
  if (carousel) {
    const track = carousel;
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button--right');
    const prevButton = document.querySelector('.carousel-button--left');
    const dotsNav = document.querySelector('.carousel-nav');
    const slideWidth = slides[0].getBoundingClientRect().width;

    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    // slides.forEach(setSlidePosition); // Not needed for flexbox approach

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-slide');
        targetDot.classList.add('current-slide');
    }

    // Create dots
    slides.forEach((slide, index) => {
        const button = document.createElement('button');
        button.classList.add('carousel-indicator');
        if (index === 0) button.classList.add('current-slide');
        dotsNav.appendChild(button);
    });
    const dots = Array.from(dotsNav.children);

    let currentIndex = 0;
    const slideCount = slides.length;

    const updateCarousel = (newIndex) => {
        const currentSlide = slides[currentIndex];
        const currentDot = dots[currentIndex];
        
        currentIndex = (newIndex + slideCount) % slideCount;

        const targetSlide = slides[currentIndex];
        const targetDot = dots[currentIndex];

        const amountToMove = targetSlide.offsetLeft;
        track.style.transform = 'translateX(-' + amountToMove + 'px)';
        
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
        currentDot.classList.remove('current-slide');
        targetDot.classList.add('current-slide');
    };

    nextButton.addEventListener('click', e => {
        updateCarousel(currentIndex + 1);
    });

    prevButton.addEventListener('click', e => {
        updateCarousel(currentIndex - 1);
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        updateCarousel(targetIndex);
    });
  }

  // 7. Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  const galleryImages = Array.from(document.querySelectorAll('.gallery-image.lightbox-trigger'));
  let currentImageIndex = 0;

  if (lightbox && lightboxImage && lightboxTriggers.length > 0) {
    const openLightbox = (index) => {
        currentImageIndex = index;
        const imageElement = galleryImages[currentImageIndex];
        lightboxImage.src = imageElement.src;
        lightboxImage.alt = imageElement.alt;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        document.querySelector('.lightbox-close').focus();
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        document.body.style.overflow = '';
    };

    const showNextImage = () => {
        const nextIndex = (currentImageIndex + 1) % galleryImages.length;
        openLightbox(nextIndex);
    };

    const showPrevImage = () => {
        const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(prevIndex);
    };

    galleryImages.forEach((trigger, index) => {
        trigger.addEventListener('click', () => openLightbox(index));
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-next').addEventListener('click', showNextImage);
    document.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);

    document.addEventListener('keydown', (e) => {
        if (!lightbox.hidden) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });
  }
});