document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const stickyThreshold = 50;
    window.addEventListener('scroll', () => {
      if (window.scrollY > stickyThreshold) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // --- Mobile Menu Drawer --- //
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('drawer-open');
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.revealDelay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach(item => revealObserver.observe(item));

  // --- Accordion --- //
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    let currentIndex = 0;
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    const dotsContainer = document.querySelector('.carousel-dots');

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
      const button = document.createElement('button');
      button.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(button);
    }
    const dots = dotsContainer.querySelectorAll('button');

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    // Auto-play
    let autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carousel.addEventListener('mouseleave', () => autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000));

    updateDots();
  }

  // --- Before/After Slider --- //
  const beforeAfterSlider = document.querySelector('.before-after-slider');
  if (beforeAfterSlider) {
    const sliderContainer = beforeAfterSlider.querySelector('.slider-container');
    const slides = sliderContainer.querySelectorAll('.slide');
    const prevButton = beforeAfterSlider.querySelector('.prev');
    const nextButton = beforeAfterSlider.querySelector('.next');
    let currentIndex = 0;

    function showSlide(index) {
      sliderContainer.style.transform = `translateX(-${index * 100}%)`;
    }

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      showSlide(currentIndex);
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      showSlide(currentIndex);
    });
  }

  // --- Lightbox Gallery --- //
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.close');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');
    let currentIndex;

    const showImage = index => {
      const item = galleryItems[index];
      const imgSrc = item.getAttribute('href');
      const imgAlt = item.dataset.alt || '';
      lightboxImg.setAttribute('src', imgSrc);
      lightboxCaption.textContent = imgAlt;
      currentIndex = index;
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', e => {
        e.preventDefault();
        lightbox.classList.add('active');
        showImage(index);
      });
    });

    const closeLightbox = () => lightbox.classList.remove('active');
    const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
    const showNext = () => showImage((currentIndex + 1) % galleryItems.length);

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when hero is NOT intersecting (scrolled past hero)
            if (!entry.isIntersecting) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero');
    if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- Contact Form --- //
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
      this.reset();
    });
  }

});