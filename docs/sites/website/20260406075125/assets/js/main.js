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
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = mobileMenu.classList.contains('open');
            if (open === isOpen) return;

            menuToggle.classList.toggle('active', open);
            menuToggle.setAttribute('aria-expanded', open);
            mobileMenu.classList.toggle('open', open);
            document.body.classList.toggle('scroll-locked', open);
        };

        menuToggle.addEventListener('click', () => {
            toggleMenu(!mobileMenu.classList.contains('open'));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || '0', 10);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('visible');
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

    // --- Contextual CTA ---
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        });
    }

    // --- Carousel ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (!carousel || slides.length === 0) return;

        const updateCarousel = () => {
            const slideWidth = slides[0].clientWidth;
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateDots();
        };

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

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

        if (dotsContainer) {
            createDots();
            updateDots();
        }
        
        window.addEventListener('resize', updateCarousel);
    });

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let galleryImages = [];
        let currentIndex = -1;

        const updateLightboxImage = (index) => {
            if (index >= 0 && index < galleryImages.length) {
                currentIndex = index;
                const newSrc = galleryImages[currentIndex].dataset.kmImage;
                const newAlt = galleryImages[currentIndex].alt;
                lightboxImg.src = newSrc.startsWith('..') ? newSrc : `../${newSrc}`.replace('../assets', 'assets');
                lightboxImg.alt = newAlt;
            }
        };

        const openLightbox = (e) => {
            const clickedImage = e.target.closest('.lightbox-trigger, [data-km-image]');
            if (clickedImage) {
                e.preventDefault();
                galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger, [data-km-image]'));
                const clickedIndex = galleryImages.findIndex(img => img === clickedImage || img.contains(clickedImage));
                
                if (clickedIndex !== -1) {
                    updateLightboxImage(clickedIndex);
                    lightbox.classList.add('visible');
                    document.body.classList.add('scroll-locked');
                }
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('scroll-locked');
            lightboxImg.src = ''; // Clear src to stop loading
        };

        const showPrev = () => updateLightboxImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
        const showNext = () => updateLightboxImage((currentIndex + 1) % galleryImages.length);

        document.body.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});