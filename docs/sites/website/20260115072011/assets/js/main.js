document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const menuToggle = document.querySelector('.header__menu-toggle');
    const mobileNav = document.getElementById('mobile-menu');
    const mobileNavClose = document.querySelector('.mobile-nav__close');
    const mobileNavBackdrop = document.querySelector('.mobile-nav__backdrop');

    if (menuToggle && mobileNav) {
        const toggleMenu = (show) => {
            mobileNav.classList.toggle('visible', show);
            menuToggle.setAttribute('aria-expanded', show);
            mobileNav.setAttribute('aria-hidden', !show);
            document.body.style.overflow = show ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', () => toggleMenu(true));
        mobileNavClose.addEventListener('click', () => toggleMenu(false));
        mobileNavBackdrop.addEventListener('click', () => toggleMenu(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('visible')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Parallax Journey Section ---
    const parallaxSection = document.getElementById('parallax-journey');
    if (parallaxSection && window.matchMedia('(min-width: 1025px) and (prefers-reduced-motion: no-preference)').matches) {
        const steps = parallaxSection.querySelectorAll('.parallax-journey__step');
        const images = parallaxSection.querySelectorAll('.parallax-journey__image-wrapper');
        const sectionHeight = parallaxSection.offsetHeight;
        const stepHeight = sectionHeight / steps.length;

        window.addEventListener('scroll', () => {
            const rect = parallaxSection.getBoundingClientRect();
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                const scrollInside = -rect.top;
                let currentStep = Math.floor(scrollInside / stepHeight) + 1;
                currentStep = Math.max(1, Math.min(steps.length, currentStep));

                steps.forEach(step => step.classList.toggle('active', parseInt(step.dataset.step) === currentStep));
                images.forEach(image => image.classList.toggle('active', parseInt(image.dataset.step) === currentStep));
            }
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', (e) => {
            if (e.target.open) {
                faqItems.forEach(otherItem => {
                    if (otherItem !== e.target) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });

    // --- Lightbox Gallery ---
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    if (gallery && lightbox) {
        const galleryItems = gallery.querySelectorAll('.gallery-item');
        const lightboxImg = lightbox.querySelector('.lightbox__image');
        const lightboxClose = lightbox.querySelector('.lightbox__close');
        const lightboxPrev = lightbox.querySelector('.lightbox__prev');
        const lightboxNext = lightbox.querySelector('.lightbox__next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            if (!item) return;
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt;
            currentIndex = index;
        };

        const openLightbox = (e, index) => {
            e.preventDefault();
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            showImage(index);
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => openLightbox(e, index));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox);

        lightboxPrev.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(newIndex);
        });

        lightboxNext.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') lightboxPrev.click();
                if (e.key === 'ArrowRight') lightboxNext.click();
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // --- Sticky CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const heroSection = document.querySelector('.hero');
        const footer = document.querySelector('.footer');
        if (heroSection && footer) {
            const ctaObserver = new IntersectionObserver((entries) => {
                const footerEntry = entries.find(e => e.target === footer);
                const heroEntry = entries.find(e => e.target === heroSection);
                
                let showCta = false;
                if (heroEntry) {
                    showCta = !heroEntry.isIntersecting;
                }
                if (footerEntry && footerEntry.isIntersecting) {
                    showCta = false;
                }

                stickyCta.classList.toggle('visible', showCta);
                stickyCta.setAttribute('aria-hidden', !showCta);

            }, { threshold: 0.1 });

            ctaObserver.observe(heroSection);
            ctaObserver.observe(footer);
        }
    }
});