document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER --- //
  const header = document.querySelector('.site-header');
  const stickyCTA = document.getElementById('sticky-cta');
  const heroSection = document.querySelector('.hero');

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : 300;

    if (scrollPosition > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (stickyCTA) {
        if (scrollPosition > heroHeight) {
            stickyCTA.classList.add('visible');
        } else {
            stickyCTA.classList.remove('visible');
        }
    }
  };

  window.addEventListener('scroll', handleScroll);

  // --- 2. MOBILE NAVIGATION --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const navBackdrop = document.querySelector('.mobile-nav-backdrop');
  const navClose = document.querySelector('.mobile-nav-close');
  const navLinks = navDrawer.querySelectorAll('a');

  const openMenu = () => {
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navDrawer.classList.add('open');
    navDrawer.setAttribute('aria-hidden', 'false');
    navBackdrop.classList.add('open');
    document.body.classList.add('no-scroll');
    navLinks[0].focus();
    document.addEventListener('keydown', handleMenuKeydown);
  };

  const closeMenu = () => {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navDrawer.classList.remove('open');
    navDrawer.setAttribute('aria-hidden', 'true');
    navBackdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
    navToggle.focus();
    document.removeEventListener('keydown', handleMenuKeydown);
  };

  const handleMenuKeydown = (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
    if (e.key === 'Tab') {
        const focusableElements = navDrawer.querySelectorAll('button, a');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
  };

  navToggle.addEventListener('click', () => {
    if (navDrawer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navBackdrop.addEventListener('click', closeMenu);
  navClose.addEventListener('click', closeMenu);
  navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
  });

  // --- 3. SCROLL REVEAL ANIMATION --- //
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-stagger, .reveal-line');
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  } else {
      revealElements.forEach(el => {
          el.classList.add('visible');
      });
  }

  // --- 4. MAGNETIC CTA --- //
  const magneticCTA = document.querySelector('.magnetic-cta');
  if (magneticCTA && window.innerWidth > 992 && !isReducedMotion) {
    magneticCTA.addEventListener('mousemove', (e) => {
      const rect = magneticCTA.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      magneticCTA.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
    });

    magneticCTA.addEventListener('mouseleave', () => {
      magneticCTA.style.transform = 'translate(0, 0)';
    });
  }

  // --- 5. CAROUSEL --- //
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      const slideWidth = slides[0].offsetWidth;
      const gap = parseInt(window.getComputedStyle(slides[0]).marginRight) * 2;
      carousel.scrollTo({ left: currentIndex * (slideWidth + gap), behavior: isReducedMotion ? 'auto' : 'smooth' });
      updateDots();
    };

    const updateDots = () => {
      dotsContainer.childNodes.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
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

    // Touch/Drag functionality
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.classList.add('active');
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => { isDown = false; carousel.classList.remove('active'); });
    carousel.addEventListener('mouseup', () => { isDown = false; carousel.classList.remove('active'); });
    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; //scroll-fast
      carousel.scrollLeft = scrollLeft - walk;
    });

    updateCarousel();
  }

  // --- 6. FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!wasActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- 7. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  const showCookieBanner = () => {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('visible');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }
  };

  const hideCookieBanner = (consent) => {
    localStorage.setItem('cookieConsent', consent);
    cookieBanner.classList.remove('visible');
    cookieBanner.setAttribute('aria-hidden', 'true');
  };

  if (cookieBanner) {
    acceptBtn.addEventListener('click', () => hideCookieBanner('accepted'));
    declineBtn.addEventListener('click', () => hideCookieBanner('declined'));
    setTimeout(showCookieBanner, 2000);
  }

  // --- 8. LIGHTBOX GALLERY --- //
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const galleryItems = document.querySelectorAll('.lightbox-trigger');
  let currentImageIndex;

  if (lightbox && galleryItems.length > 0) {
    const images = Array.from(galleryItems).map(item => ({ src: item.src, alt: item.alt }));
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    const openLightbox = (index) => {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
        document.addEventListener('keydown', handleLightboxKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        galleryItems[currentImageIndex].focus();
        document.removeEventListener('keydown', handleLightboxKeydown);
    };

    const updateLightboxImage = () => {
        lightboxImage.src = images[currentImageIndex].src;
        lightboxImage.alt = images[currentImageIndex].alt;
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    };

    const handleLightboxKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
  }
});
