document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER --- //
  const header = document.getElementById('site-header');
  if (header) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      // A dummy element to observe, placed right after the header
    }, { rootMargin: '-100px 0px 0px 0px' });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- 2. MOBILE NAVIGATION --- //
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('main-nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navList.classList.toggle('is-open');
      navToggle.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- 3. SCROLL REVEAL ANIMATIONS --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-stagger-group');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-stagger-group')) {
            entry.target.classList.add('is-visible');
            const children = entry.target.children;
            for (let i = 0; i < children.length; i++) {
                children[i].style.transitionDelay = `${i * 100}ms`;
            }
        } else {
            entry.target.classList.add('is-visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- 4. FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
    });
  });

  // --- 5. TESTIMONIAL CAROUSEL --- //
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const moveToSlide = (targetIndex) => {
      track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
      currentIndex = targetIndex;
      updateDots(targetIndex);
    };

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.addEventListener('click', () => moveToSlide(i));
      dotsNav.appendChild(dot);
    });
    const dots = Array.from(dotsNav.children);
    const updateDots = (index) => {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }
    updateDots(0);

    nextButton.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      moveToSlide(nextIndex);
    });

    prevButton.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      moveToSlide(prevIndex);
    });

    // Autoplay (optional)
    // setInterval(() => {
    //   const nextIndex = (currentIndex + 1) % slides.length;
    //   moveToSlide(nextIndex);
    // }, 5000);
  }

  // --- 6. COOKIE BANNER --- //
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
  
  // --- 7. STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (i.e., scrolled past)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });

      const heroSection = document.querySelector('.hero, .page-hero');
      if(heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

  // --- 8. INTERACTIVE HOUSE --- //
  const houseWrapper = document.querySelector('.interactive-house-wrapper');
  if (houseWrapper) {
    const points = houseWrapper.querySelectorAll('.point');
    const infoBoxes = houseWrapper.querySelectorAll('.info-box');

    points.forEach(point => {
      point.addEventListener('click', () => {
        const targetId = point.dataset.target;
        infoBoxes.forEach(box => {
          if (box.id === `info-${targetId}`) {
            box.classList.add('active');
          } else {
            box.classList.remove('active');
          }
        });
      });
    });
  }

});