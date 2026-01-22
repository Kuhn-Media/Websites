document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
    const scrollThreshold = parseInt(headerHeight, 10) || 80;
    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- 2. Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav__links a');

  const openMenu = () => {
    document.body.classList.add('mobile-nav-open');
    mobileNavDrawer.classList.add('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    navLinks[0]?.focus();
  };

  const closeMenu = () => {
    document.body.classList.remove('mobile-nav-open');
    mobileNavDrawer.classList.remove('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavToggle.focus();
  };

  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener('click', openMenu);
    mobileNavClose.addEventListener('click', closeMenu);
    mobileNavBackdrop.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
        closeMenu();
      }
    });

    // Focus Trap
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const firstFocusableElement = mobileNavDrawer.querySelectorAll(focusableElements)[0];
    const focusableContent = mobileNavDrawer.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', function(e) {
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed || !document.body.classList.contains('mobile-nav-open')) return;

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
    });
  }

  // --- 3. Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-stagger')) {
          const children = entry.target.children;
          for (let i = 0; i < children.length; i++) {
            children[i].style.setProperty('--stagger-index', i);
            children[i].classList.add('is-visible');
          }
        } else {
          entry.target.classList.add('is-visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // --- 4. FAQ Accordion --- //
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

  // --- 5. Cookie Banner --- //
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

  // --- 6. Before & After Slider --- //
  const sliders = document.querySelectorAll('.before-after-slider');
  sliders.forEach(slider => {
    const afterContainer = slider.querySelector('.after-image-container');
    const handle = slider.querySelector('.slider-handle');
    let isDragging = false;

    const moveSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      pos = Math.max(0, Math.min(1, pos));
      afterContainer.style.width = `${pos * 100}%`;
      handle.style.left = `${pos * 100}%`;
    };

    slider.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
    slider.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchend', () => { isDragging = false; });
    document.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });
    document.addEventListener('touchmove', (e) => { if (isDragging) moveSlider(e.touches[0].clientX); });
  });

  // --- 7. Lightbox Gallery --- //
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const galleryLinks = document.querySelectorAll('[data-lightbox]');
    const galleryItems = Array.from(galleryLinks).map(link => ({ src: link.href, title: link.dataset.title }));
    let currentIndex = 0;

    const showImage = (index) => {
      const item = galleryItems[index];
      lightbox.querySelector('.lightbox__image').src = item.src;
      lightbox.querySelector('.lightbox__caption').textContent = item.title;
      currentIndex = index;
    };

    const openLightbox = (e) => {
      e.preventDefault();
      const index = galleryItems.findIndex(item => item.src === e.currentTarget.href);
      if (index > -1) {
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        showImage(index);
      }
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    const prevImage = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
    const nextImage = () => showImage((currentIndex + 1) % galleryItems.length);

    galleryLinks.forEach(link => link.addEventListener('click', openLightbox));
    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__prev').addEventListener('click', prevImage);
    lightbox.querySelector('.lightbox__next').addEventListener('click', nextImage);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    });
  }

  // --- 8. Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaFooter = document.querySelector('.cta-footer');
      if (ctaFooter) {
          const ctaObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  // Show sticky CTA when the footer CTA is NOT in view
                  if (!entry.isIntersecting && window.scrollY > 400) {
                      stickyCTA.classList.add('visible');
                      stickyCTA.hidden = false;
                  } else {
                      stickyCTA.classList.remove('visible');
                  }
              });
          }, { rootMargin: '0px 0px 100px 0px' });
          ctaObserver.observe(ctaFooter);
      }
  }

});