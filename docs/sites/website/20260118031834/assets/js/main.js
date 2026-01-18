document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
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

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isNavOpen = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isNavOpen);
    });

    // Close nav on link click
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    }
  });

  // --- Carousel --- //
  const carousel = document.querySelector('.carousel-slides');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-next');
    const prevButton = document.querySelector('.carousel-prev');
    const dotsNav = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const button = document.createElement('button');
      button.addEventListener('click', () => moveToSlide(i));
      dotsNav.appendChild(button);
    });
    const dots = Array.from(dotsNav.children);

    const moveToSlide = (targetIndex) => {
      carousel.style.transform = 'translateX(-' + slides[targetIndex].offsetLeft + 'px)';
      currentIndex = targetIndex;
      updateControls();
    };

    const updateControls = () => {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;
    };

    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) moveToSlide(currentIndex - 1);
    });
    
    // Touch controls
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
    }, false);

    carousel.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleGesture();
    }, false); 

    function handleGesture() {
        if (touchendX < touchstartX) {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        }
        if (touchendX > touchstartX) {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        }
    }

    moveToSlide(0);
  }

  // --- Cookie Banner --- //
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

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const heroSection = document.querySelector('.hero');
      const footer = document.querySelector('.site-footer-main');
      
      if(heroSection && footer) {
          const heroHeight = heroSection.offsetHeight;
          const footerObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      stickyCTA.classList.remove('visible');
                  } else if (window.scrollY > heroHeight) {
                      stickyCTA.classList.add('visible');
                  }
              });
          }, { threshold: 0.1 });

          footerObserver.observe(footer);

          window.addEventListener('scroll', () => {
              if (window.scrollY > heroHeight && !footer.isIntersecting) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }
  }

  // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex;

    if (lightbox && galleryImages.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        const showImage = (index) => {
            currentImageIndex = index;
            lightboxImg.src = galleryImages[index].src;
            lightboxImg.alt = galleryImages[index].alt;
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === galleryImages.length - 1 ? 'none' : 'block';
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                lightbox.classList.add('visible');
                showImage(index);
            });
        });

        const closeLightbox = () => lightbox.classList.remove('visible');
        const showPrevImage = () => { if (currentImageIndex > 0) showImage(currentImageIndex - 1); };
        const showNextImage = () => { if (currentImageIndex < galleryImages.length - 1) showImage(currentImageIndex + 1); };

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

});