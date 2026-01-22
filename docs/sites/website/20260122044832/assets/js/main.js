document.addEventListener('DOMContentLoaded', function() {

  // --- 1. HEADER & MOBILE NAVIGATION --- //
  const header = document.getElementById('site-header');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavContainer = document.getElementById('mobile-nav-container');
  const mobileNav = document.getElementById('mobile-nav');

  // Header shrink on scroll
  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    // Update header height CSS variable for scrollspy
    const headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--header-h-current', `${headerHeight}px`);
  }
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Initial check

  // Mobile navigation toggle
  if (mobileNavToggle && mobileNavContainer) {
    const focusableElements = mobileNav.querySelectorAll('a[href], button');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    const openMenu = () => {
      mobileNavToggle.classList.add('is-open');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      mobileNavContainer.classList.add('is-open');
      document.body.classList.add('no-scroll');
      firstFocusableElement.focus();
      document.addEventListener('keydown', handleMenuKeydown);
    };

    const closeMenu = () => {
      mobileNavToggle.classList.remove('is-open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNavContainer.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      mobileNavToggle.focus();
      document.removeEventListener('keydown', handleMenuKeydown);
    };

    mobileNavToggle.addEventListener('click', () => {
      if (mobileNavContainer.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileNavContainer.querySelector('.mobile-nav__backdrop').addEventListener('click', closeMenu);
    mobileNavContainer.querySelector('.mobile-nav__close').addEventListener('click', closeMenu);
    mobileNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });

    // Focus trap
    const handleMenuKeydown = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    };
  }

  // --- 2. SCROLL-REVEAL ANIMATIONS --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 50}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 3. FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // --- 4. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieName = 'zink_cookie_consent';

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem(cookieName)) {
      cookieBanner.hidden = false;
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem(cookieName, 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // --- 5. CAROUSEL --- //
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      const offset = -currentIndex * slides[0].offsetWidth;
      carousel.style.transform = `translateX(${offset}px)`;
      updateDots();
    };

    const createDots = () => {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
    };

    const updateDots = () => {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      carousel.scrollTo({
        left: slides[currentIndex].offsetLeft,
        behavior: 'smooth'
      });
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      carousel.scrollTo({
        left: slides[currentIndex].offsetLeft,
        behavior: 'smooth'
      });
    });

    // Update index on scroll
    carousel.addEventListener('scroll', () => {
        const scrollLeft = carousel.scrollLeft;
        const slideWidth = slides[0].offsetWidth;
        currentIndex = Math.round(scrollLeft / slideWidth);
        updateDots();
    });

    createDots();
    updateDots();
  }

  // --- 6. SCROLLSPY FOR LEISTUNGEN PAGE --- //
  const pageNav = document.querySelector('.page-nav');
  if (pageNav) {
    const navLinks = pageNav.querySelectorAll('a');
    const sections = [];
    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) sections.push(section);
    });

    const scrollSpyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('is-active');
            }
          });
        }
      });
    }, { 
        rootMargin: `-${header.offsetHeight + 50}px 0px -60% 0px`,
        threshold: 0
    });

    sections.forEach(section => scrollSpyObserver.observe(section));
  }

  // --- 7. STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('visible');
                  stickyCTA.hidden = false;
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });

      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});