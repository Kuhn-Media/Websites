document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER ---
    const header = document.querySelector('.km-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE NAVIGATION ---
    const burgerMenu = document.querySelector('.km-burger-menu');
    const nav = document.querySelector('.km-nav');
    if (burgerMenu) {
        burgerMenu.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }
    // Close nav when a link is clicked
    if (nav) {
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('nav-open');
            });
        });
    }

    // --- SMOOTH SCROLL ---
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

    // --- SCROLL REVEAL ---
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el, index) => {
        el.style.transitionDelay = `${100 + index * 60}ms`;
        revealObserver.observe(el);
    });

    // --- FAQ ACCORDION ---
    const accordionItems = document.querySelectorAll('.km-accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.km-accordion-header');
        const content = item.querySelector('.km-accordion-content');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.km-accordion-content').style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // --- TESTIMONIALS CAROUSEL ---
    class SimpleCarousel {
        constructor(element) {
            this.carousel = element;
            if (!this.carousel) return;
            this.track = this.carousel.querySelector('.km-carousel-track');
            this.slides = [...this.carousel.querySelectorAll('.km-carousel-slide')];
            if (this.slides.length === 0) return;

            this.prevBtn = this.carousel.querySelector('.km-carousel-nav-prev');
            this.nextBtn = this.carousel.querySelector('.km-carousel-nav-next');
            this.dotsContainer = this.carousel.querySelector('.km-carousel-dots');
            
            this.currentIndex = 0;
            this.autoRotate = this.carousel.dataset.autoRotate !== 'false';
            this.interval = null;
            
            this.init();
        }

        init() {
            this.createDots();
            this.updateCarousel();
            this.attachEvents();
            if (this.autoRotate) this.startAutoRotate();
        }

        createDots() {
            if (!this.dotsContainer) return;
            this.slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('km-carousel-dot');
                dot.setAttribute('aria-label', `Gehe zu Slide ${i + 1}`);
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dotsContainer.appendChild(dot);
            });
        }

        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
        }

        updateCarousel() {
            const offset = -this.currentIndex * 100;
            this.track.style.transform = `translateX(${offset}%)`;
            this.updateDots();
        }
        
        next() {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.goToSlide(this.currentIndex);
        }

        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(this.currentIndex);
        }

        updateDots() {
            if (!this.dotsContainer) return;
            [...this.dotsContainer.children].forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }

        startAutoRotate() {
            this.stopAutoRotate();
            this.interval = setInterval(() => this.next(), 6000);
        }

        stopAutoRotate() {
            if (this.interval) clearInterval(this.interval);
        }

        attachEvents() {
            if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
            if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
            
            this.carousel.addEventListener('mouseenter', () => this.stopAutoRotate());
            this.carousel.addEventListener('mouseleave', () => {
                if (this.autoRotate) this.startAutoRotate();
            });

            let touchStartX = 0;
            this.track.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                this.stopAutoRotate();
            }, { passive: true });

            this.track.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? this.next() : this.prev();
                }
                if (this.autoRotate) this.startAutoRotate();
            });
        }
    }

    document.querySelectorAll('.km-carousel').forEach(el => new SimpleCarousel(el));
});