document.addEventListener('DOMContentLoaded', function() {

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Sticky Header
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

  // Scroll Reveal Animation
  const revealItems = document.querySelectorAll('.reveal-item');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach(item => observer.observe(item));

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
    });
  });

  // Testimonial Carousel
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-controls .next');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const dotsNav = document.querySelector('.carousel-controls .dots');
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(i));
      dotsNav.appendChild(dot);
    });
    const dots = Array.from(dotsNav.children);

    const setSlidePosition = (slide, index) => {
      slide.style.transform = `translateX(${index * 100}%)`;
    };
    slides.forEach(setSlidePosition);
    carousel.style.display = 'flex'; // Use flexbox for sliding

    const moveToSlide = (targetIndex) => {
      carousel.style.transform = `translateX(-${targetIndex * 100}%)`;
      dots[currentIndex].classList.remove('active');
      dots[targetIndex].classList.add('active');
      currentIndex = targetIndex;
    };

    nextButton.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % slides.length;
      moveToSlide(newIndex);
    });

    prevButton.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      moveToSlide(newIndex);
    });

    // Auto-play
    setInterval(() => {
        nextButton.click();
    }, 5000);
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (declineButton) {
      declineButton.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('visible');
    });
  }

  // Sticky CTA
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is not visible
              if (!entry.isIntersecting) {
                  stickyCta.classList.add('visible');
              } else {
                  stickyCta.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });
      const heroSection = document.querySelector('.hero, .hero-subpage');
      if (heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

  // Lightbox Gallery
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');
    let currentIndex;

    const images = Array.from(galleryItems).map(item => ({ src: item.href, alt: item.dataset.alt }));

    const showImage = (index) => {
      lightboxImg.src = images[index].src;
      lightboxImg.alt = images[index].alt;
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
    const showPrev = () => showImage((currentIndex - 1 + images.length) % images.length);
    const showNext = () => showImage((currentIndex + 1) % images.length);

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  }
});