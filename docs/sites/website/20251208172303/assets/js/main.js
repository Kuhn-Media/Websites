// JS
document.addEventListener('DOMContentLoaded', () => {

    // Sticky Header
    const header = document.querySelector('.km-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Navigation
    const burger = document.querySelector('.km-burger');
    const nav = document.querySelector('.km-nav');
    burger.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
        nav.classList.toggle('is-active');
    });
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
            nav.classList.remove('is-active');
        });
    });

    // Scroll Reveal
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Menu Tabs
    const tabContainer = document.querySelector('.km-tabs');
    if (tabContainer) {
        const tabButtons = tabContainer.querySelectorAll('.km-tab-btn');
        const tabContents = tabContainer.querySelectorAll('.km-tab-content');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                tabContents.forEach(content => {
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.km-faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.km-faq-question');
        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            // Optional: close all others
            // faqItems.forEach(i => i.classList.remove('active'));
            if (!wasActive) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    // Lightbox
    const lightbox = document.querySelector('.km-lightbox');
    const lightboxImage = lightbox.querySelector('.km-lightbox-image');
    const lightboxClose = lightbox.querySelector('.km-lightbox-close');
    const galleryItems = document.querySelectorAll('.km-gallery-item img');

    const openLightbox = (src, alt) => {
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    galleryItems.forEach(img => {
        img.parentElement.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 80; // Header height
                const top = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});