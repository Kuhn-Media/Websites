document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('is-active');
        });

        // Close nav when a link is clicked (for single-page navigation)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('is-active')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('is-active');
                }
            });
        });
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            const targetId = button.getAttribute('aria-controls');
            const targetAnswer = document.getElementById(targetId);

            button.setAttribute('aria-expanded', !isExpanded);
            if (targetAnswer) {
                if (!isExpanded) {
                    targetAnswer.removeAttribute('hidden');
                } else {
                    targetAnswer.setAttribute('hidden', '');
                }
            }
        });
    });

    // Basic scroll animation (if prefers-reduced-motion is not enabled)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const animateOnScroll = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -12% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(animateOnScroll, observerOptions);

        // Apply to sections for general 'floatIn' effect
        document.querySelectorAll('section:not(.hero-section), .feature-card, .trust-item, .proof-text, .cta-block').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(24px)'; /* slideUp */
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(element);
        });

        // Special for hero, if needed (though hero is usually visible on load)
        document.querySelectorAll('.hero-content, .hero-image').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(16px)'; /* slightly less lift */
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            // Hero elements might be observed differently or just animated on load via CSS
            // For simplicity, let's observe them too if they might be below fold on some devices
             observer.observe(element);
        });
    }
});
