document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER ---
    const header = document.querySelector('.km-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- MOBILE NAVIGATION ---
    const burgerMenu = document.querySelector('.km-burger-menu');
    const mobileNav = document.querySelector('.km-nav-mobile');
    const body = document.body;
    burgerMenu.addEventListener('click', () => {
        body.classList.toggle('menu-open');
    });
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('menu-open');
        });
    });

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- TESTIMONIALS CAROUSEL ---
    class SimpleCarousel {
        constructor(element) {
            this.carousel = element;
            if (!this.carousel) return;
            this.track = this.carousel.querySelector('.km-carousel-track');
            this.slides = Array.from(this.track.children);
            this.dotsContainer = this.carousel.querySelector('.km-carousel-dots');
            this.currentIndex = 0;
            this.interval = null;

            this.init();
        }

        init() {
            this.createDots();
            this.updateCarousel();
            this.startAutoRotate();
            this.addEventListeners();
        }

        createDots() {
            if (!this.dotsContainer) return;
            this.slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('km-carousel-dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dotsContainer.appendChild(dot);
            });
            this.dots = Array.from(this.dotsContainer.children);
        }

        updateCarousel() {
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            if (this.dots) {
                this.dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentIndex));
            }
        }

        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
            this.resetAutoRotate();
        }

        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.updateCarousel();
        }

        startAutoRotate() {
            this.interval = setInterval(() => this.nextSlide(), 6000);
        }

        stopAutoRotate() {
            clearInterval(this.interval);
        }

        resetAutoRotate() {
            this.stopAutoRotate();
            this.startAutoRotate();
        }

        addEventListeners() {
            let touchStartX = 0;
            this.carousel.addEventListener('mouseenter', () => this.stopAutoRotate());
            this.carousel.addEventListener('mouseleave', () => this.startAutoRotate());
            this.track.addEventListener('touchstart', (e) => touchStartX = e.touches[0].clientX, { passive: true });
            this.track.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    const nextIndex = diff > 0 ? (this.currentIndex + 1) % this.slides.length : (this.currentIndex - 1 + this.slides.length) % this.slides.length;
                    this.goToSlide(nextIndex);
                }
            });
        }
    }

    new SimpleCarousel(document.querySelector('.km-carousel'));

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- FLOATING LABELS FOR CONTACT FORM ---
    const formGroups = document.querySelectorAll('.km-form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (input) {
            // Add placeholder to prevent label from overlapping on autofill
            input.placeholder = ' ';
        }
    });
});