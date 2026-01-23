document.addEventListener('DOMContentLoaded', () => {

    // --- Reduced Motion Check ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.querySelector('.nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Animations ---
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right, .stagger-container');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('stagger-container')) {
                        const children = entry.target.querySelectorAll('[data-stagger-child]');
                        children.forEach((child, index) => {
                            child.style.transitionDelay = `${index * 100}ms`;
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.paddingTop = 'var(--spacing-md)';
                    answer.style.paddingBottom = 'var(--spacing-lg)';
                } else {
                    answer.style.maxHeight = '0';
                    answer.style.paddingTop = '0';
                    answer.style.paddingBottom = '0';
                }
            });
        }
    });

    // --- Carousel ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = wrapper.querySelector('.next');
        const prevButton = wrapper.querySelector('.prev');
        const dotsNav = wrapper.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition); // Not needed for flexbox approach

        // Create dots
        if (dotsNav) {
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('carousel-dot');
                if (index === 0) button.classList.add('active');
                button.addEventListener('click', () => {
                    moveToSlide(track, currentSlide, slides[index]);
                    updateDots(index);
                });
                dotsNav.appendChild(button);
            });
        }
        const dots = dotsNav ? Array.from(dotsNav.children) : [];

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };
        
        const updateSlidePositions = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
            const currentSlide = track.querySelector('.current-slide') || slides[0];
            track.style.transition = 'none'; // disable transition for resize adjustment
            track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
            setTimeout(() => { track.style.transition = ''; }, 0);
        };
        
        window.addEventListener('resize', updateSlidePositions);
        updateSlidePositions();
        slides[0].classList.add('current-slide');

        const updateDots = (targetIndex) => {
            if (!dotsNav) return;
            const currentDot = dotsNav.querySelector('.active');
            if(currentDot) currentDot.classList.remove('active');
            dots[targetIndex].classList.add('active');
        };

        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling || slides[0];
            const nextIndex = slides.findIndex(slide => slide === nextSlide);
            moveToSlide(track, currentSlide, nextSlide);
            updateDots(nextIndex);
        });

        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
            const prevIndex = slides.findIndex(slide => slide === prevSlide);
            moveToSlide(track, currentSlide, prevSlide);
            updateDots(prevIndex);
        });
    });

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const showAt = 400;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showAt && (window.innerHeight + window.scrollY) < document.body.offsetHeight - 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.hidden = false;
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxTriggers = document.querySelectorAll('.gallery-lightbox-trigger');
        const galleryImages = Array.from(lightboxTriggers).map(trigger => trigger.getAttribute('src'));
        let currentIndex = 0;

        const showImage = (index) => {
            currentIndex = index;
            lightboxImage.src = galleryImages[index];
            lightboxImage.alt = lightboxTriggers[index].alt;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => openLightbox(index));
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            showImage(newIndex);
        });
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % galleryImages.length;
            showImage(newIndex);
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
                if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
            }
        });
    }
});