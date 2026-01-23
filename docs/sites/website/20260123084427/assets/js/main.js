document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header ---
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

  // --- Mobile Navigation ---
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 100}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));

  // --- FAQ Accordion ---
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

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-controls .next');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const dotsNav = document.querySelector('.carousel-controls .dots');
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(i));
        dotsNav.appendChild(dot);
    });
    const dots = Array.from(dotsNav.children);

    const moveToSlide = (targetIndex) => {
        carousel.style.transform = 'translateX(-' + targetIndex * 100 + '%)';
        dots[currentIndex].classList.remove('active');
        dots[targetIndex].classList.add('active');
        currentIndex = targetIndex;
    };

    nextButton.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % slides.length;
        moveToSlide(newIndex);
    });

    prevButton.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        moveToSlide(newIndex);
    });
    
    // Touch controls
    let touchstartX = 0;
    let touchendX = 0;
    
    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextButton.click();
        if (touchendX > touchstartX) prevButton.click();
    });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 600) {
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
      });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookies) {
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('visible');
    });
  }

  // --- Lightbox --- 
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (lightbox && galleryItems.length > 0) {
      const lightboxImg = lightbox.querySelector('img');
      const lightboxDesc = lightbox.querySelector('.lightbox-description');
      const closeBtn = lightbox.querySelector('.close');
      const prevBtn = lightbox.querySelector('.prev');
      const nextBtn = lightbox.querySelector('.next');
      let currentImageIndex;

      const images = Array.from(galleryItems);

      const showImage = (index) => {
          const imgElement = images[index];
          lightboxImg.src = imgElement.src;
          lightboxImg.alt = imgElement.alt;
          if (lightboxDesc) {
            lightboxDesc.textContent = imgElement.dataset.description || '';
          }
          currentImageIndex = index;
          lightbox.classList.add('active');
      };

      images.forEach((img, index) => {
          img.addEventListener('click', () => showImage(index));
      });

      const closeLightbox = () => lightbox.classList.remove('active');
      const showPrevImage = () => showImage((currentImageIndex - 1 + images.length) % images.length);
      const showNextImage = () => showImage((currentImageIndex + 1) % images.length);

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