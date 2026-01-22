document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '200px 0px 0px 0px' });
    scrollObserver.observe(document.body);
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const primaryNav = document.querySelector('#primary-navigation');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isVisible = primaryNav.getAttribute('data-visible') === 'true';
      primaryNav.setAttribute('data-visible', !isVisible);
      navToggle.setAttribute('aria-expanded', !isVisible);
      document.body.style.overflow = !isVisible ? 'hidden' : '';
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Stagger children if needed
        const staggerChildren = entry.target.querySelectorAll('.stagger-child');
        staggerChildren.forEach((child, index) => {
          child.style.transitionDelay = `${index * 100}ms`;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- Accordion --- //
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const button = item.querySelector('.accordion-button');
    const content = item.querySelector('.accordion-content');
    if (button && content) {
      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        content.hidden = isExpanded;
      });
    }
  });

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const createDots = () => {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(i));
        dotsNav.appendChild(dot);
      });
    };

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      const dots = dotsNav.children;
      Array.from(dots).forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === slides.length - 1;
    };

    const moveToSlide = (index) => {
      if (index < 0 || index >= slides.length) return;
      currentIndex = index;
      updateCarousel();
    };

    nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
    prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));
    
    createDots();
    updateCarousel();
  }

  // --- Interactive House --- //
  const hotspots = document.querySelectorAll('.interactive-svg .hotspot');
  const hotspotTexts = document.querySelectorAll('.hotspot-text');
  if (hotspots.length > 0) {
    hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        const targetId = `hotspot-${hotspot.dataset.hotspot}`;
        hotspots.forEach(h => h.classList.remove('active'));
        hotspot.classList.add('active');
        hotspotTexts.forEach(text => {
          text.classList.toggle('active', text.id === targetId);
        });
      });
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookiesBtn) {
    setTimeout(() => {
      if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.classList.add('visible');
      }
    }, 1000);

    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver(([entry]) => {
        // Show when hero is NOT intersecting (user has scrolled down)
        stickyCTA.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

});