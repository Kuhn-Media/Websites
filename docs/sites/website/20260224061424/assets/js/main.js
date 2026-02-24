document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isOpen);
            document.body.classList.toggle('mobile-nav-open');
            if (!isOpen) {
                mainNav.style.display = 'flex';
            } else {
                // Let animation finish before hiding
                setTimeout(() => { if(!document.body.classList.contains('mobile-nav-open')) mainNav.style.display = 'none'; }, 500);
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-stagger');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.classList.contains('reveal-stagger') ? index * 100 : 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- Carousel --- //
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        const slides = Array.from(carousel.children);
        const slideWidth = slides[0].getBoundingClientRect().width;

        let dots = [];

        const setupCarousel = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.addEventListener('click', () => {
                    carousel.scrollTo({ left: i * slideWidth, behavior: 'smooth' });
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            });
            updateDots();
        };

        const updateDots = () => {
            const currentIndex = Math.round(carousel.scrollLeft / slideWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        nextButton.addEventListener('click', () => {
            carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
        });

        prevButton.addEventListener('click', () => {
            carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        });

        carousel.addEventListener('scroll', updateDots);
        setupCarousel();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }
    
    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex = 0;

    if (lightbox && galleryImages.length > 0) {
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const closeButton = lightbox.querySelector('.lightbox-close');
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');
        const imageSources = Array.from(galleryImages).map(img => img.dataset.lightboxSrc || img.src);

        const showImage = (index) => {
            lightboxContent.src = imageSources[index];
            currentImageIndex = index;
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                showImage(index);
            });
        });

        const closeLightbox = () => lightbox.style.display = 'none';

        closeButton.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        prevButton.addEventListener('click', () => {
            const newIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            showImage(newIndex);
        });

        nextButton.addEventListener('click', () => {
            const newIndex = (currentImageIndex + 1) % imageSources.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevButton.click();
                if (e.key === 'ArrowRight') nextButton.click();
            }
        });
    }
});