// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.km-burger-menu');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;

    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('is-open');
            burgerMenu.classList.toggle('is-open');
            body.classList.toggle('no-scroll'); // Optional: prevent body scroll when menu is open
        });

        // Close menu when a nav link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('is-open');
                burgerMenu.classList.remove('is-open');
                body.classList.remove('no-scroll');
            });
        });
    }

    // Smooth Scroll for Anchor Links
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

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.km-faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const parentItem = question.closest('.km-faq-item');
            parentItem.classList.toggle('is-active');

            // Optional: Close other open items
            faqQuestions.forEach(otherQuestion => {
                const otherParentItem = otherQuestion.closest('.km-faq-item');
                if (otherParentItem !== parentItem && otherParentItem.classList.contains('is-active')) {
                    otherParentItem.classList.remove('is-active');
                }
            });
        });
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Element is 20% visible
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
});