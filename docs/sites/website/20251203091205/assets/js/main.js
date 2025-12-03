// DOMContentLoaded ensures the script runs after the HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // --- Burger Menu Toggle ---
    const burgerMenu = document.querySelector('.km-burger-menu');
    const navList = document.querySelector('.km-nav-list');
    const body = document.body;

    if (burgerMenu && navList) {
        burgerMenu.addEventListener('click', () => {
            navList.classList.toggle('is-open');
            burgerMenu.classList.toggle('is-open');
            body.classList.toggle('no-scroll'); // Optional: Prevent body scroll when menu is open
        });

        // Close nav when a link is clicked (for smooth scroll)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('is-open');
                burgerMenu.classList.remove('is-open');
                body.classList.remove('no-scroll');
            });
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position for fixed header
                const headerOffset = document.querySelector('.km-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.km-faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling; // The answer div
            const isOpen = question.classList.contains('is-open');

            // Close all other open answers (optional)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('is-open')) {
                    otherQuestion.classList.remove('is-open');
                    otherQuestion.nextElementSibling.classList.remove('is-open');
                }
            });

            // Toggle current answer
            question.classList.toggle('is-open');
            answer.classList.toggle('is-open');
        });
    });


    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // --- Sticky Header Shrink Effect ---
    const header = document.querySelector('.km-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Adjust scroll threshold as needed
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

});