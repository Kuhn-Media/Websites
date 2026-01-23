document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    const stickyCTA = document.getElementById('sticky-cta');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if(stickyCTA) stickyCTA.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            if(stickyCTA) stickyCTA.classList.remove('visible');
        }
    });

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-stagger')) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Carousel --- //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * slides[0].offsetWidth}px)`;
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (index === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        }

        if (nextBtn) nextBtn.addEventListener('click', showNext);
        if (prevBtn) prevBtn.addEventListener('click', showPrev);

        // Touch/Swipe for Carousel
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', (e) => {
            let touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) showNext();
            if (touchStartX - touchEndX < -50) showPrev();
        });

        // Initial setup
        if (slides.length > 0) {
            // Clone for infinite loop effect on larger screens
            // For simplicity, this is a basic finite carousel
            updateDots();
        }
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex = 0;

    if (lightbox && galleryImages.length > 0) {
        const imageSources = Array.from(galleryImages).map(img => img.dataset.kmImage);

        function showImage(index) {
            if (index < 0 || index >= imageSources.length) return;
            currentImageIndex = index;
            lightboxContent.src = (lightbox.getAttribute('data-path-prefix') || '') + imageSources[index];
            lightboxContent.alt = galleryImages[index].alt;
        }

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                const pathPrefix = img.src.includes('../') ? '../' : '';
                lightbox.setAttribute('data-path-prefix', pathPrefix);
                lightbox.classList.add('visible');
                showImage(index);
            });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('visible'));
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentImageIndex + 1));
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentImageIndex - 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') lightbox.classList.remove('visible');
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

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

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formMessage = document.getElementById('form-message');
            formMessage.textContent = 'Vielen Dank! Der Formularversand ist in dieser Demo nicht aktiv.';
            formMessage.style.color = 'var(--color-secondary)';
            contactForm.reset();
        });
    }
});