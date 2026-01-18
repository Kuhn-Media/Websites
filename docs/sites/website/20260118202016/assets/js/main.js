document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // --- 2. Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- 3. Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal-container');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100); // Staggered delay
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- 4. Before/After Slider --- //
  const slider = document.querySelector('.before-after-slider');
  if (slider) {
    const afterImage = slider.querySelector('.after');
    const handle = slider.querySelector('.slider-handle');
    let isDragging = false;

    const moveSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      let newX = x - rect.left;
      if (newX < 0) newX = 0;
      if (newX > rect.width) newX = rect.width;
      const percentage = (newX / rect.width) * 100;
      afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      handle.style.left = `${percentage}%`;
      handle.setAttribute('aria-valuenow', Math.round(percentage));
    };

    slider.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
    slider.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) moveSlider(e.clientX);
    });
    window.addEventListener('touchmove', (e) => {
      if (isDragging) moveSlider(e.touches[0].clientX);
    });

    // Keyboard accessibility
    slider.addEventListener('keydown', (e) => {
        const currentPercentage = parseFloat(handle.style.left) || 50;
        if (e.key === 'ArrowLeft') {
            const newPercentage = Math.max(0, currentPercentage - 5);
            afterImage.style.clipPath = `inset(0 0 0 ${newPercentage}%)`;
            handle.style.left = `${newPercentage}%`;
        } else if (e.key === 'ArrowRight') {
            const newPercentage = Math.min(100, currentPercentage + 5);
            afterImage.style.clipPath = `inset(0 0 0 ${newPercentage}%)`;
            handle.style.left = `${newPercentage}%`;
        }
    });
  }

  // --- 5. Cookie Banner --- //
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAcceptBtn = document.querySelector('.cookie-accept');
  if (cookieBanner && cookieAcceptBtn) {
    setTimeout(() => {
      if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('visible'), 10);
      }
    }, 2000);

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('visible');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });
  }

  // --- 6. Sticky CTA --- //
  const stickyCTA = document.querySelector('.sticky-cta');
  if (stickyCTA) {
    const heroSection = document.querySelector('.hero');
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyCTA.hidden = false;
          setTimeout(() => stickyCTA.classList.add('visible'), 10);
        } else {
          stickyCTA.classList.remove('visible');
          setTimeout(() => stickyCTA.hidden = true, 500);
        }
      });
    }, { threshold: 0.1 });

    if (heroSection) {
      ctaObserver.observe(heroSection);
    }
  }

  // --- 7. Magnetic Button (WOW Effect) --- //
  const magneticButtons = document.querySelectorAll('.magnetic-button');
  const isMotionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isMotionReduced) {
    magneticButtons.forEach(button => {
      const strength = 30;
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0,0)';
      });
    });
  }

});