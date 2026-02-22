document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navContainer = document.querySelector('.mobile-nav-container');
    const navClose = document.querySelector('.mobile-nav-close');
    const navBackdrop = document.querySelector('.mobile-nav-backdrop');

    if (navToggle && navContainer) {
        navToggle.addEventListener('click', () => {
            navContainer.classList.add('is-visible');
            navContainer.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        });

        const closeNav = () => {
            navContainer.classList.remove('is-visible');
            navContainer.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        navClose.addEventListener('click', closeNav);
        navBackdrop.addEventListener('click', closeNav);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navContainer.classList.contains('is-visible')) {
                closeNav();
            }
        });
    }

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.hidden = true;
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.hidden = true;
        });
    }

    // --- Carousel ---
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-next');
        const prevButton = carousel.querySelector('.carousel-prev');
        const dotsNav = carousel.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots();
        };

        if (dotsNav) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(dot);
            });
        }

        const dots = dotsNav ? Array.from(dotsNav.children) : [];
        const updateDots = () => {
            if (!dots.length) return;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        if(nextButton) nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        if(prevButton) prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });

        if (dots.length > 0) updateDots();
    });

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('figcaption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let currentGallery = [];
        let currentIndex = -1;

        const openLightbox = (gallery, index) => {
            currentGallery = gallery;
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        const updateLightboxImage = () => {
            const trigger = currentGallery[currentIndex];
            const imgSrc = trigger.dataset.kmImage.startsWith('../') ? trigger.dataset.kmImage : (document.baseURI.includes('/index.html') || document.baseURI.endsWith('/') ? '' : '../') + trigger.dataset.kmImage;
            lightboxImg.src = imgSrc;
            lightboxImg.alt = trigger.alt || '';
            lightboxCaption.textContent = trigger.dataset.title || '';
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightboxImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateLightboxImage();
        };

        document.addEventListener('click', e => {
            const trigger = e.target.closest('[data-lightbox-trigger]');
            if (trigger) {
                e.preventDefault();
                const galleryName = trigger.dataset.lightboxTrigger;
                const galleryElements = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${galleryName}']`));
                const index = galleryElements.indexOf(trigger);
                openLightbox(galleryElements, index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');

    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                stickyCTA.hidden = entry.isIntersecting;
            });
        }, { rootMargin: '-100px 0px 0px 0px' });

        ctaObserver.observe(heroSection);
    }

});