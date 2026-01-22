document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav__container');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavBackdrop = document.querySelector('.mobile-nav__backdrop');
    const mobileNavClose = document.querySelector('.mobile-nav__close');

    if (navToggle) {
        const openMenu = () => {
            navToggle.classList.add('is-open');
            navToggle.setAttribute('aria-expanded', 'true');
            mobileNav.classList.add('is-open');
            mobileNav.setAttribute('aria-hidden', 'false');
            mobileNavBackdrop.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            navToggle.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('is-open');
            mobileNav.setAttribute('aria-hidden', 'true');
            mobileNavBackdrop.classList.remove('is-visible');
            document.body.style.overflow = '';
        };

        navToggle.addEventListener('click', () => {
            if (navToggle.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileNavClose.addEventListener('click', closeMenu);
        mobileNavBackdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navToggle.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-stagger');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
        }, 1000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCTA.classList.add('is-visible');
                } else {
                    stickyCTA.classList.remove('is-visible');
                }
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
    
    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
    let currentIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox__close');
        const prevBtn = lightbox.querySelector('.lightbox__prev');
        const nextBtn = lightbox.querySelector('.lightbox__next');
        
        const images = Array.from(galleryItems).map(item => item.href);

        function showImage(index) {
            lightboxImg.src = images[index];
            currentIndex = index;
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.style.display = 'flex';
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
        prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + images.length) % images.length));
        nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % images.length));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
});