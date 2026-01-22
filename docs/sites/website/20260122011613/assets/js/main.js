document.addEventListener('DOMContentLoaded', () => {

  // --- Header Shrink on Scroll ---
  const header = document.getElementById('site-header');
  if (header) {
    const shrinkHeader = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', shrinkHeader);
    shrinkHeader();
  }

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.getElementById('mobile-nav-drawer');
  const navBackdrop = document.querySelector('.mobile-nav-backdrop');
  const navClose = document.querySelector('.mobile-nav-close');

  const openMenu = () => {
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navDrawer.classList.add('open');
    navDrawer.setAttribute('aria-hidden', 'false');
    navBackdrop.classList.add('open');
    document.body.classList.add('body-scroll-lock');
  };

  const closeMenu = () => {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navDrawer.classList.remove('open');
    navDrawer.setAttribute('aria-hidden', 'true');
    navBackdrop.classList.remove('open');
    document.body.classList.remove('body-scroll-lock');
  };

  if (navToggle && navDrawer && navBackdrop && navClose) {
    navToggle.addEventListener('click', () => {
      if (navDrawer.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    navClose.addEventListener('click', closeMenu);
    navBackdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('grid')) {
          const children = entry.target.children;
          for (let i = 0; i < children.length; i++) {
            children[i].style.setProperty('--child-index', i);
          }
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Before/After Slider ---
  const slider = document.getElementById('before-after-slider');
  if (slider) {
    const range = slider.querySelector('.slider-range');
    const afterImage = slider.querySelector('.after-image');
    const handle = slider.querySelector('.slider-handle');

    const updateSlider = (value) => {
      afterImage.style.width = value + '%';
      handle.style.left = value + '%';
    };

    range.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });
  }

  // --- Testimonial Carousel ---
  const carouselWrapper = document.getElementById('testimonial-carousel');
  if (carouselWrapper) {
    const carousel = carouselWrapper;
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const slides = carousel.querySelectorAll('.testimonial-slide');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });
    updateCarousel();
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.paddingTop = '0.5rem';
      } else {
        answer.style.maxHeight = '0';
        answer.style.paddingTop = '0';
      }
    });
  });

  // --- Cookie Banner ---
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
  
  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const heroSection = document.querySelector('.hero');
      const footerSection = document.querySelector('.site-footer');
      
      const toggleStickyCTA = () => {
          const heroBottom = heroSection.getBoundingClientRect().bottom;
          const footerTop = footerSection.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;

          if (heroBottom < 0 && footerTop > windowHeight) {
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
      };
      
      window.addEventListener('scroll', toggleStickyCTA);
      toggleStickyCTA();
  }

  // --- Lightbox Gallery ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const items = Array.from(galleryItems).map(item => ({
      src: item.dataset.src,
      alt: item.dataset.alt
    }));

    const showImage = (index) => {
      const item = items[index];
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      currentIndex = index;
    };

    const openLightbox = (index) => {
      lightbox.hidden = false;
      setTimeout(() => lightbox.classList.add('visible'), 10);
      showImage(index);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      setTimeout(() => lightbox.hidden = true, 350);
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + items.length) % items.length;
      showImage(newIndex);
    });

    nextBtn.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % items.length;
      showImage(newIndex);
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  }

});