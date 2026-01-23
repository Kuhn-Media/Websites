document.addEventListener('DOMContentLoaded', function() {

    // --- MOBILE NAVIGATION --- //
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
    }

    // --- STICKY HEADER --- //
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

    // --- SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when the hero section is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            scrollObserver.observe(heroSection);
        }
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }
        cookieAccept.addEventListener('click', () => {
            cookieBanner.classList.remove('visible');
            localStorage.setItem('cookieAccepted', 'true');
        });
    }

    // --- LIGHTBOX GALLERY --- //
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentIndex = 0;

    if (galleryItems.length > 0 && lightbox) {
        const images = Array.from(galleryItems).map(item => item.dataset.src);

        const showImage = (index) => {
            if (index < 0 || index >= images.length) return;
            currentIndex = index;
            lightboxImg.src = images[currentIndex];
            lightboxPrev.style.display = (currentIndex === 0) ? 'none' : 'block';
            lightboxNext.style.display = (currentIndex === images.length - 1) ? 'none' : 'block';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
                lightbox.classList.add('visible');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
        lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentIndex + 1);
            }
        });
    }

});