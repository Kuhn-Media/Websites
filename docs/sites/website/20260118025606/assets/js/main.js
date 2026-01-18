document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER --- //
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

    // --- MOBILE MENU --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('#mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                menuToggle.click();
            }
        });
    }

    // --- SCROLL REVEAL --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- CAROUSEL --- //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function createDots() {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
            updateDots();
        }

        prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

        createDots();
    }

    // --- LIGHTBOX --- //
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;
        const images = Array.from(galleryItems).map(item => ({ src: item.href, alt: item.dataset.alt }));

        function showImage(index) {
            const imgData = images[index];
            lightboxImg.src = imgData.src;
            lightboxImg.alt = imgData.alt;
            lightboxCaption.textContent = imgData.alt;
            currentIndex = index;
        }

        function openLightbox(index) {
            lightbox.setAttribute('aria-hidden', 'false');
            lightbox.classList.add('open');
            document.body.classList.add('no-scroll');
            showImage(index);
            setTimeout(() => closeBtn.focus(), 50);
        }

        function closeLightbox() {
            lightbox.setAttribute('aria-hidden', 'true');
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', e => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + images.length) % images.length));
        nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % images.length));

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('open')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- STICKY CTA BAR --- //
    const stickyBar = document.querySelector('.sticky-cta-bar');
    if (stickyBar) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyBar.classList.add('visible');
                } else {
                    stickyBar.classList.remove('visible');
                }
            });
        }, { threshold: 0, rootMargin: '-200px 0px 0px 0px' });
        const heroSection = document.querySelector('.hero');
        if(heroSection) ctaObserver.observe(heroSection);
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('visible');
            }
        }, 2000);

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }
});