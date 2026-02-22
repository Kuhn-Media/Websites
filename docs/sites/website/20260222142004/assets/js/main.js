document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const body = document.body;

    const toggleMobileNav = () => {
        const isOpen = body.classList.toggle('mobile-nav-menu-open');
        mobileNavToggle.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
            body.classList.add('no-scroll');
            mobileNavMenu.querySelector('a').focus();
        } else {
            body.classList.remove('no-scroll');
        }
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', toggleMobileNav);
        mobileNavClose.addEventListener('click', toggleMobileNav);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('mobile-nav-menu-open')) {
                toggleMobileNav();
            }
        });
    }

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                const container = entry.target.closest('.stagger-container');
                if (container) {
                    const items = container.querySelectorAll('.reveal-on-scroll > *, .card, .step-item, .gallery-item');
                    items.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 100}ms`;
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.removeAttribute('aria-current');
            targetSlide.setAttribute('aria-current', 'true');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('active');
            targetDot.classList.add('active');
        }

        if (dotsNav) {
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.setAttribute('aria-label', `Gehe zu Bewertung ${index + 1}`);
                if (index === 0) button.classList.add('active');
                dotsNav.appendChild(button);
            });
            const dots = Array.from(dotsNav.children);

            dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('button');
                if (!targetDot) return;

                const currentSlide = track.querySelector('[aria-current]');
                const currentDot = dotsNav.querySelector('.active');
                const targetIndex = dots.findIndex(dot => dot === targetDot);
                const targetSlide = slides[targetIndex];

                moveToSlide(track, currentSlide, targetSlide);
                updateDots(currentDot, targetDot);
            });
        }

        nextButton.addEventListener('click', () => {
            const currentSlide = track.querySelector('[aria-current]') || slides[0];
            let nextSlide = currentSlide.nextElementSibling;
            if (!nextSlide) { nextSlide = slides[0]; }

            moveToSlide(track, currentSlide, nextSlide);

            if (dotsNav) {
                const currentDot = dotsNav.querySelector('.active');
                let nextDot = currentDot.nextElementSibling;
                if (!nextDot) { nextDot = dotsNav.firstElementChild; }
                updateDots(currentDot, nextDot);
            }
        });

        prevButton.addEventListener('click', () => {
            const currentSlide = track.querySelector('[aria-current]') || slides[0];
            let prevSlide = currentSlide.previousElementSibling;
            if (!prevSlide) { prevSlide = slides[slides.length - 1]; }

            moveToSlide(track, currentSlide, prevSlide);

            if (dotsNav) {
                const currentDot = dotsNav.querySelector('.active');
                let prevDot = currentDot.previousElementSibling;
                if (!prevDot) { prevDot = dotsNav.lastElementChild; }
                updateDots(currentDot, prevDot);
            }
        });

        slides[0].setAttribute('aria-current', 'true');
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA Bar ---
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        const handleCtaScroll = () => {
            if (window.scrollY > 400) {
                stickyCtaBar.classList.add('visible');
            } else {
                stickyCtaBar.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleCtaScroll, { passive: true });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('img');
        const closeButton = lightbox.querySelector('.lightbox-close');
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');
        let currentGallery = [];
        let currentIndex = -1;

        const openLightbox = (gallery, index) => {
            currentGallery = gallery;
            currentIndex = index;
            updateLightboxImage();
            lightbox.hidden = false;
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            closeButton.focus();
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            lightboxImage.src = '';
        };

        const updateLightboxImage = () => {
            const imagePath = currentGallery[currentIndex];
            lightboxImage.src = imagePath.startsWith('..') ? imagePath : (document.baseURI.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../') + imagePath;
            prevButton.style.display = currentGallery.length > 1 ? 'flex' : 'none';
            nextButton.style.display = currentGallery.length > 1 ? 'flex' : 'none';
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightboxImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateLightboxImage();
        };

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.lightbox-trigger');
            if (trigger) {
                e.preventDefault();
                const galleryName = trigger.dataset.gallery || 'default';
                const galleryImages = Array.from(document.querySelectorAll(`.lightbox-trigger[data-gallery='${galleryName}']`))
                                           .map(img => img.dataset.kmImage || img.src);
                const index = galleryImages.findIndex(src => src === (trigger.dataset.kmImage || trigger.src));
                openLightbox(galleryImages, index);
            }
        });

        closeButton.addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', showPrev);
        nextButton.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});