document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollThreshold = 50;
    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation --- //
  const navToggleButtons = document.querySelectorAll('.mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navBackdrop = document.querySelector('.mobile-nav-backdrop');
  const body = document.body;

  function openMenu() {
    mobileNav.setAttribute('aria-hidden', 'false');
    navToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
    navBackdrop.classList.add('active');
    body.classList.add('no-scroll');
  }

  function closeMenu() {
    mobileNav.setAttribute('aria-hidden', 'true');
    navToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    navBackdrop.classList.remove('active');
    body.classList.remove('no-scroll');
  }

  navToggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  });

  navBackdrop.addEventListener('click', closeMenu);
  mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.getAttribute('aria-hidden') === 'false') {
          closeMenu();
      }
  });

  // --- Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, index * 80); // Stagger effect
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
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

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('button');

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    updateCarousel();
  }

  // --- Lightbox --- //
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = lightbox.querySelector('img');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      let currentIndex = 0;

      const images = Array.from(galleryItems).map(item => ({ src: item.href, alt: item.dataset.alt }));

      function showImage(index) {
          const img = images[index];
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          currentIndex = index;
      }

      function openLightbox(index) {
          lightbox.classList.add('active');
          lightbox.setAttribute('aria-hidden', 'false');
          showImage(index);
      }

      function closeLightbox() {
          lightbox.classList.remove('active');
          lightbox.setAttribute('aria-hidden', 'true');
      }

      galleryItems.forEach((item, index) => {
          item.addEventListener('click', e => {
              e.preventDefault();
              openLightbox(index);
          });
      });

      closeBtn.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', e => {
          if (e.target === lightbox) closeLightbox();
      });

      prevBtn.addEventListener('click', () => {
          const newIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
          showImage(newIndex);
      });

      nextBtn.addEventListener('click', () => {
          const newIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
          showImage(newIndex);
      });

      document.addEventListener('keydown', e => {
          if (lightbox.classList.contains('active')) {
              if (e.key === 'Escape') closeLightbox();
              if (e.key === 'ArrowLeft') prevBtn.click();
              if (e.key === 'ArrowRight') nextBtn.click();
          }
      });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieConsent = localStorage.getItem('shk_cookie_consent');

  if (!cookieConsent && cookieBanner) {
    cookieBanner.setAttribute('aria-hidden', 'false');
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('shk_cookie_consent', 'true');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
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

});