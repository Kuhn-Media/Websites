document.addEventListener('DOMContentLoaded', () => {

  const initMobileMenu = () => {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('#primary-navigation');

    if (navToggle && primaryNav) {
      navToggle.addEventListener('click', () => {
        const isVisible = primaryNav.getAttribute('data-visible') === 'true';
        primaryNav.setAttribute('data-visible', !isVisible);
        navToggle.setAttribute('aria-expanded', !isVisible);
        document.body.classList.toggle('nav-open');
      });
    }
  };

  const initStickyHeader = () => {
    const header = document.getElementById('site-header');
    const stickyCta = document.getElementById('sticky-cta');
    if (header) {
      const stickyObserver = new IntersectionObserver(([e]) => {
        header.classList.toggle('scrolled', e.intersectionRatio < 1);
        if (stickyCta) {
            stickyCta.classList.toggle('visible', e.intersectionRatio < 0.5);
        }
      }, { threshold: [0.5, 1] });
      stickyObserver.observe(document.body);
    }
  };

  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger-group > *');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const delay = entry.target.closest('.reveal-stagger-group') ? index * 100 : 0;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
  };

  const initFaqAccordion = () => {
    const accordion = document.getElementById('faq-accordion');
    if (accordion) {
      const questions = accordion.querySelectorAll('.faq-question');
      questions.forEach(question => {
        question.addEventListener('click', () => {
          const answer = question.nextElementSibling;
          const isExpanded = question.getAttribute('aria-expanded') === 'true';
          question.setAttribute('aria-expanded', !isExpanded);
          answer.hidden = isExpanded;
        });
      });
    }
  };

  const initTestimonialSlider = () => {
    const slider = document.getElementById('testimonial-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-button.prev');
    const nextBtn = document.querySelector('.slider-button.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentIndex = 0;

    if (slides.length <= 1) {
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
        return;
    }

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.dot');

    const goToSlide = (index) => {
      currentIndex = index;
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    };

    prevBtn.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(newIndex);
    });

    nextBtn.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % slides.length;
      goToSlide(newIndex);
    });
  };

  const initLightbox = () => {
    const gallery = document.getElementById('project-gallery');
    if (!gallery) return;

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    const showImage = (index) => {
      const item = galleryItems[index];
      lightboxImg.src = item.href;
      lightboxCaption.textContent = item.dataset.title || '';
      currentIndex = index;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    };

    const hideLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        showImage(index);
      });
    });

    closeBtn.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) hideLightbox();
    });
    prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
    nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') hideLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  };

  const initCookieBanner = () => {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent) {
      banner.hidden = false;
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        banner.hidden = true;
    }

    acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    declineBtn.addEventListener('click', () => handleConsent('declined'));
  };

  // Initialize all modules
  initMobileMenu();
  initStickyHeader();
  initScrollReveal();
  initFaqAccordion();
  initTestimonialSlider();
  initLightbox();
  initCookieBanner();
});