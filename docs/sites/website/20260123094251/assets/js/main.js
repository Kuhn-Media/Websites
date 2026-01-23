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
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // --- Testimonial Slider --- //
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.slider-controls .next');
    const prevBtn = document.querySelector('.slider-controls .prev');
    const dotsContainer = document.querySelector('.slider-controls .dots');
    let currentIndex = 0;

    function updateSlider() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      Array.from(dotsContainer.children).forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });

    updateSlider();
  }

  // --- Scroll Animations --- //
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.classList.contains('reveal-stagger')) {
          el.style.transitionDelay = `${index * 100}ms`;
        }
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const heroSection = document.querySelector('.hero, .page-hero');
      if (heroSection) {
          const heroHeight = heroSection.offsetHeight;
          window.addEventListener('scroll', () => {
              if (window.scrollY > heroHeight) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (lightbox && galleryItems.length > 0) {
      const lightboxImg = lightbox.querySelector('.lightbox-content');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      let currentImageIndex;

      const images = Array.from(galleryItems).map(item => ({
        src: item.dataset.lightboxSrc,
        alt: item.dataset.lightboxAlt
      }));

      function showImage(index) {
          if (index < 0 || index >= images.length) return;
          lightboxImg.src = images[index].src;
          lightboxImg.alt = images[index].alt;
          currentImageIndex = index;
      }

      galleryItems.forEach((item, index) => {
          item.addEventListener('click', () => {
              lightbox.style.display = 'flex';
              showImage(index);
          });
      });

      closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
      prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
      nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

      lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) {
              lightbox.style.display = 'none';
          }
      });

      document.addEventListener('keydown', (e) => {
          if (lightbox.style.display === 'flex') {
              if (e.key === 'Escape') closeBtn.click();
              if (e.key === 'ArrowLeft') prevBtn.click();
              if (e.key === 'ArrowRight') nextBtn.click();
          }
      });
  }

});