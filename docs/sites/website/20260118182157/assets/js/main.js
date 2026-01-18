document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            body.classList.toggle('nav-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Sticky Header
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-stagger');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a delay for staggered animations
                const delay = entry.target.classList.contains('reveal-stagger') ? index * 100 : 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero, .hero-subpage');
        const footer = document.querySelector('.site-footer-main');
        
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        if(heroSection) ctaObserver.observe(heroSection);

        // Hide when footer is visible
        const footerObserver = new IntersectionObserver((entries) => {
             entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyCTA.classList.remove('visible');
                } else if (window.scrollY > (heroSection ? heroSection.offsetHeight : 300)) {
                    stickyCTA.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        if(footer) footerObserver.observe(footer);
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        // Check if cookie was already accepted
        if (!localStorage.getItem('cookieAccepted')) {
            cookieBanner.classList.add('visible');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

});