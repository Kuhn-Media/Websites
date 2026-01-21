document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const mainNavList = document.querySelector('.main-nav-list');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // --- 2. Sticky Header on Scroll ---
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

  // --- 3. Scroll Reveal Animation ---
  const revealItems = document.querySelectorAll('.reveal-item, .reveal-sequence');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        if (item.classList.contains('reveal-sequence')) {
            item.classList.add('is-visible');
            const children = item.querySelectorAll('[data-anim]');
            children.forEach((child, index) => {
                child.style.transitionDelay = `${index * 100}ms`;
            });
        } else {
            const delay = parseInt(item.dataset.animDelay, 10) || 0;
            setTimeout(() => {
                item.classList.add('is-visible');
            }, delay);
        }
        observer.unobserve(item);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- 4. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    }
  });

  // --- 5. Carousel ---
  const carousel = document.getElementById('praxis-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.parentElement.querySelector('.prev');
    const nextBtn = carousel.parentElement.querySelector('.next');
    const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (index === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });
    
    // Touch swipe
    let touchstartX = 0;
    let touchendX = 0;
    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextBtn.click();
        if (touchendX > touchstartX) prevBtn.click();
    });

    updateDots();
  }

  // --- 6. Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // --- 7. Sticky CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > window.innerHeight * 0.8) {
              stickyCta.classList.add('visible');
          } else {
              stickyCta.classList.remove('visible');
          }
      });
  }

  // --- 8. Smooth scrolling for anchor links ---
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