document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            const isExpanded = mainNav.parentElement.getAttribute('aria-expanded') === 'true';
            mainNav.parentElement.setAttribute('aria-expanded', !isExpanded);
        });
    }

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

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('button');

        prevButton.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(newIndex);
        });

        nextButton.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            goToSlide(newIndex);
        });

        goToSlide(0); // Initial setup
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const wasOpen = item.classList.contains('open');
            faqItems.forEach(i => i.classList.remove('open')); // Close all
            if (!wasOpen) {
                item.classList.add('open');
            }
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA & Back to Top Button --- //
    const stickyCta = document.getElementById('sticky-cta-bar');
    const backToTopBtn = document.getElementById('back-to-top');
    if (stickyCta || backToTopBtn) {
        window.addEventListener('scroll', () => {
            const showPosition = window.innerHeight * 0.75;
            if (window.scrollY > showPosition) {
                if(stickyCta) stickyCta.classList.add('show');
                if(backToTopBtn) backToTopBtn.classList.add('show');
            } else {
                if(stickyCta) stickyCta.classList.remove('show');
                if(backToTopBtn) backToTopBtn.classList.remove('show');
            }
        });
    }
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Lightbox Gallery --- //
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentImageIndex;

    if (galleryItems.length > 0 && lightbox) {
        const images = Array.from(galleryItems).map(item => item.href);

        const showImage = (index) => {
            lightboxImg.src = images[index];
            currentImageIndex = index;
            lightbox.classList.add('show');
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        const closeLightbox = () => lightbox.classList.remove('show');
        const showPrevImage = () => showImage((currentImageIndex - 1 + images.length) % images.length);
        const showNextImage = () => showImage((currentImageIndex + 1) % images.length);

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }
});