document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const navClose = document.querySelector('.mobile-nav-close');

    const openNav = () => {
        mobileNav.classList.add('is-open');
        mobileNav.setAttribute('aria-hidden', 'false');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('nav-open');
    };

    const closeNav = () => {
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
    };

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', openNav);
        if(navClose) navClose.addEventListener('click', closeNav);
        
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('body.nav-open::after')) {
                closeNav();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                closeNav();
            }
        });
    }

    // --- FAQ Accordion ---
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

    // --- Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.querySelector('.cookie-accept');

    if (cookieBanner && acceptCookies) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.hidden = false;
        }

        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCTA.classList.add('is-visible');
                stickyCTA.hidden = false;
            } else {
                stickyCTA.classList.remove('is-visible');
            }
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const galleryItems = Array.from(document.querySelectorAll('[data-lightbox="gallery"]'));
    let currentIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        const showImage = (index) => {
            const item = galleryItems[index];
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt;
            currentIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const index = galleryItems.indexOf(e.currentTarget);
            lightbox.hidden = false;
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
        };

        const showPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
            showImage(currentIndex);
        };

        const showNext = () => {
            currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
            showImage(currentIndex);
        };

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});