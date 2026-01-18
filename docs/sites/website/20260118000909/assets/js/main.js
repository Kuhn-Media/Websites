document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
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

    // --- 2. Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav-drawer');
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            mobileNav.classList.toggle('open');
            mobileNav.setAttribute('aria-hidden', !isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-item, .reveal-group');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Staggered delay for cards/steps
                    if (entry.target.parentElement.matches('.card-grid-3, .process-steps, .values-grid, .gallery-grid')) {
                        const items = Array.from(entry.target.parentElement.children);
                        const itemIndex = items.indexOf(entry.target);
                        entry.target.style.setProperty('--stagger-delay', `${itemIndex * 100}ms`);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 4. Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
            slides.forEach((slide, index) => {
                slide.setAttribute('aria-hidden', index !== currentIndex);
            });
        };

        // Create dots
        slides.forEach((_, i) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            button.setAttribute('aria-label', `Gehe zu Stimme ${i + 1}`);
            dotsNav.appendChild(button);
            button.addEventListener('click', () => moveToSlide(i));
        });
        const dots = Array.from(dotsNav.children);

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        // Touch controls
        let touchstartX = 0;
        let touchendX = 0;
        track.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        track.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX && currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
            if (touchendX > touchstartX && currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        moveToSlide(0); // Initialize
    }

    // --- 5. Project Gallery Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxTitle = lightbox.querySelector('figcaption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const galleryItems = Array.from(lightboxTriggers);

        const showImage = (index) => {
            const item = galleryItems[index];
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt;
            lightboxTitle.textContent = item.dataset.title;
            currentIndex = index;
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === galleryItems.length - 1 ? 'none' : 'block';
        };

        const openLightbox = (e, index) => {
            e.preventDefault();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            showImage(index);
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => openLightbox(e, index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
                if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
            }
        });
    }

    // --- 6. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }, 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('visible');
        cookieBanner.setAttribute('aria-hidden', 'true');
    }

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

    // --- 7. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                    stickyCTA.setAttribute('aria-hidden', 'false');
                } else {
                    stickyCTA.classList.remove('visible');
                    stickyCTA.setAttribute('aria-hidden', 'true');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});