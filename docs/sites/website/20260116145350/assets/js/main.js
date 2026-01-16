document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('#mobile-nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Sticky Header --- //
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

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const wrapper = carousel.querySelector('.carousel-wrapper');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let currentIndex = 0;
        const totalSlides = slides.length;

        if (totalSlides > 1) {
            // Create dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.dataset.index = i;
                if (i === 0) dot.classList.add('active');
                dotsContainer.appendChild(dot);
            }
            const dots = dotsContainer.querySelectorAll('.carousel-dot');

            const updateCarousel = () => {
                wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            };

            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            });

            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateCarousel();
            });

            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    currentIndex = parseInt(dot.dataset.index);
                    updateCarousel();
                });
            });
        }
    }

    // --- Lightbox --- //
    const galleryItems = document.querySelectorAll('[data-lightbox-src]');
    const lightbox = document.getElementById('lightbox');
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let currentImageIndex;

        const images = Array.from(galleryItems).map(item => item.dataset.lightboxSrc);

        const showImage = (index) => {
            lightboxImage.src = images[index];
            currentImageIndex = index;
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

        lightboxClose.addEventListener('click', hideLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) hideLightbox(); });

        lightboxNext.addEventListener('click', () => {
            const nextIndex = (currentImageIndex + 1) % images.length;
            showImage(nextIndex);
        });

        lightboxPrev.addEventListener('click', () => {
            const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowRight') lightboxNext.click();
                if (e.key === 'ArrowLeft') lightboxPrev.click();
            }
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.hidden = false;
                cookieBanner.classList.add('visible');
            }, 2000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show sticky CTA when hero section is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.hidden = false;
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});