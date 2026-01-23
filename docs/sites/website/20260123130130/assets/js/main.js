document.addEventListener('DOMContentLoaded', () => {

    const initMobileMenu = () => {
        const toggleBtn = document.querySelector('.mobile-menu-toggle');
        const closeBtn = document.querySelector('.mobile-menu-close');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (!toggleBtn || !mobileMenu || !closeBtn) return;

        const openMenu = () => {
            document.body.classList.add('mobile-menu-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            document.body.classList.remove('mobile-menu-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
        };

        toggleBtn.addEventListener('click', () => {
            if (document.body.classList.contains('mobile-menu-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        closeBtn.addEventListener('click', closeMenu);

        document.addEventListener('click', (e) => {
            if (e.target.matches('body.mobile-menu-open')) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
                closeMenu();
            }
        });
    };

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px' });

        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        observer.observe(sentinel);
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const createDots = () => {
            slides.forEach((_, i) => {
                const button = document.createElement('button');
                button.classList.add('carousel-dot');
                if (i === 0) button.classList.add('active');
                button.addEventListener('click', () => moveToSlide(i));
                dotsNav.appendChild(button);
            });
        };
        const dots = dotsNav ? Array.from(dotsNav.children) : [];

        const updateDots = (targetIndex) => {
            if (!dotsNav) return;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[targetIndex].classList.add('active');
        };

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
        };

        nextButton.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            moveToSlide(prevIndex);
        });

        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            moveToSlide(currentIndex);
        });
        
        createDots();
        moveToSlide(0);
    };

    const initLightbox = () => {
        const galleryItems = document.querySelectorAll('[data-lightbox-group]');
        if (galleryItems.length === 0) return;

        const lightbox = document.getElementById('lightbox');
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            const imgSrc = item.href;
            lightboxContent.innerHTML = `<img src='${imgSrc}' alt='${item.querySelector('img').alt}'>`;
            currentIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const index = Array.from(galleryItems).indexOf(e.currentTarget);
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.hidden = true;
                document.body.style.overflow = '';
                lightboxContent.innerHTML = '';
            }, 300);
        };

        const showPrev = () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(newIndex);
        };

        const showNext = () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            showImage(newIndex);
        };

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => {
            if (lightbox.hidden) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    };
    
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            banner.hidden = false;
            setTimeout(() => banner.classList.add('visible'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            banner.classList.remove('visible');
        });
    };

    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        const hero = document.querySelector('.hero');
        if (!cta || !hero) return;

        const observer = new IntersectionObserver(([entry]) => {
            cta.classList.toggle('visible', !entry.isIntersecting);
        }, { threshold: 0.1 });

        observer.observe(hero);
    };

    // Initialize all modules
    initMobileMenu();
    initStickyHeader();
    initScrollReveal();
    initTestimonialCarousel();
    initLightbox();
    initCookieBanner();
    initStickyCta();
});