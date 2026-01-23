document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpened = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isOpened);
            document.body.classList.toggle('mobile-nav-open');
        });
    }

    // --- 2. Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${index * 50}ms`;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- 4. FAQ Accordion --- //
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

    // --- 5. Feature Tabs on Homepage --- //
    const tabsContainer = document.querySelector('.feature-tabs');
    if (tabsContainer) {
        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        const tabPanels = tabsContainer.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');

                const targetPanelId = button.getAttribute('aria-controls');
                tabPanels.forEach(panel => {
                    if (panel.id === targetPanelId) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });
    }

    // --- 6. Testimonial Carousel --- //
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
            updateDots(targetIndex);
        };

        // Create dots
        slides.forEach((_, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            if (index === 0) button.classList.add('active');
            button.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(button);
        });
        const dots = Array.from(dotsNav.children);

        const updateDots = (targetIndex) => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === targetIndex);
            });
        };

        prevButton.addEventListener('click', () => {
            const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
            moveToSlide(newIndex);
        });

        nextButton.addEventListener('click', () => {
            const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
            moveToSlide(newIndex);
        });

        // Touch/Swipe logic
        let startX = 0;
        let moveX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            isDragging = true;
            track.style.transition = 'none';
        });

        track.addEventListener('touchmove', e => {
            if (!isDragging) return;
            moveX = e.touches[0].clientX - startX;
            track.style.transform = `translateX(${-currentIndex * slideWidth + moveX}px)`;
        });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.4s ease';
            if (Math.abs(moveX) > slideWidth / 4) {
                if (moveX < 0) {
                    moveToSlide(currentIndex === slides.length - 1 ? slides.length - 1 : currentIndex + 1);
                } else {
                    moveToSlide(currentIndex === 0 ? 0 : currentIndex - 1);
                }
            } else {
                moveToSlide(currentIndex);
            }
            moveX = 0;
        });
    }

    // --- 7. Sticky CTA Bar --- //
    const stickyCTA = document.querySelector('.sticky-cta-bar');
    if (stickyCTA) {
        const handleStickyCTA = () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleStickyCTA, { passive: true });
    }

    // --- 8. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.hidden = false;
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.hidden = true;
        });
    }
});