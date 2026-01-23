document.addEventListener('DOMContentLoaded', function() {

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

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const body = document.body;
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            body.classList.toggle('nav-open');
            const isExpanded = body.classList.contains('nav-open');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        document.querySelector('.nav-overlay').addEventListener('click', () => {
            body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('nav-open')) {
                body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
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
                answer.style.padding = '0 0 16px';
            } else {
                answer.style.maxHeight = '0';
                answer.style.padding = '0';
            }
        });
    });

    // --- Carousel ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-next');
        const prevButton = carousel.querySelector('.carousel-prev');
        const dotsNav = carousel.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            if(prevButton) prevButton.disabled = currentIndex === 0;
            if(nextButton) nextButton.disabled = currentIndex === slides.length - 1;
            if (dotsNav) {
                Array.from(dotsNav.children).forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        };

        if (dotsNav) {
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('carousel-dot');
                button.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(button);
            });
        }

        if(nextButton) nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
        if(prevButton) prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));

        moveToSlide(0);
    });

    // --- Cookie Banner ---
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

    // --- Lightbox --- 
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    let currentImageIndex;

    if(galleryItems.length > 0) {
        const images = Array.from(galleryItems).map(item => item.src);

        const showImage = (index) => {
            if (index < 0 || index >= images.length) return;
            lightboxImg.src = images[index];
            currentImageIndex = index;
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === images.length - 1 ? 'none' : 'block';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                lightbox.style.display = 'block';
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
        prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') closeBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
});