document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollObserver = new IntersectionObserver(([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '100px 0px 0px 0px' });
    scrollObserver.observe(document.body);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
  }

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
            answer.hidden = false;
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.paddingBottom = 'var(--spacing-lg)';
        } else {
            answer.style.maxHeight = '0';
            answer.style.paddingBottom = '0';
            setTimeout(() => { answer.hidden = true; }, 500);
        }
      });
    }
  });

  // --- Scroll Animations --- //
  const revealElements = document.querySelectorAll('.reveal');
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

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === currentIndex) dot.classList.add('active');
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

    updateDots();
  }

  // --- Lightbox Gallery --- //
  const gallery = document.querySelector('.lightbox-gallery');
  if (gallery) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    function showImage(index) {
      const item = galleryItems[index];
      lightboxImg.src = item.href;
      lightboxCaption.textContent = item.dataset.title || '';
      currentIndex = index;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', e => {
        e.preventDefault();
        showImage(index);
      });
    });

    closeBtn.addEventListener('click', () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      showImage(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      showImage(currentIndex);
    });

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) {
        closeBtn.click();
      }
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.hidden) {
            if (e.key === 'Escape') closeBtn.click();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // --- Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (i.e., scrolled past it)
              stickyCta.hidden = entry.isIntersecting;
          });
      }, { threshold: 0.1 });

      const heroSection = document.querySelector('.hero, .page-hero');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }
  
  // --- Contact Form Subject --- //
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get('subject');
  const subjectField = document.getElementById('subject');
  if (subject && subjectField) {
      subjectField.value = subject;
  }
});