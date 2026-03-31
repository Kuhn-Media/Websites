document.addEventListener('DOMContentLoaded', () => {

    // Sticky Header
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

    // Mobile Navigation
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.getElementById('mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

    const openMobileNav = () => {
        if (mobileNavContainer) {
            mobileNavContainer.style.display = 'block';
            document.body.style.overflow = 'hidden';
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        }
    };

    const closeMobileNav = () => {
        if (mobileNavContainer) {
            mobileNavContainer.style.display = 'none';
            document.body.style.overflow = '';
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (mobileNavToggle && mobileNavContainer) {
        mobileNavToggle.addEventListener('click', openMobileNav);
        mobileNavClose.addEventListener('click', closeMobileNav);
        mobileNavBackdrop.addEventListener('click', closeMobileNav);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavContainer.style.display === 'block') {
                closeMobileNav();
            }
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.display = isExpanded ? 'none' : 'block';
        });
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.style.getPropertyValue('--stagger-delay') || '0s';
                entry.target.style.transitionDelay = delay;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.style.display = 'none';
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.style.display = 'none';
        });
    }
    
    // Sticky CTA
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.style.opacity = '1';
                stickyCta.style.pointerEvents = 'auto';
            } else {
                stickyCta.style.opacity = '0';
                stickyCta.style.pointerEvents = 'none';
            }
        });
    }

    // Lightbox
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const lightboxClose = document.querySelector('.km-lightbox-close');
    const lightboxPrev = document.querySelector('.km-lightbox-prev');
    const lightboxNext = document.querySelector('.km-lightbox-next');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    function showImage(index) {
        const item = galleryItems[index];
        const imagePath = item.getAttribute('data-km-image-path');
        const imageAlt = item.getAttribute('data-km-image-alt');
        lightboxImage.src = imagePath;
        lightboxImage.alt = imageAlt;
        currentIndex = index;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
        showImage(currentIndex);
    }

    function showNext() {
        currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
        showImage(currentIndex);
    }

    if (galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('km-lightbox-backdrop')) {
                closeLightbox();
            }
        });
        lightboxPrev.addEventListener('click', showPrev);
        lightboxNext.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

});