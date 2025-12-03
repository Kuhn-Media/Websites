// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger-menu');
    const nav = document.getElementById('main-nav');
    const body = document.body;

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('is-open');
            burger.classList.toggle('is-open');
            body.classList.toggle('no-scroll'); // Optional: Prevent body scroll when menu is open
        });

        // Close nav when a link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                burger.classList.remove('is-open');
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

                // Close mobile nav after clicking an anchor link
                if (nav.classList.contains('is-open')) {
                    nav.classList.remove('is-open');
                    burger.classList.remove('is-open');
                    body.classList.remove('no-scroll');
                }
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Adjust as needed: percentage of target visibility to trigger callback
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