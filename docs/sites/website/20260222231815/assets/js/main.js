document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNavMenu) {
        const toggleNav = () => {
            const isOpen = mobileNavMenu.classList.toggle('open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('scroll-lock', isOpen);
        };

        mobileNavToggle.addEventListener('click', toggleNav);
        if(mobileNavClose) mobileNavClose.addEventListener('click', toggleNav);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
                toggleNav();
            }
        });
    }

    // --- STICKY HEADER ---
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
            });
        }
    });

    // --- TESTIMONIAL CAROUSEL ---
    const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
    if (carouselWrapper) {
        const carousel = carouselWrapper.querySelector('.testimonial-carousel');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = carouselWrapper.querySelector('.prev');
        const nextBtn = carouselWrapper.querySelector('.next');
        const dotsContainer = carouselWrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length > 1) {
            // Create dots
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
            const dots = dotsContainer.querySelectorAll('.carousel-dot');

            const updateCarousel = () => {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            };

            const goToSlide = (index) => {
                currentIndex = index;
                updateCarousel();
            };

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- LIGHTBOX ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let currentImageIndex = 0;
        const imageSources = Array.from(galleryItems).map(item => item.href);

        const showLightbox = (index) => {
            currentImageIndex = index;
            lightboxImage.src = imageSources[currentImageIndex];
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-lock');
        };

        const hideLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-lock');
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : imageSources.length - 1;
            lightboxImage.src = imageSources[currentImageIndex];
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex < imageSources.length - 1) ? currentImageIndex + 1 : 0;
            lightboxImage.src = imageSources[currentImageIndex];
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showLightbox(index);
            });
        });

        closeBtn.addEventListener('click', hideLightbox);
        backdrop.addEventListener('click', hideLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- STICKY CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const handleCtaScroll = () => {
            // Show after scrolling past 1 viewport height
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCta.classList.add('show');
            } else {
                stickyCta.classList.remove('show');
            }
        };
        window.addEventListener('scroll', handleCtaScroll, { passive: true });
    }

    // --- FORM SUBJECT from URL ---
    const contactFormSubject = document.getElementById('subject');
    if(contactFormSubject) {
        const urlParams = new URLSearchParams(window.location.search);
        const subject = urlParams.get('subject');
        if(subject) {
            contactFormSubject.value = subject;
        }
    }
});