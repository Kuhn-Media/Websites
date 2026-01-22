document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    const onPageNav = document.querySelector('.onpage-nav');
    const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
    const headerShrinkHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height-shrink');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    function openMobileNav() {
        navToggle.classList.add('is-active');
        navToggle.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('is-active');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileNavBackdrop.classList.add('is-active');
        document.body.classList.add('no-scroll');
    }

    function closeMobileNav() {
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-active');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNavBackdrop.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (navToggle.classList.contains('is-active')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        mobileNavBackdrop.addEventListener('click', closeMobileNav);
        document.querySelector('.mobile-nav-close').addEventListener('click', closeMobileNav);
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-active')) {
                closeMobileNav();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.display = isExpanded ? 'none' : 'block';
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const heroSection = document.querySelector('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('show');
                } else {
                    stickyCta.classList.remove('show');
                }
            });
        }, { threshold: 0 });
        if(heroSection) ctaObserver.observe(heroSection);
    }
    
    // --- Carousel --- //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function updateCarousel() {
            carousel.scrollTo({ left: slides[currentIndex].offsetLeft - carousel.offsetLeft, behavior: 'smooth' });
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        function goToSlide(index) {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = slides.length - 1;
            if (currentIndex >= slides.length) currentIndex = 0;
            updateCarousel();
        }

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        // Auto-play
        setInterval(() => goToSlide(currentIndex + 1), 5000);

        updateCarousel();
    }

    // --- On-Page Nav ScrollSpy --- //
    if (onPageNav) {
        const navLinks = onPageNav.querySelectorAll('a');
        const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));
        
        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: `-${headerShrinkHeight} 0px -60% 0px`, threshold: 0 });

        sections.forEach(section => {
            if(section) scrollSpyObserver.observe(section);
        });
    }
});