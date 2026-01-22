document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    const openMenu = () => {
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        mobileNavDrawer.classList.add('is-open');
        mobileNavDrawer.setAttribute('aria-hidden', 'false');
        mobileNavBackdrop.classList.add('is-visible');
        document.body.classList.add('no-scroll');
        mobileNavDrawer.querySelector('a, button').focus();
    };

    const closeMenu = () => {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavDrawer.classList.remove('is-open');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
        mobileNavBackdrop.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');
        mobileNavToggle.focus();
    };

    if (mobileNavToggle && mobileNavDrawer && mobileNavBackdrop) {
        mobileNavToggle.addEventListener('click', openMenu);
        mobileNavClose.addEventListener('click', closeMenu);
        mobileNavBackdrop.addEventListener('click', closeMenu);
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavDrawer.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }
    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Carousel --- //
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slides = Array.from(carouselContainer.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            const targetSlide = slides[targetIndex];
            carouselContainer.scrollTo({
                left: targetSlide.offsetLeft - carouselContainer.offsetLeft,
                behavior: 'smooth'
            });
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
        };

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        // Update active dot on scroll
        carouselContainer.addEventListener('scroll', () => {
            const scrollLeft = carouselContainer.scrollLeft;
            const containerWidth = carouselContainer.getBoundingClientRect().width;
            const newIndex = Math.round(scrollLeft / containerWidth);
            if(newIndex !== currentIndex) {
                 currentIndex = Math.round(scrollLeft / slides[0].getBoundingClientRect().width);
                 updateControls();
            }
        });

        updateControls();
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let currentImageIndex = 0;
        const galleryImages = Array.from(lightboxTriggers).map(trigger => trigger.src);

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            lightboxImg.src = galleryImages[index];
            currentImageIndex = index;
        };

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => {
                lightbox.classList.add('visible');
                showImage(index);
            });
        });

        lightboxClose.addEventListener('click', () => lightbox.classList.remove('visible'));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('visible');
        });
        lightboxPrev.addEventListener('click', () => showImage(currentImageIndex - 1));
        lightboxNext.addEventListener('click', () => showImage(currentImageIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') lightbox.classList.remove('visible');
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- Magnetic Buttons (WOW Effect) --- //
    const magneticItems = document.querySelectorAll('.magnetic-item');
    const strength = 25;

    magneticItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            item.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translate(0,0)';
        });
    });
});