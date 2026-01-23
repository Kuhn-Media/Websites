document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE NAVIGATION ---
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navList.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- STICKY HEADER ---
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-stagger');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const delay = entry.target.classList.contains('reveal-stagger') ? index * 100 : 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
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
      });
    }
  });

  // --- TESTIMONIAL SLIDER ---
  const slider = document.getElementById('testimonial-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentIndex = 0;

    const goToSlide = (index) => {
      slider.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    };

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');
    
    const updateButtons = () => {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slides.length - 1;
    };

    nextBtn.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) goToSlide(currentIndex - 1);
    });

    goToSlide(0);
  }

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookiesBtn) {
    if (!localStorage.getItem('cookiesAccepted')) {
      cookieBanner.hidden = false;
    } else {
        cookieBanner.remove();
    }

    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.hidden = true;
      setTimeout(() => cookieBanner.remove(), 500);
    });
  }

  // --- STICKY CTA & BACK TO TOP ---
  const stickyCta = document.getElementById('sticky-cta');
  const backToTopBtn = document.getElementById('back-to-top');
  const progressRing = backToTopBtn?.querySelector('.progress-ring-circle');
  const circumference = progressRing ? 2 * Math.PI * progressRing.r.baseVal.value : 0;

  if (progressRing) {
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = circumference;
  }

  const handleScrollFeatures = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;

    if (stickyCta) {
      if (scrollTop > window.innerHeight * 0.8) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
      if(progressRing) {
        const progress = (scrollTop / scrollHeight) * circumference;
        progressRing.style.strokeDashoffset = circumference - progress;
      }
    }
  };

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', handleScrollFeatures, { passive: true });

  // --- LIGHTBOX GALLERY ---
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;
    const imageSources = Array.from(galleryImages).map(img => ({ src: img.dataset.lightboxSrc, alt: img.dataset.lightboxAlt }));

    const showImage = (index) => {
      if (index < 0 || index >= imageSources.length) return;
      const { src, alt } = imageSources[index];
      lightboxImage.src = src;
      lightboxImage.alt = alt;
      currentIndex = index;
      prevBtn.style.display = index === 0 ? 'none' : 'block';
      nextBtn.style.display = index === imageSources.length - 1 ? 'none' : 'block';
    };

    const openLightbox = (index) => {
      showImage(index);
      lightbox.classList.add('visible');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      document.body.style.overflow = '';
    };

    galleryImages.forEach((img, index) => {
      img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      }
    });
  }
});