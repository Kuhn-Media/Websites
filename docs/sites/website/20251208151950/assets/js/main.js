document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE NAVIGATION --- //
  const navToggle = document.querySelector('.km-nav-toggle');
  const nav = document.querySelector('.km-nav');
  const body = document.body;

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      body.classList.toggle('nav-open');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        body.classList.remove('nav-open');
      });
    });
  }

  // --- SMOOTH SCROLLING --- //
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.km-faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.km-faq-question');
    const answer = item.querySelector('.km-faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Optional: Close all other items
        // faqItems.forEach(i => {
        //   i.classList.remove('is-open');
        //   i.querySelector('.km-faq-answer').style.maxHeight = null;
        // });

        if (isOpen) {
          item.classList.remove('is-open');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // --- SCROLL REVEAL ANIMATION --- //
  const revealElements = document.querySelectorAll('.reveal');
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

});