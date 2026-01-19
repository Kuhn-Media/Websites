document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '150px 0px 0px 0px' });
        scrollObserver.observe(document.body);
    }

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptAll = document.getElementById('cookie-accept-all');
    const acceptNecessary = document.getElementById('cookie-accept-necessary');
    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }
    const handleConsent = () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.classList.remove('visible');
    };
    if (acceptAll) acceptAll.addEventListener('click', handleConsent);
    if (acceptNecessary) acceptNecessary.addEventListener('click', handleConsent);

    // --- Lightbox Gallery ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentIndex = 0;

    if (galleryItems.length > 0 && lightbox) {
        const images = Array.from(galleryItems).map(item => item.href);

        const showImage = (index) => {
            if (index < 0 || index >= images.length) return;
            currentIndex = index;
            lightboxImg.src = images[currentIndex];
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.classList.add('visible');
                lightbox.setAttribute('aria-hidden', 'false');
                showImage(index);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
        lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }

    // --- Sticky CTA & Back to Top Button ---
    const stickyCta = document.getElementById('sticky-cta');
    const backToTop = document.getElementById('back-to-top');
    const footer = document.querySelector('.site-footer');

    if (stickyCta || backToTop) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const isVisible = window.scrollY > 400 && !entry.isIntersecting;
                if (stickyCta) stickyCta.classList.toggle('visible', isVisible);
                if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
            });
        }, { threshold: 0.1 });

        if (footer) {
            observer.observe(footer);
        } else {
            // Fallback if footer is not found
            window.addEventListener('scroll', () => {
                 if (stickyCta) stickyCta.classList.toggle('visible', window.scrollY > 400);
                 if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
            });
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});