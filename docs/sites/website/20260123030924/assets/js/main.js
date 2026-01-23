document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollObserver = new IntersectionObserver(
      ([e]) => header.classList.toggle('scrolled', e.intersectionRatio < 1),
      { threshold: [1] }
    );
    scrollObserver.observe(header);
  }

  // --- 2. MOBILE NAVIGATION --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavContainer = document.querySelector('.mobile-nav-container');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (mobileNavToggle && mobileNavContainer) {
    const toggleMenu = (isOpen) => {
      mobileNavContainer.classList.toggle('open', isOpen);
      mobileNavToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileNavToggle.addEventListener('click', () => toggleMenu(!mobileNavContainer.classList.contains('open')));
    mobileNavClose.addEventListener('click', () => toggleMenu(false));
    mobileNavContainer.addEventListener('click', (e) => {
      if (e.target === mobileNavContainer) toggleMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavContainer.classList.contains('open')) toggleMenu(false);
    });
  }

  // --- 3. SCROLL REVEAL ANIMATIONS --- //
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.dataset.reveal === 'group') {
          const items = entry.target.querySelectorAll('[data-reveal="group-item"]');
          items.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
            item.classList.add('is-visible');
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. TESTIMONIAL CAROUSEL --- //
  const carouselContainer = document.querySelector('.testimonial-carousel-container');
  if (carouselContainer) {
    const carousel = carouselContainer.querySelector('.testimonial-carousel');
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = carouselContainer.querySelector('.carousel-prev');
    const nextBtn = carouselContainer.querySelector('.carousel-next');
    const dotsContainer = carouselContainer.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const button = document.createElement('button');
        button.classList.toggle('active', index === currentIndex);
        button.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
        dotsContainer.appendChild(button);
      });
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    updateDots();
    // Simple touch swipe
    let touchstartX = 0;
    let touchendX = 0;
    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextBtn.click();
        if (touchendX > touchstartX) prevBtn.click();
    });
  }

  // --- 5. BEFORE/AFTER SLIDER --- //
  const baSlider = document.querySelector('.before-after-slider');
  if (baSlider) {
    const sliderInput = baSlider.querySelector('.ba-slider');
    const afterImage = baSlider.querySelector('.ba-after');
    sliderInput.addEventListener('input', (e) => {
      afterImage.style.clipPath = `inset(0 0 0 ${e.target.value}%)`;
    });
  }

  // --- 6. FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
    });
  });

  // --- 7. LIGHTBOX GALLERY --- //
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;
    const galleryItems = Array.from(lightboxTriggers);

    function showImage(index) {
      const item = galleryItems[index];
      const imgSrc = item.getAttribute('href');
      const captionText = item.querySelector('.h5')?.textContent || '';
      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', item.querySelector('img').alt);
      lightboxCaption.textContent = captionText;
      currentIndex = index;
    }

    function openLightbox(e) {
      e.preventDefault();
      const index = galleryItems.indexOf(e.currentTarget);
      showImage(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showNext() { showImage((currentIndex + 1) % galleryItems.length); }
    function showPrev() { showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length); }

    lightboxTriggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  // --- 8. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1000);
  }
  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
      cookieBanner.classList.remove('visible');
      localStorage.setItem('cookiesAccepted', 'true');
    });
  }

  // --- 9. STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (user has scrolled past it)
              stickyCTA.classList.toggle('visible', !entry.isIntersecting);
          });
      }, { threshold: 0.1 });
      const heroSection = document.querySelector('.hero, .hero-subpage');
      if (heroSection) ctaObserver.observe(heroSection);
  }
  
  // --- 10. INTERACTIVE HOUSE --- //
  const houseContainer = document.querySelector('.house-container');
  if (houseContainer) {
    const hotspots = houseContainer.querySelectorAll('.hotspot');
    const infoBox = houseContainer.querySelector('#house-info-box');
    const infoTitle = infoBox.querySelector('#house-info-title');
    const infoText = infoBox.querySelector('#house-info-text');
    const infoLink = infoBox.querySelector('#house-info-link');

    const areaData = {
      dach: {
        title: 'Dach: Die Kraft der Sonne nutzen',
        text: 'Auf dem Dach fangen wir mit Solarthermie und Photovoltaik kostenlose Energie für Wärme und Strom ein.',
        link: 'leistungen/#solar'
      },
      bad: {
        title: 'Bad: Ihre persönliche Wellness-Oase',
        text: 'Im Bad sorgen wir für perfekte Wasserinstallationen, stilvolle Objekte und intelligente Raumnutzung.',
        link: 'leistungen/#sanitaer'
      },
      keller: {
        title: 'Keller: Das Herzstück Ihrer Wärmeversorgung',
        text: 'Im Keller schlägt das Herz Ihres Hauses: die Heizanlage. Wir sorgen dafür, dass sie effizient und zuverlässig arbeitet.',
        link: 'leistungen/#heizung'
      }
    };

    hotspots.forEach(spot => {
      spot.addEventListener('mouseenter', () => {
        const area = spot.dataset.area;
        const data = areaData[area];
        infoTitle.textContent = data.title;
        infoText.textContent = data.text;
        infoLink.href = data.link;
        infoBox.classList.add('visible');
      });
    });

    houseContainer.addEventListener('mouseleave', () => {
      infoBox.classList.remove('visible');
    });
  }

});