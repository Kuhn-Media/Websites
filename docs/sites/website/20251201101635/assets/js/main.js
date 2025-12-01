// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile Navigation Toggle
const burgerMenu = document.querySelector('.km-burger-menu');
const body = document.body;

burgerMenu.addEventListener('click', () => {
    body.classList.toggle('nav-open');
});

// Sticky Header on Scroll
const header = document.querySelector('.km-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the item is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Stop observing once revealed
        }
    });
}, observerOptions);

revealElements.forEach(el => {
    observer.observe(el);
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.km-faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const parentItem = question.closest('.km-faq-item');
        parentItem.classList.toggle('is-open');

        // Close other open FAQ items, if desired (optional)
        faqQuestions.forEach(otherQuestion => {
            const otherParentItem = otherQuestion.closest('.km-faq-item');
            if (otherParentItem !== parentItem && otherParentItem.classList.contains('is-open')) {
                otherParentItem.classList.remove('is-open');
            }
        });
    });
});