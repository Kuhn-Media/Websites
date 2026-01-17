document.addEventListener('DOMContentLoaded', function() {

    // Sticky Header
    const header = document.querySelector('.sticky-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-drawer');
    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('open');
            menuOverlay.classList.toggle('open');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
        menuOverlay.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('open');
            menuOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // FAQ Accordion
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

    // Testimonial Carousel
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.next');
        const prevButton = document.querySelector('.prev');
        const dotsNav = document.querySelector('.dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        let currentIndex = 0;

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
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
            carousel.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
        };

        nextButton.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            moveToSlide(newIndex);
        });

        prevButton.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(newIndex);
        });
        
        createDots();

        // Touch support
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        const handleSwipe = () => {
            if (touchendX < touchstartX) {
                nextButton.click();
            }
            if (touchendX > touchstartX) {
                prevButton.click();
            }
        }
    }

    // Scroll Reveal
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100); // Staggered delay
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.hidden = true;
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.hidden = true;
        });
    }

    // Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.hidden = false;
            } else {
                stickyCTA.hidden = true;
            }
        });
    }

    // Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeLightbox = lightbox.querySelector('.close-lightbox');
    const prevButton = lightbox.querySelector('.prev-lightbox');
    const nextButton = lightbox.querySelector('.next-lightbox');
    let currentIndex = 0;

    const images = Array.from(galleryItems).map(item => ({
        src: item.src,
        alt: item.alt
    }));

    function showImage(index) {
        const img = images[index];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        currentIndex = index;
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            lightbox.hidden = false;
            showImage(index);
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.hidden = true;
    });

    prevButton.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(newIndex);
    });

    nextButton.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % images.length;
        showImage(newIndex);
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.hidden = true;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.hidden) {
            if (e.key === 'Escape') closeLightbox.click();
            if (e.key === 'ArrowLeft') prevButton.click();
            if (e.key === 'ArrowRight') nextButton.click();
        }
    });
});