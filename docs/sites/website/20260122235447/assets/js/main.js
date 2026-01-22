document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('is-active');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '1.5rem';
            } else {
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
            }
        });
        // Set initial max-height for transition
        answer.style.maxHeight = '0';
        answer.style.transition = 'max-height 0.5s ease-in-out';
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const cookieAccepted = localStorage.getItem('cookieAccepted');

    if (!cookieAccepted) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('show'), 100);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.hidden = true, 500);
        });
    }

    // --- Carousel --- //
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-button.next');
        const prevButton = carousel.querySelector('.carousel-button.prev');
        const dotsNav = carousel.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        //slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        if (dotsNav) {
            slides.forEach((slide, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', e => {
                    const currentSlide = track.querySelector('.current-slide') || slides[0];
                    moveToSlide(track, currentSlide, slides[index]);
                    updateDots(dotsNav.querySelector('.active'), dot);
                    updateNavButtons(index, slides.length);
                });
                dotsNav.appendChild(dot);
            });
        }
        
        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('active');
            targetDot.classList.add('active');
        };

        const updateNavButtons = (targetIndex, slidesLength) => {
            if (prevButton && nextButton) {
                prevButton.classList.toggle('disabled', targetIndex === 0);
                nextButton.classList.toggle('disabled', targetIndex === slidesLength - 1);
            }
        };

        if (nextButton) {
            nextButton.addEventListener('click', e => {
                const currentSlide = track.querySelector('.current-slide') || slides[0];
                const nextSlide = currentSlide.nextElementSibling;
                if (nextSlide) {
                    moveToSlide(track, currentSlide, nextSlide);
                    const currentIndex = slides.findIndex(slide => slide === currentSlide);
                    const nextIndex = currentIndex + 1;
                    if (dotsNav) {
                        updateDots(dotsNav.children[currentIndex], dotsNav.children[nextIndex]);
                    }
                    updateNavButtons(nextIndex, slides.length);
                }
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', e => {
                const currentSlide = track.querySelector('.current-slide') || slides[0];
                const prevSlide = currentSlide.previousElementSibling;
                if (prevSlide) {
                    moveToSlide(track, currentSlide, prevSlide);
                    const currentIndex = slides.findIndex(slide => slide === currentSlide);
                    const prevIndex = currentIndex - 1;
                    if (dotsNav) {
                        updateDots(dotsNav.children[currentIndex], dotsNav.children[prevIndex]);
                    }
                    updateNavButtons(prevIndex, slides.length);
                }
            });
        }
        
        // Initial state
        slides[0].classList.add('current-slide');
        updateNavButtons(0, slides.length);
    });

    // --- Lightbox --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const galleryItems = document.querySelectorAll('[data-lightbox]');
    let currentIndex = 0;

    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        const showImage = (index) => {
            const item = galleryItems[index];
            const imgSrc = item.getAttribute('href');
            const imgTitle = item.getAttribute('data-title');
            lightboxImg.setAttribute('src', imgSrc);
            lightboxImg.setAttribute('alt', imgTitle);
            lightboxCaption.textContent = imgTitle;
            currentIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', e => {
                e.preventDefault();
                lightbox.classList.add('show');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                showImage(index);
                closeBtn.focus();
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- Sticky CTA Bar --- //
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCtaBar.hidden = false;
                    stickyCtaBar.classList.add('show');
                } else {
                    stickyCtaBar.classList.remove('show');
                }
            });
        }, { threshold: 0, rootMargin: '-100px 0px 0px 0px' });
        
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Set current date in datenschutz --- //
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('de-DE');
    }
});