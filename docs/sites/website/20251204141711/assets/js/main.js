// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.km-nav__toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('.km-nav__link, .km-nav__cta');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !expanded);
            mainNav.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll'); // Prevent scrolling when nav is open
        });

        // Close nav when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-open')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('is-open');
                    document.body.classList.remove('no-scroll');
                }
            });
        });

        // Close nav on outside click
        document.addEventListener('click', (event) => {
            if (!mainNav.contains(event.target) && !navToggle.contains(event.target) && mainNav.classList.contains('is-open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
            }
        });

        // Close nav on ESC key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = document.querySelector('.km-header').offsetHeight; // Get dynamic header height
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Sticky Header
    const header = document.getElementById('header');
    const stickyThreshold = 100; // Adjust as needed

    function handleScroll() {
        if (window.scrollY > stickyThreshold) {
            header.classList.add('is-sticky');
        } else {
            header.classList.remove('is-sticky');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call on load to check initial position

    // FAQ Accordion
    const accordionQuestions = document.querySelectorAll('.km-accordion__question');

    accordionQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all other open accordions
            accordionQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.getAttribute('aria-expanded') === 'true') {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.setAttribute('hidden', '');
                }
            });

            // Toggle current accordion
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.removeAttribute('hidden');
            } else {
                answer.setAttribute('hidden', '');
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

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

    revealElements.forEach(el => {
        observer.observe(el);
    });
});
