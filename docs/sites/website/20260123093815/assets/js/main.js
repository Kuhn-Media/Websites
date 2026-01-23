document.addEventListener('DOMContentLoaded', function() {

    // --- 1. STICKY HEADER --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- 2. MOBILE NAVIGATION --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.getElementById('mobile-nav-drawer');
    const navClose = document.querySelector('.mobile-nav-close');
    const drawerOverlay = document.querySelector('.drawer-overlay');

    const toggleNav = (open) => {
        const isExpanded = open === undefined ? navToggle.getAttribute('aria-expanded') === 'false' : open;
        navToggle.setAttribute('aria-expanded', isExpanded);
        navDrawer.setAttribute('aria-hidden', !isExpanded);
        navDrawer.classList.toggle('open', isExpanded);
        drawerOverlay.classList.toggle('open', isExpanded);
        document.body.classList.toggle('no-scroll', isExpanded);
    };

    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', () => toggleNav());
        navClose.addEventListener('click', () => toggleNav(false));
        drawerOverlay.addEventListener('click', () => toggleNav(false));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
                toggleNav(false);
            }
        });
    }

    // --- 3. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger-group > *');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.setProperty('--stagger-index', index);
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- 4. FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // --- 5. STICKY CTA BAR --- //
    const stickyBar = document.getElementById('sticky-cta-bar');
    if (stickyBar) {
        const handleStickyBar = () => {
            // Show when scrolled past the hero section
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyBar.classList.add('visible');
            } else {
                stickyBar.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleStickyBar, { passive: true });
    }

    // --- 6. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.hidden = false;
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('visible');
        setTimeout(() => { cookieBanner.hidden = true; }, 500);
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

    // --- 7. LIGHTBOX GALLERY --- //
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            const imgSrc = item.getAttribute('href');
            const imgAlt = item.dataset.alt || '';
            lightboxImg.setAttribute('src', imgSrc);
            lightboxImg.setAttribute('alt', imgAlt);
            lightboxCaption.textContent = imgAlt;
            currentIndex = index;
        };

        const openLightbox = (e, index) => {
            e.preventDefault();
            lightbox.setAttribute('aria-hidden', 'false');
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
            showImage(index);
            setTimeout(() => closeBtn.focus(), 50);
        };

        const closeLightbox = () => {
            lightbox.setAttribute('aria-hidden', 'true');
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        };

        const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNext = () => showImage((currentIndex + 1) % galleryItems.length);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => openLightbox(e, index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});