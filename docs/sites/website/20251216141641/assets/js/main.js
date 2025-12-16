// JS
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  // Sticky Header
  const header = document.querySelector('.km-header');
  if (header) {
    const observer = new IntersectionObserver(([entry]) => {
      // A dummy element to observe is not needed, we can check scrollY
    }, { threshold: [1] });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-sticky');
      } else {
        header.classList.remove('is-sticky');
      }
    });
  }

  // Mobile Navigation
  const navToggle = document.querySelector('.km-mobile-nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 100); // Stagger effect
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
  });

  // FAQ Accordion - using native details/summary, so JS is for enhancements only
  const accordions = document.querySelectorAll('.km-faq-accordion details');
  if (accordions.length > 0) {
    accordions.forEach(accordion => {
      accordion.addEventListener('toggle', (event) => {
        if (accordion.open) {
          // Close other open accordions
          accordions.forEach(otherAccordion => {
            if (otherAccordion !== accordion && otherAccordion.open) {
              otherAccordion.open = false;
            }
          });
        }
      });
    });
  }
});
