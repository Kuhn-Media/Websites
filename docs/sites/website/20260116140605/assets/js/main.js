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
    const navToggle = document.getElementById('mobile-nav-toggle');
    const mainMenu = document.getElementById('main-menu');
    if (navToggle && mainMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mainMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // 3. Scroll Reveal Animation
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
    revealItems.forEach(item => revealObserver.observe(item));

    // 4. Projects Carousel
    const carousel = document.getElementById('projects-carousel');
    if (carousel) {
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
            updateControls();
        };

        const updateControls = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        // Create dots
        slides.forEach((_, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            button.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(button);
        });
        const dots = Array.from(dotsNav.children);

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        // Touch/Swipe functionality
        let startX = 0;
        let endX = 0;
        track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX > endX + 50) { // Swipe left
                if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
            } else if (startX < endX - 50) { // Swipe right
                if (currentIndex > 0) moveToSlide(currentIndex - 1);
            }
        });

        moveToSlide(0); // Initialize
    }

    // 5. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // 6. Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '-200px 0px 0px 0px' });
        
        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});