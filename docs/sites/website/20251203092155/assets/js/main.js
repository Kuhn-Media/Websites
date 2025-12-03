// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.km-burger-menu');
    const nav = document.querySelector('.km-nav');
    const body = document.body;

    burgerMenu.addEventListener('click', () => {
        nav.classList.toggle('is-open');
        body.classList.toggle('no-scroll');
    });

    // Close menu when a navigation link is clicked
    document.querySelectorAll('.km-nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            body.classList.remove('no-scroll');
        });
    });
});

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
document.querySelectorAll('.km-faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('is-active');

        // Close all other open answers
        document.querySelectorAll('.km-faq-question.is-active').forEach(activeQuestion => {
            if (activeQuestion !== question) {
                activeQuestion.classList.remove('is-active');
                activeQuestion.nextElementSibling.classList.remove('is-open');
            }
        });

        question.classList.toggle('is-active', !isActive);
        answer.classList.toggle('is-open', !isActive);
    });
});

// Scroll Reveal
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Percentage of the target element which is visible to trigger the callback
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Stop observing once it's visible
        }
    });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));
