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
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';

            if (navMenu.classList.contains('active')) {
                let overlay = document.createElement('div');
                overlay.className = 'nav-menu-overlay';
                document.body.appendChild(overlay);
                overlay.addEventListener('click', closeNav);
            } else {
                const overlay = document.querySelector('.nav-menu-overlay');
                if (overlay) overlay.remove();
            }
        });

        function closeNav() {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            const overlay = document.querySelector('.nav-menu-overlay');
            if (overlay) overlay.remove();
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeNav();
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion --- //
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

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            const slideWidth = slides[0].getBoundingClientRect().width;
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', (e) => {
            let touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) nextBtn.click();
            if (touchEndX - touchStartX > 50) prevBtn.click();
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
        let currentImageIndex;

        const showImage = (index) => {
            const item = galleryItems[index];
            const imgSrc = item.href;
            const imgTitle = item.dataset.title || '';
            lightbox.querySelector('.lightbox-image').src = imgSrc;
            lightbox.querySelector('.lightbox-title').textContent = imgTitle;
            currentImageIndex = index;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        const closeLightbox = () => { 
            lightbox.hidden = true; 
            document.body.style.overflow = '';
        };

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            showImage((currentImageIndex + 1) % galleryItems.length);
        });

        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            showImage((currentImageIndex - 1 + galleryItems.length) % galleryItems.length);
        });
    }

    // --- Cookie Banner --- //
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

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const dismissStickyCTA = document.getElementById('dismiss-sticky-cta');
    if (stickyCTA && dismissStickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCTA.hidden = false;
            } else {
                stickyCTA.hidden = true;
            }
        });
        dismissStickyCTA.addEventListener('click', () => {
            stickyCTA.style.display = 'none';
        });
    }
});