// Smooth Scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = document.querySelector('.km-header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset - 20; // Additional offset for spacing

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile nav if open
            if (document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
            }
        }
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

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
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

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.km-faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.closest('.km-faq-item');
        const faqAnswer = faqItem.querySelector('.km-faq-answer');

        if (faqItem.classList.contains('is-open')) {
            faqItem.classList.remove('is-open');
            faqAnswer.style.maxHeight = null; // Collapse
        } else {
            // Close other open FAQ items (optional, but good UX)
            document.querySelectorAll('.km-faq-item.is-open').forEach(openItem => {
                if (openItem !== faqItem) {
                    openItem.classList.remove('is-open');
                    openItem.querySelector('.km-faq-answer').style.maxHeight = null;
                }
            });

            faqItem.classList.add('is-open');
            faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px'; // Expand to content height
        }
    });
});
