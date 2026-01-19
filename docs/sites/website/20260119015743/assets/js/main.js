document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header ---
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('is-open');
      navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', (e) => {
        if (!navList.contains(e.target) && !navToggle.contains(e.target) && navList.classList.contains('is-open')) {
            navToggle.classList.remove('is-open');
            navList.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
  }

  // --- Scroll Animations ---
  const revealElements = document.querySelectorAll('.animate-reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, index * 100); 
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- FAQ Accordion ---
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

  // --- Before/After Slider ---
  const slider = document.getElementById('before-after-slider');
  if (slider) {
    const afterImage = slider.querySelector('.after-image');
    const handle = slider.querySelector('.slider-handle');
    let isDragging = false;

    const moveSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      let newX = x - rect.left;
      if (newX < 0) newX = 0;
      if (newX > rect.width) newX = rect.width;
      const percentage = (newX / rect.width) * 100;
      afterImage.style.width = percentage + '%';
      handle.style.left = percentage + '%';
      handle.setAttribute('aria-valuenow', Math.round(percentage));
    };

    slider.addEventListener('mousedown', () => isDragging = true);
    slider.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);

    slider.addEventListener('mousemove', (e) => {
      if (isDragging) moveSlider(e.clientX);
    });
    slider.addEventListener('touchmove', (e) => {
      if (isDragging) moveSlider(e.touches[0].clientX);
    });
    
    handle.addEventListener('keydown', (e) => {
        const currentPercentage = parseFloat(handle.style.left) || 50;
        if (e.key === 'ArrowLeft') {
            const newPercentage = Math.max(0, currentPercentage - 2);
            afterImage.style.width = newPercentage + '%';
            handle.style.left = newPercentage + '%';
        } else if (e.key === 'ArrowRight') {
            const newPercentage = Math.min(100, currentPercentage + 2);
            afterImage.style.width = newPercentage + '%';
            handle.style.left = newPercentage + '%';
        }
    });
  }

  // --- Testimonial Carousel ---
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.ariaLabel = `Zu Bewertung ${index + 1} springen`;
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.dot');

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });

    updateCarousel();
  }

  // --- Lightbox --- 
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const showImage = (index) => {
      const item = galleryItems[index];
      lightboxImg.src = item.href;
      lightboxImg.alt = item.querySelector('img').alt;
      currentIndex = index;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    };

    const hideLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        showImage(index);
      });
    });

    closeBtn.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) hideLightbox();
    });
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
      showImage(currentIndex);
    });
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
      showImage(currentIndex);
    });
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
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.hidden = false;
  }
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.hidden = true;
  });
  declineBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieBanner.hidden = true;
  });

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > window.innerHeight * 0.8) {
              stickyCTA.hidden = false;
          } else {
              stickyCTA.hidden = true;
          }
      });
  }

});