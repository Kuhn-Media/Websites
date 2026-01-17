document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.padding = '0 0 24px';
      } else {
        answer.style.maxHeight = '0';
        answer.style.padding = '0';
      }
    });
  });

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const nextButton = document.querySelector('.carousel-controls .next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      if (currentIndex < 0) currentIndex = slides.length - 1;
      if (currentIndex >= slides.length) currentIndex = 0;
      updateCarousel();
    }

    prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch/Drag functionality
    let startX, isDragging = false;
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = startX - currentX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) goToSlide(currentIndex + 1); // swipe left
            else goToSlide(currentIndex - 1); // swipe right
            isDragging = false;
        }
    });
    carousel.addEventListener('touchend', () => { isDragging = false; });

    updateCarousel();
  }

  // --- Scroll Reveal ---
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 100}ms`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }
  
  // --- Sticky CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 600) {
              stickyCta.classList.add('visible');
          } else {
              stickyCta.classList.remove('visible');
          }
      });
  }
  
  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;
    const imageSources = Array.from(galleryItems).map(item => item.href);

    const showImage = (index) => {
      lightboxImg.src = imageSources[index];
      currentIndex = index;
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        lightbox.classList.add('active');
        showImage(index);
      });
    });

    const closeLightbox = () => lightbox.classList.remove('active');
    const showPrev = () => showImage((currentIndex - 1 + imageSources.length) % imageSources.length);
    const showNext = () => showImage((currentIndex + 1) % imageSources.length);

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }
});