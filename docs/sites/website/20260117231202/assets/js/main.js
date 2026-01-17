document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.getElementById('mobile-nav-menu');
    const navClose = document.querySelector('.mobile-nav-close');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('open');
            document.body.classList.add('mobile-nav-open');
        });

        const closeMenu = () => {
            navMenu.classList.remove('open');
            document.body.classList.remove('mobile-nav-open');
        };

        if (navClose) navClose.addEventListener('click', closeMenu);
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Staggered delay
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

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

        if(nextBtn) nextBtn.addEventListener('click', showNext);
        if(prevBtn) prevBtn.addEventListener('click', showPrev);

        // Basic swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) showNext();
            if (touchendX > touchstartX) showPrev();
        });

        // Auto-play
        setInterval(showNext, 7000);
    }

    // --- Magnetic Button ---
    const magneticBtn = document.querySelector('.magnetic-btn');
    if (magneticBtn && window.matchMedia('(pointer: fine)').matches) {
        magneticBtn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            this.style.boxShadow = `0px ${Math.abs(y * 0.2)}px 20px rgba(0,0,0,0.2)`;
        });
        magneticBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0,0)';
            this.style.boxShadow = 'var(--shadow-lift)';
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.hidden = true;
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if(heroSection) ctaObserver.observe(heroSection);
    }

    // --- Lightbox --- 
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const galleryItems = document.querySelectorAll('.lightbox-trigger');
    let currentIndex = 0;

    if (lightbox && lightboxImage && galleryItems.length > 0) {
        const images = Array.from(galleryItems).map(item => item.href);

        const showImage = (index) => {
            lightboxImage.src = images[index];
            currentIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', e => {
                e.preventDefault();
                lightbox.classList.add('active');
                lightbox.ariaHidden = 'false';
                showImage(index);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.ariaHidden = 'true';
        };

        const showNextImage = () => showImage((currentIndex + 1) % images.length);
        const showPrevImage = () => showImage((currentIndex - 1 + images.length) % images.length);

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });

        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-next').addEventListener('click', showNextImage);
        document.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);

        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }
});