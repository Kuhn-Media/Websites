document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('is-open');
            navList.classList.toggle('is-open');
            document.body.style.overflow = !isOpen ? 'hidden' : '';
        });

        document.addEventListener('click', (e) => {
            if (navList.classList.contains('is-open') && !e.target.closest('.main-nav')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('is-open');
                navList.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });
    }

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

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    });

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-in');
    const observer = new IntersectionObserver((entries) => {
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

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('visible'), 100);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 300);
        });
    }
    
    // --- Carousel ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = wrapper.querySelector('.carousel-button.next');
        const prevButton = wrapper.querySelector('.carousel-button.prev');
        const dotsNav = wrapper.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('active');
            targetDot.classList.add('active');
        }

        if (dotsNav) {
            slides.forEach((slide, index) => {
                const button = document.createElement('button');
                button.classList.add('carousel-dot');
                if (index === 0) button.classList.add('active');
                button.addEventListener('click', e => {
                    const currentSlide = track.querySelector('.current-slide');
                    const currentDot = dotsNav.querySelector('.active');
                    const targetIndex = slides.findIndex(s => s === slide);
                    moveToSlide(track, currentSlide, slides[targetIndex]);
                    updateDots(currentDot, button);
                });
                dotsNav.appendChild(button);
            });
        }

        track.children[0].classList.add('current-slide');

        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            if (prevSlide) {
                moveToSlide(track, currentSlide, prevSlide);
                if(dotsNav) updateDots(dotsNav.querySelector('.active'), dotsNav.querySelector('.active').previousElementSibling);
            }
        });

        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;
            if (nextSlide) {
                moveToSlide(track, currentSlide, nextSlide);
                if(dotsNav) updateDots(dotsNav.querySelector('.active'), dotsNav.querySelector('.active').nextElementSibling);
            }
        });
        
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });
        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });
        track.addEventListener('mouseup', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });
        track.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });
        
        const updateCarousel = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = 'translateX(0)';
            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
        };

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    });
    
    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        let currentIndex = 0;
        const imageSources = Array.from(galleryItems).map(item => item.getAttribute('href'));

        const showImage = (index) => {
            lightboxImg.setAttribute('src', imageSources[index]);
            currentIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.hidden = false;
                setTimeout(() => lightbox.classList.add('visible'), 10);
                showImage(index);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => lightbox.hidden = true, 300);
        };

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % imageSources.length;
            showImage(nextIndex);
        });

        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
            showImage(prevIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
                if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
            }
        });
    }
});