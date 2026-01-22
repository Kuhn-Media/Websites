document.addEventListener('DOMContentLoaded', () => {

  // --- HEADER SCROLL EFFECT ---
  const header = document.querySelector('.header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // --- MOBILE NAVIGATION ---
  const menuToggle = document.querySelector('.header__menu-toggle');
  const body = document.body;
  let mobileNav, backdrop;

  const createMobileNav = () => {
    if (document.querySelector('.mobile-nav')) return;

    const navContent = document.querySelector('.header__nav ul')?.cloneNode(true);
    if (!navContent) return;

    mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    mobileNav.setAttribute('aria-label', 'Mobiles Menü');
    mobileNav.innerHTML = `<button class='mobile-nav__close' aria-label='Menü schließen'><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg></button>`;
    mobileNav.appendChild(navContent);
    body.appendChild(mobileNav);

    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    body.appendChild(backdrop);

    mobileNav.querySelector('.mobile-nav__close').addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  };

  const openMenu = () => {
    if (!mobileNav) createMobileNav();
    if (!mobileNav) return;
    menuToggle.setAttribute('aria-expanded', 'true');
    body.classList.add('mobile-nav-active');
    mobileNav.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.addEventListener('keydown', handleEscKey);
  };

  const closeMenu = () => {
    if (!mobileNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('mobile-nav-active');
    mobileNav.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.removeEventListener('keydown', handleEscKey);
  };

  const handleEscKey = (e) => {
    if (e.key === 'Escape') closeMenu();
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', openMenu);
  }

  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieBanner.classList.add('is-visible');
    }, 1000);
  }

  const handleConsent = (consent) => {
    localStorage.setItem('cookieConsent', consent);
    cookieBanner.classList.remove('is-visible');
  };

  if (cookieAccept) cookieAccept.addEventListener('click', () => handleConsent('accepted'));
  if (cookieDecline) cookieDecline.addEventListener('click', () => handleConsent('declined'));

  // --- LIGHTBOX GALLERY ---
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const galleryLinks = document.querySelectorAll('.lightbox-gallery a');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');
    let currentIndex = 0;

    const showImage = (index) => {
      const link = galleryLinks[index];
      if (!link) return;
      lightboxImg.src = link.href;
      lightboxImg.alt = link.querySelector('img')?.alt || 'Großansicht';
      currentIndex = index;
    };

    const openLightbox = (e, index) => {
      e.preventDefault();
      showImage(index);
      lightbox.classList.add('is-visible');
      document.addEventListener('keydown', handleLightboxKeys);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-visible');
      document.removeEventListener('keydown', handleLightboxKeys);
    };

    const showPrev = () => showImage((currentIndex - 1 + galleryLinks.length) % galleryLinks.length);
    const showNext = () => showImage((currentIndex + 1) % galleryLinks.length);

    const handleLightboxKeys = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    galleryLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => openLightbox(e, index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    summary.addEventListener('click', (e) => {
      if (item.hasAttribute('open')) {
        e.preventDefault();
        item.classList.add('closing');
        item.addEventListener('animationend', () => {
          item.removeAttribute('open');
          item.classList.remove('closing');
        }, { once: true });
      } 
    });
  });
});