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
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-open');
      const isExpanded = mainNav.classList.contains('mobile-open');
      menuToggle.setAttribute('aria-expanded', isExpanded);
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
  }

  // --- Scroll Reveal --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

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

  // --- Carousel --- //
  const carousel = document.querySelector('.carousel-track');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const moveToSlide = (track, currentSlide, targetSlide) => {
      track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
      currentSlide.classList.remove('active');
      targetSlide.classList.add('active');
    };

    const updateDots = (currentDot, targetDot) => {
        if (currentDot) currentDot.classList.remove('active');
        if (targetDot) targetDot.classList.add('active');
    }

    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.addEventListener('click', e => {
            const currentSlide = carousel.querySelector('.active');
            const currentDot = dotsNav.querySelector('.active');
            currentIndex = index;
            moveToSlide(carousel, currentSlide, slides[currentIndex]);
            updateDots(currentDot, dot);
        });
        dotsNav.appendChild(dot);
    });
    
    const dots = Array.from(dotsNav.children);
    slides[0].classList.add('active');
    dots[0].classList.add('active');

    const updateSlidePosition = () => {
        carousel.style.transform = 'translateX(-' + currentIndex * 100 + '%)';
        const currentDot = dotsNav.querySelector('.active');
        updateDots(currentDot, dots[currentIndex]);
    }

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlidePosition();
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlidePosition();
    });
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryImages = document.querySelectorAll('.gallery-image');
  let currentImageIndex;

  if (lightbox) {
    const openLightbox = (index) => {
      currentImageIndex = index;
      lightboxImg.src = galleryImages[currentImageIndex].src;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    const showNextImage = () => {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      lightboxImg.src = galleryImages[currentImageIndex].src;
    };

    const showPrevImage = () => {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[currentImageIndex].src;
    };

    galleryImages.forEach((img, index) => {
      img.addEventListener('click', () => openLightbox(index));
    });

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-next').addEventListener('click', showNextImage);
    document.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
      }
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.hidden = false;
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.hidden = true;
    });
  }

  if (declineButton) {
    declineButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.hidden = true;
    });
  }
  
  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past hero)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });
      
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});