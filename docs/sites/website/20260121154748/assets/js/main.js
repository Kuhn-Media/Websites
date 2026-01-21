document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavContainer = document.querySelector('.mobile-nav-container');
  if (mobileNavToggle && mobileNavContainer) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNavContainer.classList.toggle('open');
      mobileNavContainer.setAttribute('aria-hidden', isExpanded);
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });
    mobileNavContainer.addEventListener('click', (e) => {
      if (e.target === mobileNavContainer) {
        mobileNavToggle.click();
      }
    });
  }

  // --- Sticky Header ---
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -15% 0px' });
  revealElements.forEach(el => observer.observe(el));

  // --- Accordion ---
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
    });
  });

  // --- Testimonial Slider ---
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentIndex = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.dot');

    const goToSlide = (index) => {
      slider.scrollTo({ left: slides[index].offsetLeft - slider.offsetLeft, behavior: 'smooth' });
      currentIndex = index;
      updateControls();
    };

    const updateControls = () => {
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slides.length - 1;
    };

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Update on scroll
    let scrollTimer;
    slider.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const scrollLeft = slider.scrollLeft;
            const slideWidth = slides[0].offsetWidth;
            currentIndex = Math.round(scrollLeft / slideWidth);
            updateControls();
        }, 150);
    });

    goToSlide(0);
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.hidden = false;
        cookieBanner.classList.add('visible');
    }, 1000);
  }
  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Sticky CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when hero is NOT intersecting (scrolled past it)
            if (!entry.isIntersecting) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero');
    if(heroSection) ctaObserver.observe(heroSection);
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

    const images = Array.from(galleryItems).map(item => ({ src: item.href, alt: item.querySelector('img').alt }));

    const showImage = (index) => {
      const imgData = images[index];
      lightboxImg.src = imgData.src;
      lightboxImg.alt = imgData.alt;
      currentIndex = index;
      prevBtn.style.display = index === 0 ? 'none' : 'block';
      nextBtn.style.display = index === images.length - 1 ? 'none' : 'block';
    };

    const openLightbox = (index) => {
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      setTimeout(() => lightbox.classList.add('visible'), 10);
      showImage(index);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      document.body.style.overflow = '';
      setTimeout(() => lightbox.hidden = true, 200);
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
        if (e.key === 'ArrowRight' && currentIndex < images.length - 1) showImage(currentIndex + 1);
      }
    });
  }

});