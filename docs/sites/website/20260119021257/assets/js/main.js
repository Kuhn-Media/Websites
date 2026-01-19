document.addEventListener('DOMContentLoaded', function() {

    // --- UTILITIES ---
    const select = (el, all = false) => {
        el = el.trim();
        if (all) {
            return [...document.querySelectorAll(el)];
        }
        return document.querySelector(el);
    };

    // --- STICKY HEADER ---
    const header = select('.site-header');
    if (header) {
        const headerScrolled = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('load', headerScrolled);
        document.addEventListener('scroll', headerScrolled);
    }

    // --- MOBILE NAVIGATION ---
    const mobileMenuToggle = select('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            const isExpanded = document.body.classList.contains('nav-open');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealItems = select('.reveal-item', true);
    if (revealItems.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 50}ms`;
            observer.observe(item);
        });
    }

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const slides = select('.testimonial-slide', true);
        const dotsContainer = select('.dots');
        const prevBtn = select('.carousel-controls .prev');
        const nextBtn = select('.carousel-controls .next');
        let currentIndex = 0;
        let slideInterval;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = select('.dot', true);
        goToSlide(0);

        const showNext = () => goToSlide((currentIndex + 1) % slides.length);
        const showPrev = () => goToSlide((currentIndex - 1 + slides.length) % slides.length);

        nextBtn.addEventListener('click', () => { showNext(); resetInterval(); });
        prevBtn.addEventListener('click', () => { showPrev(); resetInterval(); });

        const startInterval = () => {
            slideInterval = setInterval(showNext, 5000);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        startInterval();
    }

    // --- FAQ ACCORDION ---
    const faqItems = select('.faq-item', true);
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- GALLERY LIGHTBOX ---
    const galleryItems = select('.gallery-item img', true);
    const lightbox = select('#lightbox');
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = select('#lightbox-img');
        const closeBtn = select('.close-lightbox');
        const prevBtn = select('.prev-lightbox');
        const nextBtn = select('.next-lightbox');
        let currentIndex = 0;

        const showImage = (index) => {
            lightboxImg.src = galleryItems[index].src;
            currentIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                lightbox.classList.add('active');
                showImage(index);
            });
        });

        const closeLightbox = () => lightbox.classList.remove('active');
        const showNext = () => showImage((currentIndex + 1) % galleryItems.length);
        const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });
    }

    // --- COOKIE BANNER ---
    const cookieBanner = select('#cookie-banner');
    const acceptBtn = select('#cookie-accept');
    const declineBtn = select('#cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
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

    // --- STICKY CONTEXT CTA ---
    const stickyCta = select('#sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = select('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});