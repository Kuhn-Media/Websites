document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Mobile Navigation --- //
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.getElementById('main-nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navList.classList.toggle('is-open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            if (el.classList.contains('reveal-stagger')) {
                // This is a simplified stagger. For true stagger, group elements and apply delays.
            }
            observer.observe(el);
        });
    }

    // --- 4. FAQ & Job Accordion --- //
    const accordions = document.querySelectorAll('.faq-accordion, .job-accordion');
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.faq-item, .job-item');
        items.forEach(item => {
            const button = item.querySelector('.faq-question, .job-title');
            const answer = item.querySelector('.faq-answer, .job-details');
            if (button && answer) {
                button.addEventListener('click', () => {
                    const isExpanded = button.getAttribute('aria-expanded') === 'true';
                    button.setAttribute('aria-expanded', !isExpanded);
                    answer.hidden = isExpanded;
                });
            }
        });
    });

    // --- 5. Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
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

    // --- 6. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaThreshold = 400;
        window.addEventListener('scroll', () => {
            if (window.scrollY > ctaThreshold) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- 7. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        const cookieName = 'cookieConsent_Herzog';
        if (!localStorage.getItem(cookieName)) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('visible'), 100);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem(cookieName, 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 300);
        });
    }

    // --- 8. Contact Form URL Parameter --- //
    const urlParams = new URLSearchParams(window.location.search);
    const anliegen = urlParams.get('anliegen');
    if (anliegen) {
        const selectAnliegen = document.getElementById('anliegen');
        if (selectAnliegen) {
            selectAnliegen.value = anliegen;
        }
    }
});