document.addEventListener('DOMContentLoaded', () => {

    // --- Header & Navigation --- //
    const header = document.getElementById('site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('is-scrolled', window.scrollY > 50);
        });
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('is-open');
            navMenu.classList.toggle('is-open');
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.parentElement.querySelector('.next');
        const prevButton = carousel.parentElement.querySelector('.prev');
        const dotsNav = carousel.parentElement.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        let currentIndex = 0;

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => moveToSlide(i));
                dotsNav.appendChild(dot);
            });
        };

        const updateDots = (targetIndex) => {
            const dots = Array.from(dotsNav.children);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === targetIndex);
            });
        };

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
        };

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });

        createDots();
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        const showCTAObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCTA.classList.add('is-visible');
                } else {
                    stickyCTA.classList.remove('is-visible');
                }
            });
        }, { threshold: 0 });
        const heroSection = document.querySelector('.hero');
        if (heroSection) showCTAObserver.observe(heroSection);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookie_consent')) {
            cookieBanner.hidden = false;
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Lightbox --- //
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt;
            lightboxCaption.textContent = item.dataset.caption || '';
            currentIndex = index;
        };

        const openLightbox = (e, index) => {
            e.preventDefault();
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        const showPrev = () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(newIndex);
        };

        const showNext = () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            showImage(newIndex);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => openLightbox(e, index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});