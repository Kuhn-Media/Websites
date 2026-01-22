document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const scrollThreshold = 50;
        const updateHeader = () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('is-shrunk');
            } else {
                header.classList.remove('is-shrunk');
            }
        };
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    };

    // --- Mobile Navigation --- //
    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const nav = document.querySelector('.mobile-nav');
        const backdrop = document.querySelector('.mobile-nav-backdrop');
        const navLinks = nav.querySelectorAll('a');

        if (!toggleBtn || !nav) return;

        const openMenu = () => {
            nav.classList.add('is-open');
            nav.setAttribute('aria-hidden', 'false');
            backdrop.classList.add('is-visible');
            document.body.classList.add('no-scroll');
            toggleBtn.setAttribute('aria-expanded', 'true');
            navLinks[0].focus();
        };

        const closeMenu = () => {
            nav.classList.remove('is-open');
            nav.setAttribute('aria-hidden', 'true');
            backdrop.classList.remove('is-visible');
            document.body.classList.remove('no-scroll');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);
        navLinks.forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                closeMenu();
            }
        });
        
        // Focus Trap
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const firstFocusableElement = nav.querySelectorAll(focusableElements)[0];
        const focusableContent = nav.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        document.addEventListener('keydown', function(e) {
            if (!nav.classList.contains('is-open')) return;
            let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
            if (!isTabPressed) return;

            if (e.shiftKey) { // shift + tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        });
    };

    // --- Scroll Reveal Animation --- //
    const initScrollReveal = () => {
        const revealItems = document.querySelectorAll('.reveal-item, .reveal-stagger-group');
        if (revealItems.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('reveal-stagger-group')) {
                        const items = entry.target.querySelectorAll(':scope > *');
                        items.forEach((item, index) => {
                            item.style.setProperty('--stagger-index', index);
                            item.classList.add('is-visible');
                        });
                    } else {
                        entry.target.classList.add('is-visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealItems.forEach(item => observer.observe(item));
    };

    // --- Carousel --- //
    const initCarousel = () => {
        const carousels = document.querySelectorAll('.carousel-wrapper');
        carousels.forEach(wrapper => {
            const carousel = wrapper.querySelector('.carousel');
            const prevBtn = wrapper.querySelector('.carousel-prev');
            const nextBtn = wrapper.querySelector('.carousel-next');
            const dotsContainer = wrapper.querySelector('.carousel-dots');
            if (!carousel) return;

            const slides = Array.from(carousel.children);
            const slideWidth = slides[0].getBoundingClientRect().width;
            let currentIndex = 0;

            // Create dots
            if (dotsContainer) {
                slides.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.classList.add('carousel-dot');
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                });
            }
            const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

            const updateCarousel = () => {
                carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
                if (dots.length > 0) {
                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[currentIndex].classList.add('active');
                }
            };

            const goToSlide = (index) => {
                currentIndex = index;
                if (currentIndex < 0) currentIndex = slides.length - 1;
                if (currentIndex >= slides.length) currentIndex = 0;
                updateCarousel();
            };

            if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
            if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

            // Touch/Drag functionality
            let isDown = false, startX, scrollLeft;
            carousel.addEventListener('mousedown', (e) => {
                isDown = true;
                carousel.classList.add('active');
                startX = e.pageX - carousel.offsetLeft;
                scrollLeft = carousel.scrollLeft;
            });
            carousel.addEventListener('mouseleave', () => { isDown = false; carousel.classList.remove('active'); });
            carousel.addEventListener('mouseup', () => { isDown = false; carousel.classList.remove('active'); });
            carousel.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - startX) * 2;
                carousel.scrollLeft = scrollLeft - walk;
            });

            goToSlide(0);
        });
    };

    // --- Lightbox --- //
    const initLightbox = () => {
        const galleryItems = document.querySelectorAll('[data-lightbox="gallery"]');
        if (galleryItems.length === 0) return;

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const images = Array.from(galleryItems).map(item => ({ src: item.href, alt: item.querySelector('img').alt }));

        const showImage = (index) => {
            const img = images[index];
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            currentIndex = index;
        };

        const openLightbox = (index) => {
            lightbox.classList.add('is-visible');
            showImage(index);
        };

        const closeLightbox = () => lightbox.classList.remove('is-visible');

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + images.length) % images.length));
        nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % images.length));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    };

    // --- Cookie Banner --- //
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        if (!banner) return;

        const cookieStatus = localStorage.getItem('cookie_status');
        if (!cookieStatus) {
            banner.classList.add('is-visible');
        }

        const hideBanner = () => banner.classList.remove('is-visible');

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'accepted');
            hideBanner();
        });
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'declined');
            hideBanner();
        });
    };
    
    // --- Accordion --- //
    const initAccordion = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
            });
        });
    };

    // --- Sticky CTA --- //
    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        const footer = document.querySelector('.site-footer');
        if (!cta || !footer) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cta.classList.remove('is-visible');
                } else {
                    cta.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(footer);
    };

    // --- Scrollspy for in-page navigation --- //
    const initScrollSpy = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.footer-links a[href^="#"]');
        if (sections.length === 0 || navLinks.length === 0) return;

        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h-shrunk') || '64px', 10);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === entry.target.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: `-${headerHeight}px 0px -60% 0px` });

        sections.forEach(section => observer.observe(section));
    };

    // --- Magnetic Button --- //
    const initMagneticButton = () => {
        const buttons = document.querySelectorAll('.magnetic-button');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const { offsetX, offsetY, target } = e;
                const { clientWidth, clientHeight } = target;
                const x = (offsetX / clientWidth - 0.5) * 30; // 30 is the strength
                const y = (offsetY / clientHeight - 0.5) * 30;
                target.style.transform = `translate(${x}px, ${y}px)`;
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initCarousel();
    initLightbox();
    initCookieBanner();
    initAccordion();
    initStickyCta();
    initScrollSpy();
    initMagneticButton();
});