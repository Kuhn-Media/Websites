document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
    const header = document.querySelector('.sticky-header');
    if (header) {
        const scrollThreshold = 50;
        const onScroll = () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- 2. Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.querySelector('#mobile-nav-drawer');
    const navClose = document.querySelector('.mobile-nav-close');

    if (navToggle && navDrawer) {
        const openDrawer = () => {
            navDrawer.classList.add('open');
            navDrawer.setAttribute('aria-hidden', 'false');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('drawer-open');
            navClose.focus();
        };

        const closeDrawer = () => {
            navDrawer.classList.remove('open');
            navDrawer.setAttribute('aria-hidden', 'true');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('drawer-open');
            navToggle.focus();
        };

        navToggle.addEventListener('click', openDrawer);
        navClose.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
                closeDrawer();
            }
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
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

    // --- 4. FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    });

    // --- 5. Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        // Basic swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });

        // Initialize first slide and dots
        if (slides.length > 0) {
            slides.forEach(s => s.style.flex = '0 0 100%');
            carousel.style.display = 'flex';
            carousel.style.transition = 'transform 0.5s ease-in-out';
            goToSlide(0);
        }
    }

    // --- 6. Gallery Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;
        const galleryItems = Array.from(lightboxTriggers);

        const showImage = (index) => {
            const item = galleryItems[index];
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt;
            currentIndex = index;
        };

        const openLightbox = (e, index) => {
            e.preventDefault();
            lightbox.hidden = false;
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            showImage(index);
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            galleryItems[currentIndex].focus();
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => openLightbox(e, index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
        nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- 7. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('visible'), 100);
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookie_consent', consent);
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- 8. Sticky CTA Bar --- //
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting) {
                    stickyCtaBar.hidden = false;
                    stickyCtaBar.classList.add('visible');
                } else {
                    stickyCtaBar.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});