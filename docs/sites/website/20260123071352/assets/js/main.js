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
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNavList = document.querySelector('#main-nav-list');
    if (navToggle && mainNavList) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNavList.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
        });
    }

    // --- Intersection Observer for Animations ---
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-group > *');
    const observer = new IntersectionObserver((entries, observer) => {
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

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Accordion Component ---
    document.querySelectorAll('[data-component="accordion"]').forEach(accordion => {
        accordion.addEventListener('click', (e) => {
            const question = e.target.closest('.faq-question');
            if (question) {
                const item = question.parentElement;
                const answer = item.querySelector('.faq-answer');
                const isExpanded = question.getAttribute('aria-expanded') === 'true';

                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            }
        });
    });

    // --- Before/After Slider Component ---
    document.querySelectorAll('[data-component="before-after-slider"]').forEach(slider => {
        const range = slider.querySelector('.slider-range');
        const afterImage = slider.querySelector('.after');
        const handle = slider.querySelector('.slider-handle');
        if (range && afterImage && handle) {
            range.addEventListener('input', (e) => {
                const value = e.target.value;
                afterImage.style.width = `${value}%`;
                handle.style.left = `${value}%`;
            });
        }
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const cookieConsent = localStorage.getItem('cookie_consent');

    if (!cookieConsent && cookieBanner) {
        cookieBanner.hidden = false;
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.hidden = false;
                    setTimeout(() => stickyCTA.classList.add('visible'), 10);
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
    
    // --- Lightbox Gallery ---
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightbox = document.getElementById('lightbox');
    if (galleryImages.length > 0 && lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const imgElement = galleryImages[index];
            const imgSrc = imgElement.src;
            const imgAlt = imgElement.alt;
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            currentIndex = index;
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                lightbox.hidden = false;
                showImage(index);
            });
        });

        lightboxClose.addEventListener('click', () => lightbox.hidden = true);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.hidden = true;
        });

        lightboxPrev.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            showImage(newIndex);
        });

        lightboxNext.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % galleryImages.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') lightbox.hidden = true;
                if (e.key === 'ArrowLeft') lightboxPrev.click();
                if (e.key === 'ArrowRight') lightboxNext.click();
            }
        });
    }
});