document.addEventListener('DOMContentLoaded', () => {

    const App = {
        init() {
            this.cacheDOMElements();
            this.initEventListeners();
            this.initIntersectionObserver();
            this.initCookieBanner();
            this.initCarousel();
            this.initLightbox();
            this.initAccordion();
            this.updateHeaderHeightVar();
        },

        cacheDOMElements() {
            this.header = document.querySelector('.site-header');
            this.mobileNavToggle = document.querySelector('.mobile-nav-toggle');
            this.mobileNavClose = document.querySelector('.mobile-nav-close');
            this.mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
            this.mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
            this.mobileNavLinks = document.querySelectorAll('.mobile-nav a');
            this.cookieBanner = document.getElementById('cookie-banner');
            this.cookieAcceptBtn = document.getElementById('cookie-accept');
            this.cookieDeclineBtn = document.getElementById('cookie-decline');
            this.stickyCTA = document.getElementById('sticky-cta');
            this.carousel = document.querySelector('.carousel-container');
            this.lightbox = document.getElementById('lightbox');
            this.accordionItems = document.querySelectorAll('.accordion-item');
        },

        initEventListeners() {
            window.addEventListener('scroll', this.handleScroll.bind(this));
            window.addEventListener('resize', this.updateHeaderHeightVar.bind(this));

            if (this.mobileNavToggle) {
                this.mobileNavToggle.addEventListener('click', this.openMobileNav.bind(this));
                this.mobileNavClose.addEventListener('click', this.closeMobileNav.bind(this));
                this.mobileNavBackdrop.addEventListener('click', this.closeMobileNav.bind(this));
                this.mobileNavLinks.forEach(link => link.addEventListener('click', this.closeMobileNav.bind(this)));
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
                        this.closeMobileNav();
                    }
                });
            }
        },

        updateHeaderHeightVar() {
            if (!this.header) return;
            const headerHeight = this.header.offsetHeight;
            document.documentElement.style.setProperty('--header-h', `${headerHeight}px`);
        },

        handleScroll() {
            // Sticky Header
            if (this.header) {
                this.header.classList.toggle('is-sticky', window.scrollY > 50);
            }
            // Sticky CTA
            if (this.stickyCTA) {
                const footer = document.querySelector('.site-footer');
                if (footer) {
                    const footerRect = footer.getBoundingClientRect();
                    const isVisible = window.scrollY > 400 && footerRect.top > window.innerHeight;
                    this.stickyCTA.classList.toggle('is-visible', isVisible);
                }
            }
        },

        openMobileNav() {
            document.body.classList.add('mobile-nav-open');
            this.mobileNavToggle.setAttribute('aria-expanded', 'true');
            this.mobileNavDrawer.setAttribute('aria-hidden', 'false');
            this.mobileNavDrawer.querySelector('a').focus();
        },

        closeMobileNav() {
            document.body.classList.remove('mobile-nav-open');
            this.mobileNavToggle.setAttribute('aria-expanded', 'false');
            this.mobileNavDrawer.setAttribute('aria-hidden', 'true');
            this.mobileNavToggle.focus();
        },

        initIntersectionObserver() {
            const revealElements = document.querySelectorAll('.reveal-up, .reveal-stagger-group');
            if (revealElements.length === 0) return;

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        if (entry.target.classList.contains('reveal-stagger-group')) {
                            const children = entry.target.children;
                            for (let i = 0; i < children.length; i++) {
                                children[i].style.transitionDelay = `${i * 100}ms`;
                            }
                        }
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -10% 0px' });

            revealElements.forEach(el => observer.observe(el));
        },

        initCookieBanner() {
            if (!this.cookieBanner || !this.cookieAcceptBtn || !this.cookieDeclineBtn) return;
            const cookieConsent = localStorage.getItem('cookieConsent');
            if (!cookieConsent) {
                setTimeout(() => this.cookieBanner.classList.add('is-visible'), 1000);
            }

            this.cookieAcceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                this.cookieBanner.classList.remove('is-visible');
            });

            this.cookieDeclineBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'declined');
                this.cookieBanner.classList.remove('is-visible');
            });
        },

        initCarousel() {
            if (!this.carousel) return;
            const track = this.carousel.querySelector('.carousel-track');
            const slides = Array.from(track.children);
            const nextButton = this.carousel.querySelector('.carousel-button--next');
            const prevButton = this.carousel.querySelector('.carousel-button--prev');
            const dotsNav = this.carousel.querySelector('.carousel-dots');
            const slideWidth = slides[0].getBoundingClientRect().width;

            const setSlidePosition = (slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            };
            slides.forEach(setSlidePosition);

            slides.forEach((slide, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('is-active');
                dot.addEventListener('click', () => {
                    moveToSlide(track, currentSlide, slides[index]);
                    updateDots(currentDot, dot);
                    currentSlide = slides[index];
                    currentDot = dot;
                });
                dotsNav.appendChild(dot);
            });

            const dots = Array.from(dotsNav.children);
            let currentSlide = slides[0];
            let currentDot = dots[0];

            const moveToSlide = (track, currentSlide, targetSlide) => {
                track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
                currentSlide.classList.remove('is-current');
                targetSlide.classList.add('is-current');
            };

            const updateDots = (currentDot, targetDot) => {
                currentDot.classList.remove('is-active');
                targetDot.classList.add('is-active');
            };

            nextButton.addEventListener('click', () => {
                const nextSlide = currentSlide.nextElementSibling || slides[0];
                const nextDot = currentDot.nextElementSibling || dots[0];
                moveToSlide(track, currentSlide, nextSlide);
                updateDots(currentDot, nextDot);
                currentSlide = nextSlide;
                currentDot = nextDot;
            });

            prevButton.addEventListener('click', () => {
                const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
                const prevDot = currentDot.previousElementSibling || dots[dots.length - 1];
                moveToSlide(track, currentSlide, prevSlide);
                updateDots(currentDot, prevDot);
                currentSlide = prevSlide;
                currentDot = prevDot;
            });
        },

        initLightbox() {
            if (!this.lightbox) return;
            const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
            if (galleryItems.length === 0) return;

            const lightboxImg = this.lightbox.querySelector('img');
            const closeBtn = this.lightbox.querySelector('.lightbox__close');
            const prevBtn = this.lightbox.querySelector('.lightbox__prev');
            const nextBtn = this.lightbox.querySelector('.lightbox__next');
            let currentIndex = 0;

            const showImage = (index) => {
                const item = galleryItems[index];
                lightboxImg.src = item.href;
                lightboxImg.alt = item.querySelector('img').alt;
                currentIndex = index;
            };

            galleryItems.forEach((item, index) => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.lightbox.classList.add('is-visible');
                    this.lightbox.setAttribute('aria-hidden', 'false');
                    showImage(index);
                });
            });

            const closeLightbox = () => {
                this.lightbox.classList.remove('is-visible');
                this.lightbox.setAttribute('aria-hidden', 'true');
            };

            closeBtn.addEventListener('click', closeLightbox);
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) closeLightbox();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.lightbox.classList.contains('is-visible')) closeLightbox();
                if (e.key === 'ArrowRight' && this.lightbox.classList.contains('is-visible')) nextBtn.click();
                if (e.key === 'ArrowLeft' && this.lightbox.classList.contains('is-visible')) prevBtn.click();
            });

            nextBtn.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % galleryItems.length;
                showImage(nextIndex);
            });

            prevBtn.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                showImage(prevIndex);
            });
        },

        initAccordion() {
            if (this.accordionItems.length === 0) return;
            this.accordionItems.forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');

                header.addEventListener('click', () => {
                    const isExpanded = header.getAttribute('aria-expanded') === 'true';
                    header.setAttribute('aria-expanded', !isExpanded);
                    content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
                });
            });
        }
    };

    App.init();
});