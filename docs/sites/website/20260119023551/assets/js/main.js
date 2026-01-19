document.addEventListener('DOMContentLoaded', () => {

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

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.querySelector('.mobile-nav-drawer');
    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navDrawer.classList.toggle('open');
            navToggle.classList.toggle('open');
            document.body.classList.toggle('mobile-nav-open');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            const slideWidth = slides[0].offsetWidth;
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'flex';
    } else if (cookieBanner) {
        cookieBanner.classList.add('hidden');
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.add('hidden');
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.add('hidden');
        });
    }

    // --- Sticky CTA for Mobile ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
    
    // --- Contact Form --- 
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formMessage = document.getElementById('form-message');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formMessage.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet...';
            formMessage.className = 'form-message success';
            // In a real application, you would send the form data to a server here.
            // For this demo, we'll just reset the form after a short delay.
            setTimeout(() => {
                formMessage.textContent = 'Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze.';
                contactForm.reset();
                setTimeout(() => { formMessage.textContent = ''; }, 5000);
            }, 1000);
        });
    }
});