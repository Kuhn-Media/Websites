document.addEventListener('DOMContentLoaded', () => {

    // --- 1. HEADER & NAVIGATION --- //
    const header = document.getElementById('main-header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    // Sticky Header
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile Navigation
    const openMobileMenu = () => {
        mobileNavMenu.classList.add('is-open');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('scroll-locked');
        mobileNavMenu.addEventListener('keydown', trapFocus);
        mobileNavClose.focus();
    };

    const closeMobileMenu = () => {
        mobileNavMenu.classList.remove('is-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('scroll-locked');
        mobileNavMenu.removeEventListener('keydown', trapFocus);
        mobileNavToggle.focus();
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            if (mobileNavMenu.classList.contains('is-open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        mobileNavClose.addEventListener('click', closeMobileMenu);

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // Focus Trap for Mobile Menu
    const focusableElements = mobileNavMenu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    function trapFocus(e) {
        const isTabPressed = e.key === 'Tab';
        if (!isTabPressed) return;

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }

    // --- 2. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.sr-hidden');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 50}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            goToSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            goToSlide(currentIndex);
        });

        createDots();
    }

    // --- 4. FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    });

    // --- 5. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- 6. STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');

    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCTA.hidden = false;
                    stickyCTA.classList.add('is-visible');
                } else {
                    stickyCTA.classList.remove('is-visible');
                }
            });
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

    // --- 7. LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            updateImage();
            lightbox.hidden = false;
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
            document.addEventListener('keydown', handleLightboxKeys);
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleLightboxKeys);
        };

        const updateImage = () => {
            const imgElement = galleryImages[currentIndex];
            const src = imgElement.dataset.kmImage || imgElement.src;
            const alt = imgElement.alt || 'Galeriebild';
            lightboxImage.src = src.replace('../', '');
            lightboxImage.alt = alt;
        };

        const showPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryImages.length - 1;
            updateImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex < galleryImages.length - 1) ? currentIndex + 1 : 0;
            updateImage();
        };

        const handleLightboxKeys = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-km-lightbox-trigger]')) {
                galleryImages = Array.from(document.querySelectorAll('[data-km-lightbox-trigger]'));
                const index = galleryImages.indexOf(e.target);
                openLightbox(index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
    }
});