document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Sticky Header --- //
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
    scrollHandler(); // Initial check
  }

  // --- 2. Mobile Navigation --- //
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- 3. Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  if (revealItems.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 100); // Staggered delay
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealItems.forEach(item => {
      observer.observe(item);
    });
  }

  // --- 4. FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        answer.hidden = isExpanded;
      });
    }
  });
  
  // --- Job Accordion --- //
  const jobItems = document.querySelectorAll('.job-item');
  jobItems.forEach(item => {
    const title = item.querySelector('.job-title');
    const details = item.querySelector('.job-details');
    if (title && details) {
      title.addEventListener('click', () => {
        const isExpanded = title.getAttribute('aria-expanded') === 'true';
        title.setAttribute('aria-expanded', !isExpanded);
        details.hidden = isExpanded;
      });
    }
  });

  // --- 5. Before/After Slider --- //
  const slider = document.getElementById('before-after-slider');
  if (slider) {
    const afterContainer = document.getElementById('after-image-container');
    const handle = document.getElementById('ba-slider-handle');
    let isDragging = false;

    const moveHandler = (x) => {
        const rect = slider.getBoundingClientRect();
        let newX = x - rect.left;
        if (newX < 0) newX = 0;
        if (newX > rect.width) newX = rect.width;
        const percentage = (newX / rect.width) * 100;
        handle.style.left = percentage + '%';
        afterContainer.style.width = percentage + '%';
    };

    slider.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
    slider.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });

    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) moveHandler(e.clientX);
    });
    window.addEventListener('touchmove', (e) => {
        if (isDragging) moveHandler(e.touches[0].clientX);
    });
  }

  // --- 6. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && acceptBtn && declineBtn) {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('visible'), 100);
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });

    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- 7. Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaScrollHandler = () => {
          const heroHeight = document.querySelector('.hero')?.offsetHeight || document.querySelector('.page-hero')?.offsetHeight || 400;
          if (window.scrollY > heroHeight) {
              stickyCTA.hidden = false;
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
      };
      window.addEventListener('scroll', ctaScrollHandler, { passive: true });
  }
  
  // --- 8. Lightbox --- //
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const showImage = (index) => {
      lightboxImg.src = galleryImages[index].src;
      currentIndex = index;
    };

    galleryImages.forEach((img, index) => {
      img.addEventListener('click', () => {
        lightbox.hidden = false;
        showImage(index);
      });
    });

    closeBtn.addEventListener('click', () => { lightbox.hidden = true; });
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryImages.length - 1;
      showImage(currentIndex);
    });
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < galleryImages.length - 1) ? currentIndex + 1 : 0;
      showImage(currentIndex);
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.hidden = true;
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') lightbox.hidden = true;
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  }
});