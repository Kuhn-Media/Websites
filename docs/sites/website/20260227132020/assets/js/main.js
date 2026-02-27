'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
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

    // --- Mobile Menu ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCTA.classList.add('is-visible');
                } else {
                    stickyCTA.classList.remove('is-visible');
                }
            });
        }, { threshold: 0 });
        const heroSection = document.querySelector('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const updateLightbox = (index) => {
            const item = galleryItems[index];
            const imageSrc = item.getAttribute('href');
            const captionText = item.dataset.caption || '';
            lightboxImage.src = imageSrc;
            lightboxImage.alt = captionText;
            lightboxCaption.textContent = captionText;
            currentIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const clickedIndex = Array.from(galleryItems).findIndex(item => item === e.currentTarget);
            updateLightbox(clickedIndex);
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const showPrev = () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightbox(newIndex);
        };

        const showNext = () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            updateLightbox(newIndex);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
    }
});