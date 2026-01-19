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
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavDrawer = document.getElementById('mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

    function openMobileNav() {
        document.body.classList.add('mobile-nav-open');
        mobileNavDrawer.classList.add('open');
        mobileNavDrawer.setAttribute('aria-hidden', 'false');
        mobileNavOverlay.classList.add('open');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileNav() {
        document.body.classList.remove('mobile-nav-open');
        mobileNavDrawer.classList.remove('open');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
        mobileNavOverlay.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
    }

    if (mobileNavToggle && mobileNavDrawer && mobileNavClose && mobileNavOverlay) {
        mobileNavToggle.addEventListener('click', openMobileNav);
        mobileNavClose.addEventListener('click', closeMobileNav);
        mobileNavOverlay.addEventListener('click', closeMobileNav);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
                closeMobileNav();
            }
        });
    }

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-stagger')) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); 
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Testimonial Carousel
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');
        const dotsNav = document.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
            updateArrows();
        };

        const updateDots = (targetIndex) => {
            const currentDot = dotsNav.querySelector('.active');
            if(currentDot) currentDot.classList.remove('active');
            dotsNav.children[targetIndex].classList.add('active');
        };

        const updateArrows = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
        };

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(dot);
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });
        
        moveToSlide(0);
    }

    // 5. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // 6. Sticky CTA Bar
    const stickyBar = document.getElementById('sticky-cta-bar');
    if (stickyBar) {
        const footer = document.querySelector('.site-footer-main');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when footer is not visible
                if (!entry.isIntersecting && window.scrollY > 400) {
                    stickyBar.classList.add('visible');
                } else {
                    stickyBar.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        if (footer) {
            observer.observe(footer);
        }
    }

    // 7. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
    }

    function handleConsent() {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.hidden = true;
    }

    if (acceptButton) acceptButton.addEventListener('click', handleConsent);
    if (declineButton) declineButton.addEventListener('click', handleConsent);

});