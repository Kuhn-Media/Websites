document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.querySelector('.km-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const burgerMenu = document.querySelector('.km-burger-menu');
    const mobileNav = document.querySelector('.km-nav-mobile');
    if (burgerMenu && mobileNav) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 50}ms`;
            observer.observe(el);
        });
    }

    // --- Lightbox --- //
    const lightbox = document.querySelector('.km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.km-lightbox-image');
        const closeButton = lightbox.querySelector('.km-lightbox-close');
        const galleryItems = document.querySelectorAll('.km-gallery-item img');

        const openLightbox = (src, alt) => {
            lightboxImage.src = src;
            lightboxImage.alt = alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                openLightbox(item.src, item.alt);
            });
        });

        closeButton.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

});