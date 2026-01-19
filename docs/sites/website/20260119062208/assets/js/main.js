document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navContainer = document.querySelector('.mobile-nav-container');
    if (navToggle && navContainer) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            navContainer.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navContainer.addEventListener('click', (e) => {
            if (e.target === navContainer) {
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navContainer.classList.remove('open');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navContainer.classList.contains('open')) {
                navToggle.click();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    const handleCookieConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        if (cookieBanner) {
            cookieBanner.classList.remove('visible');
        }
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleCookieConsent('accepted'));
    if (declineBtn) declineBtn.addEventListener('click', () => handleCookieConsent('declined'));

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when the hero section is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '-200px 0px 0px 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});