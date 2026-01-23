document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

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

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.next');
        const prevButton = carousel.querySelector('.prev');
        const dotsNav = carousel.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        let currentIndex = 0;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
            const currentDot = dotsNav.querySelector('.active');
            if (currentDot) currentDot.classList.remove('active');
            dotsNav.children[currentIndex].classList.add('active');
        };

        // Create dots
        slides.forEach((_, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            button.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(button);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });
        
        let touchstartX = 0;
        let touchendX = 0;

        track.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        track.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX && currentIndex < slides.length - 1) { moveToSlide(currentIndex + 1); }
            if (touchendX > touchstartX && currentIndex > 0) { moveToSlide(currentIndex - 1); }
        });

        // Initial state
        moveToSlide(0);
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past)
                stickyCTA.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0, rootMargin: '-100px 0px 0px 0px' });
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const cookieConsent = localStorage.getItem('cookie_consent');

    if (!cookieConsent && cookieBanner) {
        cookieBanner.hidden = false;
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.hidden = true;
        });
    }
});