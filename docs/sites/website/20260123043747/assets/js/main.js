document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Sticky Header --- //
  const header = document.querySelector('.sticky-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- 2. Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavDrawer = document.querySelector('#mobile-nav-drawer');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (mobileNavToggle && mobileNavDrawer && mobileNavOverlay) {
    const openMenu = () => {
      mobileNavDrawer.classList.add('open');
      mobileNavOverlay.classList.add('open');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileNavDrawer.classList.remove('open');
      mobileNavOverlay.classList.remove('open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    mobileNavToggle.addEventListener('click', openMenu);
    mobileNavOverlay.addEventListener('click', closeMenu);
    mobileNavClose.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // --- 3. Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay) || 0;
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
  }

  // --- 4. FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.padding = '0 0 var(--spacing-lg) 0';
        } else {
          answer.style.maxHeight = '0';
          answer.style.padding = '0';
        }
      });
    });
  }

  // --- 5. Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-dots');

    const slideWidth = slides[0].getBoundingClientRect().width;
    carousel.style.display = 'flex';

    const setSlidePosition = (slide, index) => {
        // No need to set position if we use scrollLeft
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (targetIndex) => {
        carousel.scrollLeft = targetIndex * carousel.offsetWidth;
        updateControls(targetIndex);
    };

    const updateControls = (currentIndex) => {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    };

    // Create dots
    slides.forEach((_, i) => {
      const button = document.createElement('button');
      button.classList.add('dot');
      if (i === 0) button.classList.add('active');
      dotsNav.appendChild(button);
      button.addEventListener('click', () => moveToSlide(i));
    });
    const dots = Array.from(dotsNav.children);

    nextButton.addEventListener('click', () => {
        const currentIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
        const nextIndex = currentIndex + 1;
        if (nextIndex < slides.length) moveToSlide(nextIndex);
    });

    prevButton.addEventListener('click', () => {
        const currentIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) moveToSlide(prevIndex);
    });

    // Swipe functionality
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => { isDown = false; carousel.classList.remove('active'); });
    carousel.addEventListener('mouseup', () => { isDown = false; carousel.classList.remove('active'); });
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; //scroll-fast
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Update dots on scroll
    carousel.addEventListener('scroll', () => {
        const currentIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
        updateControls(currentIndex);
    });
    
    window.addEventListener('resize', () => moveToSlide(0));

    updateControls(0);
  }

  // --- 6. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('visible');
      });
  }

  // --- 7. Sticky CTA Bar --- //
  const stickyCtaBar = document.getElementById('sticky-cta-bar');
  if (stickyCtaBar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight * 0.5) {
            stickyCtaBar.classList.add('visible');
        } else {
            stickyCtaBar.classList.remove('visible');
        }
    });
  }

});