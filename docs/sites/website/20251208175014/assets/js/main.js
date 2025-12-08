document.addEventListener('DOMContentLoaded', () => {

    // --- Feather Icons --- //
    feather.replace();

    // --- Sticky Header --- //
    const header = document.querySelector('.km-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.km-nav-toggle');
    const mobileNav = document.querySelector('.km-nav-mobile');
    const mobileNavLinks = mobileNav.querySelectorAll('a');

    navToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Smooth Scroll --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = header.offsetHeight;
                const top = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Scroll Reveal --- //
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- Testimonials Carousel --- //
    class SimpleCarousel {
        constructor(element) {
            this.carousel = element;
            this.track = this.carousel.querySelector('.km-carousel-track');
            this.slides = Array.from(this.track.children);
            this.nextBtn = this.carousel.querySelector('.km-carousel-nav-next');
            this.prevBtn = this.carousel.querySelector('.km-carousel-nav-prev');
            this.dotsNav = this.carousel.querySelector('.km-carousel-dots');
            this.currentIndex = 0;
            this.init();
        }

        init() {
            this.setupDots();
            this.updateCarousel();
            this.attachEvents();
            this.startAutoRotate();
        }

        setupDots() {
            if (!this.dotsNav) return;
            this.slides.forEach((_, i) => {
                const button = document.createElement('button');
                button.classList.add('km-carousel-dot');
                button.addEventListener('click', () => this.goToSlide(i));
                this.dotsNav.appendChild(button);
            });
            this.dots = Array.from(this.dotsNav.children);
        }

        updateCarousel() {
            const slideWidth = this.slides[0].getBoundingClientRect().width;
            this.track.style.transform = `translateX(-${slideWidth * this.currentIndex}px)`;

            if (this.dots) {
                this.dots.forEach(dot => dot.classList.remove('active'));
                this.dots[this.currentIndex].classList.add('active');
            }
        }

        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
        }

        next() {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.updateCarousel();
        }

        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.updateCarousel();
        }
        
        startAutoRotate() {
            this.interval = setInterval(() => this.next(), 7000);
        }
        
        stopAutoRotate() {
            clearInterval(this.interval);
        }

        attachEvents() {
            if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
            if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
            this.carousel.addEventListener('mouseenter', () => this.stopAutoRotate());
            this.carousel.addEventListener('mouseleave', () => this.startAutoRotate());
            
            let startX = 0;
            let isDragging = false;
            this.track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; });
            this.track.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                const endX = e.changedTouches[0].clientX;
                if (startX - endX > 50) this.next();
                else if (startX - endX < -50) this.prev();
                isDragging = false;
            });
        }
    }

    document.querySelectorAll('.km-carousel').forEach(el => new SimpleCarousel(el));

    // --- Gallery Lightbox --- //
    class Lightbox {
        constructor() {
            this.lightboxEl = document.querySelector('.km-lightbox');
            if (!this.lightboxEl) return;
            this.imageEl = this.lightboxEl.querySelector('.km-lightbox-image');
            this.closeBtn = this.lightboxEl.querySelector('.km-lightbox-close');
            this.attachEvents();
        }

        open(src, alt) {
            this.imageEl.src = src;
            this.imageEl.alt = alt || '';
            this.lightboxEl.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        close() {
            this.lightboxEl.classList.remove('active');
            document.body.style.overflow = '';
        }

        attachEvents() {
            this.closeBtn.addEventListener('click', () => this.close());
            this.lightboxEl.addEventListener('click', (e) => {
                if (e.target === this.lightboxEl) this.close();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.lightboxEl.classList.contains('active')) this.close();
            });
        }
    }

    const lightbox = new Lightbox();
    document.querySelectorAll('.km-gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            lightbox.open(img.src, img.alt);
        });
    });

});