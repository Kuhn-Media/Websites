document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('open');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('open')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    // --- Carousel --- //
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = wrapper.querySelector('.next');
        const prevButton = wrapper.querySelector('.prev');
        const dotsNav = wrapper.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition); // Not needed for flexbox version

        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
        };

        if (dotsNav) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(dot);
            });
        }

        const dots = dotsNav ? Array.from(dotsNav.children) : [];
        const updateDots = (targetIndex) => {
            if (!dotsNav) return;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === targetIndex);
            });
        };

        nextButton.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= slides.length) newIndex = 0;
            moveToSlide(newIndex);
        });

        prevButton.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = slides.length - 1;
            moveToSlide(newIndex);
        });
        
        // Touch support
        let startX = 0;
        let moveX = 0;
        track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
        track.addEventListener('touchmove', e => { moveX = e.touches[0].clientX; });
        track.addEventListener('touchend', () => {
            if (startX - moveX > 50) nextButton.click();
            else if (moveX - startX > 50) prevButton.click();
        });
    });

    // --- Lightbox --- //
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const images = Array.from(galleryItems).map(item => item.dataset.kmImage);

        const showImage = (index) => {
            const pathPrefix = lightbox.dataset.pathPrefix || '';
            lightboxImg.src = pathPrefix + images[index];
            currentIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const pathPrefix = item.src.startsWith('../') ? '../' : '';
                lightbox.dataset.pathPrefix = pathPrefix;
                lightbox.classList.add('visible');
                showImage(index);
            });
        });

        const closeLightbox = () => lightbox.classList.remove('visible');
        const showPrev = () => showImage((currentIndex - 1 + images.length) % images.length);
        const showNext = () => showImage((currentIndex + 1) % images.length);

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

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const footer = document.querySelector('.site-footer-main');
    if (stickyCTA && footer) {
        const observer = new IntersectionObserver(([entry]) => {
            // Hide CTA if footer is visible, show otherwise
            stickyCTA.classList.toggle('visible', !entry.isIntersecting && window.scrollY > 400);
        }, { threshold: 0.1 });
        observer.observe(footer);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('visible');
            }
        }, 2000);
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }
});