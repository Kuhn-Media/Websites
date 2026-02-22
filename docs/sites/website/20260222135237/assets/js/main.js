document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
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

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      navToggle.classList.toggle('open');
      document.body.classList.toggle('nav-open');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // --- Scroll Reveal --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('stagger-group')) {
            const children = entry.target.querySelectorAll(':scope > *');
            children.forEach((child, index) => {
                child.style.setProperty('--stagger-index', index);
            });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const prevButton = document.querySelector('.carousel-controls .prev');
    const nextButton = document.querySelector('.carousel-controls .next');
    const dotsContainer = document.querySelector('.carousel-controls .dots');
    const slides = Array.from(carousel.children);
    let slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const updateCarousel = () => {
        carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    };

    const updateDots = () => {
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });
    
    window.addEventListener('resize', () => {
        slideWidth = slides[0].getBoundingClientRect().width;
        updateCarousel();
    });

    updateCarousel();
  }

  // --- Sticky CTA Bar --- //
  const stickyBar = document.getElementById('sticky-cta-bar');
  if (stickyBar) {
    const showBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && window.scrollY > 400) {
                stickyBar.classList.add('visible');
            } else {
                stickyBar.classList.remove('visible');
            }
        });
    }, { rootMargin: '0px 0px -100% 0px' });
    const heroSection = document.querySelector('.hero, .page-hero');
    if(heroSection) showBarObserver.observe(heroSection);
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      cookieBanner.hidden = false;
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentImageIndex = -1;

  if (lightbox && lightboxImg && galleryItems.length > 0) {
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');

    const showImage = (index) => {
        if (index < 0 || index >= galleryItems.length) return;
        const item = galleryItems[index];
        const imagePath = item.dataset.kmImage;
        const altText = item.alt;
        lightboxImg.src = item.src.replace('..', '.'); // Adjust path for display
        lightboxImg.alt = altText;
        currentImageIndex = index;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        document.body.style.overflow = '';
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => showImage(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', () => {
        showImage((currentImageIndex - 1 + galleryItems.length) % galleryItems.length);
    });

    nextBtn.addEventListener('click', () => {
        showImage((currentImageIndex + 1) % galleryItems.length);
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.hidden) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });
  }

});