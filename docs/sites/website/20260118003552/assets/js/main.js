document.addEventListener('DOMContentLoaded', function() {

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
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('nav-open');
            // Add 'visible' class after a short delay to trigger transition
            if (mainNav.classList.contains('open')) {
                setTimeout(() => mainNav.classList.add('visible'), 10);
            } else {
                mainNav.classList.remove('visible');
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealGroups = document.querySelectorAll('.reveal-group');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealGroups.forEach(group => revealObserver.observe(group));

    // --- Carousel --- //
    const carousel = document.getElementById('projects-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            const offset = -currentIndex * slides[0].offsetWidth;
            carousel.style.transform = `translateX(${offset}px)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
        
        // Basic touch swipe
        let touchstartX = 0;
        let touchendX = 0;
        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextButton.click();
            if (touchendX > touchstartX) prevButton.click();
        });

        updateCarousel();
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const footer = document.querySelector('.site-footer-main');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.target === heroSection && entry.isIntersecting === false) {
                    stickyCTA.classList.add('visible');
                } else if (entry.target === heroSection && entry.isIntersecting === true) {
                    stickyCTA.classList.remove('visible');
                }
                if (entry.target === footer && entry.isIntersecting === true) {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        if (heroSection) observer.observe(heroSection);
        if (footer) observer.observe(footer);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }
    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }
    
    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentImageIndex;
        const galleryImages = Array.from(lightboxTriggers).map(trigger => {
            return { src: trigger.src, alt: trigger.alt };
        });

        function showImage(index) {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            lightboxImg.src = galleryImages[index].src;
            lightboxImg.alt = galleryImages[index].alt;
            lightbox.classList.add('visible');
        }

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => showImage(index));
        });

        closeBtn.addEventListener('click', () => lightbox.classList.remove('visible'));
        prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('visible');
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeBtn.click();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    }
});