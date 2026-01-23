document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navWrapper = document.getElementById('primary-navigation');
    if (navToggle && navWrapper) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('open');
            navWrapper.classList.toggle('open');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const declineCookiesBtn = document.getElementById('decline-cookies');

    if (cookieBanner && acceptCookiesBtn && declineCookiesBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            cookieBanner.hidden = false;
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.hidden = true;
        });

        declineCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.hidden = true;
        });
    }
    
    // --- Back to Top Button --- //
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        const toggleBackToTopButton = () => {
            if (window.scrollY > 300) {
                backToTopButton.hidden = false;
            } else {
                backToTopButton.hidden = true;
            }
        };

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
        toggleBackToTopButton(); // Initial check
    }
});