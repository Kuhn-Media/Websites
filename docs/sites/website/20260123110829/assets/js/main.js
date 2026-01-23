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
    const navToggle = document.querySelector('.nav-toggle');
    const mainMenu = document.querySelector('#main-menu');
    if (navToggle && mainMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            mainMenu.classList.toggle('open');
            document.body.style.overflow = mainMenu.classList.contains('open') ? 'hidden' : '';
            navToggle.setAttribute('aria-expanded', mainMenu.classList.contains('open'));
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-in-up, .reveal-fade-in-left, .reveal-fade-in-right, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let delay = 0;
                if (entry.target.classList.contains('reveal-stagger')) {
                    delay = (parseInt(entry.target.dataset.staggerIndex) || 0) * 100;
                }
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-stagger').forEach((el, index) => {
        el.dataset.staggerIndex = index;
    });
    revealElements.forEach(el => observer.observe(el));

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const showAt = document.body.scrollHeight / 4;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showAt && (window.innerHeight + window.scrollY) < document.body.offsetHeight - 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');
    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }
    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }
    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Carousel --- //
    const carousel = document.getElementById('image-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }

        function showSlide(index) {
            if (index >= slides.length) currentIndex = 0;
            else if (index < 0) currentIndex = slides.length - 1;
            else currentIndex = index;
            updateCarousel();
        }

        prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
        dots.forEach(dot => dot.addEventListener('click', () => showSlide(parseInt(dot.dataset.index))));

        updateCarousel();
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const galleryImages = Array.from(lightboxTriggers).map(img => img.dataset.kmImage || img.src);
    let currentImageIndex = 0;

    function showLightbox(index) {
        currentImageIndex = index;
        const imagePath = galleryImages[index];
        const isSubpage = window.location.pathname.includes('/leistungen/') || window.location.pathname.includes('/ueber-uns/') || window.location.pathname.includes('/kontakt/');
        lightboxImg.src = isSubpage ? `../${imagePath}` : imagePath;
        lightbox.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function hideLightbox() {
        lightbox.classList.remove('visible');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        const newIndex = (currentImageIndex + 1) % galleryImages.length;
        showLightbox(newIndex);
    }

    function showPrevImage() {
        const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        showLightbox(newIndex);
    }

    lightboxTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            showLightbox(index);
        });
    });

    if (lightbox) {
        lightbox.querySelector('.lightbox-close').addEventListener('click', hideLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) hideLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }
});