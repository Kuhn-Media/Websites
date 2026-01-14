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
  const navDrawer = document.getElementById('mobile-nav-drawer');
  const navOverlay = document.querySelector('.mobile-nav-overlay');
  const navClose = document.querySelector('.mobile-nav-close');

  const openNav = () => {
    navDrawer.classList.add('open');
    navOverlay.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  };

  const closeNav = () => {
    navDrawer.classList.remove('open');
    navOverlay.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  if (navToggle && navDrawer && navOverlay && navClose) {
    navToggle.addEventListener('click', openNav);
    navClose.addEventListener('click', closeNav);
    navOverlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        closeNav();
      }
    });
  }

  // --- Scroll Reveal --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
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
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieAccepted')) {
      setTimeout(() => {
        cookieBanner.classList.add('visible');
      }, 1000);
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // --- Carousel --- //
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(wrapper => {
    const carousel = wrapper.querySelector('.carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = wrapper.querySelector('.carousel-btn.prev');
    const nextBtn = wrapper.querySelector('.carousel-btn.next');
    const dotsContainer = wrapper.querySelector('.carousel-dots');
    let currentIndex = 0;

    if (!carousel || slides.length === 0) return;

    const updateCarousel = () => {
      const slideWidth = slides[0].offsetWidth;
      carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      updateDots();
    };

    const updateDots = () => {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.ariaLabel = `Go to slide ${index + 1}`;
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
      });
    }

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  });

  // --- Lightbox --- //
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  const galleryImages = Array.from(lightboxTriggers);
  let currentImageIndex = 0;

  if (lightbox && lightboxImage && lightboxTriggers.length > 0) {
    const openLightbox = (index) => {
      currentImageIndex = index;
      const trigger = galleryImages[index];
      lightboxImage.src = trigger.dataset.src;
      lightboxImage.alt = trigger.dataset.alt;
      if(lightboxCaption) lightboxCaption.textContent = trigger.dataset.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
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

    lightboxTriggers.forEach((trigger, index) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
      }
    });
  }

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.style.display = isExpanded ? 'none' : 'block';
    });
  });

  // --- Sticky CTA & Back to Top --- //
  const stickyCta = document.getElementById('sticky-cta');
  const backToTop = document.getElementById('back-to-top');
  if(stickyCta || backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        if(stickyCta) stickyCta.classList.add('visible');
        if(backToTop) backToTop.classList.add('visible');
      } else {
        if(stickyCta) stickyCta.classList.remove('visible');
        if(backToTop) backToTop.classList.remove('visible');
      }
    });
  }
  if(backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});