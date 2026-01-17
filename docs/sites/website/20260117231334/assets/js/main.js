document.addEventListener('DOMContentLoaded', () => {

  // Sticky Header
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

  // Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navWrapper = document.querySelector('.main-menu-wrapper');
  if (navToggle && navWrapper) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      document.body.classList.toggle('nav-open');
      navWrapper.classList.toggle('open');
    });

    navWrapper.addEventListener('click', (e) => {
      if (e.target === navWrapper) {
        navToggle.click();
      }
    });

    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = toggle.parentElement;
            const isOpen = parent.classList.contains('open');
            parent.classList.toggle('open');
            toggle.setAttribute('aria-expanded', !isOpen);
        });
    });
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
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
  revealElements.forEach((el, index) => {
    if (!el.dataset.revealDelay) {
        el.style.setProperty('--stagger-delay', `${index * 100}ms`);
    }
    observer.observe(el);
  });

  // Testimonial Carousel
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.scrollTo({ left: slides[currentIndex].offsetLeft, behavior: 'smooth' });
      updateDots();
    };

    const updateDots = () => {
        dotsContainer.childNodes.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.ariaLabel = `Go to slide ${index + 1}`;
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });
    updateDots();
  }

  // Lightbox Gallery
  const gallery = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  if (gallery && lightbox) {
    const galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
    const lightboxImg = document.getElementById('lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex;

    const showImage = (index) => {
        const item = galleryItems[index];
        lightboxImg.src = item.href;
        lightboxImg.alt = item.dataset.alt;
        currentIndex = index;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            showImage(index);
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
    nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));
    
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => cookieBanner.classList.add('active'), 2000);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('active');
    });
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const heroSection = document.querySelector('.hero');
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when hero is NOT intersecting
            stickyCTA.classList.toggle('visible', !entry.isIntersecting);
        });
    }, { threshold: 0 });

    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }
});