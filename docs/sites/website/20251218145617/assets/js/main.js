document.addEventListener('DOMContentLoaded', function() {

    // --- 1. STICKY HEADER & SHRINK --- //
    const header = document.querySelector('.site-header.sticky');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. MOBILE NAVIGATION --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- 4. CAROUSEL --- //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-btn.prev');
        const nextButton = document.querySelector('.carousel-btn.next');
        const carouselItems = document.querySelectorAll('.carousel-item');
        let currentIndex = 0;

        const updateCarousel = () => {
            const itemWidth = carouselItems[0].offsetWidth;
            carousel.scrollTo({ left: currentIndex * itemWidth, behavior: 'smooth' });
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % carouselItems.length;
                updateCarousel();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
                updateCarousel();
            });
        }
    }

    // --- 5. GALLERY LIGHTBOX --- //
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        let currentImageIndex;

        const images = Array.from(galleryItems).map(item => item.href);

        const showImage = (index) => {
            lightboxImg.src = images[index];
            currentImageIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.style.display = 'block';
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            showImage(currentImageIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showImage(currentImageIndex);
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // --- 6. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('cookie-accept');

    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            cookieBanner.classList.remove('visible');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

});