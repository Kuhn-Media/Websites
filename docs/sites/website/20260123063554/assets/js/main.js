document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-stagger');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach((el, index) => {
            if (el.classList.contains('reveal-stagger')) {
                el.style.setProperty('--stagger-index', index);
            }
            observer.observe(el);
        });
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition); // not needed for flexbox approach

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('active');
            targetSlide.classList.add('active');
        };

        let currentIndex = 0;

        const updateDots = (index) => {
            const currentDot = dotsNav.querySelector('.active');
            if (currentDot) currentDot.classList.remove('active');
            dotsNav.children[index].classList.add('active');
        };

        const updateCarousel = () => {
            track.style.transform = 'translateX(-' + (slideWidth * currentIndex) + 'px)';
            updateDots(currentIndex);
        }

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsNav.appendChild(dot);
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
        
        updateDots(0);
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const onScrollCTA = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', onScrollCTA, { passive: true });
    }

    // --- Lightbox Gallery ---
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    if (gallery && lightbox) {
        const galleryItems = gallery.querySelectorAll('a');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            if (item) {
                lightboxImg.src = item.href;
                lightboxImg.alt = item.querySelector('img').alt;
                currentIndex = index;
            }
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.classList.add('visible');
                lightbox.setAttribute('aria-hidden', 'false');
                showImage(index);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        lightboxPrev.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(newIndex);
        });

        lightboxNext.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') lightboxPrev.click();
                if (e.key === 'ArrowRight') lightboxNext.click();
            }
        });
    }

    // --- Contact Form Handler ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const status = document.getElementById('form-status');
            status.textContent = 'Vielen Dank! Ihre Nachricht wird gesendet...';
            // Simulate form submission
            setTimeout(() => {
                status.textContent = 'Ihre Nachricht wurde erfolgreich versendet. Wir melden uns in Kürze!';
                contactForm.reset();
            }, 1500);
        });
    }
});