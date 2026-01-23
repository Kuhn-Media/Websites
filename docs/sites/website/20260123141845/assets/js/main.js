document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    const scrollHandler = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
  }

  // --- Scroll Animations --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Accordion --- //
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (header && content) {
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0';
        }
      });
    }
  });

  // --- Testimonial/Gallery Slider --- //
  const slider = document.getElementById('testimonial-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.getElementById('slider-dots');
    let currentIndex = 0;
    let slideWidth = slides[0].clientWidth;

    const goToSlide = (index) => {
      slider.style.transition = 'transform 0.5s ease-in-out';
      slider.style.transform = `translateX(-${index * slideWidth}px)`;
      updateDots(index);
      currentIndex = index;
    };

    const updateDots = (index) => {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const handleResize = () => {
        slideWidth = slides[0].clientWidth;
        goToSlide(currentIndex);
    }

    window.addEventListener('resize', handleResize);

    nextBtn.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    });

    // Touch controls
    let touchstartX = 0;
    let touchendX = 0;

    slider.addEventListener('touchstart', (e) => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextBtn.click();
        if (touchendX > touchstartX) prevBtn.click();
    });

    goToSlide(0);
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
    });
  }

});