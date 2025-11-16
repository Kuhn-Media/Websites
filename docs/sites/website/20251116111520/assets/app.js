document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation Toggle
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const headerNav = document.querySelector('.header-nav');

    if (navToggle && header && headerNav) {
        navToggle.addEventListener('click', () => {
            header.classList.toggle('nav-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });

        const navLinks = headerNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                header.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Intersection Observer for animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -10% 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Active Nav Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinksObserver = document.querySelectorAll('.nav-list a');

    if (sections.length && navLinksObserver.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              navLinksObserver.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                  link.classList.add('active');
                }
              });
            }
          });
        }, {
          rootMargin: '0px 0px -50% 0px'
        });

        sections.forEach(section => {
          sectionObserver.observe(section);
        });
    }
});