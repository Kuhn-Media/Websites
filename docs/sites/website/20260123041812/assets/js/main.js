document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navList = document.querySelector('.nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navList.classList.toggle('active');
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

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, index * 100); // Staggered delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    }
  });

  // Testimonial Carousel
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    updateCarousel();
  }

  // Sticky CTA Bar
  const stickyBar = document.getElementById('sticky-cta-bar');
  if (stickyBar) {
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            stickyBar.classList.add('visible');
        } else {
            stickyBar.classList.remove('visible');
        }
        lastScrollY = window.scrollY;
    });
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookiesBtn) {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
        cookieBanner.classList.add('visible');
      }, 1000);
    }

    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

});