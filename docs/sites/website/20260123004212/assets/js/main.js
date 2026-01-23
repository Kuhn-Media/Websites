document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- 2. Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('is-open');
            const isOpen = mobileNav.classList.contains('is-open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
            mobileNav.setAttribute('aria-hidden', !isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                mobileNav.classList.remove('is-open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });

        document.querySelector('.mobile-nav-close').addEventListener('click', () => {
            mobileNav.classList.remove('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const goToSlide = (index) => {
            currentIndex = index;
            const scrollAmount = slides[index].offsetLeft - carousel.offsetLeft;
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            updateControls();
        };

        const updateControls = () => {
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === slides.length - 1;
        };

        nextBtn.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) goToSlide(currentIndex - 1);
        });

        // Update active dot on scroll
        carousel.addEventListener('scroll', () => {
            const scrollLeft = carousel.scrollLeft;
            const slideWidth = slides[0].offsetWidth;
            const newIndex = Math.round(scrollLeft / slideWidth);
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateControls();
            }
        });

        updateControls();
    }

    // --- 5. FAQ Accordion --- //
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

    // --- 6. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent && cookieBanner) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        });
    }

    // --- 7. Sticky CTA & Back to Top Button --- //
    const stickyCta = document.getElementById('sticky-cta');
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.hidden = false;
                setTimeout(() => backToTopBtn.classList.add('is-visible'), 10);
            } else {
                backToTopBtn.classList.remove('is-visible');
                setTimeout(() => backToTopBtn.hidden = true, 300);
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});