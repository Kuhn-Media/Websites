document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const menuWrapper = document.getElementById('main-menu-wrapper');
    const mainMenu = document.getElementById('main-menu');

    if (navToggle && menuWrapper) {
        navToggle.addEventListener('click', () => {
            const isActive = navToggle.classList.toggle('is-active');
            menuWrapper.classList.toggle('is-active', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
            navToggle.setAttribute('aria-expanded', isActive);
        });

        menuWrapper.addEventListener('click', (e) => {
            if (e.target === menuWrapper) {
                navToggle.classList.remove('is-active');
                menuWrapper.classList.remove('is-active');
                document.body.style.overflow = '';
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuWrapper.classList.contains('is-active')) {
                navToggle.click();
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        let lastScrollY = window.scrollY;
        let isVisible = false;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const scrollThreshold = 600; // Show after scrolling down 600px

            if (currentScrollY > scrollThreshold && currentScrollY > lastScrollY && !isVisible) {
                // Scrolling down
                stickyCTA.classList.add('visible');
                isVisible = true;
            } else if ((currentScrollY < lastScrollY && isVisible) || currentScrollY <= scrollThreshold) {
                // Scrolling up or back to top
                stickyCTA.classList.remove('visible');
                isVisible = false;
            }
            lastScrollY = currentScrollY;
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-stagger-container');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-stagger-container')) {
                    const children = entry.target.querySelectorAll(':scope > *');
                    children.forEach((child, index) => {
                        child.style.setProperty('--stagger-index', index);
                        child.classList.add('is-visible');
                    });
                } else {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Lightbox Gallery ---
    const gallery = document.getElementById('gallery-grid');
    if (gallery) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-content img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
        let currentIndex = 0;

        function showImage(index) {
            const item = galleryItems[index];
            if (!item) return;
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt;
            currentIndex = index;
        }

        function openLightbox(e) {
            e.preventDefault();
            const clickedItem = e.currentTarget;
            const index = galleryItems.indexOf(clickedItem);
            showImage(index);
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function showNext() {
            const nextIndex = (currentIndex + 1) % galleryItems.length;
            showImage(nextIndex);
        }

        function showPrev() {
            const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(prevIndex);
        }

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));

        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        });
    }
});