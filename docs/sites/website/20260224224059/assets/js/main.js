document.addEventListener('DOMContentLoaded', function() {

    // --- PREFERS REDUCED MOTION CHECK ---
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', () => {
        prefersReducedMotion = motionQuery.matches;
    });

    // --- STICKY HEADER --- 
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE NAVIGATION --- 
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    function openMobileMenu() {
        if (mobileNavMenu) {
            mobileNavMenu.style.display = 'flex';
            setTimeout(() => mobileNavMenu.classList.add('is-open'), 10);
            document.body.classList.add('no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        }
    }

    function closeMobileMenu() {
        if (mobileNavMenu) {
            mobileNavMenu.classList.remove('is-open');
            setTimeout(() => { mobileNavMenu.style.display = 'none'; }, 400);
            document.body.classList.remove('no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        }
    }

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION --- 
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0 && !prefersReducedMotion) {
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
    } else {
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // --- COOKIE BANNER --- 
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
        setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 500);
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 500);
        });
    }

    // --- LIGHTBOX --- 
    const lightbox = document.getElementById('km-lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const galleryImages = Array.from(lightboxTriggers).map(img => img.getAttribute('data-km-image') || img.src);
    let currentImageIndex = 0;

    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxImg = lightbox.querySelector('.km-lightbox-content img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        function showImage(index) {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const relativePath = lightboxImg.src.includes('/leistungen/') || lightboxImg.src.includes('/ueber-uns/') || lightboxImg.src.includes('/kontakt/') ? '../' : '';
            lightboxImg.src = relativePath + galleryImages[index];
        }

        function openLightbox(index) {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('is-visible'), 10);
            showImage(index);
            document.body.classList.add('no-scroll');
        }

        function closeLightbox() {
            lightbox.classList.remove('is-visible');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
            document.body.classList.remove('no-scroll');
        }

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
            }
        });
    }

    // --- STICKY CTA BAR --- 
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCtaBar.style.display = 'block';
                    setTimeout(() => stickyCtaBar.classList.add('is-visible'), 10);
                } else {
                    stickyCtaBar.classList.remove('is-visible');
                    setTimeout(() => { stickyCtaBar.style.display = 'none'; }, 400);
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- CONTACT FORM --- 
    const contactForm = document.getElementById('kontaktformular');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // This is a dummy form submission handler.
            // In a real project, this would send data to a server.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});