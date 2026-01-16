document.addEventListener('DOMContentLoaded', function() {

  // 1. Sticky Header
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

  // 2. Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navDrawer.classList.toggle('open');
      document.body.style.overflow = navDrawer.classList.contains('open') ? 'hidden' : '';
    });
  }

  // 3. Scroll Reveal Animation
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.revealDelay) || 0;
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach(item => revealObserver.observe(item));

  // 4. FAQ Accordion
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

  // 5. Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  const cookieConsent = localStorage.getItem('cookieConsent');

  if (!cookieConsent && cookieBanner) {
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

  // 6. Sticky CTA
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
      }, { rootMargin: '-200px 0px 0px 0px' });
      const heroSection = document.querySelector('.hero, .page-hero');
      if(heroSection) ctaObserver.observe(heroSection);
  }

  // 7. Carousel
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(wrapper => {
    const carousel = wrapper.querySelector('.carousel');
    const prevBtn = wrapper.querySelector('.prev');
    const nextBtn = wrapper.querySelector('.next');
    const dotsContainer = wrapper.querySelector('.carousel-dots');
    const slides = Array.from(carousel.children);
    let slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      carousel.style.transition = 'transform 0.4s ease-in-out';
      updateDots();
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    window.addEventListener('resize', () => {
      slideWidth = slides[0].getBoundingClientRect().width;
      updateCarousel();
    });

    updateDots();
  });

  // 8. Lightbox Gallery
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let currentIndex;

  if (galleryItems.length > 0 && lightbox) {
    const images = Array.from(galleryItems).map(item => item.href);

    function showImage(index) {
        if (index < 0 || index >= images.length) return;
        lightboxImg.src = images[index];
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
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') lightbox.classList.remove('active');
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }
});