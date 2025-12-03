// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.km-nav-toggle');
    const navList = document.querySelector('.km-nav-list');
    const body = document.body;

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('is-open');
            navToggle.classList.toggle('is-open');
            body.classList.toggle('nav-open'); // To potentially disable body scroll
        });

        // Close nav when a link is clicked (for smooth scrolling)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('is-open')) {
                    navList.classList.remove('is-open');
                    navToggle.classList.remove('is-open');
                    body.classList.remove('nav-open');
                }
            });
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.km-faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.km-faq-item');
            faqItem.classList.toggle('is-open');

            const answer = faqItem.querySelector('.km-faq-answer');
            if (faqItem.classList.contains('is-open')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // When 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
});