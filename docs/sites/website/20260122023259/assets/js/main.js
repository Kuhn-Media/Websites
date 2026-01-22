document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        scrollHandler(); // Initial check
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav__container');
    if (mobileNavToggle && mobileNavContainer) {
        const openMenu = () => {
            document.body.classList.add('mobile-nav-open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            mobileNavContainer.setAttribute('aria-hidden', 'false');
        };

        const closeMenu = () => {
            document.body.classList.remove('mobile-nav-open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavContainer.setAttribute('aria-hidden', 'true');
        };

        mobileNavToggle.addEventListener('click', () => {
            if (document.body.classList.contains('mobile-nav-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileNavContainer.querySelector('.mobile-nav__backdrop').addEventListener('click', closeMenu);
        
        // Close on link click
        const mobileNavLinks = mobileNavContainer.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${index * 100}ms`;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Contextual CTA --- //
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when the first section is out of view
                if (!entry.isIntersecting && window.scrollY > 300) {
                    contextCta.classList.add('visible');
                } else {
                    contextCta.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        const firstSection = document.querySelector('main > section:first-of-type');
        if (firstSection) {
            ctaObserver.observe(firstSection);
        }
    }

});