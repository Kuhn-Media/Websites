document.addEventListener('DOMContentLoaded', function() {

  // --- 1. MOBILE MENU --- //
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.setAttribute('aria-hidden', isExpanded);
      document.body.classList.toggle('mobile-menu-open');
    });
  }

  // --- 2. STICKY HEADER --- //
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

  // --- 3. SCROLL REVEAL ANIMATIONS --- //
  const revealElements = document.querySelectorAll('.reveal-item, .reveal-group');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
  }

  // --- 4. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.setAttribute('aria-hidden', 'false');
      cookieBanner.classList.add('visible');
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
      setTimeout(() => cookieBanner.setAttribute('aria-hidden', 'true'), 500);
    });
  }

  // --- 5. GLOBAL LIGHTBOX --- //
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImage = lightbox.querySelector('img');
    const closeButton = lightbox.querySelector('.km-lightbox-close');
    const prevButton = lightbox.querySelector('.km-lightbox-prev');
    const nextButton = lightbox.querySelector('.km-lightbox-next');
    const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
    let currentGallery = [];
    let currentIndex = -1;

    const updateLightbox = () => {
      if (currentIndex >= 0 && currentIndex < currentGallery.length) {
        const trigger = currentGallery[currentIndex];
        const src = trigger.dataset.imageSrc;
        const alt = trigger.dataset.imageAlt || 'Galeriebild';
        lightboxImage.src = '../' + src; // Adjust for subfolder structure
        if (window.location.pathname === '/') {
             lightboxImage.src = src;
        }
        lightboxImage.alt = alt;
      }
      prevButton.style.display = currentIndex > 0 ? 'flex' : 'none';
      nextButton.style.display = currentIndex < currentGallery.length - 1 ? 'flex' : 'none';
    };

    const openLightbox = (trigger) => {
      const galleryId = trigger.dataset.lightboxTrigger;
      currentGallery = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${galleryId}']`));
      currentIndex = currentGallery.indexOf(trigger);
      document.body.style.overflow = 'hidden';
      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.classList.add('visible');
      updateLightbox();
      closeButton.focus();
    };

    const closeLightbox = () => {
      document.body.style.overflow = '';
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.classList.remove('visible');
      currentGallery = [];
      currentIndex = -1;
    };

    document.addEventListener('click', e => {
      const trigger = e.target.closest('[data-lightbox-trigger]');
      if (trigger) {
        e.preventDefault();
        openLightbox(trigger);
      }
    });

    closeButton.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; updateLightbox(); } });
    nextButton.addEventListener('click', () => { if (currentIndex < currentGallery.length - 1) { currentIndex++; updateLightbox(); } });

    document.addEventListener('keydown', e => {
      if (lightbox.classList.contains('visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevButton.click();
        if (e.key === 'ArrowRight') nextButton.click();
      }
    });
  }

  // --- 6. STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const showAt = 600; // Pixels from top to show CTA
    window.addEventListener('scroll', () => {
      if (window.scrollY > showAt && (window.innerHeight + window.scrollY) < document.body.offsetHeight - 400) {
        stickyCTA.classList.add('visible');
        stickyCTA.setAttribute('aria-hidden', 'false');
      } else {
        stickyCTA.classList.remove('visible');
        stickyCTA.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // --- 7. TESTIMONIAL CAROUSEL --- //
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    };

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);
    goToSlide(0);

    nextBtn.addEventListener('click', () => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      goToSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) prevIndex = slides.length - 1;
      goToSlide(prevIndex);
    });
  }

});