document.addEventListener('DOMContentLoaded', () => {
    // Burger Menu Toggle
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('nav ul');

    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', () => {
            const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
            navMenu.classList.toggle('active');
            burgerMenu.setAttribute('aria-expanded', !isExpanded);
        });

        // Close nav menu when a link is clicked (for mobile)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                burgerMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust for fixed header height
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Add pulse animation to CTA button if specified in design
    const ctaButton = document.querySelector('.animate-hero-cta');
    // The design.motion.cta value is 'pulse 1.2s ease-in-out infinite'. Check if it contains 'pulse'.
    // This will be replaced by the backend with the actual string value during generation.
    const ctaMotionString = "pulse 1.2s ease-in-out infinite"; // Placeholder for template logic
    if (ctaButton && ctaMotionString.includes('pulse')) {
        ctaButton.classList.add('pulse-animation');
    }

    // Intersection Observer for card animations (Features, Steps, Contact)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    // Select all cards for observation
    document.querySelectorAll('.feature-card, .step-card, .contact-card').forEach(card => {
        observer.observe(card);
    });
});