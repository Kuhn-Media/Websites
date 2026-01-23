'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('is-active');
            navToggle.classList.toggle('is-active');
            navToggle.setAttribute('aria-expanded', isActive);
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '50px 0px 0px 0px' });
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.revealDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Carousel ---
    const carousel = document.getElementById('projects-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-button.next');
        const prevButton = carousel.querySelector('.carousel-button.prev');
        const dotsNav = carousel.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        const moveToSlide = (currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('is-selected');
            targetSlide.classList.add('is-selected');
        };
        
        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('is-selected');
            targetDot.classList.add('is-selected');
        }

        // Create dots
        slides.forEach((slide, i) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            if (i === 0) button.classList.add('is-selected');
            button.addEventListener('click', () => {
                const currentSlide = track.querySelector('.is-selected');
                const currentDot = dotsNav.querySelector('.is-selected');
                moveToSlide(currentSlide, slides[i]);
                updateDots(currentDot, button);
            });
            dotsNav.appendChild(button);
        });
        const dots = Array.from(dotsNav.children);

        nextButton.addEventListener('click', () => {
            const currentSlide = track.querySelector('.is-selected');
            const nextSlide = currentSlide.nextElementSibling || slides[0];
            const currentDot = dotsNav.querySelector('.is-selected');
            const nextDot = currentDot.nextElementSibling || dots[0];
            moveToSlide(currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
        });

        prevButton.addEventListener('click', () => {
            const currentSlide = track.querySelector('.is-selected');
            const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
            const currentDot = dotsNav.querySelector('.is-selected');
            const prevDot = currentDot.previousElementSibling || dots[dots.length - 1];
            moveToSlide(currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
        });

        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;
        track.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        track.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextButton.click();
            if (touchendX > touchstartX) prevButton.click();
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeButton = lightbox.querySelector('.lightbox-close');
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            const imgSrc = item.href;
            const caption = item.dataset.caption || '';
            lightboxImage.src = imgSrc;
            lightboxImage.alt = caption;
            lightboxCaption.textContent = caption;
            currentIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', e => {
                e.preventDefault();
                lightbox.hidden = false;
                document.body.style.overflow = 'hidden';
                showImage(index);
            });
        });

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        const showNext = () => showImage((currentIndex + 1) % galleryItems.length);
        const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);

        closeButton.addEventListener('click', closeLightbox);
        nextButton.addEventListener('click', showNext);
        prevButton.addEventListener('click', showPrev);

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', e => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            stickyCTA.classList.toggle('visible', entry.boundingClientRect.top < -300);
        });
        ctaObserver.observe(document.body);
    }
});