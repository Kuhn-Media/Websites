document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav-list');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      navToggle.classList.toggle('open');
      const isExpanded = mainNav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isExpanded);
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
  }

  // Sticky Header
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-fade-right, .reveal-fade-left, .reveal-stagger');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.classList.contains('reveal-stagger') ? index * 100 : 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // Testimonial Carousel (using a simple manual implementation)
  const carouselContainer = document.getElementById('testimonial-carousel');
  if (carouselContainer) {
    const slides = carouselContainer.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    if (slides.length > 0) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function updateCarousel() {
            carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        // Basic swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carouselContainer.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        }
        
        // To make it a seamless slider, we clone first and last elements
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        carouselContainer.appendChild(firstClone);
        carouselContainer.insertBefore(lastClone, slides[0]);
        carouselContainer.style.transition = 'none';
        currentIndex = 1;
        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

        setTimeout(() => {
            carouselContainer.style.transition = 'transform 0.5s ease-in-out';
        }, 50);

        const allSlides = carouselContainer.querySelectorAll('.testimonial-slide');

        function updateCarouselSeamless() {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === (currentIndex - 1 + slides.length) % slides.length);
            });
            carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        nextBtn.addEventListener('click', () => {
            if (currentIndex >= allSlides.length - 1) return;
            currentIndex++;
            updateCarouselSeamless();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex <= 0) return;
            currentIndex--;
            updateCarouselSeamless();
        });

        carouselContainer.addEventListener('transitionend', () => {
            if (currentIndex === 0) {
                carouselContainer.style.transition = 'none';
                currentIndex = allSlides.length - 2;
                carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                setTimeout(() => { carouselContainer.style.transition = 'transform 0.5s ease-in-out'; });
            } 
            if (currentIndex === allSlides.length - 1) {
                carouselContainer.style.transition = 'none';
                currentIndex = 1;
                carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                setTimeout(() => { carouselContainer.style.transition = 'transform 0.5s ease-in-out'; });
            }
        });
    }
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieAccepted')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > window.innerHeight * 0.5) {
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
      });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
  });

});