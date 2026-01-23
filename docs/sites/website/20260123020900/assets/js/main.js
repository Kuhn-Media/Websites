document.addEventListener('DOMContentLoaded', function() {

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
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
        // Close on click outside
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('nav-open') && !e.target.closest('.site-header')) {
                 document.body.classList.remove('nav-open');
                 navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealStaggerItems = document.querySelectorAll('.reveal-item-stagger');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealItems.forEach(item => observer.observe(item));

    revealStaggerItems.forEach(container => {
        const items = container.children;
        for (let i = 0; i < items.length; i++) {
            items[i].classList.add('reveal-item');
            items[i].style.transitionDelay = `${i * 100}ms`;
            observer.observe(items[i]);
        }
    });

    // --- 4. Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const wrapper = carousel.querySelector('.carousel-wrapper');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const dotsContainer = carousel.querySelector('.dots');
        let currentIndex = 0;

        function updateCarousel() {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (index === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;
        
        wrapper.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        wrapper.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });

        updateCarousel();
    }

    // --- 5. Sticky CTA Bar --- //
    const stickyCTA = document.querySelector('.sticky-cta-bar');
    if (stickyCTA) {
        const showThreshold = 600;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showThreshold) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- 6. Cookie Banner --- //
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

    // --- 7. Smooth scrolling for anchor links --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                 targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});