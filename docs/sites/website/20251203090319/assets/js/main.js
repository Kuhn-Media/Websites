// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.km-burger');
    const navList = document.querySelector('.km-nav-list');
    const header = document.querySelector('.km-header');

    if (burger && navList) {
        burger.addEventListener('click', () => {
            navList.classList.toggle('is-open');
            burger.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll'); // Optional: prevent body scroll when menu is open
        });

        // Close menu when a navigation link is clicked
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('is-open');
                burger.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close menu if clicked outside
        document.addEventListener('click', (event) => {
            if (!header.contains(event.target) && navList.classList.contains('is-open')) {
                navList.classList.remove('is-open');
                burger.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
            }
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
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('is-open');

            // Close all other open answers
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('is-open')) {
                    otherQuestion.classList.remove('is-open');
                    otherQuestion.nextElementSibling.classList.remove('is-open');
                }
            });

            // Toggle current answer
            if (isOpen) {
                question.classList.remove('is-open');
                answer.classList.remove('is-open');
            } else {
                question.classList.add('is-open');
                answer.classList.add('is-open');
            }
        });
    });

    // Scroll-Reveal Animation
    const revealElements = document.querySelectorAll('.km-reveal');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // 15% of the element must be visible
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