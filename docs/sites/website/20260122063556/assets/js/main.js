document.addEventListener('DOMContentLoaded', () => {

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Sticky Header
    const header = document.getElementById('site-header');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('is-shrunk');
            } else {
                header.classList.remove('is-shrunk');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // 2. Mobile Navigation
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navContainer = document.getElementById('mobile-nav-container');
    const nav = document.getElementById('mobile-nav');
    const navClose = document.querySelector('.mobile-nav__close');

    if (navToggle && navContainer && nav) {
        const openMenu = () => {
            navContainer.classList.add('is-open');
            nav.setAttribute('aria-hidden', 'false');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            navContainer.classList.remove('is-open');
            nav.setAttribute('aria-hidden', 'true');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        navToggle.addEventListener('click', openMenu);
        navClose.addEventListener('click', closeMenu);
        navContainer.addEventListener('click', (e) => {
            if (e.target === navContainer) closeMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navContainer.classList.contains('is-open')) closeMenu();
        });
    }

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0 && !isReducedMotion) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    // 4. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // 5. Process Carousel
    const carousel = document.querySelector('.process-steps');
    if (carousel) {
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let slides = Array.from(carousel.children);
        let slidesPerView = Math.floor(carousel.offsetWidth / slides[0].offsetWidth) || 1;
        let totalSlides = slides.length;
        let totalPages = Math.ceil(totalSlides / slidesPerView);
        let currentPage = 0;

        const updateCarousel = () => {
            const offset = currentPage * carousel.offsetWidth;
            carousel.scrollTo({ left: offset, behavior: isReducedMotion ? 'auto' : 'smooth' });
            updateControls();
        };

        const updateControls = () => {
            prevBtn.disabled = currentPage === 0;
            nextBtn.disabled = currentPage >= totalPages - 1;
            Array.from(dotsContainer.children).forEach((dot, index) => {
                dot.classList.toggle('active', index === currentPage);
            });
        };

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => { currentPage = i; updateCarousel(); });
            dotsContainer.appendChild(dot);
        }

        prevBtn.addEventListener('click', () => { if (currentPage > 0) { currentPage--; updateCarousel(); } });
        nextBtn.addEventListener('click', () => { if (currentPage < totalPages - 1) { currentPage++; updateCarousel(); } });

        window.addEventListener('resize', () => {
            slidesPerView = Math.floor(carousel.offsetWidth / slides[0].offsetWidth) || 1;
            totalPages = Math.ceil(totalSlides / slidesPerView);
            updateCarousel();
        });

        updateControls();
    }

    // 6. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            cookieBanner.classList.add('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // 7. Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                stickyCTA.classList.add('is-visible');
                stickyCTA.setAttribute('aria-hidden', 'false');
            } else {
                stickyCTA.classList.remove('is-visible');
                stickyCTA.setAttribute('aria-hidden', 'true');
            }
        }, { rootMargin: '0px 0px -100px 0px' });
        if (heroSection) observer.observe(heroSection);
    }

    // 8. Lightbox Gallery
    const lightbox = document.getElementById('lightbox');
    const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImage = lightbox.querySelector('.lightbox__image');
        const closeBtn = lightbox.querySelector('.lightbox__close');
        const prevBtn = lightbox.querySelector('.lightbox__prev');
        const nextBtn = lightbox.querySelector('.lightbox__next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            const imgSrc = item.getAttribute('href');
            const imgAlt = item.querySelector('img').getAttribute('alt');
            lightboxImage.setAttribute('src', imgSrc);
            lightboxImage.setAttribute('alt', imgAlt);
            currentIndex = index;
            prevBtn.style.display = (index === 0) ? 'none' : 'grid';
            nextBtn.style.display = (index === galleryItems.length - 1) ? 'none' : 'grid';
        };

        const openLightbox = (e, index) => {
            e.preventDefault();
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => openLightbox(e, index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox.querySelector('.lightbox__backdrop')) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) showImage(currentIndex - 1);
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
                if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
            }
        });
    }
});