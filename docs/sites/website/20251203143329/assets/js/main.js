// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.km-burger-menu');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.km-nav-list a');

    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('is-open');
            burgerMenu.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll'); // Optional: Prevent body scroll when menu is open
            burgerMenu.setAttribute('aria-expanded', mainNav.classList.contains('is-open'));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu when a link is clicked (for mobile)
                if (mainNav.classList.contains('is-open')) {
                    mainNav.classList.remove('is-open');
                    burgerMenu.classList.remove('is-open');
                    document.body.classList.remove('no-scroll');
                    burgerMenu.setAttribute('aria-expanded', false);
                }
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
                const headerOffset = document.querySelector('.km-header').offsetHeight; // Account for fixed header
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.km-faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all other open answers (optional, but good for UX)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.getAttribute('aria-expanded') === 'true') {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('is-open');
                    otherQuestion.nextElementSibling.style.maxHeight = null; // Reset max-height
                }
            });

            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.classList.add('is-open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.classList.remove('is-open');
                answer.style.maxHeight = null;
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
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