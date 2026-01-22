document.addEventListener('DOMContentLoaded', function() {

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
    const mobileNav = document.querySelector('.mobile-nav');
    if (navToggle && mobileNav) {
        const openMenu = () => {
            navToggle.classList.add('is-open');
            navToggle.setAttribute('aria-expanded', 'true');
            mobileNav.classList.add('is-open');
            mobileNav.setAttribute('aria-hidden', 'false');
            document.body.classList.add('mobile-nav-open', 'no-scroll');
            mobileNav.querySelector('a').focus();
        };

        const closeMenu = () => {
            navToggle.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('is-open');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('mobile-nav-open', 'no-scroll');
            navToggle.focus();
        };

        navToggle.addEventListener('click', () => {
            if (navToggle.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                closeMenu();
            }
        });
        
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('.mobile-nav-open::after') || e.target.closest('.mobile-nav a')) {
                closeMenu();
            }
        });

        const closeButton = mobileNav.querySelector('.mobile-nav-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeMenu);
        }
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100); // Staggered delay
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.scrollTo({ left: slides[currentIndex].offsetLeft, behavior: 'smooth' });
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

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

        updateDots();
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.setAttribute('aria-hidden', 'false');
            cookieBanner.classList.add('visible');
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // --- Back to Top & Sticky CTA ---
    const backToTopButton = document.getElementById('back-to-top');
    const stickyCta = document.getElementById('sticky-cta');

    const handleScroll = () => {
        if (window.scrollY > 300) {
            if(backToTopButton) backToTopButton.classList.add('visible');
            if(stickyCta) stickyCta.classList.add('visible');
        } else {
            if(backToTopButton) backToTopButton.classList.remove('visible');
            if(stickyCta) stickyCta.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll);

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // --- Lightbox Gallery ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentImageIndex;

    if (galleryItems.length > 0 && lightbox) {
        const imageSources = Array.from(galleryItems).map(item => ({ src: item.dataset.src, alt: item.dataset.alt }));

        const showImage = (index) => {
            if (index < 0 || index >= imageSources.length) return;
            const { src, alt } = imageSources[index];
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            currentImageIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        lightboxPrev.addEventListener('click', () => showImage(currentImageIndex - 1));
        lightboxNext.addEventListener('click', () => showImage(currentImageIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
            }
        });
    }
});