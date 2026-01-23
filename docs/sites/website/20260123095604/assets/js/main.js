document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav ul');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      document.body.classList.toggle('nav-open');
      const isExpanded = mainNav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });
    document.body.addEventListener('click', (e) => {
      if (document.body.classList.contains('nav-open') && !e.target.closest('.main-nav') && !e.target.closest('.nav-toggle')) {
          mainNav.classList.remove('open');
          document.body.classList.remove('nav-open');
          navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Sticky Header
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

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger animation for items in a grid
        if (entry.target.classList.contains('stagger-item')) {
            let delay = entry.target.dataset.delay || 0;
            entry.target.style.transitionDelay = `${delay}ms`;
        }
      }
    });
  }, { threshold: 0.1 });

  let staggerIndex = 0;
  revealElements.forEach(el => {
    if(el.classList.contains('stagger-item')) {
        el.dataset.delay = staggerIndex * 150;
        staggerIndex++;
        const parent = el.closest('.scroll-reveal');
        if(parent && getComputedStyle(parent).getPropertyValue('display') === 'grid') {
            // Reset index for each new grid
        }
    }
    observer.observe(el);
  });

  // Carousel
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(wrapper => {
      const carousel = wrapper.querySelector('.carousel');
      const prevBtn = wrapper.querySelector('.prev');
      const nextBtn = wrapper.querySelector('.next');
      const dotsContainer = wrapper.querySelector('.carousel-dots');
      if (!carousel) return;
      let slides = Array.from(carousel.children);
      let slideWidth = slides[0].getBoundingClientRect().width;

      const dots = [];
      slides.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.classList.add('carousel-dot');
          dot.addEventListener('click', () => goToSlide(i));
          dotsContainer.appendChild(dot);
          dots.push(dot);
      });

      let currentIndex = 0;

      function updateCarousel() {
          carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
          dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
      }

      function goToSlide(index) {
          currentIndex = index;
          if (currentIndex < 0) currentIndex = slides.length - 1;
          if (currentIndex >= slides.length) currentIndex = 0;
          updateCarousel();
      }

      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
      
      window.addEventListener('resize', () => {
        slideWidth = slides[0].getBoundingClientRect().width;
        updateCarousel();
      });

      goToSlide(0);
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
  if (lightbox && galleryItems.length > 0) {
      const lightboxImg = lightbox.querySelector('img');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      let currentIndex = 0;
      const imageSources = Array.from(galleryItems).map(item => item.href);

      function showImage(index) {
          lightboxImg.src = imageSources[index];
          currentIndex = index;
      }

      galleryItems.forEach((item, index) => {
          item.addEventListener('click', e => {
              e.preventDefault();
              lightbox.classList.add('active');
              showImage(index);
          });
      });

      closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
      prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + imageSources.length) % imageSources.length));
      nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % imageSources.length));

      lightbox.addEventListener('click', e => {
          if (e.target === lightbox) {
              lightbox.classList.remove('active');
          }
      });

      document.addEventListener('keydown', e => {
          if (lightbox.classList.contains('active')) {
              if (e.key === 'Escape') closeBtn.click();
              if (e.key === 'ArrowLeft') prevBtn.click();
              if (e.key === 'ArrowRight') nextBtn.click();
          }
      });
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  const declineCookies = document.getElementById('decline-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1000);
  }

  if (acceptCookies) {
      acceptCookies.addEventListener('click', () => {
          localStorage.setItem('cookieConsent', 'accepted');
          cookieBanner.classList.remove('show');
      });
  }

  if (declineCookies) {
      declineCookies.addEventListener('click', () => {
          localStorage.setItem('cookieConsent', 'declined');
          cookieBanner.classList.remove('show');
      });
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past)
              if (!entry.isIntersecting && window.scrollY > 300) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }, { threshold: 0 });

      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});