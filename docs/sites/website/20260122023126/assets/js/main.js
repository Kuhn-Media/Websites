document.addEventListener('DOMContentLoaded', function() {

    // --- MOBILE NAVIGATION --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    function openMobileMenu() {
        mobileNav.classList.add('is-open');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileNavBackdrop.classList.add('is-visible');
        document.body.classList.add('no-scroll');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNavBackdrop.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
    }

    if (mobileNavToggle && mobileNav && mobileNavBackdrop) {
        const allToggles = document.querySelectorAll('.mobile-nav-toggle');
        allToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                if (mobileNav.classList.contains('is-open')) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });
        });

        mobileNavBackdrop.addEventListener('click', closeMobileMenu);
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // --- STICKY HEADER --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(
            ([entry]) => {
                header.classList.toggle('is-scrolled', !entry.isIntersecting);
            },
            { rootMargin: '200px 0px 0px 0px' }
        );
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-stagger');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // No need to unobserve if you want animations to replay on scroll up
                    // observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('cookie-accept');
    const declineCookies = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
        }, 1000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when the hero section is NOT intersecting (i.e., scrolled past it)
                stickyCTA.classList.toggle('is-visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});