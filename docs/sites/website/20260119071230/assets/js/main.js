document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('#main-menu');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('is-open');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
    }

    // --- 2. Sticky Header --- //
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

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. Carousel --- //
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            const scrollAmount = slides[currentIndex].offsetLeft - carousel.offsetLeft;
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        // Update on scroll for swipe gestures
        carousel.addEventListener('scroll', () => {
            const scrollLeft = carousel.scrollLeft;
            const slideWidth = slides[0].offsetWidth;
            const newIndex = Math.round(scrollLeft / slideWidth);
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateDots();
            }
        });

        updateDots();
    }

    // --- 5. Sticky CTA --- //
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
        }, { threshold: 0.1, rootMargin: '-200px 0px 0px 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- 6. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        // Check if consent was already given
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.hidden = false;
            }, 1500);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.opacity = '0';
            setTimeout(() => {
                cookieBanner.hidden = true;
            }, 300);
        });
    }

});