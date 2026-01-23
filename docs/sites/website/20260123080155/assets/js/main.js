document.addEventListener('DOMContentLoaded', () => {

    const initMobileNav = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('is-open');
            navToggle.classList.toggle('is-open');
            document.body.classList.toggle('nav-open');
        });
    };

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.animate-in');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    };

    const initCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

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
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        let currentIndex = 0;

        // Create dots
        slides.forEach((slide, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            if (index === 0) button.classList.add('active');
            button.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsNav.appendChild(button);
        });
        const dots = Array.from(dotsNav.children);

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
        };

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        updateCarousel();
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const cookieAccepted = localStorage.getItem('cookie_accepted');

        if (!cookieAccepted) {
            banner.hidden = false;
            setTimeout(() => {
                banner.classList.add('show');
            }, 100);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_accepted', 'true');
            banner.classList.remove('show');
            setTimeout(() => {
                banner.hidden = true;
            }, 500);
        });
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollAnimations();
    initCarousel();
    initCookieBanner();
});