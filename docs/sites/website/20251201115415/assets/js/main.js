// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = document.querySelector('.km-header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset - 20; // Added extra padding

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile nav if open
            if (document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
                document.querySelector('.km-nav-menu').classList.remove('is-open');
            }
        }
    });
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.km-nav-toggle');
    const navMenu = document.querySelector('.km-nav-menu');

    navToggle.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
        navMenu.classList.toggle('is-open');
    });

    // Close nav when a menu item is clicked (for smooth scroll)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
                navMenu.classList.remove('is-open');
            }
        });
    });
});

// Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Element is visible when 15% of it is in the viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.km-faq__question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const parentItem = question.closest('.km-faq__item');
            parentItem.classList.toggle('is-open');
        });
    });
});

// Sticky Header
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.km-header');
    const heroSection = document.getElementById('hero');

    const stickyObserver = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        },
        {
            root: null,
            rootMargin: '-100px 0px 0px 0px', // Header becomes sticky after scrolling past 100px of the hero
            threshold: 0
        }
    );

    if (heroSection) {
        stickyObserver.observe(heroSection);
    }
});
