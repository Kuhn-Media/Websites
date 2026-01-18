document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Menu --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuClose = document.querySelector('.mobile-menu-close');
    const drawer = document.querySelector('.mobile-menu-drawer');

    if (menuToggle && drawer) {
        menuToggle.addEventListener('click', () => {
            drawer.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (menuClose && drawer) {
        menuClose.addEventListener('click', () => {
            drawer.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // --- Intersection Observer for Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Carousel --- //
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(initCarousel);

    function initCarousel(wrapper) {
        const container = wrapper.querySelector('.carousel-container');
        const slides = wrapper.querySelectorAll('.carousel-slide');
        const prevButton = wrapper.querySelector('.carousel-button.prev');
        const nextButton = wrapper.querySelector('.carousel-button.next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(prevButton) prevButton.style.display = 'none';
            if(nextButton) nextButton.style.display = 'none';
            return;
        }

        function updateCarousel() {
            container.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
        updateCarousel();
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.querySelector('.sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
    
    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

});