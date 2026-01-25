document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Behavior ---
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
    const mobileNav = document.querySelector('.mobile-nav-menu');
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => moveToSlide(i));
                dotsNav.appendChild(dot);
            });
        };

        const updateDots = () => {
            const dots = Array.from(dotsNav.children);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const moveToSlide = (targetIndex) => {
            carousel.style.transform = 'translateX(-' + targetIndex * 100 + '%)';
            currentIndex = targetIndex;
            updateDots();
        };

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });

        createDots();
        carousel.style.transition = 'transform 0.4s ease-in-out';
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.hidden = false;
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => { cookieBanner.hidden = true; }, 500);
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = lightbox ? lightbox.querySelector('.lightbox-content') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

    if (lightbox && lightboxContent && lightboxClose) {
        const openLightbox = (src, alt) => {
            lightboxContent.src = src;
            lightboxContent.alt = alt;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            setTimeout(() => lightbox.classList.add('visible'), 10);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.style.overflow = '';
            setTimeout(() => { 
                lightbox.hidden = true; 
                lightboxContent.src = '';
            }, 300);
        };

        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                openLightbox(trigger.src, trigger.alt);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });
    }
});