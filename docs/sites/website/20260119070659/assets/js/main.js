document.addEventListener('DOMContentLoaded', function() {

    // --- PREFERS REDUCED MOTION CHECK ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- STICKY HEADER ---
    const header = document.querySelector('.sticky-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE NAVIGATION ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.mobile-nav-menu');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
    const navClose = document.querySelector('.mobile-nav-close');
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    if (navToggle && navMenu && navOverlay && navClose) {
        const openMenu = () => {
            navMenu.hidden = false;
            navOverlay.hidden = false;
            setTimeout(() => {
                navMenu.classList.add('is-open');
                navOverlay.classList.add('is-visible');
                navToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
                const firstFocusableElement = navMenu.querySelectorAll(focusableElements)[0];
                firstFocusableElement.focus();
            }, 10);
        };

        const closeMenu = () => {
            navMenu.classList.remove('is-open');
            navOverlay.classList.remove('is-visible');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            setTimeout(() => {
                navMenu.hidden = true;
                navOverlay.hidden = true;
            }, 400);
        };

        navToggle.addEventListener('click', openMenu);
        navClose.addEventListener('click', closeMenu);
        navOverlay.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (entry.target.classList.contains('stagger-children')) {
                        const children = entry.target.children;
                        for (let i = 0; i < children.length; i++) {
                            children[i].style.setProperty('--stagger-index', i);
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- CAROUSEL ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        if (!carousel) return;

        let slides = Array.from(carousel.children);
        let slideWidth = slides[0].getBoundingClientRect().width;

        const updateDots = (currentIndex) => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (index === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => carousel.scrollTo({ left: index * slideWidth, behavior: 'smooth' }));
                dotsContainer.appendChild(dot);
            });
        };

        const updateCarousel = () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            const currentIndex = Math.round(carousel.scrollLeft / slideWidth);
            updateDots(currentIndex);
        };

        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
            });
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
            });
        }

        carousel.addEventListener('scroll', updateCarousel);
        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    });

    // --- LIGHTBOX ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const galleryImages = Array.from(document.querySelectorAll('.gallery-lightbox-trigger'));
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const imgElement = galleryImages[index];
            const imgSrc = imgElement.getAttribute('data-km-image') || imgElement.src;
            const imgAlt = imgElement.alt;
            lightboxImg.src = imgSrc.startsWith('..') ? imgSrc.substring(1) : imgSrc; // Adjust path for subpages
            lightboxImg.alt = imgAlt;
            currentIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.hidden = false;
            setTimeout(() => lightbox.classList.add('is-visible'), 10);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            setTimeout(() => lightbox.hidden = true, 300);
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length));
        nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % galleryImages.length));
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('is-visible'), 500);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        });
    }
    if (declineBtn) {
         declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        });
    }

    // --- BACK TO TOP & STICKY CTA ---
    const backToTopBtn = document.getElementById('back-to-top');
    const stickyCta = document.getElementById('sticky-cta');
    const footer = document.querySelector('.site-footer');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.hidden = false;
                setTimeout(() => backToTopBtn.classList.add('is-visible'), 10);
            } else {
                backToTopBtn.classList.remove('is-visible');
                setTimeout(() => backToTopBtn.hidden = true, 300);
            }
        });
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
    }

    if (stickyCta && footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (window.scrollY > 400 && entry.isIntersecting) {
                    stickyCta.classList.remove('is-visible');
                } else if (window.scrollY > 400) {
                    stickyCta.hidden = false;
                    stickyCta.classList.add('is-visible');
                } else {
                    stickyCta.classList.remove('is-visible');
                    setTimeout(() => stickyCta.hidden = true, 300);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(footer);
    }
});