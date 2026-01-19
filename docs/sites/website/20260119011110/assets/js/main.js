document.addEventListener('DOMContentLoaded', function() {

    // 1. Sticky Header
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

    // 2. Mobile Navigation
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navList = document.getElementById('main-nav-list');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = mainNav.getAttribute('data-visible') === 'true';
            mainNav.setAttribute('data-visible', !isVisible);
            navToggle.setAttribute('aria-expanded', !isVisible);
            document.body.style.overflow = !isVisible ? 'hidden' : '';
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.getAttribute('data-visible') === 'true') {
                navToggle.click();
            }
        });
    }

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-stagger');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // 4. Carousel
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        const dotsNav = document.querySelector('.carousel-dots');

        let isDragging = false, startX, scrollLeft;
        let currentIndex = 0;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Gehe zu Bild ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        const updateCarousel = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            const offset = slides[0].style.marginRight;
            const offsetValue = offset ? parseInt(offset, 10) : 20;
            carousel.style.transform = `translateX(-${currentIndex * (slideWidth + offsetValue)}px)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        const goToSlide = (index) => {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex >= slides.length) currentIndex = slides.length - 1;
            updateCarousel();
        };

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        // Drag functionality
        const dragStart = (e) => {
            isDragging = true;
            carousel.classList.add('is-dragging');
            startX = e.pageX || e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        };

        const dragging = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX || e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast
            carousel.scrollLeft = scrollLeft - walk;
        };

        const dragStop = () => {
            isDragging = false;
            carousel.classList.remove('is-dragging');
        };

        // carousel.addEventListener('mousedown', dragStart);
        // carousel.addEventListener('mousemove', dragging);
        // document.addEventListener('mouseup', dragStop);
        // carousel.addEventListener('mouseleave', dragStop);
        // carousel.addEventListener('touchstart', dragStart);
        // carousel.addEventListener('touchmove', dragging);
        // carousel.addEventListener('touchend', dragStop);
        
        window.addEventListener('resize', updateCarousel);
    }

    // 5. Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const footer = document.querySelector('.site-footer-main');
        if (heroSection && footer) {
            const showAt = heroSection.offsetHeight;
            const hideAt = document.body.offsetHeight - footer.offsetHeight - window.innerHeight;

            window.addEventListener('scroll', () => {
                if (window.scrollY > showAt && window.scrollY < hideAt) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }
    }

    // 6. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && acceptButton && declineButton) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            setTimeout(() => {
                cookieBanner.hidden = false;
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('visible');
        });

        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }
});