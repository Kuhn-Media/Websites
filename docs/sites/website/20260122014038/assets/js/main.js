document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    const openMenu = () => {
        mobileNavDrawer.classList.add('is-open');
        mobileNavBackdrop.classList.add('is-open');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
    };

    const closeMenu = () => {
        mobileNavDrawer.classList.remove('is-open');
        mobileNavBackdrop.classList.remove('is-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    };

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', openMenu);
        mobileNavBackdrop.addEventListener('click', closeMenu);
        mobileNavClose.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavDrawer.classList.contains('is-open')) {
                closeMenu();
            }
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

    // --- Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
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

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // --- Carousel ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = wrapper.querySelector('.carousel-next');
        const prevButton = wrapper.querySelector('.carousel-prev');
        const dotsNav = wrapper.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
            if (dotsNav) {
                Array.from(dotsNav.children).forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        };

        if (dotsNav) {
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('carousel-dot');
                button.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(button);
            });
        }

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        moveToSlide(0);
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Back to Top & Sticky CTA ---
    const backToTopButton = document.getElementById('back-to-top');
    const stickyCta = document.getElementById('sticky-cta');
    const scrollThreshold = 300;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            if(backToTopButton) backToTopButton.classList.add('visible');
            if(stickyCta) stickyCta.classList.add('visible');
        } else {
            if(backToTopButton) backToTopButton.classList.remove('visible');
            if(stickyCta) stickyCta.classList.remove('visible');
        }
    });

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Magnetic Button Effect ---
    const magneticButton = document.querySelector('.magnetic-button');
    if (magneticButton && window.matchMedia('(pointer: fine)').matches) {
        magneticButton.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY, target } = e;
            const { clientWidth, clientHeight } = target;
            const x = (offsetX / clientWidth - 0.5) * 30; // 30 is the strength
            const y = (offsetY / clientHeight - 0.5) * 30;
            target.style.transform = `translate(${x}px, ${y}px)`;
        });
        magneticButton.addEventListener('mouseleave', () => {
            magneticButton.style.transform = 'translate(0, 0)';
        });
    }
});
