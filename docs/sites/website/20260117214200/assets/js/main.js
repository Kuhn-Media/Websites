document.addEventListener('DOMContentLoaded', () => {

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
  const navList = document.querySelector('.nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navList.classList.toggle('open');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });
  }

  // --- Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger');
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

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
        dotsContainer.childNodes.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });
    
    updateCarousel();
  }

  // --- Lightbox Gallery --- //
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  if (gallery && lightbox) {
      const lightboxImg = document.getElementById('lightbox-img');
      const galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
      let currentIndex = 0;

      const showImage = (index) => {
          const item = galleryItems[index];
          const imgSrc = item.href;
          const imgAlt = item.querySelector('img').alt;
          lightboxImg.src = imgSrc;
          lightboxImg.alt = imgAlt;
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

      lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
              lightbox.hidden = true;
              document.body.style.overflow = '';
          }
      });

      document.querySelector('.lightbox-next').addEventListener('click', () => {
          const nextIndex = (currentIndex + 1) % galleryItems.length;
          showImage(nextIndex);
      });

      document.querySelector('.lightbox-prev').addEventListener('click', () => {
          const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
          showImage(prevIndex);
      });

      document.addEventListener('keydown', (e) => {
          if (!lightbox.hidden) {
              if (e.key === 'Escape') lightbox.querySelector('.lightbox-close').click();
              if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
              if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
          }
      });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
      if (!localStorage.getItem('cookiesAccepted')) {
          cookieBanner.hidden = false;
      }
      cookieAccept.addEventListener('click', () => {
          localStorage.setItem('cookiesAccepted', 'true');
          cookieBanner.hidden = true;
      });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  const heroSection = document.querySelector('.hero');
  if (stickyCTA && heroSection) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (!entry.isIntersecting) {
                  stickyCTA.hidden = false;
                  setTimeout(() => stickyCTA.classList.add('visible'), 10);
              } else {
                  stickyCTA.classList.remove('visible');
                  setTimeout(() => stickyCTA.hidden = true, 300);
              }
          });
      }, { threshold: 0 });
      ctaObserver.observe(heroSection);
  }

});