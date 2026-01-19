document.addEventListener('DOMContentLoaded', function() {

    // --- Helper Functions ---
    const select = (el, all = false) => {
        el = el.trim();
        if (all) {
            return [...document.querySelectorAll(el)];
        } else {
            return document.querySelector(el);
        }
    };

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const mobileNavToggle = select('.mobile-nav-toggle');
    const mainNav = select('.main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            mobileNavToggle.classList.toggle('open');
            const isExpanded = mainNav.classList.contains('open');
            mobileNavToggle.setAttribute('aria-expanded', isExpanded);
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = select('.reveal', true);
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- FAQ Accordion ---
    const faqQuestions = select('.faq-question', true);
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
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
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const slides = select('.testimonial-slide', true);
        const dotsContainer = select('.dots');
        const prevBtn = select('.carousel-controls .prev');
        const nextBtn = select('.carousel-controls .next');
        let currentIndex = 0;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = select('.dots span', true);

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

        const showNext = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
        
        updateCarousel();
    }

    // --- Lightbox Gallery ---
    const galleryItems = select('.gallery-item', true);
    const lightbox = select('#lightbox');
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = select('.lightbox-close');
        const lightboxPrev = select('.lightbox-prev');
        const lightboxNext = select('.lightbox-next');
        let currentIndex = 0;

        const showLightbox = (index) => {
            currentIndex = index;
            const item = galleryItems[currentIndex];
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        const hideLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        const showNextImage = () => {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            showLightbox(currentIndex);
        };

        const showPrevImage = () => {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showLightbox(currentIndex);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showLightbox(index);
            });
        });

        lightboxClose.addEventListener('click', hideLightbox);
        lightboxNext.addEventListener('click', showNextImage);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) hideLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = select('#cookie-banner');
    const acceptBtn = select('#accept-cookies');
    const declineBtn = select('#decline-cookies');
    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieStatus = localStorage.getItem('cookie_status');
        if (!cookieStatus) {
            cookieBanner.hidden = false;
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'accepted');
            cookieBanner.hidden = true;
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'declined');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA & Back to Top Button ---
    const stickyCta = select('.sticky-cta-bar');
    const backToTop = select('#back-to-top');
    if (stickyCta || backToTop) {
        const toggleVisibility = () => {
            const scrollY = window.scrollY;
            if (stickyCta) {
                const showAt = document.body.scrollHeight / 4;
                if (scrollY > showAt) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            }
            if (backToTop) {
                if (scrollY > 300) {
                    backToTop.classList.add('visible');
                    backToTop.hidden = false;
                } else {
                    backToTop.classList.remove('visible');
                    backToTop.hidden = true;
                }
            }
        };
        window.addEventListener('scroll', toggleVisibility);
    }
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});