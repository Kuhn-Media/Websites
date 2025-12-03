document.addEventListener('DOMContentLoaded', () => {
  // Burger Menu
  const navToggle = document.querySelector('.km-nav-toggle');
  const navList = document.querySelector('.km-nav-list');
  const body = document.body;

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('is-open');
      navToggle.classList.toggle('is-active'); // Optional: for animating the burger icon
      body.classList.toggle('no-scroll'); // Prevent body scroll when nav is open
    });

    // Close nav when a link is clicked (for mobile)
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navList.classList.contains('is-open')) {
          navList.classList.remove('is-open');
          navToggle.classList.remove('is-active');
          body.classList.remove('no-scroll');
        }
      });
    });
  }


  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // FAQ Accordion
  document.querySelectorAll('.km-faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('.km-faq-item');
      const answer = parent.querySelector('.km-faq-answer');

      // Close other open answers
      document.querySelectorAll('.km-faq-answer.is-open').forEach(openAnswer => {
        if (openAnswer !== answer) {
          openAnswer.classList.remove('is-open');
          openAnswer.closest('.km-faq-item').querySelector('.km-faq-question').classList.remove('is-active');
        }
      });

      // Toggle current answer
      answer.classList.toggle('is-open');
      button.classList.toggle('is-active');
    });
  });

  // Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Start revealing a bit earlier
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
});