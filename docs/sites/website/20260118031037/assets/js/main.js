document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation --- //
    const navToggle = document.getElementById('mobile-nav-toggle');
    const mainMenu = document.getElementById('main-menu');
    if (navToggle && mainMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            mainMenu.classList.toggle('is-open');
            document.body.style.overflow = !isOpen ? 'hidden' : '';
        });
    }

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const headerObserver = new IntersectionObserver(([entry]) => {
            // Use a threshold of 1 to detect when the header is fully out of view
            // This is a placeholder for a more robust scroll detection
        }, { threshold: [1] });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Accordion (FAQ) --- //
    const accordions = document.querySelectorAll('.accordion-item');
    accordions.forEach(item => {
        const button = item.querySelector('.accordion-button');
        const content = item.querySelector('.accordion-content');
        if (button && content) {
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
                content.hidden = isExpanded;
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (index === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }

        updateDots();
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.querySelectorAll(':scope > *');
                    children.forEach((child, index) => {
                        child.style.setProperty('--stagger-index', index);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the main CTA banner is NOT in view
                if (!entry.isIntersecting && window.scrollY > 500) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const mainCTA = document.querySelector('.cta-banner');
        if (mainCTA) {
            ctaObserver.observe(mainCTA);
        } else {
             window.addEventListener('scroll', () => {
                if (window.scrollY > 800) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }
    }

    // --- Lightbox Gallery --- //
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const images = Array.from(galleryItems).map(item => item.href);

        function showImage(index) {
            lightboxImg.src = images[index];
            currentIndex = index;
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.hidden = false;
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', () => lightbox.hidden = true);
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(newIndex);
        });
        nextBtn.addEventListener('click', () => {
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
                if (e.key === 'Escape') closeBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
});