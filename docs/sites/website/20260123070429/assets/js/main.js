document.addEventListener('DOMContentLoaded', function() {

  // --- STICKY HEADER ---
  const header = document.querySelector('.site-header.sticky');
  if (header) {
    const headerObserver = new IntersectionObserver(([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '100px 0px 0px 0px' });
    headerObserver.observe(document.body);
  }

  // --- MOBILE MENU ---
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpened = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isOpened);
      menuToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
  }

  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
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
  revealElements.forEach(el => revealObserver.observe(el));

  // --- ACCORDION ---
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.padding = '1rem 0';
      } else {
        content.style.maxHeight = '0';
        content.style.padding = '0';
      }
    });
  });

  // --- TESTIMONIAL CAROUSEL ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.slider-controls .next');
    const prevButton = document.querySelector('.slider-controls .prev');
    const dotsNav = document.querySelector('.slider-controls .dots');
    let currentIndex = 0;

    const slideWidth = slides[0].getBoundingClientRect().width;
    const setSlidePosition = (slide, index) => {
      slide.style.transform = `translateX(${index * 100}%)`;
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (targetIndex) => {
      carousel.style.transform = `translateX(-${targetIndex * 100}%)`;
      currentIndex = targetIndex;
      updateControls();
    };

    const updateControls = () => {
      // Dots
      const currentDot = dotsNav.querySelector('.active');
      if (currentDot) currentDot.classList.remove('active');
      dotsNav.children[currentIndex].classList.add('active');
      // Buttons
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === slides.length - 1;
    };

    // Create dots
    slides.forEach((_, index) => {
      const button = document.createElement('button');
      button.addEventListener('click', () => moveToSlide(index));
      dotsNav.appendChild(button);
    });

    nextButton.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) moveToSlide(currentIndex - 1);
    });

    // Keyboard nav
    carousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        }
    });

    moveToSlide(0);
  }

  // --- INTERACTIVE HOUSE ---
  const houseVisual = document.querySelector('.house-visual');
  if (houseVisual) {
    const hotspots = houseVisual.querySelectorAll('.hotspot');
    const infoTitle = document.getElementById('house-info-title');
    const infoText = document.getElementById('house-info-text');
    const pointsData = {
        dach: { title: 'Dach: Photovoltaik & Energie', text: 'Hier beginnt Ihre Unabhängigkeit. Wir installieren leistungsstarke PV-Module, die Sonnenlicht in sauberen Strom für Ihr ganzes Haus umwandeln.' },
        bad: { title: 'Bad: Sanitär & Komfort', text: 'Ihre persönliche Wohlfühloase. Wir realisieren moderne Bäder, die Design, Funktionalität und höchste Wasserqualität vereinen.' },
        keller: { title: 'Keller: Heizung & Effizienz', text: 'Die Kommandozentrale für Wärme. Hier installieren wir zukunftssichere Heizsysteme wie Wärmepumpen, die die erzeugte Energie optimal nutzen.' }
    };

    hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        const targetId = hotspot.dataset.target;
        infoTitle.textContent = pointsData[targetId].title;
        infoText.textContent = pointsData[targetId].text;

        hotspots.forEach(h => h.classList.remove('active'));
        hotspot.classList.add('active');
      });
    });
    // Set initial state
    if (hotspots.length > 0) hotspots[0].click();
  }

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('show'), 100);
    }
    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });
  }

  // --- STICKY CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  const heroSection = document.getElementById('hero');
  if (stickyCta && heroSection) {
      const ctaObserver = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) {
              stickyCta.hidden = false;
              setTimeout(() => stickyCta.classList.add('show'), 10);
          } else {
              stickyCta.classList.remove('show');
              setTimeout(() => stickyCta.hidden = true, 500);
          }
      }, { threshold: 0.1 });
      ctaObserver.observe(heroSection);
  }

});