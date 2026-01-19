document.addEventListener('DOMContentLoaded', function() {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile Navigation
    function initMobileNav() {
        const navToggle = document.querySelector('.mobile-nav-toggle');
        const mainNav = document.querySelector('.main-nav');
        if (navToggle && mainNav) {
            navToggle.addEventListener('click', () => {
                mainNav.classList.toggle('is-open');
                navToggle.classList.toggle('is-active');
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                document.body.style.overflow = !isExpanded ? 'hidden' : '';
            });
        }
    }

    // Sticky Header
    function initStickyHeader() {
        const header = document.querySelector('.sticky-header');
        if (header) {
            const onScroll = () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    }

    // Scroll Reveal Animation
    function initScrollReveal() {
        if (prefersReducedMotion) return;

        const revealElements = document.querySelectorAll('.reveal-up');
        if (revealElements.length > 0) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            revealElements.forEach(el => {
                observer.observe(el);
            });
        }
    }

    // Cookie Banner
    function initCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');

        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.hidden = false;
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.hidden = true;
        });
    }

    // Sticky CTA Bar
    function initStickyCtaBar() {
        const ctaBar = document.getElementById('sticky-cta-bar');
        if(ctaBar) {
             const onScroll = () => {
                if (window.scrollY > 400) {
                    ctaBar.hidden = false;
                    setTimeout(() => ctaBar.classList.add('visible'), 10);
                } else {
                    ctaBar.classList.remove('visible');
                }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    }

    // Initialize all functions
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initCookieBanner();
    initStickyCtaBar();
});