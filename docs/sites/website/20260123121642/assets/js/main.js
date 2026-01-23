document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('#primary-navigation');
    if (mobileNavToggle && primaryNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
        });
    }

    // Sticky Header
    const header = document.querySelector('.site-header.sticky');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Scroll Animations
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger-item');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // FAQ Accordion
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

    // Testimonial Slider
    const sliders = document.querySelectorAll('[data-carousel]');
    sliders.forEach(slider => {
        const slideContainer = slider;
        const slides = slideContainer.querySelectorAll('.testimonial-slide');
        if (slides.length === 0) return;

        const prevButton = slider.parentElement.querySelector('.slider-btn.prev');
        const nextButton = slider.parentElement.querySelector('.slider-btn.next');
        const dotsContainer = slider.parentElement.querySelector('.slider-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            slideContainer.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            updateControls();
        };

        const updateControls = () => {
            // Dots
            if (dotsContainer) {
                const dots = Array.from(dotsContainer.children);
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
            // Buttons
            if (prevButton) prevButton.disabled = currentIndex === 0;
            if (nextButton) nextButton.disabled = currentIndex === slides.length - 1;
        };

        // Create dots
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) goToSlide(currentIndex - 1);
            });
        }
        
        // Touch/Drag functionality
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        slideContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            slideContainer.style.transition = 'none';
        });

        slideContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            slideContainer.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
        });

        slideContainer.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            slideContainer.style.transition = '';
            const diff = currentX - startX;
            if (Math.abs(diff) > 50) {
                if (diff < 0 && currentIndex < slides.length - 1) {
                    goToSlide(currentIndex + 1);
                } else if (diff > 0 && currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                }
            } else {
                goToSlide(currentIndex);
            }
        });

        goToSlide(0);
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // Sticky CTA Bar
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        const onScrollCta = () => {
            // Show after scrolling past the hero section
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCtaBar.classList.add('show');
            } else {
                stickyCtaBar.classList.remove('show');
            }
        };
        window.addEventListener('scroll', onScrollCta, { passive: true });
    }
});