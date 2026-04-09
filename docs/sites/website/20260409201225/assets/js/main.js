document.addEventListener('DOMContentLoaded', function() {

    // --- Header Scroll Effect ---
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

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('is-open');
            mobileMenu.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // --- Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealItems.forEach(item => revealObserver.observe(item));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookie_consent')) {
        cookieBanner.style.display = 'block';
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.style.display = 'none';
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const galleryContainer = document.getElementById('gallery-container');
    let galleryImages = [];
    let currentIndex = 0;

    if (lightbox && galleryContainer) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');

        galleryImages = Array.from(galleryContainer.querySelectorAll('img[data-km-image]'));

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            const imgSrc = galleryImages[currentIndex].dataset.kmImage;
            const imgAlt = galleryImages[currentIndex].alt;
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
        };

        const openLightbox = (e) => {
            const clickedImg = e.target.closest('img[data-km-image]');
            if (clickedImg) {
                const index = galleryImages.indexOf(clickedImg);
                if (index > -1) {
                    showImage(index);
                    lightbox.style.display = 'block';
                    lightbox.setAttribute('aria-hidden', 'false');
                    document.body.classList.add('no-scroll');
                    closeBtn.focus();
                }
            }
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            lightboxImg.src = '';
        };

        const showNext = () => showImage((currentIndex + 1) % galleryImages.length);
        const showPrev = () => showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);

        galleryContainer.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        });
    }
    
    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when the footer is not visible
                if (!entry.isIntersecting && window.scrollY > window.innerHeight / 2) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        const footer = document.querySelector('.main-footer');
        if(footer) ctaObserver.observe(footer);
    }

});