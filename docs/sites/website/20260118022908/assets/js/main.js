document.addEventListener('DOMContentLoaded', function() {

    // 1. Sticky Header
    const header = document.querySelector('.sticky-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile Navigation
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.querySelector('.mobile-nav-drawer');
    const navClose = document.querySelector('.mobile-nav-close');
    const navOverlay = document.querySelector('.mobile-nav-overlay');

    if (navToggle && navDrawer && navClose && navOverlay) {
        const openNav = () => {
            navDrawer.classList.add('open');
            navOverlay.classList.add('open');
            navToggle.setAttribute('aria-expanded', 'true');
            navDrawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeNav = () => {
            navDrawer.classList.remove('open');
            navOverlay.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navDrawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        navToggle.addEventListener('click', openNav);
        navClose.addEventListener('click', closeNav);
        navOverlay.addEventListener('click', closeNav);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
                closeNav();
            }
        });
    }

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    let staggerIndex = 0;
    revealElements.forEach(el => {
        if (el.classList.contains('reveal-stagger')) {
            el.dataset.delay = staggerIndex * 150;
            staggerIndex++;
        }
        observer.observe(el);
    });

    // 4. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = 0;
            }
        });
        // Set initial state for transition
        answer.style.maxHeight = 0;
    });

    // 5. Testimonial Carousel
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
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

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel(); // Initial call
    }

    // 6. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // 7. Sticky CTA
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                stickyCta.classList.add('visible');
                stickyCta.setAttribute('aria-hidden', 'false');
            } else {
                stickyCta.classList.remove('visible');
                stickyCta.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // 8. Lightbox
    const lightbox = document.getElementById('lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            const imgSrc = item.getAttribute('href');
            const imgAlt = item.dataset.alt || 'Galeriebild';
            lightboxImg.setAttribute('src', imgSrc);
            lightboxImg.setAttribute('alt', imgAlt);
            currentIndex = index;
        };

        const openLightbox = (e, index) => {
            e.preventDefault();
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => openLightbox(e, index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % galleryItems.length;
            showImage(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(prevIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') nextBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
            }
        });
    }

});