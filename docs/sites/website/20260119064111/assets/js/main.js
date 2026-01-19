document.addEventListener('DOMContentLoaded', function() {

    // Sticky Header
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

    // Mobile Menu
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-active');
            document.body.style.overflow = mobileMenu.classList.contains('is-active') ? 'hidden' : '';
        });
    }

    // Scroll Animations
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

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentIndex = 0;

    if (galleryItems.length > 0 && lightbox) {
        const images = Array.from(galleryItems).map(item => item.href);

        function showImage(index) {
            if (index >= 0 && index < images.length) {
                lightboxImg.src = images[index];
                currentIndex = index;
                lightbox.style.display = 'block';
            }
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });

        lightboxPrev.addEventListener('click', () => {
            showImage((currentIndex - 1 + images.length) % images.length);
        });

        lightboxNext.addEventListener('click', () => {
            showImage((currentIndex + 1) % images.length);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') lightboxClose.click();
                if (e.key === 'ArrowLeft') lightboxPrev.click();
                if (e.key === 'ArrowRight') lightboxNext.click();
            }
        });
    }

});