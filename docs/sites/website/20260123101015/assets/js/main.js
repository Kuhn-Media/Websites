document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
        });
    }

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

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

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

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel(); // Initial setup
    }

    // --- FAQ Accordion --- //
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
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const showAt = 400; // Pixels from top to show the CTA
        window.addEventListener('scroll', () => {
            if (window.scrollY > showAt) {
                stickyCTA.hidden = false;
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Smooth scroll for anchor links --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});