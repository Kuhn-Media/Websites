document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('mobile-nav-toggle');
  const navList = document.getElementById('main-nav-list');
  if (navToggle && navList) {
    let navOverlay;
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navList.classList.toggle('is-open');
      navToggle.classList.toggle('is-open');
      
      if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
        navOverlay.addEventListener('click', () => closeNav());
      }
      navOverlay.classList.toggle('is-open');
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    const closeNav = () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navList.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        if(navOverlay) navOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }
  }

  // --- Sticky Header ---
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

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 100); // Staggered delay
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- Carousel ---
  const carousel = document.getElementById('projects-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector('.next');
    const prevButton = carousel.querySelector('.prev');
    const dotsNav = carousel.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;

    const setSlidePosition = (slide, index) => {
      slide.style.left = slideWidth * index + 'px';
    };
    // slides.forEach(setSlidePosition); // This is for absolute positioning, not needed for flexbox approach

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.addEventListener('click', () => moveToSlide(i));
        dotsNav.appendChild(dot);
    }
    const dots = Array.from(dotsNav.children);

    const moveToSlide = (targetIndex) => {
        const currentSlideIndex = slides.findIndex(slide => slide === track.querySelector('.current-slide'));
        if(targetIndex < 0) targetIndex = slides.length - 1;
        if(targetIndex >= slides.length) targetIndex = 0;

        track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
        slides.forEach(s => s.classList.remove('current-slide'));
        slides[targetIndex].classList.add('current-slide');

        updateDots(targetIndex);
    };

    const updateDots = (targetIndex) => {
        dots.forEach(d => d.classList.remove('active'));
        dots[targetIndex].classList.add('active');
    }

    nextButton.addEventListener('click', () => {
        const currentSlideIndex = slides.findIndex(slide => slide === track.querySelector('.current-slide'));
        moveToSlide(currentSlideIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        const currentSlideIndex = slides.findIndex(slide => slide === track.querySelector('.current-slide'));
        moveToSlide(currentSlideIndex - 1);
    });
    
    // Touch/drag functionality
    let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0, animationID;
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('mouseleave', dragEnd);
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('mousemove', drag);
    track.addEventListener('touchmove', drag);

    function dragStart(e) {
        isDragging = true;
        startPos = getPositionX(e);
        animationID = requestAnimationFrame(animation);
        track.style.transition = 'none';
    }

    function drag(e) {
        if (isDragging) {
            const currentPosition = getPositionX(e);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function dragEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        const movedBy = currentTranslate - prevTranslate;
        const currentSlideIndex = slides.findIndex(slide => slide.classList.contains('current-slide'));

        if (movedBy < -100 && currentSlideIndex < slides.length - 1) {
            moveToSlide(currentSlideIndex + 1);
        } else if (movedBy > 100 && currentSlideIndex > 0) {
            moveToSlide(currentSlideIndex - 1);
        } else {
            moveToSlide(currentSlideIndex);
        }
        track.style.transition = '';
        prevTranslate = currentTranslate;
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function animation() {
        track.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) requestAnimationFrame(animation);
    }

    // Initialize
    slides[0].classList.add('current-slide');
    dots[0].classList.add('active');
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // --- Sticky CTA Bar ---
  const stickyCtaBar = document.getElementById('sticky-cta-bar');
  if (stickyCtaBar) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when hero is NOT intersecting (scrolled past it)
            if (!entry.isIntersecting) {
                stickyCtaBar.classList.add('visible');
            } else {
                stickyCtaBar.classList.remove('visible');
            }
        });
    }, { rootMargin: '0px 0px -100% 0px' }); // Trigger when hero is fully out of view

    const heroSection = document.querySelector('.hero, .page-hero');
    if (heroSection) {
        stickyCtaBar.hidden = false;
        ctaObserver.observe(heroSection);
    }
  }

  // --- Lightbox --- 
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item img');
  if (lightbox && galleryItems.length > 0) {
      const lightboxImage = lightbox.querySelector('.lightbox-image');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      let currentIndex = 0;

      const images = Array.from(galleryItems).map(item => ({ src: item.src, alt: item.alt }));

      const showImage = (index) => {
          currentIndex = (index + images.length) % images.length;
          lightboxImage.src = images[currentIndex].src;
          lightboxImage.alt = images[currentIndex].alt;
      };

      galleryItems.forEach((item, index) => {
          item.addEventListener('click', () => {
              lightbox.classList.add('visible');
              showImage(index);
          });
      });

      const closeLightbox = () => lightbox.classList.remove('visible');

      closeBtn.addEventListener('click', closeLightbox);
      prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
      nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

      lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener('keydown', (e) => {
          if (!lightbox.classList.contains('visible')) return;
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
          if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      });
  }
});