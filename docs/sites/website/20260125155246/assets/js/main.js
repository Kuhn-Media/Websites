document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY HEADER & SCROLL BEHAVIOR ---
  const header = document.querySelector('.site-header');
  const stickyCTA = document.getElementById('sticky-cta');
  
  if (header) {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '100px 0px 0px 0px' });
    scrollObserver.observe(document.body);
  }

  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) {
              stickyCTA.classList.add('show');
          }
      }, { threshold: 0, rootMargin: '-20% 0px -80% 0px' });
      const heroSection = document.querySelector('.hero');
      if(heroSection) ctaObserver.observe(heroSection);

      document.getElementById('close-sticky-cta')?.addEventListener('click', () => {
          stickyCTA.classList.remove('show');
      });
  }

  // --- 2. MOBILE NAVIGATION ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navToggle.classList.toggle('is-open');
      navMenu.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- 3. SCROLL REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. TESTIMONIAL SLIDER ---
  const sliderContainer = document.getElementById('testimonial-slider');
  if (sliderContainer) {
    const track = sliderContainer.querySelector('.slider-track');
    const slides = Array.from(track.children);
    const nextButton = sliderContainer.querySelector('.next');
    const prevButton = sliderContainer.querySelector('.prev');
    const dotsNav = sliderContainer.querySelector('.slider-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const moveToSlide = (targetIndex) => {
      track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
      currentIndex = targetIndex;
      updateControls();
    };

    const updateControls = () => {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;
        dotsNav.querySelectorAll('button').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    slides.forEach((_, index) => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `Go to slide ${index + 1}`);
        button.addEventListener('click', () => moveToSlide(index));
        dotsNav.appendChild(button);
    });

    nextButton.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) moveToSlide(currentIndex - 1);
    });

    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + newSlideWidth * currentIndex + 'px)';
    });

    moveToSlide(0);
  }

  // --- 5. BEFORE/AFTER SLIDER ---
  const baContainer = document.getElementById('before-after-container');
  if (baContainer) {
    const afterImage = baContainer.querySelector('.after-image');
    const handle = baContainer.querySelector('.slider-handle');
    let isDragging = false;

    const moveSlider = (x) => {
        const rect = baContainer.getBoundingClientRect();
        let newX = x - rect.left;
        if (newX < 0) newX = 0;
        if (newX > rect.width) newX = rect.width;
        const percent = (newX / rect.width) * 100;
        afterImage.style.width = percent + '%';
        handle.style.left = percent + '%';
    };

    baContainer.addEventListener('mousedown', () => isDragging = true);
    baContainer.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);

    baContainer.addEventListener('mousemove', (e) => {
        if (isDragging) moveSlider(e.clientX);
    });
    baContainer.addEventListener('touchmove', (e) => {
        if (isDragging) moveSlider(e.touches[0].clientX);
    });
  }

  // --- 6. LIGHTBOX GALLERY ---
  const gallery = document.getElementById('gallery-grid');
  if (gallery) {
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const galleryItems = gallery.querySelectorAll('.gallery-item');
      let currentIndex = 0;

      const showImage = (index) => {
          currentIndex = index;
          lightboxImg.src = galleryItems[index].href;
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

      lightbox.querySelector('.lightbox-close').addEventListener('click', hideLightbox);
      lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
          showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
      });
      lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
          showImage((currentIndex + 1) % galleryItems.length);
      });

      lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) hideLightbox();
      });

      document.addEventListener('keydown', (e) => {
          if (!lightbox.hidden) {
              if (e.key === 'Escape') hideLightbox();
              if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
              if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
          }
      });
  }

  // --- 7. COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('show'), 100);
    }

    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.classList.remove('show');
    });
  }
});