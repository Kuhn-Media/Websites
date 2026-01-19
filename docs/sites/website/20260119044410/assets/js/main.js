document.addEventListener('DOMContentLoaded', function() {

  // --- MOBILE NAVIGATION ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNavToggle && mobileNav) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.setAttribute('aria-hidden', isExpanded);
      document.body.classList.toggle('mobile-nav-open');
    });

    mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) {
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('mobile-nav-open');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
            mobileNavToggle.click();
        }
    });
  }

  // --- STICKY HEADER ---
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
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
  }

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        answer.hidden = isExpanded;
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.paddingTop = 'var(--spacing-sm)';
        } else {
          answer.style.maxHeight = 0;
          answer.style.paddingTop = '0';
        }
      });

      // Reset max-height on transition end to allow for resize
      answer.addEventListener('transitionend', () => {
        if (question.getAttribute('aria-expanded') === 'true') {
          answer.style.maxHeight = 'none';
        }
      });
    }
  });

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieAccepted')) {
      setTimeout(() => cookieBanner.classList.add('active'), 2000);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.classList.remove('active');
    });
  }

  // --- CAROUSEL & LIGHTBOX ---
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const slides = Array.from(carousel.children);
    let slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const updateDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === currentIndex) button.classList.add('active');
        button.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(button);
      });
    };

    const updateCarousel = () => {
      carousel.scrollTo({ left: currentIndex * slideWidth, behavior: 'smooth' });
      updateDots();
    };

    const handleResize = () => {
        slideWidth = slides[0].getBoundingClientRect().width;
        updateCarousel();
    }

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
    
    window.addEventListener('resize', handleResize);
    updateDots();

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;

    const showImage = (index) => {
        const item = galleryItems[index];
        lightboxImg.src = item.href;
        lightboxImg.alt = item.querySelector('img').alt;
        lightboxTitle.textContent = item.dataset.title || '';
        currentImageIndex = index;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            lightbox.classList.add('active');
            showImage(index);
        });
    });

    lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });
    lightboxPrev.addEventListener('click', () => showImage((currentImageIndex - 1 + galleryItems.length) % galleryItems.length));
    lightboxNext.addEventListener('click', () => showImage((currentImageIndex + 1) % galleryItems.length));

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') lightboxClose.click();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        }
    });
  }

  // --- STICKY CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  const heroSection = document.querySelector('.hero');
  if (stickyCTA && heroSection) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }, { threshold: 0 });
      observer.observe(heroSection);
  }

});