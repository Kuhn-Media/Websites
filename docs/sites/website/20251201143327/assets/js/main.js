// Smooth Scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        // Close mobile nav if open
        if (document.body.classList.contains('nav-open')) {
            document.body.classList.remove('nav-open');
        }
    });
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.km-nav-toggle');
const body = document.body;

navToggle.addEventListener('click', () => {
    body.classList.toggle('nav-open');
});

// Sticky Header
const header = document.querySelector('.km-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Percentage of the element that needs to be visible to trigger the callback
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, observerOptions);

revealElements.forEach(element => {
    observer.observe(element);
});

// FAQ Accordion
document.querySelectorAll('.km-faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const parentItem = question.closest('.km-faq-item');
        parentItem.classList.toggle('is-open');

        const answer = parentItem.querySelector('.km-faq-answer');
        if (parentItem.classList.contains('is-open')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = null;
        }
    });
});
