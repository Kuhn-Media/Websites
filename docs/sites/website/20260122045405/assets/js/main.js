document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- 2. Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.querySelector('.mobile-nav-drawer');
    const navBackdrop = document.querySelector('.mobile-nav-backdrop');
    const navClose = document.querySelector('.mobile-nav-close');
    const navLinks = document.querySelectorAll('.mobile-nav a');

    const openNav = () => {
        navDrawer.classList.add('is-open');
        navBackdrop.classList.add('is-visible');
        document.body.classList.add('no-scroll');
        navToggle.setAttribute('aria-expanded', 'true');
    };

    const closeNav = () => {
        navDrawer.classList.remove('is-open');
        navBackdrop.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', openNav);
        navClose.addEventListener('click', closeNav);
        navBackdrop.addEventListener('click', closeNav);
        navLinks.forEach(link => link.addEventListener('click', closeNav));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
                closeNav();
            }
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.staggerDelay) {
                    const items = el.children;
                    for (let i = 0; i < items.length; i++) {
                        items[i].style.transitionDelay = `${i * parseInt(el.dataset.staggerDelay)}ms`;
                        items[i].classList.add('is-visible');
                    }
                } else {
                    el.classList.add('is-visible');
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        if (el.dataset.staggerDelay) {
            const items = el.children;
            for (const item of items) {
                item.classList.add('reveal-on-scroll');
            }
        } 
        revealObserver.observe(el);
    });

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
        }, 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('is-visible');
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

    // --- 5. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('is-visible');
            } else {
                stickyCTA.classList.remove('is-visible');
            }
        });
    }

    // --- 6. Carousel --- //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        const slides = Array.from(carousel.children);
        let currentIndex = 0;

        const setupCarousel = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
            updateCarousel();
        };

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = dotsContainer.children;
            Array.from(dots).forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        setupCarousel();
    }

    // --- 7. Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex;

    if (lightbox && galleryItems.length > 0) {
        const openLightbox = (index) => {
            currentImageIndex = index;
            const item = galleryItems[currentImageIndex];
            lightboxImage.src = item.dataset.lightboxSrc;
            lightboxImage.alt = item.dataset.lightboxAlt;
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        const showNextImage = () => {
            const newIndex = (currentImageIndex + 1) % galleryItems.length;
            openLightbox(newIndex);
        };

        const showPrevImage = () => {
            const newIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(newIndex);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox__next').addEventListener('click', showNextImage);
        lightbox.querySelector('.lightbox__prev').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });
    }

});