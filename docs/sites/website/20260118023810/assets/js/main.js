document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER --- //
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

  // --- 2. MOBILE NAVIGATION --- //
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const mobileClose = document.querySelector('.nav-mobile-close');
  const mobileOverlay = document.querySelector('.nav-mobile-overlay');
  const focusableElementsString = 'a[href], button:not([disabled]), textarea, input, select';
  let firstFocusableElement, lastFocusableElement;

  function openMobileMenu() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    let focusableElements = Array.from(mobileNav.querySelectorAll(focusableElementsString));
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
    firstFocusableElement.focus();
    mobileNav.addEventListener('keydown', trapFocus);
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
    mobileNav.removeEventListener('keydown', trapFocus);
  }

  function trapFocus(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  }

  if (mobileToggle && mobileNav && mobileClose && mobileOverlay) {
    mobileToggle.addEventListener('click', openMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // --- 3. SCROLL REVEAL ANIMATIONS --- //
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.revealDelay || 0;
        const staggerDelay = el.classList.contains('reveal-stagger') ? index * 100 : 0;
        
        setTimeout(() => {
            el.classList.add('visible');
        }, delay + staggerDelay);
        
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // --- 4. TESTIMONIAL SLIDER --- //
  const sliderWrapper = document.querySelector('.testimonial-slider-wrapper');
  if (sliderWrapper) {
    const slider = sliderWrapper.querySelector('.testimonial-slider');
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevButton = sliderWrapper.querySelector('.slider-prev');
    const nextButton = sliderWrapper.querySelector('.slider-next');
    const dotsContainer = sliderWrapper.querySelector('.slider-dots');
    let currentIndex = 0;

    function updateSlider() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.childNodes.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function createDots() {
      if (!dotsContainer) return;
      slides.forEach((_, index) => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `Go to slide ${index + 1}`);
        button.addEventListener('click', () => {
          currentIndex = index;
          updateSlider();
        });
        dotsContainer.appendChild(button);
      });
    }

    if (slides.length > 0) {
        createDots();
        updateSlider();
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % slides.length;
          updateSlider();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
          updateSlider();
        });
    }
    
    // Swipe functionality
    let touchstartX = 0;
    let touchendX = 0;

    slider.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
    }, {passive: true});

    slider.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        if (touchendX < touchstartX) { // Swiped left
            nextButton.click();
        }
        if (touchendX > touchstartX) { // Swiped right
            prevButton.click();
        }
    }
  }

  // --- 5. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('show');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }
  
  // --- 6. STICKY CTA & BACK TO TOP --- //
  const stickyCTA = document.getElementById('sticky-cta');
  const backToTopButton = document.getElementById('back-to-top');
  const footer = document.querySelector('.site-footer');

  if (stickyCTA || backToTopButton) {
      window.addEventListener('scroll', () => {
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.body.scrollHeight;
          const footerHeight = footer ? footer.offsetHeight : 0;

          // Sticky CTA logic
          if (stickyCTA) {
              if (scrollPosition > windowHeight * 0.5 && (scrollPosition + windowHeight) < (documentHeight - footerHeight)) {
                  stickyCTA.classList.add('visible');
                  stickyCTA.setAttribute('aria-hidden', 'false');
              } else {
                  stickyCTA.classList.remove('visible');
                  stickyCTA.setAttribute('aria-hidden', 'true');
              }
          }

          // Back to Top logic
          if (backToTopButton) {
              if (scrollPosition > windowHeight * 0.75) {
                  backToTopButton.classList.add('visible');
              } else {
                  backToTopButton.classList.remove('visible');
              }
          }
      });
  }

  if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

});