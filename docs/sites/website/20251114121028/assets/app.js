document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('.site-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // Add some extra space

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }

            // Close mobile nav after clicking a link
            if (navMenu.classList.contains('is-active')) {
                navToggle.click();
            }
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('main-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('is-active');
            document.body.classList.toggle('no-scroll'); // Prevent scrolling when nav is open
        });
    }

    // Intersection Observer for staggered fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                if (target.classList.contains('feature-card') || target.classList.contains('step-item')) {
                    // Staggered animation handled by CSS animation-delay
                } else {
                    target.style.animationPlayState = 'running';
                }
                observer.unobserve(target);
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    // Apply observer to feature cards and step items for 'fadeInUp' animation triggering
    document.querySelectorAll('.feature-card, .step-item').forEach((element, index) => {
        // Set initial state for elements not having CSS animation on load
        if (!element.style.animationName) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        }
        observer.observe(element);
        // Add staggered delay to elements that have the fadeInUp animation
        element.style.animationDelay = `${0.08 * index}s`;
    });

});
