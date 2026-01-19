document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.sticky-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeButton = document.querySelector('.mobile-menu-close');

    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
            menuToggle.classList.toggle('open', isOpen);
            mobileMenu.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
            mobileMenu.setAttribute('aria-hidden', !isOpen);
        };

        menuToggle.addEventListener('click', () => toggleMenu());
        if (closeButton) {
            closeButton.addEventListener('click', () => toggleMenu(false));
        }
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                toggleMenu(false);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = (index % 5) * 80; // Stagger delay
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }
    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const galleryItems = Array.from(lightboxTriggers);
    let currentIndex = 0;

    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        function showImage(index) {
            currentIndex = index;
            const item = galleryItems[currentIndex];
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt;
            prevBtn.style.display = (currentIndex === 0) ? 'none' : 'flex';
            nextBtn.style.display = (currentIndex === galleryItems.length - 1) ? 'none' : 'flex';
        }

        function openLightbox(e) {
            e.preventDefault();
            const index = galleryItems.indexOf(e.currentTarget);
            showImage(index);
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', openLightbox);
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
                if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
            }
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('show');
                } else {
                    stickyCTA.classList.remove('show');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Magnetic Button --- //
    const magneticButton = document.querySelector('.magnetic-button');
    if (magneticButton && window.matchMedia('(pointer: fine)').matches) {
        magneticButton.addEventListener('mousemove', function(e) {
            const rect = magneticButton.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            magneticButton.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
        });
        magneticButton.addEventListener('mouseleave', function() {
            magneticButton.style.transform = 'translate(0,0)';
        });
    }
});