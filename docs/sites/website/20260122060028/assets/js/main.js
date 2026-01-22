document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE NAVIGATION ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavDrawer = document.querySelector('#mobile-nav-drawer');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  const openMobileNav = () => {
    document.body.classList.add('nav-open');
    mobileNavDrawer.classList.add('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileNavBackdrop.classList.add('is-visible');
  };

  const closeMobileNav = () => {
    document.body.classList.remove('nav-open');
    mobileNavDrawer.classList.remove('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileNavBackdrop.classList.remove('is-visible');
  };

  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener('click', openMobileNav);
    mobileNavClose.addEventListener('click', closeMobileNav);
    mobileNavBackdrop.addEventListener('click', closeMobileNav);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('is-open')) {
        closeMobileNav();
      }
    });
  }

  // --- STICKY HEADER ---
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.gridTemplateRows = '1fr';
      } else {
        answer.style.gridTemplateRows = '0fr';
      }
    });
  });

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealItems = document.querySelectorAll('.reveal-item');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealItems.forEach(item => {
    observer.observe(item);
  });

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieAccepted = localStorage.getItem('cookieAccepted');

  if (!cookieAccepted && cookieBanner) {
    cookieBanner.classList.add('is-visible');
    cookieBanner.setAttribute('aria-hidden', 'false');
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.classList.remove('is-visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

  // --- STICKY CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const handleCtaScroll = () => {
      if (window.scrollY > 400) {
        stickyCta.classList.add('is-visible');
        stickyCta.setAttribute('aria-hidden', 'false');
      } else {
        stickyCta.classList.remove('is-visible');
        stickyCta.setAttribute('aria-hidden', 'true');
      }
    };
    window.addEventListener('scroll', handleCtaScroll, { passive: true });
  }

  // --- CERTIFICATIONS CAROUSEL ---
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    const carousel = carouselContainer.querySelector('.carousel');
    const slides = Array.from(carousel.children);
    const nextButton = carouselContainer.querySelector('.carousel-next');
    const prevButton = carouselContainer.querySelector('.carousel-prev');
    const dotsNav = carouselContainer.querySelector('.carousel-dots');

    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const moveToSlide = (targetIndex) => {
      carousel.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
      currentIndex = targetIndex;
      updateDots(targetIndex);
    };

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.addEventListener('click', () => moveToSlide(i));
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

  // --- LIGHTBOX GALLERY ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox__caption');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');
    let currentIndex;

    const images = Array.from(galleryItems).map(item => ({ src: item.href, alt: item.dataset.alt }));

    const showImage = (index) => {
      const { src, alt } = images[index];
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightboxCaption.textContent = alt;
      currentIndex = index;
    };

    const openLightbox = (index) => {
      lightbox.classList.add('is-visible');
      lightbox.setAttribute('aria-hidden', 'false');
      showImage(index);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-visible');
      lightbox.setAttribute('aria-hidden', 'true');
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
      const newIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(newIndex);
    });

    nextBtn.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % images.length;
      showImage(newIndex);
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('is-visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  }

});