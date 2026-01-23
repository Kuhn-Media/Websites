document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('is-open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        const observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px' });
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        header.insertAdjacentElement('afterend', sentinel);
        observer.observe(sentinel);
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.revealDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Carousel ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = wrapper.querySelector('.carousel-btn.next');
        const prevButton = wrapper.querySelector('.carousel-btn.prev');
        const dotsNav = wrapper.querySelector('.carousel-dots');
        if (!track || slides.length === 0) return;

        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            if (prevButton) prevButton.disabled = currentIndex === 0;
            if (nextButton) nextButton.disabled = currentIndex === slides.length - 1;
            if (dotsNav) {
                const currentDot = dotsNav.querySelector('.active');
                if(currentDot) currentDot.classList.remove('active');
                dotsNav.children[currentIndex].classList.add('active');
            }
        };

        if (dotsNav) {
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('carousel-dot');
                button.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(button);
            });
        }

        if (nextButton) nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
        if (prevButton) prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));

        // Auto-resize
        const handleResize = () => {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            track.style.transition = 'none';
            track.style.transform = 'translateX(-' + (newSlideWidth * currentIndex) + 'px)';
            setTimeout(() => { track.style.transition = ''; }, 0);
        };
        window.addEventListener('resize', handleResize);

        updateControls();
    });

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('[data-lightbox]');
    let currentImageIndex;

    if (lightbox && lightboxImg && galleryItems.length > 0) {
        const galleryImageSources = Array.from(galleryItems).map(item => item.getAttribute('href'));

        const openLightbox = (index) => {
            currentImageIndex = index;
            lightboxImg.setAttribute('src', galleryImageSources[currentImageIndex]);
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        const showNextImage = () => openLightbox((currentImageIndex + 1) % galleryImageSources.length);
        const showPrevImage = () => openLightbox((currentImageIndex - 1 + galleryImageSources.length) % galleryImageSources.length);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('show'), 100);
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta && window.location.pathname.indexOf('kontakt') === -1) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            stickyCta.classList.toggle('show', !entry.isIntersecting);
        }, { threshold: 0 });
        const heroSection = document.querySelector('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }
});