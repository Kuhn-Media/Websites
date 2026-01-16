document.addEventListener('DOMContentLoaded', () => {

  // Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.setAttribute('aria-hidden', isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // Sticky Header
  const header = document.querySelector('.site-header');
  if (header) {
    const observer = new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-scrolled', !entry.isIntersecting);
    }, { rootMargin: '200px 0px 0px 0px' });
    observer.observe(document.body);
  }

  // Scroll Reveal
  const revealItems = document.querySelectorAll('.reveal-item');
  if (revealItems.length > 0) {
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

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.hidden = false;
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.hidden = true;
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.hidden = true;
    });
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver(([entry]) => {
        // Show when the hero section is NOT intersecting (scrolled past it)
        stickyCTA.classList.toggle('is-visible', !entry.isIntersecting);
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero');
    if(heroSection) {
        ctaObserver.observe(heroSection);
    } else {
        // Fallback for pages without a hero section
        const firstSection = document.querySelector('main > section');
        if(firstSection) ctaObserver.observe(firstSection);
    }
  }

  // Carousel & Lightbox
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const createDots = () => {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsNav.appendChild(dot);
      });
    };

    const updateDots = () => {
      const dots = Array.from(dotsNav.children);
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
      updateDots();
    };

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    createDots();

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const carouselImages = document.querySelectorAll('.carousel-image');
    let currentLightboxIndex = 0;

    const showImage = (index) => {
        const img = carouselImages[index];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        currentLightboxIndex = index;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    };

    carouselImages.forEach((img, index) => {
        img.addEventListener('click', () => showImage(index));
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.hidden = true;
        document.body.style.overflow = '';
    });

    lightboxNext.addEventListener('click', () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % carouselImages.length;
        showImage(currentLightboxIndex);
    });

    lightboxPrev.addEventListener('click', () => {
        currentLightboxIndex = (currentLightboxIndex - 1 + carouselImages.length) % carouselImages.length;
        showImage(currentLightboxIndex);
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') lightboxClose.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
    });

  }
});