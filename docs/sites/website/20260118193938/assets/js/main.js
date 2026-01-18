document.addEventListener('DOMContentLoaded', function() {

  // 1. Sticky Header
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

  // 2. Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.getElementById('mobile-nav-drawer');
  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navDrawer.setAttribute('aria-hidden', isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // 3. Scroll Reveal Animation
  const revealItems = document.querySelectorAll('.reveal-item');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealItems.forEach(item => {
    observer.observe(item);
  });

  // 4. FAQ Accordion
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

  // 5. Testimonial Carousel
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const moveToSlide = (targetIndex) => {
      track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
      currentIndex = targetIndex;
      updateDots(targetIndex);
    };

    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.addEventListener('click', () => moveToSlide(index));
      dotsNav.appendChild(dot);
    });
    const dots = Array.from(dotsNav.children);

    const updateDots = (index) => {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
    };

    nextButton.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      moveToSlide(nextIndex);
    });

    prevButton.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      moveToSlide(prevIndex);
    });
    
    // Auto-resize on window change
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        track.style.transition = 'none'; // Disable transition for instant resize
        track.style.transform = 'translateX(-' + newSlideWidth * currentIndex + 'px)';
        setTimeout(() => {
            track.style.transition = ''; // Re-enable transition
        }, 0);
    });

    moveToSlide(0);
  }

  // 6. Cookie Banner
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

  // 7. Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const heroSection = document.querySelector('.hero, .hero-subpage');
      if (heroSection) {
          const showCTAPoint = heroSection.offsetHeight;
          window.addEventListener('scroll', () => {
              if (window.scrollY > showCTAPoint) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }
  }

  // 8. Parallax Background
  const parallaxBg = document.querySelector('.parallax-bg');
  if (parallaxBg) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      const sectionTop = parallaxBg.parentElement.offsetTop;
      if (scrollPosition >= sectionTop - window.innerHeight && scrollPosition <= sectionTop + parallaxBg.parentElement.offsetHeight) {
        const yPos = (scrollPosition - sectionTop) * 0.3; // Adjust 0.3 for more/less effect
        parallaxBg.style.transform = `translateY(${yPos}px)`;
      }
    });
  }

});