document.addEventListener('DOMContentLoaded', () => {

  // Mobile Navigation
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mainMenu = document.querySelector('.main-menu');
  if (mobileNavToggle && mainMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isOpen);
      mainMenu.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  }

  // Sticky Header
  const header = document.getElementById('site-header');
  if (header) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      // A bit of a hack to use the observer. We create a dummy element before the header.
      // A better way would be to use scroll event listener but this is more performant.
      // We check scrollY here to handle reloads mid-page.
      if (window.scrollY > 50) {
          header.classList.add('is-scrolled');
      } else {
          header.classList.remove('is-scrolled');
      }
    });
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    });
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger-group');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-stagger-group')) {
          const children = entry.target.children;
          for (let i = 0; i < children.length; i++) {
            children[i].style.transitionDelay = `${i * 100}ms`;
            children[i].classList.add('is-visible');
          }
        } else {
          entry.target.classList.add('is-visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.hidden = false;
  }
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.hidden = true;
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.hidden = true;
    });
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 600) {
              stickyCTA.hidden = false;
              stickyCTA.classList.add('is-visible');
          } else {
              stickyCTA.classList.remove('is-visible');
          }
      });
  }

  // Carousel
  const carousel = document.getElementById('projects-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width + 20; // 20 is margin
    let currentIndex = 0;

    const moveToSlide = (targetIndex) => {
      track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
      currentIndex = targetIndex;
      updateDots(targetIndex);
    };

    const updateDots = (targetIndex) => {
        const currentDot = dotsNav.querySelector('.active');
        if(currentDot) currentDot.classList.remove('active');
        dotsNav.children[targetIndex].classList.add('active');
    };

    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.addEventListener('click', () => moveToSlide(index));
        dotsNav.appendChild(dot);
    });

    nextButton.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % slides.length;
      moveToSlide(newIndex);
    });

    prevButton.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      moveToSlide(newIndex);
    });
    
    moveToSlide(0);
  }

  // Lightbox
  const gallery = document.getElementById('image-gallery');
  if (gallery) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    const showImage = (index) => {
      const item = galleryItems[index];
      lightboxImg.src = item.href;
      lightboxImg.alt = item.querySelector('img').alt;
      currentIndex = index;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        showImage(index);
      });
    });

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
    document.querySelector('.lightbox-next').addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
        if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
      }
    });
  }
});