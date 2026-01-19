'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER --- //
    const header = document.getElementById('header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- 2. MOBILE NAVIGATION --- //
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.header__nav');
    if (menuToggle && mainNav) {
        let navOverlay = null;

        const closeMenu = () => {
            document.body.classList.remove('mobile-nav-active');
            menuToggle.setAttribute('aria-expanded', 'false');
            if (navOverlay) navOverlay.remove();
        };

        const openMenu = () => {
            document.body.classList.add('mobile-nav-active');
            menuToggle.setAttribute('aria-expanded', 'true');
            navOverlay = document.createElement('div');
            navOverlay.className = 'nav-overlay';
            document.body.appendChild(navOverlay);
            navOverlay.addEventListener('click', closeMenu);
        };

        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            isExpanded ? closeMenu() : openMenu();
        });
    }

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
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

        revealElements.forEach(el => observer.observe(el));
    }

    // --- 4. FAQ ACCORDION --- //
    const accordionItems = document.querySelectorAll('.accordion__item');
    accordionItems.forEach(item => {
        const button = item.querySelector('.accordion__button');
        const content = item.querySelector('.accordion__content');
        if (button && content) {
            // To make the animation work, we need a wrapper div
            const contentInner = document.createElement('div');
            while(content.firstChild) {
                contentInner.appendChild(content.firstChild);
            }
            content.appendChild(contentInner);

            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
            });
        }
    });

    // --- 5. TESTIMONIALS CAROUSEL --- //
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel__track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel__button--next');
        const prevButton = carousel.querySelector('.carousel__button--prev');
        const dotsNav = carousel.querySelector('.carousel__dots');

        if (!track || slides.length === 0) return;

        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= slides.length - 1; // Adjust for visible slides later if needed
            if (dotsNav) {
                Array.from(dotsNav.children).forEach((dot, index) => {
                    dot.classList.toggle('is-active', index === currentIndex);
                });
            }
        };

        if (dotsNav) {
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('carousel__dot');
                button.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(button);
            });
        }

        prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));
        nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));

        // Initial state
        moveToSlide(0);
    });

    // --- 6. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        const cookieConsent = localStorage.getItem('cookieConsent');

        if (!cookieConsent) {
            cookieBanner.hidden = false;
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookieConsent', consent);
            cookieBanner.hidden = true;
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }
    
    // --- 7. LIGHTBOX --- //
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxContent = lightbox.querySelector('.lightbox__content');
        const closeBtn = lightbox.querySelector('.lightbox__close');
        const prevBtn = lightbox.querySelector('.lightbox__prev');
        const nextBtn = lightbox.querySelector('.lightbox__next');
        let galleryItems = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            currentIndex = index;
            const item = galleryItems[currentIndex];
            const imgSrc = item.href;
            const imgAlt = item.querySelector('img')?.alt || 'Galeriebild';
            
            lightboxContent.innerHTML = `<img src='${imgSrc}' alt='${imgAlt}'>`;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            updateLightboxNav();
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        const showPrev = () => {
            if (currentIndex > 0) {
                openLightbox(currentIndex - 1);
            }
        };

        const showNext = () => {
            if (currentIndex < galleryItems.length - 1) {
                openLightbox(currentIndex + 1);
            }
        };
        
        const updateLightboxNav = () => {
            prevBtn.hidden = currentIndex <= 0;
            nextBtn.hidden = currentIndex >= galleryItems.length - 1;
        };

        document.querySelectorAll('[data-lightbox-group]').forEach(item => {
            const itemIndex = galleryItems.length;
            galleryItems.push(item);
            item.addEventListener('click', e => {
                e.preventDefault();
                openLightbox(itemIndex);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', e => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

});