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
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Sticky CTA ---
    const stickyCta = document.querySelector('.sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting
                if (!entry.isIntersecting && window.scrollY > 400) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        const heroSection = document.querySelector('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- Cookie Banner ---
    const cookieBanner = document.querySelector('.cookie-banner');
    const cookieAccept = document.querySelector('.cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 400);
        });
    }

    // --- Carousel & Lightbox ---
    const carousel = document.querySelector('.carousel');
    const lightbox = document.getElementById('lightbox');
    if (carousel && lightbox) {
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        const slides = Array.from(carousel.children);
        const slideWidth = slides[0].getBoundingClientRect().width;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => {
                carousel.scrollTo({ left: i * slideWidth, behavior: 'smooth' });
                updateDots(i);
            });
            dotsContainer.appendChild(dot);
        });
        const dots = Array.from(dotsContainer.children);

        const updateDots = (index) => {
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        };

        const updateButtons = () => {
            const currentIndex = Math.round(carousel.scrollLeft / slideWidth);
            updateDots(currentIndex);
        };

        prevButton.addEventListener('click', () => {
            carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        });

        nextButton.addEventListener('click', () => {
            carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
        });

        carousel.addEventListener('scroll', updateButtons);
        updateDots(0);

        // Lightbox functionality
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const lightboxImages = document.querySelectorAll('.carousel-image');
        let currentImageIndex;

        const showImage = (index) => {
            currentImageIndex = index;
            lightboxContent.src = lightboxImages[index].dataset.lightboxSrc;
        };

        lightboxImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                lightbox.classList.add('visible');
                lightbox.ariaHidden = 'false';
                showImage(index);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.ariaHidden = 'true';
        };

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            const newIndex = (currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length;
            showImage(newIndex);
        });
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            const newIndex = (currentImageIndex + 1) % lightboxImages.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
                if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
            }
        });
    }
});