document.addEventListener('DOMContentLoaded', () => {

    // --- HEADER SCROLL EFFECT ---
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

    // --- MOBILE NAVIGATION ---
    const mobileNavToggleButtons = document.querySelectorAll('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    if (mobileNavToggleButtons.length && mobileNavMenu) {
        mobileNavToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const isOpening = !mobileNavMenu.classList.contains('open');
                mobileNavMenu.classList.toggle('open');
                document.body.classList.toggle('body-scroll-lock', isOpening);
                button.setAttribute('aria-expanded', isOpening);
                mobileNavMenu.setAttribute('aria-hidden', !isOpening);
            });
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        cookieAcceptBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.ariaLabel = `Go to slide ${index + 1}`;
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- LIGHTBOX ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = document.getElementById('lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let currentGroup = [];
        let currentIndexInGroup = -1;

        const openLightbox = (group, index) => {
            currentGroup = group;
            currentIndexInGroup = index;
            updateLightboxImage();
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('body-scroll-lock');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('body-scroll-lock');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateLightboxImage = () => {
            const trigger = currentGroup[currentIndexInGroup];
            const imagePath = trigger.getAttribute('href');
            lightboxImage.setAttribute('src', imagePath);
        };

        const showNext = () => {
            currentIndexInGroup = (currentIndexInGroup + 1) % currentGroup.length;
            updateLightboxImage();
        };

        const showPrev = () => {
            currentIndexInGroup = (currentIndexInGroup - 1 + currentGroup.length) % currentGroup.length;
            updateLightboxImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };

        document.querySelectorAll('[data-lightbox-trigger]').forEach(trigger => {
            trigger.addEventListener('click', e => {
                e.preventDefault();
                const groupName = trigger.dataset.lightboxTrigger;
                const groupTriggers = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${groupName}']`));
                const index = groupTriggers.indexOf(trigger);
                openLightbox(groupTriggers, index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
    }

    // --- BACK TO TOP BUTTON ---
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});