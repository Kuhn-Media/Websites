document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavContainer = document.getElementById('mobile-nav-container');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileNavToggle && mobileNavContainer) {
    const openMenu = () => {
      mobileNavContainer.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');
      mobileNav.querySelector('a').focus();
    };

    const closeMenu = () => {
      mobileNavContainer.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
      mobileNavToggle.focus();
    };

    mobileNavToggle.addEventListener('click', () => {
      if (mobileNavContainer.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileNavContainer.addEventListener('click', (e) => {
      if (e.target === mobileNavContainer.querySelector('.mobile-nav__backdrop')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavContainer.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Focus trap
    const focusableElements = mobileNav.querySelectorAll('a[href], button');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    mobileNav.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // --- 2. Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // --- 3. Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-stagger');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-stagger')) {
            entry.target.style.transitionDelay = `${index * 100}ms`;
          }
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- 4. Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const nextButton = document.querySelector('.carousel-controls .next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });

    updateCarousel();
  }

  // --- 5. Project Gallery Lightbox --- //
  const projectCards = document.querySelectorAll('.project-card');
  const lightbox = document.getElementById('lightbox');
  if (projectCards.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;
    const galleryItems = Array.from(projectCards).map(card => ({
      src: card.querySelector('img').src,
      alt: card.querySelector('img').alt,
      title: card.querySelector('h3').textContent,
      description: card.querySelector('p').textContent
    }));

    const showImage = (index) => {
      const item = galleryItems[index];
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxCaption.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
      currentIndex = index;
    };

    projectCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        showImage(index);
      });
    });

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
    nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  }

  // --- 6. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');

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

  // --- 7. Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const observer = new IntersectionObserver((entries) => {
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
    if (heroSection) {
      observer.observe(heroSection);
    }
  }

});