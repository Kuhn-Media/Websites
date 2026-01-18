document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.querySelector('#mobile-nav-drawer');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
    const navClose = document.querySelector('.mobile-nav-close');

    function openNav() {
        navDrawer.classList.add('open');
        navOverlay.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        navDrawer.classList.remove('open');
        navOverlay.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', openNav);
        navClose.addEventListener('click', closeNav);
        navOverlay.addEventListener('click', closeNav);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
                closeNav();
            }
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-stagger');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-stagger')) {
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, index * 100); 
                } else {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Carousel --- //
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const prevButton = wrapper.querySelector('.carousel-prev');
        const nextButton = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        const slides = Array.from(carousel.children);
        let slideWidth = slides[0].getBoundingClientRect().width;

        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    carousel.scrollTo({ left: i * slideWidth, behavior: 'smooth' });
                    updateDots(i);
                });
                dotsContainer.appendChild(dot);
            });
        }

        const updateDots = (currentIndex) => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const updateButtons = () => {
            const currentIndex = Math.round(carousel.scrollLeft / slideWidth);
            if (prevButton) prevButton.disabled = currentIndex === 0;
            if (nextButton) nextButton.disabled = currentIndex >= slides.length - 1;
        };

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
            });
        }

        carousel.addEventListener('scroll', () => {
            const currentIndex = Math.round(carousel.scrollLeft / slideWidth);
            updateDots(currentIndex);
            updateButtons();
        });

        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
        });
        
        updateButtons();
    });

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaSection = document.querySelector('.cta-section');
        const footer = document.querySelector('.site-footer-main');
        const showAt = ctaSection ? ctaSection.offsetTop : document.body.scrollHeight / 3;
        const hideAt = footer ? footer.offsetTop : document.body.scrollHeight;

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            if (window.scrollY > showAt && scrollPosition < hideAt) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }
    
    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    let currentImageIndex;
    const galleryImages = Array.from(lightboxTriggers);

    function showImage(index) {
        const imgElement = galleryImages[index];
        const imgSrc = imgElement.src;
        const imgAlt = imgElement.alt;
        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt;
        currentImageIndex = index;
    }

    function openLightbox(index) {
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        showImage(index);
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        const nextIndex = (currentImageIndex + 1) % galleryImages.length;
        showImage(nextIndex);
    }

    function showPrevImage() {
        const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage(prevIndex);
    }

    if (lightbox) {
        galleryImages.forEach((trigger, index) => {
            trigger.addEventListener('click', () => openLightbox(index));
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }
});