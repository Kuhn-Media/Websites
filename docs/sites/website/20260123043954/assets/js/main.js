document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.classList.toggle('open');
        mainNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // --- Scroll Reveal Animation --- //
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

    // --- Testimonial Slider --- //
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const track = slider.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const nextButton = slider.querySelector('.next');
        const prevButton = slider.querySelector('.prev');
        const dotsNav = slider.querySelector('.slider-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
        };

        const updateDots = (targetIndex) => {
            const currentDot = dotsNav.querySelector('.active');
            if (currentDot) currentDot.classList.remove('active');
            dotsNav.children[targetIndex].classList.add('active');
        };

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(dot);
        });

        dotsNav.children[0].classList.add('active');

        nextButton.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            moveToSlide(newIndex);
        });

        prevButton.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(newIndex);
        });
    }

    // --- FAQ Accordion --- //
    const detailsElements = document.querySelectorAll('.faq-accordion details');
    detailsElements.forEach(details => {
        details.addEventListener('toggle', () => {
            if (details.open) {
                detailsElements.forEach(otherDetails => {
                    if (otherDetails !== details) {
                        otherDetails.open = false;
                    }
                });
            }
        });
    });

    // --- Interactive House --- //
    const hotspots = document.querySelectorAll('.hotspot');
    const tooltips = document.querySelectorAll('.tooltip');
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            const targetId = 'tooltip-' + hotspot.dataset.target;
            const targetTooltip = document.getElementById(targetId);

            tooltips.forEach(tt => tt.classList.remove('active'));
            hotspots.forEach(hs => hs.classList.remove('active'));

            targetTooltip.classList.add('active');
            hotspot.classList.add('active');
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }

    acceptCookiesBtn.addEventListener('click', () => {
        cookieBanner.classList.remove('visible');
        localStorage.setItem('cookiesAccepted', 'true');
    });

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight * 0.8) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    });

    // --- Lightbox Gallery --- //
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    if (galleryItems.length > 0) {
        const images = Array.from(galleryItems).map(item => item.href);

        const showImage = (index) => {
            lightboxImg.src = images[index];
            currentIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.classList.add('active');
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % images.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
});