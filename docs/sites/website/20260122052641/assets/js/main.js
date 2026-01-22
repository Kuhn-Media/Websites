document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNavToggle.classList.toggle('is-active');
            mobileNav.classList.toggle('is-open');
            mobileNav.setAttribute('aria-hidden', !isOpen);
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
            body.classList.toggle('no-scroll', isOpen);
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('is-active');
                mobileNav.classList.remove('is-open');
                mobileNav.setAttribute('aria-hidden', 'true');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                body.classList.remove('no-scroll');
            });
        });
    }

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const updateHeaderHeight = () => {
            const headerHeight = header.getBoundingClientRect().height;
            document.documentElement.style.setProperty('--header-h', `${headerHeight}px`);
        };

        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            updateHeaderHeight();
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        updateHeaderHeight();
    }

    // --- Scroll Animations (Intersection Observer) --- //
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-stagger-group');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('reveal-stagger-group')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // --- On-Page Nav ScrollSpy --- //
    const onpageNav = document.querySelector('.onpage-nav');
    if (onpageNav) {
        const navLinks = onpageNav.querySelectorAll('a');
        const sections = Array.from(navLinks).map(link => document.querySelector(link.hash));

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('is-active', link.hash === `#${id}`);
                    });
                }
            });
        }, {
            rootMargin: `-100px 0px -50% 0px`,
            threshold: 0
        });

        sections.forEach(section => {
            if (section) spyObserver.observe(section);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCTA.classList.add('is-visible');
                    stickyCTA.setAttribute('aria-hidden', 'false');
                } else {
                    stickyCTA.classList.remove('is-visible');
                    stickyCTA.setAttribute('aria-hidden', 'true');
                }
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});