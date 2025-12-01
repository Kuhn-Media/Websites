// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - document.querySelector('.km-header').offsetHeight, // Adjust for sticky header
                behavior: 'smooth'
            });

            // Close mobile nav after click
            if (document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
            }
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

// Scroll Reveal
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Element is considered visible when 10% is in viewport
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
const faqQuestions = document.querySelectorAll('.km-faq-item__question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const parentItem = question.closest('.km-faq-item');
        parentItem.classList.toggle('is-open');

        const answer = parentItem.querySelector('.km-faq-item__answer');
        if (parentItem.classList.contains('is-open')) {
            answer.style.maxHeight = answer.scrollHeight + 'px'; // Set max-height to scrollHeight
        } else {
            answer.style.maxHeight = '0';
        }
    });
});