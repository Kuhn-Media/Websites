document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeButton = document.querySelector('.mobile-menu-close');

    if (menuToggle && mobileMenu) {
        const openMenu = () => {
            mobileMenu.classList.add('is-open');
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.classList.add('mobile-menu-open');
            document.body.classList.add('mobile-menu-active');
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('mobile-menu-open');
            document.body.classList.remove('mobile-menu-active');
        };

        menuToggle.addEventListener('click', openMenu);
        if (closeButton) {
            closeButton.addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = (element.dataset.reveal === 'stagger' && element.children.length > 0) ? 0 : index * 100;
                
                if (element.dataset.reveal === 'stagger') {
                    Array.from(element.children).forEach((child, i) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, i * 150);
                    });
                } else {
                     element.classList.add('visible');
                }
                observer.unobserve(element);
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

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookieConsent', consent);
            cookieBanner.classList.remove('visible');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

});