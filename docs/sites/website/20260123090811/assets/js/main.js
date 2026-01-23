document.addEventListener('DOMContentLoaded', function() {

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('open');
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });
    }

    // 2. Sticky Header
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

    // 3. Scroll Animations
    if (!isReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('reveal-stagger')) {
                        const children = entry.target.children;
                        for (let i = 0; i < children.length; i++) {
                            children[i].style.setProperty('--stagger-index', i);
                            children[i].classList.add('visible');
                        }
                    } else {
                        entry.target.classList.add('visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // 4. FAQ Accordion
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

    // 5. Testimonial Carousel
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        const slides = Array.from(carousel.children);
        let currentIndex = 0;

        const setupCarousel = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        };

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = dotsContainer.children;
            Array.from(dots).forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        setupCarousel();
    }

    // 6. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('show'), 100);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }
    
    // 7. Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('show');
            } else {
                stickyCTA.classList.remove('show');
            }
        });
    }
});