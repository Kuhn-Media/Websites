document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('#main-nav-list');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            mainNav.classList.toggle('open');
            navToggle.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- FAQ Accordion ---
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
    
    // --- Sticky CTA Bar ---
    const stickyBar = document.getElementById('sticky-cta-bar');
    if (stickyBar) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero is NOT intersecting (user has scrolled down)
                if (!entry.isIntersecting) {
                    stickyBar.classList.add('visible');
                } else {
                    stickyBar.classList.remove('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '-200px 0px 0px 0px' });
        
        const heroSection = document.querySelector('.hero'); // Target first hero/main section
        if(heroSection) scrollObserver.observe(heroSection);
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }
    
    // --- Lightbox Gallery ---
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    if (gallery && lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            if (item) {
                lightboxImg.src = item.href;
                lightboxImg.alt = item.querySelector('img').alt;
                currentIndex = index;
                lightbox.classList.add('visible');
            }
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        const closeLightbox = () => lightbox.classList.remove('visible');
        const prevImage = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        const nextImage = () => showImage((currentIndex + 1) % galleryItems.length);

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);
        lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevImage();
                if (e.key === 'ArrowRight') nextImage();
            }
        });
    }

});