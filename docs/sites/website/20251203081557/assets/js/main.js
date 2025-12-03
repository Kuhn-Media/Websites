// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.km-burger');
    const nav = document.querySelector('.km-nav');
    const navLinks = document.querySelectorAll('.km-nav-list a');

    burger.addEventListener('click', () => {
        nav.classList.toggle('is-open');
        burger.classList.toggle('is-open');
        document.body.classList.toggle('no-scroll'); // Optional: Sperrt Body-Scroll
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('is-open')) {
                nav.classList.remove('is-open');
                burger.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Close nav on outside click (optional)
    document.addEventListener('click', (event) => {
        if (!nav.contains(event.target) && !burger.contains(event.target) && nav.classList.contains('is-open')) {
            nav.classList.remove('is-open');
            burger.classList.remove('is-open');
            document.body.classList.remove('no-scroll');
        }
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
document.querySelectorAll('.km-faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.closest('.km-faq-item');
        const answer = faqItem.querySelector('.km-faq-answer');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Close all other open answers
        document.querySelectorAll('.km-faq-question[aria-expanded="true"]').forEach(otherButton => {
            if (otherButton !== button) {
                otherButton.setAttribute('aria-expanded', 'false');
                otherButton.closest('.km-faq-item').querySelector('.km-faq-answer').style.maxHeight = '0';
            }
        });

        // Toggle current answer
        button.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = '0';
        }
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.km-reveal');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Element becomes visible when 10% of it is in viewport
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