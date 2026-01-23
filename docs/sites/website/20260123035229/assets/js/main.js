document.addEventListener('DOMContentLoaded', () => {

    const initMobileNav = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('is-open');
            document.body.style.overflow = !isOpen ? 'hidden' : '';
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                navToggle.click();
            }
        });

        navMenu.addEventListener('click', (e) => {
            if (e.target === navMenu) {
                navToggle.click();
            }
        });
    };

    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;

        const observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px' });

        observer.observe(document.body);
    };

    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.reveal-up');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    };

    const initCarousel = () => {
        const carousels = document.querySelectorAll('.carousel-wrapper');
        carousels.forEach(wrapper => {
            const carousel = wrapper.querySelector('.carousel');
            const prevButton = wrapper.querySelector('.carousel-button.prev');
            const nextButton = wrapper.querySelector('.carousel-button.next');
            const dotsContainer = wrapper.querySelector('.carousel-dots');
            if (!carousel) return;

            const slides = Array.from(carousel.children);
            const slideWidth = slides[0].getBoundingClientRect().width;
            let currentIndex = 0;

            const createDots = () => {
                if (!dotsContainer) return;
                slides.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.classList.add('carousel-dot');
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                });
            };

            const updateDots = () => {
                if (!dotsContainer) return;
                Array.from(dotsContainer.children).forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            };

            const goToSlide = (index) => {
                carousel.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
                currentIndex = index;
                updateDots();
            };

            if (nextButton) nextButton.addEventListener('click', () => goToSlide((currentIndex + 1) % slides.length));
            if (prevButton) prevButton.addEventListener('click', () => goToSlide((currentIndex - 1 + slides.length) % slides.length));

            createDots();
            updateDots();
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        
        const scrollHandler = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    };

    const initBackToTop = () => {
        const button = document.getElementById('back-to-top');
        if (!button) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        }, { passive: true });

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => banner.classList.add('visible'), 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('visible');
        });
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        const triggers = document.querySelectorAll('.lightbox-trigger');
        const img = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentImageIndex;
        const galleryImages = Array.from(triggers).map(t => ({ src: t.href, alt: t.querySelector('img').alt }));

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            const { src, alt } = galleryImages[index];
            img.src = src;
            img.alt = alt;
            currentImageIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        triggers.forEach((trigger, index) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage((currentImageIndex - 1 + galleryImages.length) % galleryImages.length));
        nextBtn.addEventListener('click', () => showImage((currentImageIndex + 1) % galleryImages.length));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollAnimations();
    initCarousel();
    initStickyCTA();
    initBackToTop();
    initCookieBanner();
    initLightbox();
});