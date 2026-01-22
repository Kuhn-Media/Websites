document.addEventListener('DOMContentLoaded', () => {

    // --- PREFERS REDUCED MOTION CHECK ---
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', () => {
        prefersReducedMotion = motionQuery.matches;
    });

    // --- STICKY HEADER ---
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollThreshold = 150;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('has-scrolled');
            } else {
                header.classList.remove('has-scrolled');
            }
        });
    }

    // --- MOBILE NAVIGATION ---
    const navToggleButtons = document.querySelectorAll('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    const openMobileNav = () => {
        mobileNavDrawer.classList.add('is-open');
        mobileNavDrawer.setAttribute('aria-hidden', 'false');
        mobileNavBackdrop.classList.add('is-visible');
        document.body.classList.add('no-scroll');
        navToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
    };

    const closeMobileNav = () => {
        mobileNavDrawer.classList.remove('is-open');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
        mobileNavBackdrop.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');
        navToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    };

    if (navToggleButtons.length && mobileNavDrawer) {
        navToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (mobileNavDrawer.classList.contains('is-open')) {
                    closeMobileNav();
                } else {
                    openMobileNav();
                }
            });
        });

        mobileNavBackdrop.addEventListener('click', closeMobileNav);
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavDrawer.classList.contains('is-open')) {
                closeMobileNav();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0 && !prefersReducedMotion) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                    const stagger = parseInt(entry.target.dataset.revealStagger) || 0;
                    
                    if (stagger > 0) {
                        const children = entry.target.children;
                        for (let i = 0; i < children.length; i++) {
                            setTimeout(() => {
                                children[i].classList.add('is-visible');
                            }, (i * stagger) + delay);
                        }
                    } else {
                         setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, delay);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.setAttribute('aria-hidden', 'false');
            cookieBanner.classList.add('is-visible');
        }, 1000);
    }

    const handleConsent = () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.classList.remove('is-visible');
        cookieBanner.setAttribute('aria-hidden', 'true');
    };

    if (acceptButton) acceptButton.addEventListener('click', handleConsent);
    if (declineButton) declineButton.addEventListener('click', handleConsent);

    // --- CONTACT FORM ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            statusEl.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet...';
            // This is a dummy form. In a real project, this would send data to a server.
            setTimeout(() => {
                statusEl.textContent = 'Nachricht erfolgreich gesendet. Wir melden uns in Kürze.';
                statusEl.style.color = 'var(--color-primary)';
                contactForm.reset();
            }, 1500);
        });
    }

    // --- STICKY CTA BAR ---
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        const ctaThreshold = 600; // Show after scrolling 600px
        window.addEventListener('scroll', () => {
            if (window.scrollY > ctaThreshold) {
                stickyCtaBar.classList.add('is-visible');
            } else {
                stickyCtaBar.classList.remove('is-visible');
            }
        });
    }
    
    // --- CAROUSEL (using Keen Slider) ---
    const carouselElement = document.querySelector('.projects-carousel');
    if (carouselElement) {
        // Dynamically load Keen Slider script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/keen-slider@6.8.6/keen-slider.min.js';
        script.onload = () => {
            const slider = new KeenSlider(carouselElement, {
                loop: true,
                slides: { perView: 1.2, spacing: 16 },
                breakpoints: {
                    '(min-width: 768px)': { slides: { perView: 2.5, spacing: 24 } },
                    '(min-width: 1200px)': { slides: { perView: 3.5, spacing: 32 } },
                },
                created(s) {
                    const dotsWrapper = document.querySelector('.carousel-dots');
                    const slides = s.track.details.slides;
                    slides.forEach((_slide, idx) => {
                        const dot = document.createElement('button');
                        dot.classList.add('carousel-dot');
                        dot.setAttribute('aria-label', `Gehe zu Bild ${idx + 1}`);
                        dotsWrapper.appendChild(dot);
                        dot.addEventListener('click', () => s.moveToIdx(idx));
                    });
                    updateDots(s);
                },
                slideChanged(s) {
                    updateDots(s);
                },
            });

            const updateDots = (s) => {
                const dots = document.querySelectorAll('.carousel-dot');
                const slide = s.track.details.rel;
                dots.forEach((dot, idx) => {
                    idx === slide ? dot.classList.add('active') : dot.classList.remove('active');
                });
            };

            const arrowLeft = document.querySelector('.carousel-arrow--left');
            const arrowRight = document.querySelector('.carousel-arrow--right');
            if(arrowLeft) arrowLeft.addEventListener('click', () => slider.prev());
            if(arrowRight) arrowRight.addEventListener('click', () => slider.next());
        };
        document.body.appendChild(script);
    }

    // --- LIGHTBOX (using basicLightbox) ---
    const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
    if (galleryItems.length > 0) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/basiclightbox@5.0.4/dist/basicLightbox.min.js';
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/basiclightbox@5.0.4/dist/basicLightbox.min.css';
        document.head.appendChild(link);
        
        script.onload = () => {
            galleryItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const imageUrl = item.getAttribute('href');
                    basicLightbox.create(`<img src="${imageUrl}" alt="">`).show();
                });
            });
        };
        document.body.appendChild(script);
    }
});