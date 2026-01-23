document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            primaryNav.classList.toggle('active');
            document.body.style.overflow = primaryNav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header.sticky');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- Scroll Animations --- //
    const animatedElements = document.querySelectorAll('.animate-in');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            updateDots(index);
            currentIndex = index;
        };

        const updateDots = (index) => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        goToSlide(0);
    }

    // --- Sticky CTA Bar --- //
    const stickyBar = document.getElementById('sticky-cta-bar');
    if (stickyBar) {
        const onScroll = () => {
            stickyBar.classList.toggle('visible', window.scrollY > 400);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('visible');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;
        const galleryItems = Array.from(lightboxTriggers);

        const showImage = (index) => {
            const item = galleryItems[index];
            lightboxContent.src = item.href;
            lightboxContent.alt = item.querySelector('img').alt;
            currentIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const index = galleryItems.indexOf(e.currentTarget);
            lightbox.classList.add('visible');
            showImage(index);
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.style.overflow = '';
        };

        const showNext = () => {
            const nextIndex = (currentIndex + 1) % galleryItems.length;
            showImage(nextIndex);
        };

        const showPrev = () => {
            const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(prevIndex);
        };

        lightboxTriggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });
    }
});