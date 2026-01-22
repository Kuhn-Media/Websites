document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.querySelector('.mobile-nav-drawer');
    const navBackdrop = document.querySelector('.mobile-nav-backdrop');
    const navClose = document.querySelector('.mobile-nav-close');

    const openMenu = () => {
        navDrawer.classList.add('is-open');
        navDrawer.setAttribute('aria-hidden', 'false');
        navBackdrop.classList.add('is-visible');
        document.body.classList.add('no-scroll');
    };

    const closeMenu = () => {
        navDrawer.classList.remove('is-open');
        navDrawer.setAttribute('aria-hidden', 'true');
        navBackdrop.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');
    };

    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', () => {
            if (navDrawer.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navClose.addEventListener('click', closeMenu);
        navBackdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
                closeMenu();
            }
        });
        navDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

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

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger effect for elements inside a .stagger container
                if (entry.target.classList.contains('stagger')) {
                    entry.target.querySelectorAll('.card, .feature-card').forEach((child, index) => {
                        child.style.transitionDelay = `${index * 100}ms`;
                        child.classList.add('visible');
                    });
                } else {
                     entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

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
        const heroSection = document.querySelector('.hero');
        const footer = document.querySelector('.site-footer');
        if (heroSection && footer) {
            const showAt = heroSection.offsetHeight;
            const hideAt = document.body.offsetHeight - footer.offsetHeight - window.innerHeight;

            window.addEventListener('scroll', () => {
                if (window.scrollY > showAt && window.scrollY < hideAt) {
                    stickyCTA.classList.add('is-visible');
                } else {
                    stickyCTA.classList.remove('is-visible');
                }
            });
        }
    }

    // --- Carousel ---
    const carousels = document.querySelectorAll('.gallery-carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.gallery-carousel');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        const items = carousel.querySelectorAll('.carousel-item');
        let currentIndex = 0;

        function updateCarousel() {
            const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight);
            carousel.scrollTo({ left: currentIndex * itemWidth, behavior: 'smooth' });
            updateDots();
        }

        function updateDots() {
            dotsContainer.innerHTML = '';
            items.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.toggle('active', index === currentIndex);
                button.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(button);
            });
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
        });

        updateDots();
        // Add click to open lightbox
        items.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });
    });

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const galleryImages = Array.from(document.querySelectorAll('.gallery-carousel img'));
    let currentLightboxIndex = 0;

    function openLightbox(index) {
        currentLightboxIndex = index;
        updateLightboxImage();
        lightbox.classList.add('is-visible');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    function updateLightboxImage() {
        const img = galleryImages[currentLightboxIndex];
        lightboxContent.innerHTML = `<img src='${img.src}' alt='${img.alt}'>`;
    }

    function showPrevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => e.target === lightbox && closeLightbox());
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }
});