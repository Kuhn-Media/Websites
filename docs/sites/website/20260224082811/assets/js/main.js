document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY HEADER --- //
  const header = document.getElementById('site-header');
  if (header) {
    const scrollThreshold = 50;
    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- 2. MOBILE NAVIGATION --- //
  const navToggle = document.getElementById('mobile-nav-toggle');
  const mainNav = document.getElementById('main-nav-list');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('open');
      document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });
  }

  // --- 3. SCROLL REVEAL ANIMATION --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- 4. FAQ ACCORDION --- //
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

  // --- 5. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');
  const cookieConsent = localStorage.getItem('cookie_consent');

  if (!cookieConsent && cookieBanner) {
    cookieBanner.hidden = false;
    setTimeout(() => cookieBanner.classList.add('visible'), 100);
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (declineButton) {
    declineButton.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- 6. STICKY CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show sticky CTA when hero is NOT intersecting (i.e., scrolled past it)
            if (!entry.isIntersecting && window.scrollY > 300) {
                stickyCta.hidden = false;
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

  // --- 7. LIGHTBOX GALLERY --- //
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox ? lightbox.querySelector('.lightbox-image') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  let currentIndex = 0;

  if (galleryItems.length > 0 && lightbox) {
    const images = Array.from(galleryItems).map(item => ({ 
        src: item.href, 
        alt: item.dataset.alt,
        kmImage: item.dataset.kmImage
    }));

    function showImage(index) {
        const img = images[index];
        if (img) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxImage.setAttribute('data-km-image', img.kmImage);
            currentIndex = index;
        }
    }

    function showLightbox(index) {
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        showImage(index);
    }

    function hideLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) hideLightbox();
    });

    lightboxPrev.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(newIndex);
    });

    lightboxNext.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % images.length;
        showImage(newIndex);
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.hidden) {
            if (e.key === 'Escape') hideLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        }
    });
  }

  // --- 8. CONTACT FORM HANDLING (Placeholder) --- //
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const formStatus = document.getElementById('form-status');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet...';
      formStatus.className = 'form-status success';
      
      // Simulate form submission
      setTimeout(() => {
        formStatus.textContent = 'Nachricht erfolgreich gesendet! Wir melden uns in Kürze.';
        contactForm.reset();
      }, 1500);

      // In a real scenario, you would use fetch() to send data to a server.
    });
  }

});