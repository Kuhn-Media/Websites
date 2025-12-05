// Function to handle the mobile navigation toggle
function navToggle() {
  const navToggleBtn = document.querySelector('.km-nav__toggle');
  const mainNav = document.getElementById('main-nav');
  const header = document.querySelector('.km-header');

  if (!navToggleBtn || !mainNav || !header) return;

  navToggleBtn.addEventListener('click', () => {
    const isExpanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
    navToggleBtn.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('is-open');
    document.body.classList.toggle('nav-open'); // Add class to body to prevent scroll
  });

  // Close nav when clicking outside or on a link
  mainNav.addEventListener('click', (event) => {
    if (event.target.closest('.km-nav__link')) {
      navToggleBtn.setAttribute('aria-expanded', false);
      mainNav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }
  });

  // Close nav on ESC key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
      navToggleBtn.setAttribute('aria-expanded', false);
      mainNav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }
  });
}

// Function for smooth scrolling to anchor links
function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      const headerOffset = document.querySelector('.km-header').offsetHeight;
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset - 20; // Additional padding

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // Update URL hash without jumping
      history.pushState(null, null, targetId);

      // Immediately set active class on click
      updateActiveNavLink(targetId);
    });
  });
}

// Function to handle FAQ accordion
function faqAccordion() {
  const faqItems = document.querySelectorAll('.km-faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.km-faq__question');
    const answer = item.querySelector('.km-faq__answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
    });
  });
}

// Function for scroll reveal animations
function scrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, {
    threshold: 0.1, // Element is visible when 10% is in viewport
    rootMargin: "0px 0px -10% 0px" // Start animating a bit before it hits the bottom
  });

  revealElements.forEach((el, index) => {
    el.style.setProperty('--reveal-delay', `${index * 0.1}s`); // Staggered delay
    observer.observe(el);
  });
}

// Function for scroll spy to highlight active navigation links
function scrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.km-nav__link');
  const headerHeight = document.querySelector('.km-header').offsetHeight;

  const observerOptions = {
    root: null, // viewport
    rootMargin: `-${headerHeight}px 0px -70% 0px`, // Adjust top margin to trigger when section is past header
    threshold: 0 // Trigger as soon as target enters/leaves root
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const targetId = `#${entry.target.id}`;
      const correspondingLink = document.querySelector(`.km-nav__link[href="${targetId}"]`);

      if (correspondingLink) {
        if (entry.isIntersecting) {
          // Add active class
          navLinks.forEach(link => link.classList.remove('km-nav__link--active'));
          correspondingLink.classList.add('km-nav__link--active');
        } else {
          // Optional: remove active class if not intersecting, but only if another is active
          // This prevents all links from being inactive if scrolling fast between sections
          if (!document.querySelector('.km-nav__link--active')) {
            correspondingLink.classList.remove('km-nav__link--active');
          }
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Initialize active link on page load
  window.addEventListener('load', () => {
    const initialActiveSection = document.querySelector('main section[id]').id;
    updateActiveNavLink(`#${initialActiveSection}`);
  });
}

// Helper to update active nav link directly
function updateActiveNavLink(activeId) {
  const navLinks = document.querySelectorAll('.km-nav__link');
  navLinks.forEach(link => {
    link.classList.remove('km-nav__link--active');
    if (link.getAttribute('href') === activeId) {
      link.classList.add('km-nav__link--active');
    }
  });
}


// Initialize all functions on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  navToggle();
  smoothScroll();
  faqAccordion();
  scrollReveal();
  scrollSpy();
});