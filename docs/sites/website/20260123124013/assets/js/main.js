document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Header & Mobile Navigation --- //
  const header = document.querySelector('.site-header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  // Sticky Header Shrink
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // --- 2. Scroll Animations (Intersection Observer) --- //
  const animatedElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.animateDelay) || 0;
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));

  // --- 3. Testimonial Carousel --- //
  const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
  if (carouselWrapper) {
    const carousel = carouselWrapper.querySelector('.testimonial-carousel');
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = carouselWrapper.querySelector('.carousel-prev');
    const nextButton = carouselWrapper.querySelector('.carousel-next');
    const dotsContainer = carouselWrapper.querySelector('.carousel-dots');
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('button');

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateControls();
    }

    function updateControls() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch/Swipe functionality
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    carousel.addEventListener('touchend', e => {
        let touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) goToSlide(currentIndex + 1);
        if (touchEndX - touchStartX > 50) goToSlide(currentIndex - 1);
    });

    goToSlide(0);
  }

  // --- 4. FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.style.maxHeight = isExpanded ? '0' : answer.scrollHeight + 'px';
    });
  });

  // --- 5. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');

  if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1000);
  }

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- 6. Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    });
  }
  
  // --- 7. Lightbox Gallery --- //
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentGalleryIndex;

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    const openLightbox = (index) => {
        currentGalleryIndex = index;
        const item = galleryItems[index];
        const imgSrc = item.href;
        const title = item.dataset.title || '';
        const description = item.dataset.description || '';

        lightboxImg.src = imgSrc;
        lightboxImg.alt = title;
        lightboxCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        lightbox.classList.add('visible');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        document.body.style.overflow = '';
    };

    const showPrev = () => openLightbox((currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length);
    const showNext = () => openLightbox((currentGalleryIndex + 1) % galleryItems.length);

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('visible')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
  }

});