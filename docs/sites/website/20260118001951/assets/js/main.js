document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY HEADER --- //
  const header = document.querySelector('.sticky-header');
  if (header) {
    const scrollHandler = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler(); // Initial check
  }

  // --- 2. MOBILE NAVIGATION --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navWrapper = document.querySelector('.nav-wrapper');
  if (navToggle && navWrapper) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navWrapper.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- 3. SCROLL REVEAL ANIMATIONS --- //
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- 4. BEFORE/AFTER SLIDER --- //
  const sliders = document.querySelectorAll('.before-after-slider');
  sliders.forEach(slider => {
    const beforeImage = slider.querySelector('.before-image');
    const sliderInput = slider.querySelector('.slider-range');
    const handle = slider.querySelector('.slider-handle');

    if (beforeImage && sliderInput && handle) {
        const updateSlider = (value) => {
            beforeImage.style.width = value + '%';
            handle.style.left = value + '%';
        }

        sliderInput.addEventListener('input', (e) => {
            updateSlider(e.target.value);
        });

        // Touch support
        let isDragging = false;
        slider.addEventListener('touchstart', () => isDragging = true, { passive: true });
        slider.addEventListener('touchend', () => isDragging = false);
        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const rect = slider.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            sliderInput.value = percentage;
            updateSlider(percentage);
        }, { passive: true });
    }
  });

  // --- 5. ACCORDION (FAQ) --- //
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Optional: Close other accordions
      // accordionItems.forEach(i => {
      //   i.classList.remove('active');
      //   i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      //   i.querySelector('.accordion-content').style.maxHeight = null;
      // });

      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });

  // --- 6. LIGHTBOX GALLERY --- //
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
  let currentIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    const showImage = (index) => {
      const item = galleryItems[index];
      const imgSrc = item.href;
      const imgTitle = item.dataset.title || '';
      lightboxImg.src = imgSrc;
      lightboxImg.alt = item.querySelector('img').alt;
      lightboxCaption.textContent = imgTitle;
      currentIndex = index;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    };

    const hideLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
    const showNext = () => showImage((currentIndex + 1) % galleryItems.length);

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        showImage(index);
      });
    });

    closeBtn.addEventListener('click', hideLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) hideLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') hideLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  }

  // --- 7. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && acceptBtn && declineBtn) {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      cookieBanner.hidden = false;
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.hidden = true;
    }

    acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    declineBtn.addEventListener('click', () => handleConsent('declined'));
  }

  // --- 8. STICKY CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show CTA when hero is NOT intersecting (i.e., scrolled past)
            stickyCta.hidden = entry.isIntersecting;
        });
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

});