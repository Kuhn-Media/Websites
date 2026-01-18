document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.getElementById('mobile-nav-drawer');
    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navDrawer.classList.toggle('is-open');
            navDrawer.setAttribute('aria-hidden', isOpen);
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });
    }

    // --- Sticky Header ---
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

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.dataset.reveal === 'stagger-up') {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                        children[i].classList.add('is-visible');
                    }
                } else {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Before/After Slider ---
    const baSlider = document.querySelector('.before-after-slider');
    if (baSlider) {
        const handle = baSlider.querySelector('.ba-slider-handle');
        const afterImage = baSlider.querySelector('.ba-image-after');
        let isDragging = false;

        const moveSlider = (x) => {
            const rect = baSlider.getBoundingClientRect();
            let pos = (x - rect.left) / rect.width * 100;
            pos = Math.max(0, Math.min(100, pos));
            handle.style.left = pos + '%';
            afterImage.style.width = pos + '%';
        };

        baSlider.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
        baSlider.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('touchend', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });
        window.addEventListener('touchmove', (e) => { if (isDragging) moveSlider(e.touches[0].clientX); });
    }

    // --- FAQ Accordion ---
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
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Lightbox --- 
    const lightbox = document.getElementById('lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const galleryItems = Array.from(lightboxTriggers);
    let currentIndex = 0;

    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        const showImage = (index) => {
            const item = galleryItems[index];
            lightboxImage.src = item.href;
            lightboxImage.alt = item.querySelector('img').alt;
            currentIndex = index;
        };

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.classList.add('active');
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
        prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
        nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });
        document.addEventListener('keydown', (e) => { 
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' });
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});