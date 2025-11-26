document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll-Reveal via IntersectionObserver
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('[data-fade]');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  };

  // 2. Header-Scroll-State
  const initHeaderScroll = () => {
    const header = document.querySelector('.km-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('km-header--scrolled');
      } else {
        header.classList.remove('km-header--scrolled');
      }
    }, { passive: true });
  };

  // 3. Smooth Scrolling for internal links
  const initSmoothScroll = () => {
    const navLinks = document.querySelectorAll('.km-nav a[href^="#"], .km-btn[href^="#"]');

    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const header = document.querySelector('.km-header');
          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // Initialize all functionalities
  initScrollReveal();
  initHeaderScroll();
  initSmoothScroll();

});