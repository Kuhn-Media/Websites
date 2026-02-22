document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
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
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpen);
            menuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-group');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = lightbox ? lightbox.querySelector('.lightbox-image') : null;
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const backdrop = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;
    const imageTriggers = document.querySelectorAll('.lightbox-trigger');

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleEscKey);
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscKey);
    }

    function handleEscKey(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }

    if (imageTriggers.length > 0) {
        imageTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const img = e.currentTarget.tagName === 'IMG' ? e.currentTarget : e.currentTarget.querySelector('img');
                if (img) {
                    openLightbox(img.src, img.alt);
                }
            });
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    const footer = document.querySelector('.main-footer');

    if (stickyCta && footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when footer is NOT intersecting (i.e., user has scrolled past hero but not to footer)
                if (!entry.isIntersecting && window.scrollY > window.innerHeight / 2) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(footer);
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (formStatus) {
                formStatus.textContent = 'Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.';
                formStatus.style.color = 'var(--color-accent)';
            }
            contactForm.reset();
        });
    }
});