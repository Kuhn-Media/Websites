document.addEventListener('DOMContentLoaded', () => {

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

  // --- Mobile Menu --- //
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.mobile-menu-close');

  if (menuToggle && mobileMenu) {
    const openMenu = () => {
        document.body.classList.add('mobile-menu-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuClose.focus();
    };

    const closeMenu = () => {
        document.body.classList.remove('mobile-menu-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
    };

    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
        closeMenu();
      }
    });
    
    document.body.addEventListener('click', (e) => {
        if (document.body.classList.contains('mobile-menu-open') && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, index * 100); // Staggered delay
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
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
    };

    prevBtn.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(newIndex);
    });

    nextBtn.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % slides.length;
      goToSlide(newIndex);
    });
    
    // Touch/Swipe for Carousel
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
    }, false);

    carousel.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleSwipe();
    }, false); 

    function handleSwipe() {
        if (touchendX < touchstartX) {
            nextBtn.click();
        }
        if (touchendX > touchstartX) {
            prevBtn.click();
        }
    }
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const heroSection = document.querySelector('.hero');
    const footer = document.querySelector('.site-footer-main');
    let heroHeight = heroSection ? heroSection.offsetHeight : 500;

    window.addEventListener('scroll', () => {
      const footerTop = footer.getBoundingClientRect().top;
      if (window.scrollY > heroHeight && footerTop > window.innerHeight) {
        stickyCTA.classList.add('visible');
      } else {
        stickyCTA.classList.remove('visible');
      }
    });
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

  // --- Lightbox --- //
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const galleryImages = document.querySelectorAll('[data-km-image]');
    const lightboxImages = Array.from(document.querySelectorAll('.lightbox-image'));
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const showImage = (index) => {
        lightboxImages.forEach(img => img.style.display = 'none');
        lightboxImages[index].style.display = 'block';
        currentIndex = index;
    };

    galleryImages.forEach((img, index) => {
        const kmImage = img.getAttribute('data-km-image');
        const lightboxImageIndex = lightboxImages.findIndex(li => li.getAttribute('data-km-image') === kmImage);

        if(lightboxImageIndex > -1) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                lightbox.classList.add('active');
                showImage(lightboxImageIndex);
            });
        }
    });

    const closeLightbox = () => lightbox.classList.remove('active');
    const showPrev = () => showImage((currentIndex - 1 + lightboxImages.length) % lightboxImages.length);
    const showNext = () => showImage((currentIndex + 1) % lightboxImages.length);

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }
    });
  }

});