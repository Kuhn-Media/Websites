document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
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

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpened = document.body.classList.toggle('nav-open');
            mobileNavToggle.setAttribute('aria-expanded', isOpened);
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger animation for child elements
                const staggerItems = entry.target.querySelectorAll('.stagger-group > *');
                staggerItems.forEach((item, index) => {
                    item.style.setProperty('--stagger-index', index);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
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

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            updateDots(index);
            currentIndex = index;
        };

        const updateDots = (index) => {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
        
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', (e) => {
            let touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) nextBtn.click();
            if (touchEndX - touchStartX > 50) prevBtn.click();
        });

        goToSlide(0);
    }

    // --- Lightbox Gallery ---
    const lightbox = document.getElementById('lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentImageIndex;

        const images = Array.from(lightboxTriggers).map(trigger => trigger.getAttribute('href'));

        const showImage = (index) => {
            lightboxImg.setAttribute('src', images[index]);
            currentImageIndex = index;
        };

        const openLightbox = (index) => {
            lightbox.classList.add('active');
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
        };

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (lightbox.classList.contains('active')) {
                if (e.key === 'ArrowRight') nextBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
            }
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentImageIndex + 1) % images.length;
            showImage(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }
    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('visible');
            localStorage.setItem('cookieAccepted', 'true');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero, .hero-subpage');
        const footer = document.querySelector('.site-footer-main');

        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                if (entry.target === heroSection && !entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                }
                // Hide when hero IS intersecting
                if (entry.target === heroSection && entry.isIntersecting) {
                    stickyCTA.classList.remove('visible');
                }
                // Hide when footer is intersecting
                if (entry.target === footer && entry.isIntersecting) {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        if (heroSection) ctaObserver.observe(heroSection);
        if (footer) ctaObserver.observe(footer);
    }
    
    // --- Contact Form Subject Prefill ---
    const urlParams = new URLSearchParams(window.location.search);
    const bewerbung = urlParams.get('bewerbung');
    if (bewerbung) {
        const subjectField = document.querySelector('#subject');
        if (subjectField) {
            let jobTitle = '';
            if (bewerbung === 'anlagenmechaniker') jobTitle = 'Anlagenmechaniker SHK';
            if (bewerbung === 'elektroniker') jobTitle = 'Elektroniker für Energie- & Gebäudetechnik';
            if (jobTitle) {
                subjectField.value = `Bewerbung als ${jobTitle}`;
            }
        }
    }
});