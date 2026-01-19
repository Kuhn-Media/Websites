document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
            document.body.classList.toggle('nav-open');
        });
    }

    // Sticky Header
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // Testimonial Slider
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        let currentIndex = 0;
        const slides = slider.querySelectorAll('.testimonial-slide');
        const totalSlides = slides.length;
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        const dotsContainer = document.querySelector('.slider-dots');

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateControls();
        }

        function updateControls() {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        goToSlide(0); // Initialize
    }

    // Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger-group > *');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach((el, index) => {
        if (el.parentElement.classList.contains('reveal-stagger-group')) {
            el.style.setProperty('--stagger-index', index);
        }
        observer.observe(el);
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
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

    // Sticky CTA
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('show');
            } else {
                stickyCta.classList.remove('show');
            }
        });
    }

    // Handle contact form query params for career page
    const urlParams = new URLSearchParams(window.location.search);
    const bewerbung = urlParams.get('bewerbung');
    if (bewerbung) {
        const messageField = document.getElementById('message');
        if (messageField) {
            let subject = '';
            if (bewerbung === 'anlagenmechaniker') subject = 'Bewerbung als Anlagenmechaniker SHK (m/w/d)';
            if (bewerbung === 'kundendienst') subject = 'Bewerbung als Kundendienstmonteur (m/w/d)';
            if (bewerbung === 'initiativ') subject = 'Initiativbewerbung';
            messageField.value = `Sehr geehrte Damen und Herren,\n\nich bewerbe mich hiermit auf die Stelle: ${subject}.\n\nMit freundlichen Grüßen,\n`;
        }
    }
});