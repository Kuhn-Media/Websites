document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.querySelector('.mobile-nav-drawer');
    const navBackdrop = document.querySelector('.mobile-nav-backdrop');
    const navClose = document.querySelector('.mobile-nav-close');
    const navLinks = document.querySelectorAll('.mobile-nav a');

    const openNav = () => {
        document.body.classList.add('mobile-nav-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navDrawer.setAttribute('aria-hidden', 'false');
        navDrawer.querySelector('a').focus();
    };

    const closeNav = () => {
        document.body.classList.remove('mobile-nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navDrawer.setAttribute('aria-hidden', 'true');
        navToggle.focus();
    };

    if (navToggle) {
        navToggle.addEventListener('click', openNav);
        navClose.addEventListener('click', closeNav);
        navBackdrop.addEventListener('click', closeNav);
        navLinks.forEach(link => link.addEventListener('click', closeNav));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
                closeNav();
            }
        });
    }

    // --- Sticky Header ---
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

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.staggerDelay || '0', 10);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting && window.scrollY > 400) {
                    stickyCTA.classList.add('is-visible');
                } else {
                    stickyCTA.classList.remove('is-visible');
                }
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Accordion ---
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
    
    // --- Parallax Hero BG ---
    const parallaxBg = document.querySelector('.hero-bg-parallax');
    if (parallaxBg && window.matchMedia('(min-width: 769px) and (prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', () => {
            const offset = window.pageYOffset;
            parallaxBg.style.transform = `translateY(${offset * 0.3}px)`;
        });
    }

    // --- Carousel ---
    const carousel = document.getElementById('image-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.parentElement.querySelector('.carousel-prev');
        const nextBtn = carousel.parentElement.querySelector('.carousel-next');
        const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.scrollTo({ left: slides[currentIndex].offsetLeft, behavior: 'smooth' });
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.children;
            for (let i = 0; i < dots.length; i++) {
                dots[i].classList.toggle('active', i === currentIndex);
            }
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        updateDots();
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt;
            currentIndex = index;
        };

        const openLightbox = (e, index) => {
            e.preventDefault();
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => openLightbox(e, index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-visible')) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            showImage(currentIndex);
        });
    }
});