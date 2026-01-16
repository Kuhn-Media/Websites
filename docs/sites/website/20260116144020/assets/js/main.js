document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive);
            document.body.classList.toggle('nav-open', isActive);
        });
    }

    // Sticky Header
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

    // Scroll Reveal Animation
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealItems.forEach(item => revealObserver.observe(item));

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // Testimonial Slider
    const slider = document.getElementById('testimonial-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        const dotsContainer = document.querySelector('.slider-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            slider.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('button');

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
        
        goToSlide(0); // Initialize
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.hidden = true;
        });
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.hidden = true;
        });
    }

    // Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                    stickyCTA.hidden = false;
                } else {
                    stickyCTA.classList.remove('visible');
                    stickyCTA.addEventListener('transitionend', () => { stickyCTA.hidden = true; }, { once: true });
                }
            });
        }, { threshold: 0.1 });
        const heroSection = document.querySelector('.hero');
        if(heroSection) ctaObserver.observe(heroSection);
    }
    
    // Lightbox Gallery
    const lightbox = document.getElementById('lightbox');
    const gallery = document.querySelector('.lightbox-gallery');
    if (lightbox && gallery) {
        const galleryItems = gallery.querySelectorAll('a');
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            lightboxImg.src = galleryItems[index].href;
            lightboxImg.alt = galleryItems[index].querySelector('img').alt;
            currentIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.hidden = false;
                showImage(index);
            });
        });

        const closeLightbox = () => lightbox.hidden = true;
        const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNext = () => showImage((currentIndex + 1) % galleryItems.length);

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});