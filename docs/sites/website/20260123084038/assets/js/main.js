document.addEventListener('DOMContentLoaded', function() {

    // --- PREFERS REDUCED MOTION CHECK --- 
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- STICKY HEADER --- 
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
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavMenu.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        });

        const closeMenu = () => {
            mobileNavMenu.classList.remove('is-open');
            document.body.style.overflow = '';
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        };

        mobileNavClose.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION --- 
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-fade');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- TESTIMONIAL CAROUSEL --- 
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            if (!prefersReducedMotion) {
                 carousel.style.transition = 'transform 0.5s ease-in-out';
            }
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- COOKIE BANNER --- 
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }
    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- STICKY CTA --- 
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const showCtaThreshold = 400;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showCtaThreshold) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- FAQ ACCORDION --- 
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

    // --- LIGHTBOX GALLERY --- 
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    if (gallery && lightbox) {
        const galleryItems = gallery.querySelectorAll('.gallery-item');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeButton = lightbox.querySelector('.lightbox-close');
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const images = Array.from(galleryItems).map(item => ({
            src: item.href,
            alt: item.querySelector('img').alt
        }));

        function showImage(index) {
            const img = images[index];
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            currentIndex = index;
        }

        function openLightbox(index) {
            lightbox.classList.add('visible');
            showImage(index);
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('visible');
            document.body.style.overflow = '';
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeButton.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        prevButton.addEventListener('click', () => {
            const newIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
            showImage(newIndex);
        });

        nextButton.addEventListener('click', () => {
            const newIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevButton.click();
                if (e.key === 'ArrowRight') nextButton.click();
            }
        });
    }
});