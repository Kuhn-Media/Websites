document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.querySelector('.mobile-nav-drawer');
    const navOverlay = document.querySelector('.nav-overlay');
    if (navToggle && navDrawer && navOverlay) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            navDrawer.classList.toggle('open');
            navOverlay.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        navOverlay.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navDrawer.classList.remove('open');
            navOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 50}ms`;
        observer.observe(el);
    });

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
        });
    });

    // --- Carousel ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const slides = wrapper.querySelectorAll('.carousel-slide');
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(prevBtn) prevBtn.style.display = 'none';
            if(nextBtn) nextBtn.style.display = 'none';
            return;
        }

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = Array.from(dotsContainer.children);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }

        updateCarousel();
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }
    
    // --- Sticky CTA Bar ---
    const stickyBar = document.getElementById('sticky-cta-bar');
    if(stickyBar) {
        const heroSection = document.querySelector('.hero, .page-hero');
        const showBarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyBar.classList.add('show');
                } else {
                    stickyBar.classList.remove('show');
                }
            });
        }, { threshold: 0 });
        if (heroSection) {
            showBarObserver.observe(heroSection);
        }
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = document.querySelectorAll('.lightbox-trigger');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    let currentImageIndex;

    if (lightbox) {
        const imageSources = Array.from(galleryImages).map(img => img.src);

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageIndex = index;
                openLightbox(img.src);
            });
        });

        function openLightbox(src) {
            lightbox.classList.add('show');
            lightboxImg.src = src;
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        }

        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }
});