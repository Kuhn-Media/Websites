document.addEventListener('DOMContentLoaded', function() {

    // --- REDUCED MOTION CHECK --- //
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', () => {
        prefersReducedMotion = motionQuery.matches;
    });

    // --- STICKY HEADER --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

    // --- MOBILE NAVIGATION --- //
    const navToggle = document.querySelector('.nav-toggle');
    const mainMenu = document.querySelector('#main-menu');
    if (navToggle && mainMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('is-open');
            mainMenu.classList.toggle('is-open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- SCROLL REVEAL ANIMATIONS --- //
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-in-right, .reveal-stagger-children');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (entry.target.classList.contains('reveal-stagger-children')) {
                        const children = entry.target.children;
                        for (let i = 0; i < children.length; i++) {
                            children[i].style.setProperty('--stagger-index', i);
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- CAROUSEL --- //
    const carousel = document.getElementById('impressions-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = carousel.parentElement.querySelector('.carousel-button.prev');
        const nextButton = carousel.parentElement.querySelector('.carousel-button.next');
        const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
        let currentIndex = 0;

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Gehe zu Bild ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        };

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            updateCarousel();
        };

        prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

        createDots();
        goToSlide(0);
    }

    // --- ACCORDION (FAQ) --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
        });
    });

    // --- STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const handleStickyCTA = () => {
            const hero = document.querySelector('.hero');
            if (hero && window.scrollY > hero.offsetHeight) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleStickyCTA);
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }
        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('visible');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // --- LIGHTBOX GALLERY --- //
    const gallery = document.getElementById('lightbox-gallery');
    const lightbox = document.getElementById('lightbox');
    if (gallery && lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        const galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            if (!item) return;
            currentIndex = index;
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        const hideLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        lightboxClose.addEventListener('click', hideLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) hideLightbox();
        });
        lightboxPrev.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
        lightboxNext.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowLeft') lightboxPrev.click();
                if (e.key === 'ArrowRight') lightboxNext.click();
            }
        });
    }
});