document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealItems.forEach(item => revealObserver.observe(item));

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCta.classList.add('show');
                } else {
                    stickyCta.classList.remove('show');
                }
            });
        }, { threshold: 0 });
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Carousel & Lightbox --- //
    const carousel = document.getElementById('image-carousel');
    const lightbox = document.getElementById('lightbox');

    if (carousel && lightbox) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.parentElement.querySelector('.next');
        const prevButton = carousel.parentElement.querySelector('.prev');
        const dotsNav = carousel.parentElement.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
            updateArrows();
        };

        const updateDots = (targetIndex) => {
            const currentDot = dotsNav.querySelector('.active');
            if(currentDot) currentDot.classList.remove('active');
            dotsNav.children[targetIndex].classList.add('active');
        };

        const updateArrows = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
        };

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(dot);
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        moveToSlide(0);

        // Lightbox Logic
        const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        let currentImageIndex = 0;
        const galleryImages = Array.from(lightboxTriggers).map(img => img.src);

        const showImage = (index) => {
            lightboxImg.src = galleryImages[index];
            currentImageIndex = index;
            lightboxPrev.style.display = index === 0 ? 'none' : 'block';
            lightboxNext.style.display = index === galleryImages.length - 1 ? 'none' : 'block';
        };

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => {
                lightbox.classList.add('show');
                lightbox.setAttribute('aria-hidden', 'false');
                showImage(index);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        lightboxNext.addEventListener('click', () => { if(currentImageIndex < galleryImages.length - 1) showImage(currentImageIndex + 1); });
        lightboxPrev.addEventListener('click', () => { if(currentImageIndex > 0) showImage(currentImageIndex - 1); });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight' && currentImageIndex < galleryImages.length - 1) showImage(currentImageIndex + 1);
                if (e.key === 'ArrowLeft' && currentImageIndex > 0) showImage(currentImageIndex - 1);
            }
        });
    }

});