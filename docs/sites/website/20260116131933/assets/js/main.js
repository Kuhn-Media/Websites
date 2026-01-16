document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const nav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('is-open');
            const isOpen = nav.classList.contains('is-open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(
            ([e]) => e.target.classList.toggle('scrolled', e.intersectionRatio < 1),
            { threshold: [1] }
        );
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.reveal-item');
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
    revealItems.forEach(item => revealObserver.observe(item));

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const items = carousel.querySelectorAll('.carousel-item');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.hidden = true;
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA Bar ---
    const stickyBar = document.getElementById('sticky-cta-bar');
    if (stickyBar) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the footer is NOT visible
                stickyBar.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });
        const footer = document.querySelector('.site-footer-main');
        if (footer) ctaObserver.observe(footer);
    }

    // --- Lightbox Gallery ---
    const gallerySection = document.getElementById('gallery-section');
    if (gallerySection) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        let currentIndex;

        function showImage(index) {
            const item = galleryItems[index];
            lightboxImg.src = item.dataset.src;
            lightboxImg.alt = item.dataset.alt;
            currentIndex = index;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        }

        function hideLightbox() {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', hideLightbox);
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
            showImage(newIndex);
        });
        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
            showImage(newIndex);
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) hideLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
});