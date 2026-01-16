document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.nav-toggle');
  const mainMenu = document.getElementById('main-menu');
  if (navToggle && mainMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navToggle.classList.toggle('open');
      mainMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  }

  // --- Sticky Header ---
  const header = document.querySelector('.site-header.sticky');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-stagger');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-stagger')) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        } else {
            entry.target.classList.add('visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));

  // --- Testimonial Carousel ---
  const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
  if (carouselWrapper) {
    const track = carouselWrapper.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carouselWrapper.querySelector('.carousel-next');
    const prevButton = carouselWrapper.querySelector('.carousel-prev');
    const dotsNav = carouselWrapper.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;

    const setSlidePosition = (slide, index) => {
      slide.style.left = slideWidth * index + 'px';
    };
    // slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    }

    let currentIndex = 0;

    // Create dots
    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', e => {
            currentIndex = index;
            updateCarousel();
        });
        dotsNav.appendChild(dot);
    });
    const dots = Array.from(dotsNav.children);

    const updateCarousel = () => {
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    nextButton.addEventListener('click', e => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', e => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });
  }

  // --- Signature Interaction ---
  const interactionWrapper = document.querySelector('.interaction-wrapper');
  if (interactionWrapper) {
    const points = interactionWrapper.querySelectorAll('.point');
    const panels = interactionWrapper.querySelectorAll('.content-panel');

    points.forEach(point => {
      point.addEventListener('click', () => {
        const targetId = point.dataset.target;
        
        points.forEach(p => p.classList.remove('active'));
        point.classList.add('active');

        panels.forEach(panel => {
          if (panel.id === 'content-' + targetId) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
    // Activate first point by default
    if(points.length > 0) points[0].classList.add('active');
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
        cookieBanner.setAttribute('aria-hidden', 'false');
      }, 1000);
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // --- Sticky CTA Bar ---
  const stickyBar = document.getElementById('sticky-cta-bar');
  if (stickyBar) {
      const heroSection = document.querySelector('.hero, .hero-subpage');
      const footerSection = document.querySelector('.site-footer');
      
      const observer = new IntersectionObserver((entries) => {
          const heroEntry = entries.find(e => e.target === heroSection);
          const footerEntry = entries.find(e => e.target === footerSection);

          let showBar = false;
          if (heroEntry && !heroEntry.isIntersecting) {
              showBar = true;
          }
          if (footerEntry && footerEntry.isIntersecting) {
              showBar = false;
          }

          stickyBar.classList.toggle('show', showBar);

      }, { threshold: 0.1 });

      if (heroSection) observer.observe(heroSection);
      if (footerSection) observer.observe(footerSection);
  }

});