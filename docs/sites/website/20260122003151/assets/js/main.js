document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.querySelector('.mobile-nav-drawer');
    const navBackdrop = document.querySelector('.mobile-nav-backdrop');
    const navClose = document.querySelector('.mobile-nav-close');

    const openMenu = () => {
        document.body.classList.add('mobile-nav-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navDrawer.setAttribute('aria-hidden', 'false');
        navDrawer.querySelector('a').focus();
    };

    const closeMenu = () => {
        document.body.classList.remove('mobile-nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navDrawer.setAttribute('aria-hidden', 'true');
        navToggle.focus();
    };

    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', openMenu);
        navClose.addEventListener('click', closeMenu);
        navBackdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
                closeMenu();
            }
        });
    }

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('is-sticky');
            } else {
                header.classList.remove('is-sticky');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealStaggerElements = document.querySelectorAll('.reveal-stagger');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    revealStaggerElements.forEach(container => {
        const children = container.children;
        const staggerObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(children).forEach((child, index) => {
                        child.style.transitionDelay = `${index * 100}ms`;
                        child.classList.add('reveal', 'is-visible');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        staggerObserver.observe(container);
    });

    // --- Magnetic Buttons ---
    const magneticButtons = document.querySelectorAll('.magnetic');
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isReducedMotion) {
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const { offsetX, offsetY, target } = e;
                const { clientWidth, clientHeight } = target;
                const x = (offsetX / clientWidth - 0.5) * 30;
                const y = (offsetY / clientHeight - 0.5) * 30;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.style.transition = 'transform 0.1s ease';
            });

            button.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translate(0, 0)';
                e.target.style.transition = 'transform 0.3s ease';
            });
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        const heroSection = document.querySelector('.hero, .page-hero');
        if(heroSection) ctaObserver.observe(heroSection);
    }

    // --- Contact Form --- 
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const status = document.getElementById('form-status');
            status.textContent = 'Nachricht wird gesendet...';
            status.className = 'form-status';

            // This is a dummy timeout to simulate form submission
            setTimeout(() => {
                const hasError = Math.random() > 0.8; // Simulate occasional errors
                if (!hasError) {
                    status.textContent = 'Vielen Dank! Ihre Nachricht wurde gesendet.';
                    status.classList.add('success');
                    form.reset();
                } else {
                    status.textContent = 'Fehler beim Senden. Bitte versuchen Sie es später erneut.';
                    status.classList.add('error');
                }
            }, 1000);
        });
    }
});