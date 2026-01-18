'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // Sticky Header
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px' });
        scrollObserver.observe(document.body);
    }

    // Mobile Navigation
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

    if (mobileNavToggle && mobileNavContainer) {
        const openMenu = () => {
            mobileNavContainer.classList.add('is-open');
            mobileNavContainer.setAttribute('aria-hidden', 'false');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            mobileNavContainer.classList.remove('is-open');
            mobileNavContainer.setAttribute('aria-hidden', 'true');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        mobileNavToggle.addEventListener('click', openMenu);
        mobileNavClose.addEventListener('click', closeMenu);
        mobileNavOverlay.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavContainer.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.revealDelay) || 0;
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
    }

    // Signature House Interaction
    const signatureTabs = document.querySelectorAll('.signature-tab');
    const signaturePanes = document.querySelectorAll('.signature-pane');

    if (signatureTabs.length > 0 && signaturePanes.length > 0) {
        signatureTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.target;

                signatureTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                signaturePanes.forEach(pane => {
                    if (pane.id === targetId) {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                });
            });
        });
    }
    
    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('visible');
                cookieBanner.setAttribute('aria-hidden', 'false');
            }
        }, 1500);

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

});