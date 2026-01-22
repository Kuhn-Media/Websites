(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // --- Mobile Navigation ---
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
        const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
        const mobileNavClose = document.querySelector('.mobile-nav-close');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

        const openMobileMenu = () => {
            mobileNavDrawer.classList.add('is-open');
            mobileNavDrawer.setAttribute('aria-hidden', 'false');
            mobileNavBackdrop.classList.add('is-visible');
            document.body.classList.add('no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        };

        const closeMobileMenu = () => {
            mobileNavDrawer.classList.remove('is-open');
            mobileNavDrawer.setAttribute('aria-hidden', 'true');
            mobileNavBackdrop.classList.remove('is-visible');
            document.body.classList.remove('no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        };

        if (mobileNavToggle && mobileNavDrawer) {
            mobileNavToggle.addEventListener('click', openMobileMenu);
            mobileNavClose.addEventListener('click', closeMobileMenu);
            mobileNavBackdrop.addEventListener('click', closeMobileMenu);
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileNavDrawer.classList.contains('is-open')) {
                    closeMobileMenu();
                }
            });
        }

        // --- Sticky Header ---
        const siteHeader = document.querySelector('.site-header');
        if (siteHeader) {
            const handleScroll = () => {
                if (window.scrollY > 50) {
                    siteHeader.classList.add('is-scrolled');
                } else {
                    siteHeader.classList.remove('is-scrolled');
                }
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // Initial check
        }

        // --- Scroll Reveal Animation ---
        const revealElements = document.querySelectorAll('.reveal-group');
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

        // --- FAQ Accordion ---
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });

        // --- Cookie Banner ---
        const cookieBanner = document.getElementById('cookie-banner');
        const cookieAccept = document.getElementById('cookie-accept');
        if (cookieBanner && cookieAccept) {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('is-visible');
                cookieBanner.setAttribute('aria-hidden', 'false');
            }

            cookieAccept.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                cookieBanner.classList.remove('is-visible');
                cookieBanner.setAttribute('aria-hidden', 'true');
            });
        }

        // --- Sticky CTA ---
        const stickyCTA = document.getElementById('sticky-cta');
        if (stickyCTA) {
            const handleStickyCTA = () => {
                if (window.scrollY > window.innerHeight * 0.8) {
                    stickyCTA.classList.add('is-visible');
                    stickyCTA.setAttribute('aria-hidden', 'false');
                } else {
                    stickyCTA.classList.remove('is-visible');
                    stickyCTA.setAttribute('aria-hidden', 'true');
                }
            };
            window.addEventListener('scroll', handleStickyCTA, { passive: true });
        }

        // --- ScrollSpy for Leistungen Page ---
        const inPageNav = document.querySelector('.in-page-nav');
        if (inPageNav) {
            const navLinks = inPageNav.querySelectorAll('a');
            const sections = [];
            navLinks.forEach(link => {
                const section = document.querySelector(link.hash);
                if (section) {
                    sections.push(section);
                }
            });

            if (sections.length > 0) {
                const headerHeight = document.querySelector('.site-header.is-scrolled') ? 60 : 80;
                const scrollSpyObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute('id');
                            navLinks.forEach(link => {
                                link.classList.remove('is-active');
                                if (link.hash === `#${id}`) {
                                    link.classList.add('is-active');
                                }
                            });
                        }
                    });
                }, { rootMargin: `-${headerHeight}px 0px -60% 0px` });

                sections.forEach(section => {
                    scrollSpyObserver.observe(section);
                });
            }
        }
        
        // --- Contact Form floating labels ---
        const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                if (e.target.value !== '') {
                    e.target.classList.add('has-value');
                } else {
                    e.target.classList.remove('has-value');
                }
            });
        });

    });
})();