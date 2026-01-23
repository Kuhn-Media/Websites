document.addEventListener('DOMContentLoaded', () => {

    // --- Header Logic ---
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

    // --- Mobile Menu ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- Intersection Observer for Animations ---
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Carousel Logic ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        if (!carousel) return;

        let slides = Array.from(carousel.children);
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        };

        const updateDots = () => {
            const dots = dotsContainer.children;
            Array.from(dots).forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        if (dotsContainer) {
            createDots();
            updateDots();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
        
        // Basic swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA & Back to Top ---
    const stickyCta = document.getElementById('sticky-cta');
    const backToTop = document.getElementById('back-to-top');
    if (stickyCta || backToTop) {
        window.addEventListener('scroll', () => {
            const show = window.scrollY > 400;
            if(stickyCta) stickyCta.classList.toggle('show', show);
            if(backToTop) backToTop.classList.toggle('show', show);
        });
    }
    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (lightbox && galleryImages.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const imgElement = galleryImages[index];
            const imgSrc = imgElement.src;
            const imgAlt = imgElement.alt;
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            currentIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length));
        nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % galleryImages.length));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    }
});