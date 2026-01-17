document.addEventListener('DOMContentLoaded', function() {

    // Sticky Header
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

    // Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Scroll Reveal Animation
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); 
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // Testimonial Slider
    const slider = document.getElementById('testimonial-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.slider-controls .prev');
        const nextBtn = document.querySelector('.slider-controls .next');
        const dotsContainer = document.querySelector('.slider-dots');
        let currentIndex = 0;

        function createDots() {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            const offset = slides[index].offsetLeft - slider.offsetLeft;
            slider.scrollTo({ left: offset, behavior: 'smooth' });
            updateDots();
        }

        prevBtn.addEventListener('click', () => {
            let newIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            let newIndex = (currentIndex + 1) % slides.length;
            goToSlide(newIndex);
        });
        
        createDots();

        // Update on scroll snap
        let scrollTimer;
        slider.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const scrollLeft = slider.scrollLeft;
                const slideWidth = slides[0].offsetWidth;
                const newIndex = Math.round(scrollLeft / slideWidth);
                if(newIndex !== currentIndex) {
                    currentIndex = newIndex;
                    updateDots();
                }
            }, 150);
        });
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('visible'), 100);
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

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('[data-lightbox-src]');
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentImageIndex;

        const imageSources = Array.from(galleryItems).map(item => item.dataset.lightboxSrc);

        function showImage(index) {
            if (index < 0 || index >= imageSources.length) return;
            currentImageIndex = index;
            lightboxImg.src = imageSources[index];
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function hideLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', hideLightbox);
        prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                hideLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
            }
        });
    }
});