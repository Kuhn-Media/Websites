document.addEventListener('DOMContentLoaded', () => {

  // 1. Sticky Header
  const header = document.getElementById('site-header');
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

  // 2. Mobile Navigation
  const navToggle = document.getElementById('mobile-nav-toggle');
  const mainNavList = document.getElementById('main-nav-list');
  if (navToggle && mainNavList) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // 3. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
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

  // 4. Before & After Slider
  const slider = document.getElementById('before-after-slider');
  if (slider) {
    const handle = slider.querySelector('.ba-slider-handle');
    const afterImage = slider.querySelector('.ba-image-after');

    let isDragging = false;

    const moveHandler = (x) => {
      const rect = slider.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width * 100;
      pos = Math.max(0, Math.min(100, pos));
      handle.style.left = `${pos}%`;
      afterImage.style.clipPath = `inset(0 0 0 ${pos}%)`;
      handle.setAttribute('aria-valuenow', Math.round(pos));
    };

    const startDrag = (e) => {
      e.preventDefault();
      isDragging = true;
    };

    const onDrag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      moveHandler(x);
    };

    const stopDrag = () => {
      isDragging = false;
    };

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag, { passive: false });

    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    // Keyboard support
    handle.addEventListener('keydown', (e) => {
        const currentPos = parseFloat(handle.style.left) || 50;
        if (e.key === 'ArrowLeft') {
            const newPos = Math.max(0, currentPos - 2);
            handle.style.left = `${newPos}%`;
            afterImage.style.clipPath = `inset(0 0 0 ${newPos}%)`;
        } else if (e.key === 'ArrowRight') {
            const newPos = Math.min(100, currentPos + 2);
            handle.style.left = `${newPos}%`;
            afterImage.style.clipPath = `inset(0 0 0 ${newPos}%)`;
        }
    });
  }

  // 5. Magnetic Button Effect
  const magneticLinks = document.querySelectorAll('.magnetic-link');
  if (magneticLinks.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    magneticLinks.forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const { offsetX, offsetY, target } = e;
        const { clientWidth, clientHeight } = target;
        const x = (offsetX / clientWidth - 0.5) * 30;
        const y = (offsetY / clientHeight - 0.5) * 30;
        target.style.transform = `translate(${x}px, ${y}px)`;
      });

      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translate(0, 0)';
      });
    });
  }

  // 6. Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('accept-cookies');

  if (cookieBanner && acceptButton) {
    // Check if consent has already been given
    if (!localStorage.getItem('cookie_consent')) {
      cookieBanner.hidden = false;
      setTimeout(() => {
        cookieBanner.classList.add('visible');
      }, 100);
    }

    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'true');
      cookieBanner.classList.remove('visible');
      setTimeout(() => {
        cookieBanner.hidden = true;
      }, 500);
    });
  }

});