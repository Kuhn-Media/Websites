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
  const navMenu = document.querySelector('.mobile-nav-menu');
  const navClose = document.querySelector('.mobile-nav-close');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    };

    navClose.addEventListener('click', closeMenu);
    navMenu.addEventListener('click', (e) => {
        if (e.target === navMenu) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Carousel --- //
  const carousel = document.querySelector('.carousel-slides');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-next');
    const prevButton = document.querySelector('.carousel-prev');
    const dotsNav = document.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    slides.forEach((slide, index) => {
      slide.style.left = slideWidth * index + 'px';
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(index));
      dotsNav.appendChild(dot);
    });
    const dots = Array.from(dotsNav.children);

    const moveToSlide = (targetIndex) => {
      carousel.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
      dots[currentIndex].classList.remove('active');
      dots[targetIndex].classList.add('active');
      currentIndex = targetIndex;
    };

    nextButton.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % slides.length;
      moveToSlide(newIndex);
    });

    prevButton.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      moveToSlide(newIndex);
    });
    
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        slides.forEach((slide, index) => {
            slide.style.left = newSlideWidth * index + 'px';
        });
        carousel.style.transform = 'translateX(-' + (newSlideWidth * currentIndex) + 'px)';
    });
  }

  // --- Lightbox --- //
  const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
  if (galleryItems.length > 0) {
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = lightbox.querySelector('img');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      let currentIndex = 0;

      const showImage = (index) => {
          lightboxImg.src = galleryItems[index].href;
          currentIndex = index;
      };

      galleryItems.forEach((item, index) => {
          item.addEventListener('click', (e) => {
              e.preventDefault();
              lightbox.classList.add('visible');
              showImage(index);
          });
      });

      const closeLightbox = () => lightbox.classList.remove('visible');
      closeBtn.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
      prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
      nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));
      document.addEventListener('keydown', (e) => {
          if (!lightbox.classList.contains('visible')) return;
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowLeft') prevBtn.click();
          if (e.key === 'ArrowRight') nextBtn.click();
      });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

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
      const ctaObserver = new IntersectionObserver((entries) => {
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
      if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- Magnetic CTA --- //
  const magneticCTA = document.querySelector('.magnetic-cta');
  if (magneticCTA && window.matchMedia('(pointer: fine)').matches) {
      magneticCTA.addEventListener('mousemove', (e) => {
          const { offsetX, offsetY, target } = e;
          const { clientWidth, clientHeight } = target;
          const x = (offsetX / clientWidth - 0.5) * 30; // 30 is the strength
          const y = (offsetY / clientHeight - 0.5) * 30;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.style.transition = 'transform 100ms ease-out';
      });
      magneticCTA.addEventListener('mouseleave', (e) => {
          e.target.style.transform = 'translate(0, 0)';
          e.target.style.transition = 'transform 300ms ease-in-out';
      });
  }

});