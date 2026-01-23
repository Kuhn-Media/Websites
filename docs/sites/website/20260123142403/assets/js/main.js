document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
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
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('#mobile-nav-menu');
    const navClose = document.querySelector('.mobile-nav-close');
    const navOverlay = document.querySelector('.mobile-nav-overlay');

    if (navToggle && navMenu) {
        const openMenu = () => {
            navMenu.classList.add('open');
            navMenu.setAttribute('aria-hidden', 'false');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        };
        const closeMenu = () => {
            navMenu.classList.remove('open');
            navMenu.setAttribute('aria-hidden', 'true');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        navToggle.addEventListener('click', openMenu);
        navClose.addEventListener('click', closeMenu);
        navOverlay.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-in-left, .reveal-fade-in-right, .reveal-stagger');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('reveal-stagger')) {
                    const delay = entry.target.style.getPropertyValue('--stagger-delay') || '0s';
                    entry.target.style.transitionDelay = delay;
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Accordion --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.hidden = isExpanded;
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }, 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('visible');
        cookieBanner.setAttribute('aria-hidden', 'true');
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

    // --- Sticky CTA --- //
    const stickyCTA = document.querySelector('.sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const status = document.getElementById('form-status');
            status.textContent = 'Vielen Dank! Ihre Nachricht wird gesendet...';
            // This is a dummy form handler. In a real project, this would send data to a server.
            setTimeout(() => {
                status.textContent = 'Nachricht erfolgreich gesendet. Wir melden uns in Kürze.';
                contactForm.reset();
            }, 2000);
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
    let currentIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        const showImage = (index) => {
            const item = galleryItems[index];
            const src = item.getAttribute('href');
            const title = item.getAttribute('data-title') || '';
            lightboxImg.setAttribute('src', src);
            lightboxCaption.textContent = title;
            currentIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const index = Array.from(galleryItems).indexOf(e.currentTarget);
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNext = () => showImage((currentIndex + 1) % galleryItems.length);

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }
});