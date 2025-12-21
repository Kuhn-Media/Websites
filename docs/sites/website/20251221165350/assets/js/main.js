document.addEventListener('DOMContentLoaded', () => {

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
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('is-active');
      navToggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
  }

  // --- 3. Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100); // Staggered delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. FAQ Accordion --- //
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (header && content) {
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', !isExpanded);
        content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
      });
    }
  });

  // --- 5. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  if (cookieBanner && acceptButton) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    }
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // --- 6. Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (scrolled past it)
        if (!entry.isIntersecting && window.scrollY > 300) {
          stickyCTA.classList.add('visible');
        } else {
          stickyCTA.classList.remove('visible');
        }
      });
    }, { threshold: 0 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) ctaObserver.observe(heroSection);
  }

  // --- 7. Before/After Slider --- //
  const sliderContainer = document.getElementById('before-after-container');
  if (sliderContainer) {
    const afterWrapper = sliderContainer.querySelector('.slider-image-after-wrapper');
    const handle = sliderContainer.querySelector('.slider-handle');
    let isDragging = false;

    const moveSlider = (x) => {
      const rect = sliderContainer.getBoundingClientRect();
      let newWidth = ((x - rect.left) / rect.width) * 100;
      if (newWidth < 0) newWidth = 0;
      if (newWidth > 100) newWidth = 100;
      afterWrapper.style.width = newWidth + '%';
      handle.style.left = newWidth + '%';
    };

    sliderContainer.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
    sliderContainer.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });
    window.addEventListener('touchmove', (e) => { if (isDragging) moveSlider(e.touches[0].clientX); });
  }

  // --- 8. Interactive House --- //
  const houseContainer = document.querySelector('.house-container');
  if (houseContainer) {
    const hotspots = houseContainer.querySelectorAll('.hotspot');
    const contents = houseContainer.querySelectorAll('.house-content');
    const mobileAccordionContainer = document.querySelector('.house-accordion-mobile');
    let activeContent = null;
    let activeHotspot = null;

    // Create mobile accordion from content
    if (mobileAccordionContainer) {
        const mobileAccordion = document.createElement('div');
        mobileAccordion.className = 'accordion';
        contents.forEach(content => {
            const item = document.createElement('div');
            item.className = 'accordion-item';
            const header = document.createElement('button');
            header.className = 'accordion-header';
            header.setAttribute('aria-expanded', 'false');
            header.innerHTML = `${content.querySelector('h4').textContent} <span class='accordion-icon'></span>`;
            const contentDiv = document.createElement('div');
            contentDiv.className = 'accordion-content';
            contentDiv.innerHTML = `<p>${content.querySelector('p').textContent}</p>`;
            item.appendChild(header);
            item.appendChild(contentDiv);
            mobileAccordion.appendChild(item);
        });
        mobileAccordionContainer.appendChild(mobileAccordion);
        // Re-run accordion logic for this new accordion
        mobileAccordion.querySelectorAll('.accordion-item').forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
            });
        });
    }

    hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        const targetId = `house-content-${hotspot.dataset.target}`;
        const newContent = document.getElementById(targetId);

        if (activeContent === newContent) {
          activeContent.classList.remove('active');
          activeHotspot.classList.remove('active');
          activeContent = null;
          activeHotspot = null;
          return;
        }

        if (activeContent) {
          activeContent.classList.remove('active');
          activeHotspot.classList.remove('active');
        }

        if (newContent) {
          newContent.classList.add('active');
          hotspot.classList.add('active');
          activeContent = newContent;
          activeHotspot = hotspot;
        }
      });
    });
  }
  
  // --- 9. Lightbox --- //
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const triggers = document.querySelectorAll('.lightbox-trigger');
    
    triggers.forEach(trigger => {
      trigger.addEventListener('click', e => {
        e.preventDefault();
        lightboxImage.src = trigger.href;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });
    
    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };
    
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !lightbox.hidden) {
        closeLightbox();
      }
    });
  }

});