document.addEventListener('DOMContentLoaded', () => {

  // Mobile Navigation
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const primaryNav = document.querySelector('#primary-navigation');

  if (mobileNavToggle && primaryNav) {
    mobileNavToggle.addEventListener('click', () => {
      const isVisible = primaryNav.getAttribute('data-visible') === 'true';
      primaryNav.setAttribute('data-visible', !isVisible);
      mobileNavToggle.setAttribute('aria-expanded', !isVisible);
      document.body.classList.toggle('nav-open');
    });
  }

  // Sticky Header
  const header = document.querySelector('.sticky-header');
  if (header) {
    const scrollObserver = new IntersectionObserver(
      ([e]) => e.target.classList.toggle('scrolled', e.intersectionRatio < 1),
      { threshold: [1] }
    );
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    document.body.prepend(sentinel);
    scrollObserver.observe(sentinel);
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger');
  if (revealElements.length > 0) {
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
  }

  // Before/After Slider
  const sliders = document.querySelectorAll('[data-module="BeforeAfterSlider"]');
  sliders.forEach(slider => {
    const afterImage = slider.querySelector('.after-image');
    const handle = slider.querySelector('.slider-handle');
    let isDragging = false;

    const moveHandler = (clientX) => {
        const rect = slider.getBoundingClientRect();
        let x = clientX - rect.left;
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        const percent = (x / rect.width) * 100;
        afterImage.style.width = `${percent}%`;
        handle.style.left = `${percent}%`;
    };

    slider.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
    slider.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });

    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchend', () => { isDragging = false; });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) moveHandler(e.clientX);
    });
    document.addEventListener('touchmove', (e) => {
        if (isDragging) moveHandler(e.touches[0].clientX);
    });
  });

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieBanner.classList.add('visible');
      }, 1000);
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

});