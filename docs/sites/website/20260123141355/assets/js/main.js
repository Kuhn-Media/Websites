document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('nav-open');
            body.style.overflow = !isExpanded ? 'hidden' : '';
        });
    }

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

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Before/After Slider --- //
    const sliderContainer = document.querySelector('.before-after-slider');
    if (sliderContainer) {
        const sliderInput = sliderContainer.querySelector('.slider-input');
        const afterImage = sliderContainer.querySelector('.after-image');
        const sliderHandle = sliderContainer.querySelector('.slider-handle');

        const updateSlider = (value) => {
            afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
            sliderHandle.style.left = `${value}%`;
        };

        sliderInput.addEventListener('input', (e) => {
            updateSlider(e.target.value);
        });

        // For touch devices
        sliderInput.addEventListener('touchstart', () => {}, { passive: true });
        sliderInput.addEventListener('touchmove', (e) => {
            const rect = sliderContainer.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            sliderInput.value = percentage;
            updateSlider(percentage);
        }, { passive: true });
    }

    // --- Testimonial Carousel --- //
    const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
    if (carouselWrapper) {
        const carousel = carouselWrapper.querySelector('.testimonial-carousel');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = carouselWrapper.querySelector('.prev');
        const nextBtn = carouselWrapper.querySelector('.next');
        const dotsContainer = carouselWrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots[0].classList.add('active');

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });
    }

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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookie_consent')) {
            cookieBanner.hidden = false;
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting
                if (!entry.isIntersecting) {
                    stickyCTA.hidden = false;
                } else {
                    stickyCTA.hidden = true;
                }
            });
        }, { threshold: 0.1 });
        const heroSection = document.querySelector('.hero');
        if(heroSection) ctaObserver.observe(heroSection);
    }

    // --- Lightbox Gallery --- //
    const galleryItems = document.querySelectorAll('[data-gallery-item]');
    const lightbox = document.getElementById('lightbox');
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const galleryData = Array.from(galleryItems).map(item => ({
            src: item.dataset.galleryItem,
            caption: item.dataset.galleryCaption
        }));

        const showImage = (index) => {
            const item = galleryData[index];
            const relativePath = lightbox.ownerDocument.location.pathname.includes('/index.html') ? '' : '../';
            lightboxImage.src = relativePath + item.src;
            lightboxCaption.textContent = item.caption;
            currentIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
            showImage(newIndex);
        });
        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % galleryData.length;
            showImage(newIndex);
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
});