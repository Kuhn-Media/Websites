document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header --- //
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const navBackdrop = document.querySelector('.mobile-nav-backdrop');
  const navClose = document.querySelector('.mobile-nav-close');

  if (navToggle && mobileNav) {
    const openMenu = () => {
      mobileNav.classList.add('is-open');
      navBackdrop.classList.add('is-open');
      document.body.classList.add('no-scroll');
      mobileNav.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      mobileNav.classList.remove('is-open');
      navBackdrop.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      mobileNav.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', openMenu);
    navClose.addEventListener('click', closeMenu);
    navBackdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeMenu();
      }
    });
    
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- FAQ Accordion --- //
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

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieAccepted = localStorage.getItem('cookieAccepted');

  if (!cookieAccepted && cookieBanner) {
    cookieBanner.setAttribute('aria-hidden', 'false');
    setTimeout(() => cookieBanner.classList.add('active'), 500);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.classList.remove('active');
      setTimeout(() => cookieBanner.setAttribute('aria-hidden', 'true'), 500);
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.querySelector('.sticky-cta');
  if (stickyCTA) {
    const onScrollCTA = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        stickyCTA.classList.add('visible');
        stickyCTA.setAttribute('aria-hidden', 'false');
      } else {
        stickyCTA.classList.remove('visible');
        stickyCTA.setAttribute('aria-hidden', 'true');
      }
    };
    window.addEventListener('scroll', onScrollCTA, { passive: true });
    onScrollCTA();
  }

  // --- ScrollSpy for Page Navigation --- //
  const pageNav = document.querySelector('.page-nav');
  if (pageNav) {
    const navLinks = pageNav.querySelectorAll('a');
    const sections = Array.from(navLinks).map(link => {
      const id = link.getAttribute('href').substring(1);
      return document.getElementById(id);
    }).filter(section => section !== null);

    if (sections.length > 0) {
        const observerOptions = {
            rootMargin: `-${header.offsetHeight + pageNav.offsetHeight}px 0px -60% 0px`,
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('is-active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('is-active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }
  }

  // --- Lightbox Gallery --- //
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const showImage = (index) => {
        const item = galleryItems[index];
        const imgSrc = item.getAttribute('href');
        const imgAlt = item.querySelector('img').getAttribute('alt');
        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', imgAlt);
        currentIndex = index;
    };

    const openLightbox = (e, index) => {
        e.preventDefault();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        showImage(index);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
    };

    const showPrev = () => {
        const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showImage(newIndex);
    };

    const showNext = () => {
        const newIndex = (currentIndex + 1) % galleryItems.length;
        showImage(newIndex);
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => openLightbox(e, index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }
    });
  }

});