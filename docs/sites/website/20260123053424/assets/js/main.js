document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;
        const observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '0px', threshold: 0.99 });
        observer.observe(document.body);
    };

    // --- Mobile Navigation ---
    const initMobileMenu = () => {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    };

    // --- Scroll Animations ---
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.animate-reveal');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- Accordion ---
    const initAccordion = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const content = item.querySelector('.accordion-content');
            if (!button || !content) return;

            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
                content.hidden = isExpanded;
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            });
        });
    };

    // --- Carousel ---
    const initCarousel = () => {
        const carousel = document.querySelector('#testimonial-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        const moveToSlide = (currentSlide, targetSlide) => {
            const amountToMove = targetSlide.offsetLeft - currentSlide.offsetLeft;
            track.style.transform = `translateX(-${targetSlide.offsetLeft}px)`;
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            if (currentDot) currentDot.classList.remove('active');
            if (targetDot) targetDot.classList.add('active');
        }

        // Create dots
        slides.forEach((slide, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            button.addEventListener('click', () => {
                const currentSlide = track.querySelector('.current-slide');
                const currentDot = dotsNav.querySelector('.active');
                moveToSlide(currentSlide, slides[index]);
                updateDots(currentDot, button);
            });
            dotsNav.appendChild(button);
        });
        const dots = Array.from(dotsNav.children);
        dots[0].classList.add('active');
        slides[0].classList.add('current-slide');

        nextButton.addEventListener('click', () => {
            const currentSlide = track.querySelector('.current-slide');
            let nextSlide = currentSlide.nextElementSibling;
            if (!nextSlide) {
                nextSlide = slides[0];
            }
            moveToSlide(currentSlide, nextSlide);

            const currentDot = dotsNav.querySelector('.active');
            let nextDot = currentDot.nextElementSibling;
            if (!nextDot) {
                nextDot = dots[0];
            }
            updateDots(currentDot, nextDot);
        });

        prevButton.addEventListener('click', () => {
            const currentSlide = track.querySelector('.current-slide');
            let prevSlide = currentSlide.previousElementSibling;
            if (!prevSlide) {
                prevSlide = slides[slides.length - 1];
            }
            moveToSlide(currentSlide, prevSlide);

            const currentDot = dotsNav.querySelector('.active');
            let prevDot = currentDot.previousElementSibling;
            if (!prevDot) {
                prevDot = dots[dots.length - 1];
            }
            updateDots(currentDot, prevDot);
        });
    };
    
    // --- Sticky CTA ---
    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        const trigger = document.querySelector('.hero');
        if (!cta || !trigger) return;

        const observer = new IntersectionObserver(([entry]) => {
            cta.classList.toggle('visible', !entry.isIntersecting);
        }, { threshold: 0 });
        observer.observe(trigger);
    };

    // --- Cookie Banner ---
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            banner.hidden = false;
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            banner.hidden = true;
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initAccordion();
    initCarousel();
    initStickyCTA();
    initCookieBanner();
});