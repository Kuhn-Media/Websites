document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      // Simple show/hide for mobile menu - for a drawer, more complex logic is needed
      if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.right = '1rem';
        navMenu.style.background = 'var(--color-surface)';
        navMenu.style.padding = '1rem';
        navMenu.style.borderRadius = 'var(--radius-md)';
        navMenu.style.boxShadow = 'var(--shadow-lift)';
      }
    });
  }

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add stagger effect for .reveal-stagger
          if (entry.target.classList.contains('reveal-stagger')) {
            entry.target.style.transitionDelay = `${index * 100}ms`;
          }
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.dot');

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        carousel.style.display = 'flex'; // Ensure flex is set
        carousel.style.transition = 'transform 0.5s ease-in-out';
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });
    
    updateCarousel(); // Initial setup
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
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

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const heroSection = document.querySelector('.hero, .page-hero');
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
            if (!entry.isIntersecting) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

  // --- Lightbox Gallery --- //
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  let currentImageIndex;

  if (galleryItems.length > 0 && lightbox) {
    const imageSources = Array.from(galleryItems).map(item => item.src);

    const showImage = (index) => {
        if (index < 0 || index >= imageSources.length) return;
        lightboxImage.src = imageSources[index];
        currentImageIndex = index;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            lightbox.classList.add('active');
            showImage(index);
        });
    });

    lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    lightboxPrev.addEventListener('click', () => showImage(currentImageIndex - 1));
    lightboxNext.addEventListener('click', () => showImage(currentImageIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') lightbox.classList.remove('active');
        if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
    });
  }
});