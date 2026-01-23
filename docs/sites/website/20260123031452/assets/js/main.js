document.addEventListener('DOMContentLoaded', function() {

    // --- 1. STICKY HEADER & SCROLL-BASED UI --- //
    const header = document.querySelector('.site-header');
    const backToTopButton = document.getElementById('back-to-top');
    const stickyCta = document.getElementById('sticky-cta');

    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        if (header) {
            header.classList.toggle('scrolled', scrollPosition > 50);
        }
        if (backToTopButton) {
            backToTopButton.classList.toggle('visible', scrollPosition > 300);
        }
        if (stickyCta) {
            stickyCta.classList.toggle('visible', scrollPosition > 500 && (window.innerHeight + scrollPosition) < document.body.offsetHeight - 400);
        }
    };

    window.addEventListener('scroll', handleScroll);

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 2. MOBILE NAVIGATION --- //
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

    // --- 3. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-stagger');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-stagger')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                        children[i].classList.add('is-visible');
                    }
                } else {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- 4. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 1000);
    }

    const handleCookieConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        if (cookieBanner) {
            cookieBanner.classList.remove('active');
        }
    };

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => handleCookieConsent('accepted'));
    }
    if (declineCookies) {
        declineCookies.addEventListener('click', () => handleCookieConsent('declined'));
    }

    // --- 5. LIGHTBOX GALLERY --- //
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');

    if (gallery && lightbox) {
        const galleryItems = gallery.querySelectorAll('.gallery-item');
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            if (!item) return;
            const imgSrc = item.getAttribute('href');
            const imgAlt = item.querySelector('img').getAttribute('alt');
            lightboxImg.setAttribute('src', imgSrc);
            lightboxImg.setAttribute('alt', imgAlt);
            currentIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const clickedIndex = Array.from(galleryItems).indexOf(e.currentTarget);
            showImage(clickedIndex);
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            lightboxNext.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            galleryItems[currentIndex].focus();
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', openLightbox);
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));
        lightboxPrev.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') lightboxNext.click();
                if (e.key === 'ArrowLeft') lightboxPrev.click();
            }
        });
    }

    // --- 6. TESTIMONIAL CAROUSEL --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Gehe zu Bewertung ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        };

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }

        createDots();
        updateCarousel();

        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextButton.click();
            if (touchendX > touchstartX) prevButton.click();
        });
    }
});