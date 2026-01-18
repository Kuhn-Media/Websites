document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER --- //
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

    // --- MOBILE NAVIGATION --- //
    const mobileNavToggleButtons = document.querySelectorAll('.mobile-nav-toggle');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

    if (mobileNavToggleButtons.length > 0 && mobileNavDrawer) {
        mobileNavToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const isExpanded = mobileNavDrawer.getAttribute('aria-hidden') === 'false';
                mobileNavDrawer.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
                document.body.classList.toggle('mobile-nav-open');
                mobileNavToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', !isExpanded));
            });
        });

        if (mobileNavOverlay) {
            mobileNavOverlay.addEventListener('click', () => {
                mobileNavDrawer.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('mobile-nav-open');
                mobileNavToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
                mobileNavDrawer.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('mobile-nav-open');
                mobileNavToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- FAQ ACCORDION --- //
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

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
        
        // Touch support
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });

        updateCarousel();
    }

    // --- INTERACTIVE HOUSE --- //
    const houseAreas = document.querySelectorAll('.house-area');
    if (houseAreas.length > 0) {
        houseAreas.forEach(area => {
            area.addEventListener('click', () => {
                const areaId = area.dataset.area;
                document.querySelectorAll('.house-area').forEach(a => a.classList.remove('active'));
                area.classList.add('active');
                document.querySelectorAll('.house-text-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`content-${areaId}`).classList.add('active');
            });
        });
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

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

    // --- STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            scrollObserver.observe(heroSection);
        }
    }

    // --- LIGHTBOX GALLERY --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex;

    if (lightbox && galleryImages.length > 0) {
        const imageSources = Array.from(galleryImages).map(img => ({ src: img.src, alt: img.alt }));

        const openLightbox = (index) => {
            currentImageIndex = index;
            lightboxImg.src = imageSources[currentImageIndex].src;
            lightboxImg.alt = imageSources[currentImageIndex].alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : imageSources.length - 1;
            lightboxImg.src = imageSources[currentImageIndex].src;
            lightboxImg.alt = imageSources[currentImageIndex].alt;
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex < imageSources.length - 1) ? currentImageIndex + 1 : 0;
            lightboxImg.src = imageSources[currentImageIndex].src;
            lightboxImg.alt = imageSources[currentImageIndex].alt;
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
        document.querySelector('.lightbox-next').addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }
});