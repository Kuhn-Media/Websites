document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

    // --- MOBILE NAVIGATION --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');

    const openMobileMenu = () => {
        mobileNavMenu.classList.add('is-open');
        mobileNavMenu.setAttribute('aria-hidden', 'false');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
    };

    const closeMobileMenu = () => {
        mobileNavMenu.classList.remove('is-open');
        mobileNavMenu.setAttribute('aria-hidden', 'true');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    };

    if (mobileNavToggle && mobileNavMenu && mobileNavClose) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // --- SCROLL REVEAL --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100); // Staggered delay
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && acceptButton && declineButton) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            cookieBanner.classList.add('show');
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- CONTEXTUAL CTA --- //
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const handleCtaScroll = () => {
            if (window.scrollY > 400) {
                contextCta.classList.add('show');
            } else {
                contextCta.classList.remove('show');
            }
        };
        window.addEventListener('scroll', handleCtaScroll);
        handleCtaScroll(); // Initial check
    }

    // --- CONTACT FORM --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            statusEl.textContent = 'Nachricht wird gesendet...';
            statusEl.style.color = 'var(--color-text)';

            // This is a dummy submission handler. 
            // In a real project, this would be an AJAX call to a server.
            setTimeout(() => {
                statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
                statusEl.style.color = 'var(--color-primary)';
                contactForm.reset();
            }, 1500);
        });
    }
    
    // --- LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        const showImage = (index) => {
            const item = galleryItems[index];
            const path = item.getAttribute('data-km-image-path');
            const alt = item.getAttribute('data-km-image-alt');
            lightboxImg.src = path;
            lightboxImg.alt = alt;
            currentIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            lightboxImg.src = ''; // Clear src to stop loading
        };

        const showPrev = () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(newIndex);
        };

        const showNext = () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            showImage(newIndex);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }
});