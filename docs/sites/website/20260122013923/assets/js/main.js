document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (navToggle && mobileNav) {
    const openMenu = () => {
      mobileNav.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-nav-open');
      mobileNav.querySelector('a').focus();
    };

    const closeMenu = () => {
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-nav-open');
      navToggle.focus();
    };

    navToggle.addEventListener('click', openMenu);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeMenu();
      }
    });
    
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('body.mobile-nav-open')) {
            closeMenu();
        }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
  }

  // Sticky Header
  const header = document.getElementById('site-header');
  if (header) {
    const headerObserver = new IntersectionObserver(([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '100px 0px 0px 0px' });
    headerObserver.observe(document.body);

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.style.display = isExpanded ? 'none' : 'block';
    });
  });

  // Testimonial Carousel
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const nextButton = document.querySelector('.carousel-controls .next');
    const dotsContainer = document.querySelector('.carousel-controls .dots');
    let currentIndex = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('span');

    const goToSlide = (index) => {
        currentIndex = (index + slides.length) % slides.length;
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateControls();
    };

    const updateControls = () => {
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    };

    prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

    goToSlide(0); // Initialize
  }

  // Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');

  if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    cookieBanner.style.display = 'block';
  }

  if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver(([entry]) => {
          stickyCTA.classList.toggle('visible', !entry.isIntersecting);
      }, { threshold: 0 });
      const heroSection = document.querySelector('.hero');
      if(heroSection) ctaObserver.observe(heroSection);
  }

});