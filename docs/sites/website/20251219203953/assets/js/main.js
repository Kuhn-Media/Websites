document.addEventListener('DOMContentLoaded', () => {

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Sticky Header Shrink
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

    // 2. Mobile Navigation Drawer
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // 3. Scroll Reveal (Staggered)
    if (!isReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-stagger');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // 4. Sticky Context CTA
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const showAt = 400;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showAt) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // 5. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.classList.add('visible');
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // 6. Carousel
    const carousel = document.getElementById('impressions-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.parentElement.querySelector('.carousel-button.next');
        const prevButton = carousel.parentElement.querySelector('.carousel-button.prev');
        const dotsNav = carousel.parentElement.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition); // This is for absolute positioning, we use flexbox instead

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };
        
        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('active');
            targetDot.classList.add('active');
        }

        const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
            if (targetIndex === 0) {
                prevButton.setAttribute('hidden', true);
                nextButton.removeAttribute('hidden');
            } else if (targetIndex === slides.length - 1) {
                prevButton.removeAttribute('hidden');
                nextButton.setAttribute('hidden', true);
            } else {
                prevButton.removeAttribute('hidden');
                nextButton.removeAttribute('hidden');
            }
        }

        // Create dots
        slides.forEach((slide, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            if (index === 0) button.classList.add('active');
            button.addEventListener('click', e => {
                const currentSlide = track.querySelector('.current-slide');
                const currentDot = dotsNav.querySelector('.active');
                const targetIndex = slides.findIndex(s => s === slide);
                const targetSlide = slides[targetIndex];

                track.style.transform = `translateX(-${targetIndex * 100}%)`;
                currentSlide.classList.remove('current-slide');
                targetSlide.classList.add('current-slide');
                updateDots(currentDot, button);
                hideShowArrows(slides, prevButton, nextButton, targetIndex);
            });
            dotsNav.appendChild(button);
        });

        track.children[0].classList.add('current-slide');
        hideShowArrows(slides, prevButton, nextButton, 0);

        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;
            if (nextSlide) {
                const currentDot = dotsNav.querySelector('.active');
                const nextDot = currentDot.nextElementSibling;
                const nextIndex = slides.findIndex(slide => slide === nextSlide);
                track.style.transform = `translateX(-${nextIndex * 100}%)`;
                currentSlide.classList.remove('current-slide');
                nextSlide.classList.add('current-slide');
                updateDots(currentDot, nextDot);
                hideShowArrows(slides, prevButton, nextButton, nextIndex);
            }
        });

        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            if (prevSlide) {
                const currentDot = dotsNav.querySelector('.active');
                const prevDot = currentDot.previousElementSibling;
                const prevIndex = slides.findIndex(slide => slide === prevSlide);
                track.style.transform = `translateX(-${prevIndex * 100}%)`;
                currentSlide.classList.remove('current-slide');
                prevSlide.classList.add('current-slide');
                updateDots(currentDot, prevDot);
                hideShowArrows(slides, prevButton, nextButton, prevIndex);
            }
        });
    }

    // 7. Gallery Lightbox
    const lightbox = document.getElementById('lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            const imgSrc = item.getAttribute('href');
            const imgAlt = item.querySelector('img').getAttribute('alt');
            lightboxImg.setAttribute('src', imgSrc);
            lightboxImg.setAttribute('alt', imgAlt);
            currentIndex = index;
            lightboxPrev.style.display = (index === 0) ? 'none' : 'block';
            lightboxNext.style.display = (index === galleryItems.length - 1) ? 'none' : 'block';
        };

        const openLightbox = (e, index) => {
            e.preventDefault();
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => openLightbox(e, index));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        lightboxPrev.addEventListener('click', () => {
            if (currentIndex > 0) showImage(currentIndex - 1);
        });

        lightboxNext.addEventListener('click', () => {
            if (currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
                if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
            }
        });
    }
});