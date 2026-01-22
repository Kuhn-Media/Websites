document.addEventListener('DOMContentLoaded', () => {

  // --- Header Logic ---
  const header = document.querySelector('.site-header');
  const updateHeaderHeight = () => {
    if (!header) return;
    const headerHeight = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-h', `${headerHeight}px`);
  };

  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateHeaderHeight);
    updateHeaderHeight();
  }

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  if (mobileNavToggle && mobileNav) {
    const openMenu = () => {
      document.body.classList.add('nav-open');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
    };

    const closeMenu = () => {
      document.body.classList.remove('nav-open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    };

    mobileNavToggle.addEventListener('click', () => {
      if (document.body.classList.contains('nav-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileNavClose?.addEventListener('click', closeMenu);
    mobileNavBackdrop?.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        closeMenu();
      }
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal-up');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.staggerDelay || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
      });
    }
  });

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    let currentIndex = 0;
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    if (dotsContainer) {
      for (let i = 0; i < totalSlides; i++) {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `Go to slide ${i + 1}`);
        button.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(button);
      }
    }

    prevButton?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });

    nextButton?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    });

    updateCarousel(); // Initial setup
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.setAttribute('aria-hidden', 'false');
      cookieBanner.classList.add('is-visible');
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
      setTimeout(() => cookieBanner.setAttribute('aria-hidden', 'true'), 300);
    });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (scrolled past)
        if (!entry.isIntersecting) {
          stickyCTA.classList.add('is-visible');
          stickyCTA.setAttribute('aria-hidden', 'false');
        } else {
          stickyCTA.classList.remove('is-visible');
          stickyCTA.setAttribute('aria-hidden', 'true');
        }
      });
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      ctaObserver.observe(heroSection);
    }
  }

  // --- Scrollspy for Leistungen Page ---
  const pageNav = document.querySelector('.page-nav');
  if (pageNav) {
    const navLinks = pageNav.querySelectorAll('.page-nav-link');
    const sections = Array.from(navLinks).map(link => document.getElementById(link.hash.substring(1))).filter(Boolean);

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = pageNav.querySelector(`a[href='#${id}']`);
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('is-active'));
                if (navLink) navLink.classList.add('is-active');
            }
        });
    }, { 
        rootMargin: `-${header ? header.getBoundingClientRect().height + 60 : 130}px 0px -60% 0px`,
        threshold: 0
    });

    sections.forEach(section => scrollSpyObserver.observe(section));
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

});