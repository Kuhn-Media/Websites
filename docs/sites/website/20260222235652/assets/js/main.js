document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY HEADER --- //
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
  }

  // --- 2. MOBILE NAVIGATION --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (mobileNavToggle && mobileNavMenu) {
    const openMenu = () => {
      mobileNavMenu.classList.add('is-open');
      document.body.classList.add('no-scroll');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      mobileNavMenu.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
    };

    mobileNavToggle.addEventListener('click', openMenu);
    mobileNavClose.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- 3. SCROLL REVEAL ANIMATIONS --- //
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. TESTIMONIAL CAROUSEL --- //
  const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
  if (carouselWrapper) {
    const carousel = carouselWrapper.querySelector('.testimonial-carousel');
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = carouselWrapper.querySelector('.carousel-prev');
    const nextButton = carouselWrapper.querySelector('.carousel-next');
    const dotsContainer = carouselWrapper.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });
    
    updateCarousel();
  }

  // --- 5. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // --- 6. GLOBAL LIGHTBOX --- //
  const lightbox = document.getElementById('km-lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const allGalleryImages = Array.from(galleryItems).map(item => item.querySelector('img'));

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('.lightbox-image-container img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    let currentIndex = 0;

    const showImage = (index) => {
        if (index < 0 || index >= allGalleryImages.length) return;
        currentIndex = index;
        const imgElement = allGalleryImages[index];
        lightboxImg.src = imgElement.getAttribute('data-km-image');
        lightboxImg.alt = imgElement.alt;
    };

    const openLightbox = (index) => {
        showImage(index);
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
        closeBtn.focus();
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

});