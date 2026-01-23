document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- Sticky Header ---
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

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach((el, index) => {
        if (el.classList.contains('reveal-stagger')) {
            el.style.transitionDelay = `${index * 100}ms`;
        }
        observer.observe(el);
    });

    // --- Testimonial Carousel ---
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function createDots() {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            goToSlide(newIndex);
        });

        createDots();
        
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX) nextBtn.click();
            if (touchEndX > touchStartX) prevBtn.click();
        }
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('visible');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // --- Sticky CTA & Back to Top ---
    const stickyCta = document.getElementById('sticky-cta');
    const backToTopBtn = document.getElementById('back-to-top');
    if (stickyCta || backToTopBtn) {
        window.addEventListener('scroll', () => {
            const show = window.scrollY > window.innerHeight * 0.5;
            if (stickyCta) stickyCta.classList.toggle('visible', show);
            if (backToTopBtn) backToTopBtn.classList.toggle('visible', show);
        });
    }
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Contact Form --- 
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formMessage = document.getElementById('form-message');
            formMessage.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet. (Dies ist eine Demo)';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            contactForm.reset();
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }
});