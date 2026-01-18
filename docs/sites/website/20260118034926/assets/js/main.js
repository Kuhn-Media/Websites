document.addEventListener('DOMContentLoaded', () => {

  // --- Reduced Motion Check ---
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;
  motionQuery.addEventListener('change', () => {
    prefersReducedMotion = motionQuery.matches;
  });

  // --- Sticky Header ---
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavContainer = document.getElementById('mobile-nav');
  if (mobileNavToggle && mobileNavContainer) {
    const mobileNavClose = mobileNavContainer.querySelector('.mobile-nav-close');
    const mobileNavOverlay = mobileNavContainer.querySelector('.mobile-nav-overlay');
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let firstFocusableElement, lastFocusableElement;

    const openMenu = () => {
      mobileNavContainer.classList.add('is-open');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const focusableContent = Array.from(mobileNavContainer.querySelectorAll(focusableElements));
      firstFocusableElement = focusableContent[0];
      lastFocusableElement = focusableContent[focusableContent.length - 1];
      firstFocusableElement.focus();
    };

    const closeMenu = () => {
      mobileNavContainer.classList.remove('is-open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      mobileNavToggle.focus();
    };

    mobileNavToggle.addEventListener('click', openMenu);
    mobileNavClose.addEventListener('click', closeMenu);
    mobileNavOverlay.addEventListener('click', closeMenu);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavContainer.classList.contains('is-open')) {
            closeMenu();
        }
        if (e.key === 'Tab' && mobileNavContainer.classList.contains('is-open')) {
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
  }

  // --- Scroll Reveal Animation ---
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal-group');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- FAQ Accordion ---
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

  // --- Testimonial Slider ---
  const slider = document.getElementById('testimonial-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentIndex = 0;

    const updateSlider = () => {
      const slideWidth = slides[0].offsetWidth;
      slider.scrollTo({ left: currentIndex * slideWidth, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      updateDots();
    };

    const updateDots = () => {
      Array.from(dotsContainer.children).forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });

    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) nextBtn.click();
        if (touchEndX - touchStartX > 50) prevBtn.click();
    }, { passive: true });

    updateSlider();
    window.addEventListener('resize', updateSlider);
  }

  // --- Lightbox --- 
  const gallery = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  if (gallery && lightbox) {
      const galleryItems = gallery.querySelectorAll('a');
      const lightboxImg = document.getElementById('lightbox-img');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      let currentIndex = 0;

      const showImage = (index) => {
          const item = galleryItems[index];
          lightboxImg.src = item.href;
          lightboxImg.alt = item.querySelector('img').alt;
          currentIndex = index;
          lightbox.classList.add('visible');
          lightbox.hidden = false;
          document.body.style.overflow = 'hidden';
          closeBtn.focus();
      };

      const hideLightbox = () => {
          lightbox.classList.remove('visible');
          lightbox.hidden = true;
          document.body.style.overflow = '';
          galleryItems[currentIndex].focus();
      };

      galleryItems.forEach((item, index) => {
          item.addEventListener('click', (e) => {
              e.preventDefault();
              showImage(index);
          });
      });

      closeBtn.addEventListener('click', hideLightbox);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) hideLightbox(); });
      prevBtn.addEventListener('click', () => { showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length); });
      nextBtn.addEventListener('click', () => { showImage((currentIndex + 1) % galleryItems.length); });

      document.addEventListener('keydown', (e) => {
          if (!lightbox.hidden) {
              if (e.key === 'Escape') hideLightbox();
              if (e.key === 'ArrowLeft') prevBtn.click();
              if (e.key === 'ArrowRight') nextBtn.click();
          }
      });
  }

  // --- Cookie Banner ---
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

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          const showCtaThreshold = heroSection.offsetHeight;
          const handleScrollCTA = () => {
              if (window.scrollY > showCtaThreshold) {
                  stickyCTA.classList.add('visible');
                  stickyCTA.hidden = false;
              } else {
                  stickyCTA.classList.remove('visible');
              }
          };
          window.addEventListener('scroll', handleScrollCTA, { passive: true });
      }
  }

});