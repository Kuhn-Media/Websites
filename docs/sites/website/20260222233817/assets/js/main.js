document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation --- //
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navList = document.querySelector('.nav-list');

  if (mobileMenuToggle && mainNav && navList) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenuToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
      navList.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
  }

  // --- Sticky Header --- //
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Scroll Reveal Animation --- //
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  scrollElements.forEach(el => {
    observer.observe(el);
  });

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
      updateDots();
    };

    const updateDots = () => {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    nextBtn.addEventListener('click', () => {
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
      let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIndex);
    });

    goToSlide(0);
  }

  // --- Accordion --- //
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', !isExpanded);
    });
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.hidden = false;
        cookieBanner.classList.add('visible');
    }, 1000);
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

  // --- Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  let currentImageIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    const images = Array.from(galleryItems).map(item => ({
        src: item.dataset.kmImage,
        alt: item.alt
    }));

    const showImage = (index) => {
        const imgData = images[index];
        const pathPrefix = lightboxImage.src.includes('/referenzen/') ? '../' : '';
        lightboxImage.src = pathPrefix + imgData.src;
        lightboxImage.alt = imgData.alt;
        currentImageIndex = index;
    };

    const openLightbox = (index) => {
        lightbox.hidden = false;
        document.body.classList.add('no-scroll');
        showImage(index);
        document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleKeydown);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    };

    const showNextImage = () => showImage((currentImageIndex + 1) % images.length);
    const showPrevImage = () => showImage((currentImageIndex - 1 + images.length) % images.length);

    galleryItems.forEach((item, index) => {
        item.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const footer = document.querySelector('.main-footer');
      const scrollObserver = new IntersectionObserver((entries) => {
          const footerEntry = entries[0];
          if (window.scrollY > 400 && footerEntry.isIntersecting === false) {
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
      }, { threshold: 0.1 });

      if(footer) scrollObserver.observe(footer);
  }

});