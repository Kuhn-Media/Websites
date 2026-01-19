document.addEventListener('DOMContentLoaded', () => {

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
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('is-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.classList.add('mobile-menu-open');
        });
        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('mobile-menu-open');
        });
    }

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // Carousel
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => { currentIndex = i; updateCarousel(); });
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('button');

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
        
        updateCarousel();
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const galleryImages = Array.from(lightboxTriggers).map(img => ({ src: img.dataset.kmImage || img.src, alt: img.alt }));
    let currentImageIndex = 0;

    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        const showImage = (index) => {
            const imgData = galleryImages[index];
            const pathPrefix = window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../';
            lightboxImg.src = pathPrefix + imgData.src;
            lightboxImg.alt = imgData.alt;
            currentImageIndex = index;
        };

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => {
                lightbox.hidden = false;
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', () => lightbox.hidden = true);
        prevBtn.addEventListener('click', () => showImage((currentImageIndex - 1 + galleryImages.length) % galleryImages.length));
        nextBtn.addEventListener('click', () => showImage((currentImageIndex + 1) % galleryImages.length));
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.hidden = true;
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') lightbox.hidden = true;
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                    stickyCTA.hidden = false;
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

});