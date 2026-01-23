document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu --- //
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-open');
      mainNav.classList.toggle('active');
      menuToggle.classList.toggle('is-active');
      document.body.classList.toggle('no-scroll');
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal-fade');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- FAQ Accordion --- //
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

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    const dotsContainer = document.querySelector('.carousel-controls .dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    const createDots = () => {
      if (!dotsContainer) return;
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
    };

    if (nextBtn) nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });
    if (prevBtn) prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    createDots();
    updateCarousel();
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('show'), 100);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('lightbox');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  let currentGallery = [];
  let currentIndexInGallery = 0;

  if (lightbox && lightboxTriggers.length > 0) {
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const imgEl = lightbox.querySelector('img');

    const showImage = (index) => {
      const item = currentGallery[index];
      if (!item) return;
      imgEl.src = item.href;
      imgEl.alt = item.querySelector('img')?.alt || 'Projektbild';
      currentIndexInGallery = index;
    };

    const openLightbox = (e) => {
      e.preventDefault();
      const trigger = e.currentTarget;
      const galleryName = trigger.dataset.gallery;
      currentGallery = Array.from(document.querySelectorAll(`.lightbox-trigger[data-gallery='${galleryName}']`));
      const index = currentGallery.indexOf(trigger);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      setTimeout(() => lightbox.classList.add('show'), 10);
      showImage(index);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
      setTimeout(() => lightbox.hidden = true, 300);
    };

    const showNext = () => showImage((currentIndexInGallery + 1) % currentGallery.length);
    const showPrev = () => showImage((currentIndexInGallery - 1 + currentGallery.length) % currentGallery.length);

    lightboxTriggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      }
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when the hero is NOT intersecting (user has scrolled down)
              if (!entry.isIntersecting) {
                  stickyCTA.hidden = false;
                  setTimeout(() => stickyCTA.classList.add('show'), 10);
              } else {
                  stickyCTA.classList.remove('show');
                  setTimeout(() => stickyCTA.hidden = true, 400);
              }
          });
      }, { threshold: 0.1, rootMargin: '200px 0px 0px 0px' });

      const heroSection = document.querySelector('.hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});