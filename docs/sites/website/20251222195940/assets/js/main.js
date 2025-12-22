document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Sticky Header --- //
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

  // --- 2. Mobile Navigation --- //
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('is-active');
      navToggle.setAttribute('aria-expanded', isActive);
      document.body.classList.toggle('nav-open', isActive);
    });
  }

  // --- 3. Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.revealDelay) || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- 4. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieBanner.classList.add('visible');
      }, 1000);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- 5. Sticky Context CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show CTA when hero is NOT intersecting (i.e., scrolled past)
            if (!entry.isIntersecting) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }, { threshold: 0, rootMargin: '-200px 0px 0px 0px' });
    
    const heroSection = document.querySelector('.hero, .hero-subpage');
    if(heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

  // --- 6. Lightbox Gallery --- //
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('[data-lightbox]');
  let currentImageIndex = 0;
  const images = Array.from(galleryItems).map(item => item.href);

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    const showImage = (index) => {
      lightboxImg.src = images[index];
      currentImageIndex = index;
    };

    const openLightbox = (e) => {
      e.preventDefault();
      const imageIndex = images.indexOf(e.currentTarget.href);
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      showImage(imageIndex);
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const showPrevImage = () => {
      const newIndex = (currentImageIndex - 1 + images.length) % images.length;
      showImage(newIndex);
    };

    const showNextImage = () => {
      const newIndex = (currentImageIndex + 1) % images.length;
      showImage(newIndex);
    };

    galleryItems.forEach(item => item.addEventListener('click', openLightbox));
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    });
  }

});