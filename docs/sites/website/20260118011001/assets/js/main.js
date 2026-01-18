document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER ---
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(
            ([e]) => header.classList.toggle('sticky', e.intersectionRatio < 1),
            { threshold: [1] }
        );
        // Create a dummy element to observe
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        document.body.insertAdjacentElement('beforebegin', sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

    if (mobileNavToggle && mobileNavMenu) {
        const openMenu = () => {
            document.body.classList.add('mobile-nav-open');
            mobileNavMenu.classList.add('open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            document.body.classList.remove('mobile-nav-open');
            mobileNavMenu.classList.remove('open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        };

        mobileNavToggle.addEventListener('click', () => {
            if (document.body.classList.contains('mobile-nav-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);
        if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
                closeMenu();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealItems = document.querySelectorAll('.reveal-item');
    if (revealItems.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(item => {
            revealObserver.observe(item);
        });
    }

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            const offset = -currentIndex * slides[0].offsetWidth;
            carousel.style.transform = `translateX(${offset}px)`;
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function createDots() {
            if (!dotsContainer) return;
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('dot');
                button.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(button);
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

        // Touch/Swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX) {
                // Swiped left
                currentIndex = (currentIndex + 1) % slides.length;
            }
            if (touchEndX > touchStartX) {
                // Swiped right
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            }
            updateCarousel();
        }

        createDots();
        updateCarousel();
        window.addEventListener('resize', updateCarousel); // Adjust on resize
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }
});