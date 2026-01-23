document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const body = document.body;
    navToggle.addEventListener('click', () => {
        body.classList.toggle('nav-open');
    });

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.scroll-reveal, .animate-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion --- //
    const detailsElements = document.querySelectorAll('.faq-accordion details');
    detailsElements.forEach(details => {
        details.addEventListener('toggle', function() {
            if (this.open) {
                detailsElements.forEach(otherDetails => {
                    if (otherDetails !== this && otherDetails.open) {
                        otherDetails.removeAttribute('open');
                    }
                });
            }
        });
    });

    // --- Sticky CTA Bar --- //
    const stickyBar = document.querySelector('.sticky-cta-bar');
    if (stickyBar) {
        const showBarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyBar.classList.add('visible');
                } else {
                    stickyBar.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) showBarObserver.observe(heroSection);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
        cookieBanner.classList.add('visible');
    }
    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Simple Carousel for 'Technik, die man versteht' --- //
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const wrapper = carouselContainer.querySelector('.carousel-wrapper');
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const nextBtn = carouselContainer.querySelector('.carousel-next');
        const prevBtn = carouselContainer.querySelector('.carousel-prev');
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        function updateCarousel() {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    // --- Lightbox for Project Gallery --- //
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex;

        const showImage = (index) => {
            const item = galleryItems[index];
            lightboxImg.src = item.dataset.src;
            lightboxImg.alt = item.dataset.alt;
            currentIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.classList.add('active');
                showImage(index);
            });
        });

        const closeLightbox = () => lightbox.classList.remove('active');
        const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNext = () => showImage((currentIndex + 1) % galleryItems.length);

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

});