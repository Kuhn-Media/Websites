'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- Header & Navigation --- //
    const header = document.getElementById('site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-in-up, .reveal-fade-in-left, .reveal-fade-in-right, .reveal-stagger');
    const staggerElements = document.querySelectorAll('.reveal-stagger');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        if (!el.classList.contains('reveal-stagger')) {
            observer.observe(el);
        }
    });

    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const elements = Array.from(entry.target.parentElement.querySelectorAll('.reveal-stagger'));
                elements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, index * 150);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe only the first stagger element in each group
    const observedStaggerGroups = new Set();
    staggerElements.forEach(el => {
        const parent = el.parentElement;
        if (!observedStaggerGroups.has(parent)) {
            staggerObserver.observe(el);
            observedStaggerGroups.add(parent);
        }
    });

    // --- Testimonials Carousel --- //
    const carousel = document.getElementById('testimonials-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const nextBtn = document.querySelector('.carousel-button.next');
        const prevBtn = document.querySelector('.carousel-button.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
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

        updateCarousel();
    }

    // --- Accordion --- //
    const accordions = document.querySelectorAll('.accordion-item');
    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.padding = '0 var(--spacing-s)';
            } else {
                content.style.maxHeight = '0';
                content.style.padding = '0 var(--spacing-s)';
            }
        });
    });

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            const heroSection = document.querySelector('.hero, .hero-subpage');
            if (heroSection && window.scrollY > heroSection.offsetHeight) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.remove('hidden');
        } else {
            cookieBanner.classList.add('hidden');
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.add('hidden');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex;

    if (lightbox && galleryItems.length > 0) {
        const images = Array.from(galleryItems).map(item => item.querySelector('img'));

        const showImage = (index) => {
            const img = images[index];
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            currentImageIndex = index;
            lightbox.classList.add('visible');
            document.body.style.overflow = 'hidden';
        };

        const hideLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.style.overflow = '';
        };

        const showNext = () => showImage((currentImageIndex + 1) % images.length);
        const showPrev = () => showImage((currentImageIndex - 1 + images.length) % images.length);

        images.forEach((img, index) => {
            img.parentElement.addEventListener('click', () => showImage(index));
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', hideLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) hideLightbox();
        });

        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') hideLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });
    }

    // --- Signature Interaction Hotspots --- //
    const hotspots = document.querySelectorAll('.hotspot');
    const hotspotContentBox = document.getElementById('hotspot-content-box');
    if (hotspots.length > 0 && hotspotContentBox) {
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', () => {
                const targetId = hotspot.dataset.hotspot;
                const targetContent = document.getElementById(`${targetId}-content`);

                // Deactivate all
                hotspots.forEach(h => h.classList.remove('active'));
                hotspotContentBox.querySelectorAll('.hotspot-info').forEach(info => info.classList.remove('active'));

                // Activate current
                hotspot.classList.add('active');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
        // Activate first one by default
        if (hotspots[0]) hotspots[0].click();
    }

    // --- Contact Form Subject Sync --- //
    const urlParams = new URLSearchParams(window.location.search);
    const anliegen = urlParams.get('anliegen');
    if (anliegen) {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            subjectSelect.value = anliegen;
        }
    }

    // --- Datenschutz Date --- //
    const dateElement = document.getElementById('last-updated-date');
    if (dateElement) {
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
    }
});