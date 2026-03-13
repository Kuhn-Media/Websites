document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navList = document.getElementById('primary-navigation');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    });
  }

  // --- Scroll Reveal --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

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

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.km-lightbox-close');
  const prevBtn = lightbox.querySelector('.km-lightbox-prev');
  const nextBtn = lightbox.querySelector('.km-lightbox-next');
  let currentImageIndex = -1;
  let galleryImages = [];

  const updateLightbox = () => {
    if (currentImageIndex >= 0 && currentImageIndex < galleryImages.length) {
      const imgPath = galleryImages[currentImageIndex].dataset.kmImage;
      const imgAlt = galleryImages[currentImageIndex].alt;
      lightboxImg.src = imgPath.startsWith('..') ? imgPath : (document.baseURI.includes('/leistungen/') || document.baseURI.includes('/ueber-uns/') || document.baseURI.includes('/kontakt/') || document.baseURI.includes('/impressum/') || document.baseURI.includes('/datenschutz/')) ? '../' + imgPath : imgPath;
      lightboxImg.alt = imgAlt;
    }
  };

  const openLightbox = (index) => {
    currentImageIndex = index;
    lightbox.style.display = 'flex';
    setTimeout(() => lightbox.classList.add('is-visible'), 10);
    document.body.classList.add('no-scroll');
    updateLightbox();
    document.addEventListener('keydown', handleKeydown);
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-visible');
    setTimeout(() => lightbox.style.display = 'none', 300);
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', handleKeydown);
  };

  const showPrev = () => {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  };

  const showNext = () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightbox();
  };

  const handleKeydown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  };

  document.addEventListener('click', e => {
    if (e.target.classList.contains('clickable-image')) {
      galleryImages = Array.from(document.querySelectorAll('.clickable-image'));
      const index = galleryImages.indexOf(e.target);
      openLightbox(index);
    }
  });

  if (lightbox) {
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // --- Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (scrolled past)
        if (!entry.isIntersecting && window.scrollY > 300) {
          stickyCta.hidden = false;
          setTimeout(() => stickyCta.classList.add('is-visible'), 10);
        } else {
          stickyCta.classList.remove('is-visible');
          setTimeout(() => { if(!stickyCta.classList.contains('is-visible')) stickyCta.hidden = true; }, 500);
        }
      });
    }, { threshold: 0 });

    const heroSection = document.querySelector('.hero, .hero-subpage');
    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }
});