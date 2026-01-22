document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('#primary-navigation');
    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            primaryNav.setAttribute('data-visible', !isVisible);
            navToggle.setAttribute('aria-expanded', !isVisible);
            navToggle.classList.toggle('nav-open');
        });

        document.addEventListener('click', (e) => {
            if (!primaryNav.contains(e.target) && !navToggle.contains(e.target) && primaryNav.getAttribute('data-visible') === 'true') {
                primaryNav.setAttribute('data-visible', false);
                navToggle.setAttribute('aria-expanded', false);
                navToggle.classList.remove('nav-open');
            }
        });
    }

    // Sticky Header Shrink
    const header = document.querySelector('.site-header.sticky');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px' });
        scrollObserver.observe(document.body);
    }

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.animate-in');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // Sticky CTA Bar
    const stickyCTA = document.querySelector('.sticky-cta-bar');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        }, { threshold: 0.1 });
        const heroSection = document.querySelector('.hero');
        if(heroSection) ctaObserver.observe(heroSection);
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    const cookieConsent = localStorage.getItem('cookie_consent');

    if (!cookieConsent && cookieBanner) {
        cookieBanner.classList.add('visible');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // Carousel
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        if (!carousel) return;

        const slides = Array.from(carousel.children);
        let currentIndex = 0;

        const updateCarousel = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateDots();
        }

        const createDots = () => {
            if (!dotsContainer) return;
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        const updateDots = () => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
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

        createDots();
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxTriggers = document.querySelectorAll('.gallery-lightbox-trigger');
    const galleryImages = Array.from(lightboxTriggers).map(el => el.src);
    let currentImageIndex = 0;

    if (lightbox && lightboxImg && lightboxTriggers.length > 0) {
        const openLightbox = (index) => {
            currentImageIndex = index;
            lightboxImg.src = galleryImages[currentImageIndex];
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            lightboxImg.src = galleryImages[currentImageIndex];
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImg.src = galleryImages[currentImageIndex];
        };

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.getAttribute('aria-hidden') === 'false') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }
});