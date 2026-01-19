document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER --- //
    const header = document.querySelector('.sticky-header');
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

    // --- MOBILE MENU --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeButton = document.querySelector('.mobile-menu-close');

    if (menuToggle && mobileMenu) {
        const openMenu = () => {
            document.body.classList.add('menu-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            menuToggle.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            document.body.classList.remove('menu-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.addEventListener('click', openMenu);
        if(closeButton) closeButton.addEventListener('click', closeMenu);

        document.addEventListener('click', (e) => {
            if (document.body.classList.contains('menu-open') && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
                closeMenu();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-in-up, .reveal-fade-in-left, .reveal-fade-in-right, .reveal-stagger');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.classList.contains('reveal-stagger')) {
                    setTimeout(() => {
                        el.classList.add('is-visible');
                    }, index * 100);
                } else {
                    el.classList.add('is-visible');
                }
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && acceptButton && declineButton) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            cookieBanner.classList.add('show');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookieConsent', consent);
            cookieBanner.classList.remove('show');
            cookieBanner.setAttribute('aria-hidden', 'true');
        };

        acceptButton.addEventListener('click', () => handleConsent('accepted'));
        declineButton.addEventListener('click', () => handleConsent('declined'));
    }

    // --- STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaThreshold = 600;
        window.addEventListener('scroll', () => {
            if (window.scrollY > ctaThreshold) {
                stickyCta.classList.add('visible');
                stickyCta.setAttribute('aria-hidden', 'false');
            } else {
                stickyCta.classList.remove('visible');
                stickyCta.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // --- CONTACT FORM --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formStatus = document.getElementById('form-status');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const privacy = document.getElementById('privacy').checked;

            if (name && email && message && privacy) {
                formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird gesendet...';
                formStatus.style.color = 'var(--accent2)';
                // In a real scenario, you would send the form data here.
                setTimeout(() => {
                    formStatus.textContent = 'Nachricht erfolgreich gesendet. Wir melden uns in Kürze.';
                    contactForm.reset();
                }, 1500);
            } else {
                formStatus.textContent = 'Bitte füllen Sie alle erforderlichen Felder aus.';
                formStatus.style.color = '#e53e3e';
            }
        });
    }

    // --- CAROUSEL --- //
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const slides = wrapper.querySelectorAll('.carousel-slide');
        const prevButton = wrapper.querySelector('.carousel-button.prev');
        const nextButton = wrapper.querySelector('.carousel-button.next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (!carousel || slides.length === 0) return;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function createDots() {
            if (!dotsContainer) return;
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Gehe zu Bild ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }

        createDots();
        updateCarousel();
    });
});