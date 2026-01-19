document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
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
    const mobileMenu = document.querySelector('.mobile-menu-drawer');
    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            menuOverlay.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            menuToggle.setAttribute('aria-expanded', isOpen);
        });
        menuOverlay.addEventListener('click', () => {
            menuToggle.click();
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    // --- Carousel ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        if (!carousel) return;

        const slides = Array.from(carousel.children);
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        // Create dots
        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }
        const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            if (dots.length > 0) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            }
        };

        const goToSlide = (index) => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;
            updateCarousel();
        };

        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
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

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            const showCTA = () => {
                const heroBottom = heroSection.getBoundingClientRect().bottom;
                if (heroBottom < 100 && window.scrollY > 200) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            };
            window.addEventListener('scroll', showCTA);
        }
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = document.querySelectorAll('.gallery-image, .carousel-slide img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentImageIndex;

    if (lightbox && lightboxImg && galleryImages.length > 0) {
        const imageSources = Array.from(galleryImages).map(img => img.getAttribute('data-km-image'));

        const showImage = (index) => {
            if (index < 0 || index >= imageSources.length) return;
            currentImageIndex = index;
            const imagePath = galleryImages[0].src.includes('../') ? `../${imageSources[index]}` : imageSources[index];
            lightboxImg.src = imagePath;
            lightbox.classList.add('visible');
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => showImage(index));
        });

        const closeLightbox = () => lightbox.classList.remove('visible');
        const showPrev = () => showImage((currentImageIndex - 1 + imageSources.length) % imageSources.length);
        const showNext = () => showImage((currentImageIndex + 1) % imageSources.length);

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }
});