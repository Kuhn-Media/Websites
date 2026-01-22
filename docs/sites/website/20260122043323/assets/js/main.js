document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Header Logic ---
    const header = document.querySelector('.site-header');
    const updateHeaderHeight = () => {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-h', `${headerHeight}px`);
    };
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('is-sticky');
        } else {
            header.classList.remove('is-sticky');
        }
    };

    if (header) {
        updateHeaderHeight();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', updateHeaderHeight);
    }

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    const openMenu = () => {
        if (!mobileNav) return;
        mobileNavToggle.classList.add('is-active');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('is-open');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileNavBackdrop.classList.add('is-visible');
        document.body.classList.add('body-scroll-lock');
        mobileNavLinks[0]?.focus();
        document.addEventListener('keydown', handleFocusTrap);
    };

    const closeMenu = () => {
        if (!mobileNav) return;
        mobileNavToggle.classList.remove('is-active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNavBackdrop.classList.remove('is-visible');
        document.body.classList.remove('body-scroll-lock');
        mobileNavToggle.focus();
        document.removeEventListener('keydown', handleFocusTrap);
    };

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            if (mobileNav.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);
    if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
            closeMenu();
        }
    });

    const handleFocusTrap = (e) => {
        if (e.key !== 'Tab') return;
        const focusableElements = mobileNav.querySelectorAll('a[href], button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };

    // --- Scroll Reveal Animation ---
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const staggerDelay = parseInt(entry.target.dataset.staggerDelay) || 0;
                if (staggerDelay > 0) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.transitionDelay = `${i * staggerDelay}ms`;
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // --- In-Page Navigation Scrollspy (Leistungen Page) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.in-page-nav a');

    if (sections.length > 0 && navLinks.length > 0) {
        const scrollspyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('is-active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('is-active');
                        }
                    });
                }
            });
        }, {
            rootMargin: `-${header.offsetHeight}px 0px -60% 0px`,
            threshold: 0
        });

        sections.forEach(section => scrollspyObserver.observe(section));
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                }
            }
        });
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
        }, 1000);
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('is-visible');
                } else {
                    stickyCTA.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Contact Form --- 
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy form handler for demonstration.
            // In a real project, this would send data to a server.
            formFeedback.textContent = 'Vielen Dank! Ihre Nachricht wurde (simuliert) gesendet.';
            formFeedback.classList.add('success');
            contactForm.reset();
            setTimeout(() => {
                formFeedback.textContent = '';
                formFeedback.classList.remove('success');
            }, 5000);
        });
    }
});