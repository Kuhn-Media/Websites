document.addEventListener('DOMContentLoaded', function() {

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

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navClose = document.querySelector('.mobile-nav-close');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.drawer-overlay');

  const openNav = () => {
    navDrawer.classList.add('open');
    overlay.classList.add('open');
    navDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    navDrawer.classList.remove('open');
    overlay.classList.remove('open');
    navDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (navToggle && navDrawer && overlay && navClose) {
    navToggle.addEventListener('click', openNav);
    navClose.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        closeNav();
      }
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (declineButton) {
    declineButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }
  
  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const showAt = 400;
      window.addEventListener('scroll', () => {
          if (window.scrollY > showAt && (window.innerHeight + window.scrollY) < document.body.offsetHeight - 400) {
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
      });
  }

  // --- Carousel --- //
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(wrapper => {
      const track = wrapper.querySelector('.carousel-track');
      const slides = Array.from(track.children);
      const nextButton = wrapper.querySelector('.carousel-button-right');
      const prevButton = wrapper.querySelector('.carousel-button-left');
      const dotsNav = wrapper.querySelector('.carousel-nav');
      
      if (!track || slides.length === 0) return;

      let slideWidth = slides[0].getBoundingClientRect().width;
      let currentIndex = 0;

      const setSlidePosition = (slide, index) => {
          slide.style.left = slideWidth * index + 'px';
      };
      // slides.forEach(setSlidePosition);

      const moveToSlide = (targetIndex) => {
          track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
          currentIndex = targetIndex;
          updateDots(targetIndex);
          updateButtons();
      };

      const updateDots = (targetIndex) => {
          if (!dotsNav) return;
          const currentDot = dotsNav.querySelector('.current-slide');
          if (currentDot) currentDot.classList.remove('current-slide');
          dotsNav.children[targetIndex].classList.add('current-slide');
      };
      
      const updateButtons = () => {
        if(!prevButton || !nextButton) return;
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;
      }

      if (dotsNav) {
          slides.forEach((slide, index) => {
              const button = document.createElement('button');
              button.classList.add('carousel-indicator');
              button.addEventListener('click', () => moveToSlide(index));
              dotsNav.appendChild(button);
          });
          dotsNav.children[0].classList.add('current-slide');
      }

      nextButton.addEventListener('click', () => {
          if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
      });

      prevButton.addEventListener('click', () => {
          if (currentIndex > 0) moveToSlide(currentIndex - 1);
      });
      
      window.addEventListener('resize', () => {
        slideWidth = slides[0].getBoundingClientRect().width;
        moveToSlide(currentIndex);
      });
      
      updateButtons();
  });
  
  // --- Lightbox --- //
  const lightbox = document.getElementById('lightbox');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  const lightboxContent = lightbox.querySelector('.lightbox-content img');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const prevButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;
  
  if(lightbox) {
      const images = Array.from(lightboxTriggers).map(trigger => ({ src: trigger.src, alt: trigger.alt }));

      const showImage = (index) => {
          if (index < 0 || index >= images.length) return;
          currentIndex = index;
          lightboxContent.src = images[index].src;
          lightboxContent.alt = images[index].alt;
          prevButton.style.display = index === 0 ? 'none' : 'block';
          nextButton.style.display = index === images.length - 1 ? 'none' : 'block';
      };

      const openLightbox = (index) => {
          lightbox.classList.add('visible');
          lightbox.setAttribute('aria-hidden', 'false');
          showImage(index);
      };

      const closeLightbox = () => {
          lightbox.classList.remove('visible');
          lightbox.setAttribute('aria-hidden', 'true');
      };

      lightboxTriggers.forEach((trigger, index) => {
          trigger.addEventListener('click', () => openLightbox(index));
      });

      closeButton.addEventListener('click', closeLightbox);
      prevButton.addEventListener('click', () => showImage(currentIndex - 1));
      nextButton.addEventListener('click', () => showImage(currentIndex + 1));

      lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener('keydown', (e) => {
          if (!lightbox.classList.contains('visible')) return;
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
          if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      });
  }

});