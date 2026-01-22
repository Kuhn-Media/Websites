document.addEventListener('DOMContentLoaded', () => {

  // --- Header Scroll Logic ---
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
  const navToggleButtons = document.querySelectorAll('.mobile-nav-toggle');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  if (navToggleButtons.length > 0 && mobileNavMenu) {
    navToggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const isOpening = !mobileNavMenu.classList.contains('is-open');
        mobileNavMenu.classList.toggle('is-open');
        document.body.style.overflow = isOpening ? 'hidden' : '';
        navToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', isOpening));
      });
    });
  }

  // --- Intersection Observer for Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100); 
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
    });
  });

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const nextButton = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

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

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
    
    updateCarousel();
  }

  // --- Sticky CTA Bar ---
  const stickyBar = document.querySelector('.sticky-cta-bar');
  if (stickyBar) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (scrolled past it)
        if (!entry.isIntersecting && window.scrollY > 300) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) ctaObserver.observe(heroSection);
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  const declineCookies = document.getElementById('decline-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (acceptCookies) {
      acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('visible');
      });
  }
  
  if(declineCookies) {
      declineCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('visible');
      });
  }

  // --- Lightbox Gallery ---
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const images = Array.from(galleryItems).map(item => ({
      src: item.src.replace('../', ''),
      alt: item.alt
    }));

    const showImage = (index) => {
      const imgData = images[index];
      const relativeSrc = window.location.pathname.includes('/projekte/') ? `../${imgData.src}` : imgData.src;
      lightboxImg.src = relativeSrc;
      lightboxImg.alt = imgData.alt;
      currentIndex = index;
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        showImage(index);
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    };

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
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    });
  }
});