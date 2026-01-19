document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // --- Sticky Header --- //
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

  // --- Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach(item => revealObserver.observe(item));

  // --- Accordion --- //
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

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
    cookieBanner.hidden = false;
  }
  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.hidden = true;
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting
        if (!entry.isIntersecting && window.scrollY > 400) {
          stickyCTA.classList.add('visible');
        } else {
          stickyCTA.classList.remove('visible');
        }
      });
    }, { threshold: 0 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) ctaObserver.observe(heroSection);
  }

  // --- Carousel --- //
  const slider = document.getElementById('project-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.ariaLabel = `Go to slide ${index + 1}`;
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

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
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    function showImage(index) {
      const item = galleryItems[index];
      lightboxImg.src = item.href;
      lightboxCaption.textContent = item.dataset.alt || '';
      currentIndex = index;
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', e => {
        e.preventDefault();
        lightbox.hidden = false;
        showImage(index);
      });
    });

    function closeLightbox() { lightbox.hidden = true; }
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
    nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));

    document.addEventListener('keydown', e => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  }

  // --- Magnetic Buttons --- //
  const magneticButtons = document.querySelectorAll('.magnetic');
  if (window.matchMedia('(pointer: fine)').matches) { // Only on devices with a mouse
    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
        this.style.transition = 'transform 0.1s';
      });
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0,0)';
        this.style.transition = 'transform 0.3s';
      });
    });
  }

});