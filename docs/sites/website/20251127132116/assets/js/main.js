document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Close mobile nav if open
                const nav = document.getElementById('primary-navigation');
                if (nav && nav.getAttribute('data-visible') === 'true') {
                    document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
                    nav.setAttribute('data-visible', 'false');
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            navToggle.setAttribute('aria-expanded', !isVisible);
            primaryNav.setAttribute('data-visible', !isVisible);
        });
    }

    // Optional: Add a subtle scroll reveal effect
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to sections and cards for a subtle fade-in/slide-up effect
    document.querySelectorAll('.section, .feature-card, .quote-card, .step-card, .faq-item, .contact-card').forEach(el => {
        el.classList.add('scroll-reveal'); // Add a class for initial hidden state
        observer.observe(el);
    });

    // Initial styles for scroll-reveal
    const style = document.createElement('style');
    style.innerHTML = `
        .scroll-reveal {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .scroll-reveal.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});