document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation --- //
  const burgerMenu = document.querySelector('.km-burger-menu');
  const nav = document.querySelector('.km-nav');
  const body = document.body;

  if (burgerMenu && nav) {
    burgerMenu.addEventListener('click', () => {
      body.classList.toggle('nav-open');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
      });
    });
  }

  // --- Smooth Scrolling for Anchor Links --- //
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

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.km-faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.km-faq-question');
      question.addEventListener('click', () => {
        // Optional: Close other open items
        // faqItems.forEach(otherItem => {
        //   if (otherItem !== item) {
        //     otherItem.classList.remove('active');
        //   }
        // });
        item.classList.toggle('active');
      });
    });
  }

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || '0ms';
          entry.target.style.transitionDelay = delay;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    revealElements.forEach(element => {
      observer.observe(element);
    });
  }

});