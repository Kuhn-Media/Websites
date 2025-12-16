document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.querySelector('.km-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // --- Mobile Menu ---
    const mobileToggle = document.querySelector('.km-header__mobile-toggle');
    const mobileMenu = document.querySelector('.km-mobile-menu');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('mobile-menu-open');
            mobileMenu.setAttribute('aria-hidden', isExpanded);
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        let delay = 0;
        revealElements.forEach(el => {
            // Stagger logic for elements in a list/grid
            if (el.parentElement.classList.contains('km-card-grid') || 
                el.parentElement.classList.contains('km-icon-list') ||
                el.parentElement.classList.contains('km-process-steps')) {
                if (el.style.getPropertyValue('--reveal-delay') === '') {
                     el.style.setProperty('--reveal-delay', `${delay}ms`);
                     delay += 120;
                }
            } else {
                delay = 0;
            }
            observer.observe(el);
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.km-faq__item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const button = item.querySelector('.km-faq__question');
            const answer = item.querySelector('.km-faq__answer');

            if (!button || !answer) return;

            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';

                // Close all other items
                faqItems.forEach(otherItem => {
                    const otherButton = otherItem.querySelector('.km-faq__question');
                    if (otherButton && otherButton !== button) {
                        otherButton.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current item
                button.setAttribute('aria-expanded', !isExpanded);
            });
        });
    }

    // --- Testimonial Carousel ---
    const carousels = document.querySelectorAll('.km-testimonial-carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.km-testimonial-carousel__track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.is-next');
        const prevButton = carousel.querySelector('.is-prev');
        const dotsNav = carousel.querySelector('.km-carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
            
            if (dotsNav) {
                const currentDot = dotsNav.querySelector('.is-active');
                if (currentDot) currentDot.classList.remove('is-active');
                dotsNav.children[currentIndex].classList.add('is-active');
            }
        };

        if (dotsNav) {
            slides.forEach((slide, index) => {
                const button = document.createElement('button');
                button.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(button);
            });
        }

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                moveToSlide(currentIndex + 1);
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        });
        
        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        track.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        const handleSwipe = () => {
            if (touchendX < touchstartX && currentIndex < slides.length - 1) {
                moveToSlide(currentIndex + 1);
            }
            if (touchendX > touchstartX && currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        }

        updateControls();
    });
});