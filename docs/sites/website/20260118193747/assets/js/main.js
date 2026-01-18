document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(
            ([e]) => e.target.classList.toggle('is-scrolled', e.intersectionRatio < 1),
            { threshold: [1] }
        );
        // Create a dummy element to observe at the top of the body
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = '0';
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- Mobile Navigation --- //
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-menu-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-menu-open')) {
                document.body.classList.remove('nav-menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${index * 100}ms`;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero, .page-hero');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                stickyCTA.classList.toggle('is-visible', !entry.isIntersecting);
            });
        }, { rootMargin: '0px 0px -100% 0px' });
        ctaObserver.observe(heroSection);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Carousel --- //
    const carousel = document.getElementById('image-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.parentElement.querySelector('.next');
        const prevButton = carousel.parentElement.querySelector('.prev');
        const dotsNav = carousel.parentElement.querySelector('.carousel-dots');
        let slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('active');
            targetDot.classList.add('active');
        };

        // Create dots
        slides.forEach((slide, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            if (index === 0) button.classList.add('active');
            button.addEventListener('click', e => {
                const currentSlide = track.querySelector('.current-slide') || slides[0];
                const currentDot = dotsNav.querySelector('.active');
                moveToSlide(track, currentSlide, slides[index]);
                updateDots(currentDot, button);
            });
            dotsNav.appendChild(button);
        });

        const dots = Array.from(dotsNav.children);

        const updateSlideAndDot = (direction) => {
            const currentSlide = track.querySelector('.current-slide') || slides[0];
            const currentDot = dotsNav.querySelector('.active');
            let targetIndex = slides.findIndex(slide => slide === currentSlide) + direction;
            if (targetIndex < 0) targetIndex = slides.length - 1;
            if (targetIndex >= slides.length) targetIndex = 0;

            moveToSlide(track, currentSlide, slides[targetIndex]);
            updateDots(currentDot, dots[targetIndex]);
        }

        prevButton.addEventListener('click', () => updateSlideAndDot(-1));
        nextButton.addEventListener('click', () => updateSlideAndDot(1));
        
        // Initial setup
        slides[0].classList.add('current-slide');
        track.style.transform = 'translateX(0)';

        // Recalculate on resize
        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            // slides.forEach(setSlidePosition);
            const currentSlide = track.querySelector('.current-slide') || slides[0];
            track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
        });
    }
    
    // --- Lightbox --- //
    const gallery = document.getElementById('image-gallery');
    const lightbox = document.getElementById('lightbox');
    if (gallery && lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const galleryItems = gallery.querySelectorAll('.gallery-item');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            const src = item.href;
            const alt = item.dataset.alt || '';
            lightboxImage.src = src;
            lightboxImage.alt = alt;
            currentIndex = index;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        const hideLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', hideLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(newIndex);
        });
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            showImage(newIndex);
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                hideLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
                if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
            }
        });
    }
});