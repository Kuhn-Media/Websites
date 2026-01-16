document.addEventListener('DOMContentLoaded', function() {

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

  // Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
    });

    document.body.addEventListener('click', (e) => {
        if (document.body.classList.contains('nav-open') && !e.target.closest('.mobile-nav-drawer') && !e.target.closest('.mobile-nav-toggle')) {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
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
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  const rejectCookies = document.getElementById('reject-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (rejectCookies) {
    rejectCookies.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBanner.classList.remove('visible');
    });
  }

  // Parallax CTA Background
  const ctaBannerBg = document.querySelector('.cta-banner-background');
  if (ctaBannerBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      window.addEventListener('scroll', () => {
          const scrollPosition = window.pageYOffset;
          const elementPosition = ctaBannerBg.parentElement.offsetTop;
          const elementHeight = ctaBannerBg.parentElement.offsetHeight;
          if (scrollPosition > elementPosition - window.innerHeight && scrollPosition < elementPosition + elementHeight) {
              const y = (scrollPosition - elementPosition) * 0.3;
              ctaBannerBg.style.transform = `scale(1.1) translateY(${y}px)`;
          }
      });
  }
  
  // Carousel
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(wrapper => {
    const carousel = wrapper.querySelector('.carousel');
    const prevBtn = wrapper.querySelector('.carousel-btn.prev');
    const nextBtn = wrapper.querySelector('.carousel-btn.next');
    const dotsContainer = wrapper.querySelector('.carousel-dots');
    const slides = Array.from(carousel.children);
    let slideWidth = slides[0].getBoundingClientRect().width;

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === Math.round(carousel.scrollLeft / slideWidth)) {
          dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
          carousel.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
      });
    }

    function handleScroll() {
      if (dotsContainer) {
        const activeDot = dotsContainer.querySelector('.dot.active');
        if (activeDot) activeDot.classList.remove('active');
        const newActiveDot = dotsContainer.children[Math.round(carousel.scrollLeft / slideWidth)];
        if (newActiveDot) newActiveDot.classList.add('active');
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      });
    }

    carousel.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
      slideWidth = slides[0].getBoundingClientRect().width;
      updateDots();
    });

    updateDots();
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const galleryImages = Array.from(lightboxTriggers).map(img => ({ src: img.src, alt: img.alt }));
    let currentIndex = 0;

    function showImage(index) {
      if (index < 0 || index >= galleryImages.length) return;
      const { src, alt } = galleryImages[index];
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      currentIndex = index;
    }

    lightboxTriggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => {
        lightbox.classList.add('visible');
        showImage(index);
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('visible'));
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentIndex - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('visible');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('visible')) return;
      if (e.key === 'Escape') lightbox.classList.remove('visible');
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

});