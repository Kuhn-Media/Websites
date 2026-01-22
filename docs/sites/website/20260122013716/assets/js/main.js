document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    const openMenu = () => {
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        mobileNavDrawer.setAttribute('aria-hidden', 'false');
        mobileNavBackdrop.classList.add('is-active');
        document.body.classList.add('no-scroll');
        mobileNavDrawer.querySelector('a').focus();
    };

    const closeMenu = () => {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
        mobileNavBackdrop.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
        mobileNavToggle.focus();
    };

    if (mobileNavToggle && mobileNavDrawer) {
        mobileNavToggle.addEventListener('click', openMenu);
        mobileNavClose.addEventListener('click', closeMenu);
        mobileNavBackdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavToggle.getAttribute('aria-expanded') === 'true') {
                closeMenu();
            }
        });
        mobileNavDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // --- 2. Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('is-sticky');
            } else {
                header.classList.remove('is-sticky');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }, 1000);
    }

    const handleCookieConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('is-visible');
        cookieBanner.setAttribute('aria-hidden', 'true');
    };

    if (acceptCookies) acceptCookies.addEventListener('click', () => handleCookieConsent('accepted'));
    if (declineCookies) declineCookies.addEventListener('click', () => handleCookieConsent('declined'));

    // --- 5. Carousel --- //
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        carouselContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            carouselContainer.classList.add('active');
            startX = e.pageX - carouselContainer.offsetLeft;
            scrollLeft = carouselContainer.scrollLeft;
        });
        carouselContainer.addEventListener('mouseleave', () => {
            isDown = false;
            carouselContainer.classList.remove('active');
        });
        carouselContainer.addEventListener('mouseup', () => {
            isDown = false;
            carouselContainer.classList.remove('active');
        });
        carouselContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carouselContainer.offsetLeft;
            const walk = (x - startX) * 2; //scroll-fast
            carouselContainer.scrollLeft = scrollLeft - walk;
        });

        // Center active slide logic
        const slides = Array.from(carouselContainer.children);
        const updateActiveSlide = () => {
            const containerCenter = carouselContainer.scrollLeft + carouselContainer.offsetWidth / 2;
            let closestSlide = null;
            let minDistance = Infinity;

            slides.forEach(slide => {
                const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
                const distance = Math.abs(containerCenter - slideCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestSlide = slide;
                }
                slide.classList.remove('is-active');
            });

            if (closestSlide) {
                closestSlide.classList.add('is-active');
            }
        };

        carouselContainer.addEventListener('scroll', updateActiveSlide, { passive: true });
        updateActiveSlide();
    }

    // --- 6. Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
        let currentImageIndex = 0;

        const openLightbox = (index) => {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            lightbox.querySelector('.lightbox-close').focus();
        };

        const closeLightbox = () => {
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            galleryItems[currentImageIndex].focus();
        };

        const updateLightboxImage = () => {
            const item = galleryItems[currentImageIndex];
            const imgSrc = item.getAttribute('href');
            const imgAlt = item.querySelector('img').getAttribute('alt');
            const kmImage = item.getAttribute('data-km-image');

            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.setAttribute('src', imgSrc);
            lightboxImg.setAttribute('alt', imgAlt);
            lightboxImg.setAttribute('data-km-image', kmImage);
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxImage();
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
            updateLightboxImage();
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.getAttribute('aria-hidden') === 'false') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- 7. Sticky CTA Bar --- //
    const stickyCtaBar = document.querySelector('.sticky-cta-bar');
    if (stickyCtaBar) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the footer is NOT visible
                if (!entry.isIntersecting && window.scrollY > 400) {
                    stickyCtaBar.classList.add('is-visible');
                    stickyCtaBar.setAttribute('aria-hidden', 'false');
                } else {
                    stickyCtaBar.classList.remove('is-visible');
                    stickyCtaBar.setAttribute('aria-hidden', 'true');
                }
            });
        }, { threshold: 0 });

        const footer = document.querySelector('.site-footer');
        if (footer) {
            ctaObserver.observe(footer);
        }
    }

    // --- 8. Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formStatus = document.getElementById('form-status');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy submission handler.
            // In a real project, this would send data to a server.
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            formStatus.style.color = 'green';
            contactForm.reset();
            setTimeout(() => { formStatus.textContent = ''; }, 5000);
        });
    }
});