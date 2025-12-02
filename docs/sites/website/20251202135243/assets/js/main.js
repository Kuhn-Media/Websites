// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.km-nav-toggle');
  const navMenu = document.querySelector('.km-nav-menu');
  const body = document.body;

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open');
      body.classList.toggle('no-scroll'); // Optional: Prevent body scroll when menu is open
    });
  }

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = document.querySelector('.km-header').offsetHeight; // Adjust for fixed header
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu after clicking a link
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          navToggle.classList.remove('is-open');
          body.classList.remove('no-scroll');
        }
      }
    });
  });

  // FAQ Accordion
  document.querySelectorAll('.km-faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.closest('.km-faq-item');
      faqItem.classList.toggle('is-open');
    });
  });

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
});