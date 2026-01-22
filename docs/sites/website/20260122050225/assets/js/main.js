document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER ---
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollThreshold = 50;
        const updateHeader = () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav__container');
    const mobileNavClose = document.querySelector('.mobile-nav__close');
    const mobileNavBackdrop = document.querySelector('.mobile-nav__backdrop');

    if (mobileNavToggle && mobileNavContainer) {
        const openMenu = () => {
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            mobileNavContainer.setAttribute('aria-hidden', 'false');
            document.body.classList.add('mobile-nav-open');
        };

        const closeMenu = () => {
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavContainer.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('mobile-nav-open');
        };

        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            isExpanded ? closeMenu() : openMenu();
        });

        mobileNavClose?.addEventListener('click', closeMenu);
        mobileNavBackdrop?.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
                closeMenu();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const staggerElements = document.querySelectorAll('.reveal-stagger');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
    
    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const items = parent.querySelectorAll('.reveal-stagger');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('is-visible');
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { ...observerOptions, threshold: 0.2 });

    if(staggerElements.length > 0) {
        // Observe the first element of each group
        const parents = new Set();
        staggerElements.forEach(el => parents.add(el.parentElement));
        parents.forEach(parent => {
            const firstChild = parent.querySelector('.reveal-stagger');
            if(firstChild) staggerObserver.observe(firstChild);
        });
    }

    // --- FAQ ACCORDION ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.setAttribute('aria-hidden', isExpanded);
        });
    });

    // --- LIGHTBOX GALLERY ---
    const gallery = document.querySelector('.lightbox-gallery');
    if (gallery) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox__close');
        const lightboxPrev = lightbox.querySelector('.lightbox__prev');
        const lightboxNext = lightbox.querySelector('.lightbox__next');
        const lightboxBackdrop = lightbox.querySelector('.lightbox__backdrop');
        const images = Array.from(gallery.querySelectorAll('a'));
        let currentIndex = 0;

        const showImage = (index) => {
            currentIndex = index;
            lightboxImg.src = images[index].href;
            lightboxImg.alt = images[index].querySelector('img').alt;
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const hideLightbox = () => {
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const showPrev = () => showImage((currentIndex - 1 + images.length) % images.length);
        const showNext = () => showImage((currentIndex + 1) % images.length);

        images.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        lightboxClose.addEventListener('click', hideLightbox);
        lightboxBackdrop.addEventListener('click', hideLightbox);
        lightboxPrev.addEventListener('click', showPrev);
        lightboxNext.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.getAttribute('aria-hidden') === 'false') {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }, 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('is-visible');
        cookieBanner.setAttribute('aria-hidden', 'true');
    };

    acceptBtn?.addEventListener('click', () => handleConsent('accepted'));
    declineBtn?.addEventListener('click', () => handleConsent('declined'));

    // --- STICKY CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the footer is NOT visible
                if (!entry.isIntersecting && window.scrollY > 400) {
                    stickyCTA.classList.add('is-visible');
                    stickyCTA.setAttribute('aria-hidden', 'false');
                } else {
                    stickyCTA.classList.remove('is-visible');
                    stickyCTA.setAttribute('aria-hidden', 'true');
                }
            });
        }, { rootMargin: '100px 0px 0px 0px' });

        const footer = document.querySelector('.site-footer');
        if (footer) {
            ctaObserver.observe(footer);
        }
    }
});