document.addEventListener('DOMContentLoaded', function() {

    // --- Skip Link Focus --- //
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main-content');
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.setAttribute('tabindex', -1);
            mainContent.focus();
        });
        mainContent.addEventListener('blur', () => {
            mainContent.removeAttribute('tabindex');
        });
    }

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('is-scrolled', !entry.isIntersecting);
        }, { rootMargin: '50px 0px 0px 0px' });
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.getElementById('mobile-nav-drawer');
    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.toggle('is-active');
            navToggle.setAttribute('aria-expanded', isOpen);
            navDrawer.classList.toggle('is-open');
            navDrawer.setAttribute('aria-hidden', !isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (entry.target.dataset.reveal === 'stagger') {
                        const children = entry.target.querySelectorAll('[data-reveal-child]');
                        children.forEach((child, index) => {
                            child.style.setProperty('--child-index', index);
                            child.classList.add('is-visible');
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            if (el.dataset.reveal !== 'stagger') {
                 revealObserver.observe(el);
            } else {
                // For stagger containers, trigger them, and JS will handle children
                const children = el.querySelectorAll('[data-reveal-child]');
                children.forEach(child => {
                    child.dataset.reveal = 'true'; // Mark for animation
                    child.classList.remove('is-visible'); // Ensure it's hidden initially
                });
                revealObserver.observe(el);
            }
        });
    }

    // --- Testimonial Slider --- //
    const slider = document.getElementById('testimonial-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        const dotsContainer = document.querySelector('.slider-dots');
        let currentIndex = 0;

        function updateSlider() {
            const slideWidth = slides[0].offsetWidth;
            slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateDots();
        }

        function updateDots() {
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.toggle('active', index === currentIndex);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            });
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        });

        window.addEventListener('resize', updateSlider);
        updateSlider();
    }

    // --- FAQ Accordion --- //
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

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxBody = lightbox.querySelector('.lightbox-body');
        const closeButton = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let lastFocusedElement;

        const openLightbox = (content) => {
            lastFocusedElement = document.activeElement;
            lightboxBody.innerHTML = content;
            lightbox.hidden = false;
            document.body.classList.add('no-scroll');
            closeButton.focus();
            document.addEventListener('keydown', handleEsc);
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleEsc);
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        };

        document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const title = trigger.dataset.title || '';
                const category = trigger.dataset.category || '';
                const text = trigger.dataset.text || '';
                const content = `
                    ${category ? `<span class='project-category'>${category}</span>` : ''}
                    <h3>${title}</h3>
                    <p>${text}</p>
                `;
                openLightbox(content);
            });
        });

        closeButton.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
    }
});