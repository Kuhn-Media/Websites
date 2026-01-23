document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  const mobileNavClose = document.querySelector('.mobile-nav-toggle.close');

  if (mobileNavToggle && mobileNavMenu) {
    const toggleMenu = () => {
      const isOpen = mobileNavMenu.classList.toggle('open');
      mobileNavToggle.setAttribute('aria-expanded', isOpen);
      mobileNavMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileNavToggle.addEventListener('click', toggleMenu);
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', toggleMenu);
    }
  }

  // --- Sticky Header --- //
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

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- FAQ Accordion --- //
  const faqAccordion = document.getElementById('faq-accordion');
  if (faqAccordion) {
    faqAccordion.addEventListener('click', (e) => {
      const question = e.target.closest('.faq-question');
      if (question) {
        const item = question.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isExpanded = question.getAttribute('aria-expanded') === 'true';

        question.setAttribute('aria-expanded', !isExpanded);
        answer.style.display = isExpanded ? 'none' : 'block';
      }
    });
  }

  // --- Testimonial Carousel --- //
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

    slides.forEach((slide, index) => {
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
    
    moveToSlide(0);
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past hero)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('visible');
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

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
          cookieBanner.classList.add('visible');
      }, 1000);
  }

  if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
          localStorage.setItem('cookieConsent', 'accepted');
          cookieBanner.classList.remove('visible');
      });
  }

  if (declineBtn) {
      declineBtn.addEventListener('click', () => {
          localStorage.setItem('cookieConsent', 'declined');
          cookieBanner.classList.remove('visible');
      });
  }

  // --- Lightbox --- //
  const gallery = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  if (gallery && lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    const showImage = (index) => {
        const item = galleryItems[index];
        if (item) {
            lightboxImg.src = item.href;
            currentIndex = index;
        }
    };

    const openLightbox = (e) => {
        e.preventDefault();
        const clickedItem = e.target.closest('.gallery-item');
        if (clickedItem) {
            const index = galleryItems.indexOf(clickedItem);
            showImage(index);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('open'), 10);
        }
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        setTimeout(() => lightbox.style.display = 'none', 300);
    };

    gallery.addEventListener('click', openLightbox);
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
    lightboxNext.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('open')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        }
    });
  }

});