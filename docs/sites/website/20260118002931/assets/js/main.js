document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavMenu.setAttribute('aria-hidden', isExpanded);
            document.body.classList.toggle('mobile-nav-open');
            mobileNavToggle.classList.toggle('mobile-nav-open');
        });
    }

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px' });
        scrollObserver.observe(document.body);
    }

    // --- Scroll Reveal Animation --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealItems.forEach(item => revealObserver.observe(item));

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;
        let slideWidth = slides[0].offsetWidth;

        const goToSlide = (index) => {
            carousel.style.transition = 'transform 0.5s ease-in-out';
            carousel.style.transform = `translateX(-${index * slideWidth}px)`;
            updateDots(index);
            currentIndex = index;
        };

        const updateDots = (index) => {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        window.addEventListener('resize', () => {
            slideWidth = slides[0].offsetWidth;
            goToSlide(currentIndex);
        });
        
        updateDots(0);
    }

    // --- Image Comparison Slider --- //
    const sliders = document.querySelectorAll('.image-comparison-slider');
    sliders.forEach(slider => {
        const afterImage = slider.querySelector('.comparison-after');
        const handle = slider.querySelector('.comparison-handle');
        let isDragging = false;

        const moveHandler = (x) => {
            const rect = slider.getBoundingClientRect();
            let newWidth = ((x - rect.left) / rect.width) * 100;
            if (newWidth < 0) newWidth = 0;
            if (newWidth > 100) newWidth = 100;
            afterImage.style.width = `${newWidth}%`;
            handle.style.left = `${newWidth}%`;
        };

        slider.addEventListener('mousedown', () => isDragging = true);
        slider.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('touchend', () => isDragging = false);

        slider.addEventListener('mousemove', e => {
            if (isDragging) moveHandler(e.clientX);
        });
        slider.addEventListener('touchmove', e => {
            if (isDragging) moveHandler(e.touches[0].clientX);
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            stickyCTA.classList.toggle('show', entry.boundingClientRect.top < -window.innerHeight * 0.5);
        }, { threshold: [0, 1] });
        const heroSection = document.querySelector('.hero');
        if(heroSection) ctaObserver.observe(heroSection);
    }
});