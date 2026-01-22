document.addEventListener('DOMContentLoaded', () => {

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Header Scroll Logic ---
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const navToggleButtons = document.querySelectorAll('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavContainer = document.querySelector('.mobile-nav__container');
    const focusableElementsString = 'a[href], button:not([disabled])';
    let focusableElements, firstFocusableElement, lastFocusableElement;

    if (mobileNav) {
        focusableElements = Array.from(mobileNav.querySelectorAll(focusableElementsString));
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
    }

    const openMobileNav = () => {
        document.body.classList.add('mobile-nav-open');
        mobileNavContainer.setAttribute('aria-hidden', 'false');
        setTimeout(() => firstFocusableElement?.focus(), 50);
        document.addEventListener('keydown', trapFocus);
    };

    const closeMobileNav = () => {
        document.body.classList.remove('mobile-nav-open');
        mobileNavContainer.setAttribute('aria-hidden', 'true');
        navToggleButtons[0]?.focus();
        document.removeEventListener('keydown', trapFocus);
    };

    navToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (document.body.classList.contains('mobile-nav-open')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });
    });

    if (mobileNavContainer) {
        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer.querySelector('.mobile-nav__backdrop')) {
                closeMobileNav();
            }
        });
        mobileNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                closeMobileNav();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
                closeMobileNav();
            }
        });
    }
    
    function trapFocus(e) {
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
    }

    // --- Scroll Reveal Animations ---
    if (!isReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-stagger-container');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
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

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
            
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.paddingTop = 'var(--spacing-sm)';
            } else {
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
            }
        });
    });

    // --- Carousel ---
    const carousels = document.querySelectorAll('.why-us__carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.next');
        const prevButton = carousel.querySelector('.prev');
        const dotsNav = carousel.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
        };

        if (dotsNav) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(dot);
            });
        }
        const dots = dotsNav ? Array.from(dotsNav.children) : [];
        const updateDots = (targetIndex) => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === targetIndex);
            });
        };

        nextButton.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            moveToSlide(newIndex);
        });

        prevButton.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(newIndex);
        });
        
        // Resize observer for responsive carousel
        const resizeObserver = new ResizeObserver(() => {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            track.style.transition = 'none'; // Disable transition during resize
            track.style.transform = 'translateX(-' + newSlideWidth * currentIndex + 'px)';
            setTimeout(() => { track.style.transition = ''; }, 50);
        });
        resizeObserver.observe(track);
    });

    // --- Magnetic Buttons ---
    if (!isReducedMotion) {
        document.querySelectorAll('.magnetic-button').forEach(button => {
            const strength = 20;
            button.addEventListener('mousemove', (e) => {
                const { offsetX, offsetY, target } = e;
                const { clientWidth, clientHeight } = target;
                const x = (offsetX / clientWidth - 0.5) * strength;
                const y = (offsetY / clientHeight - 0.5) * strength;
                button.style.transform = `translate(${x}px, ${y}px)`;
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            stickyCTA.classList.toggle('is-visible', !entry.isIntersecting);
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        });
    }
    
    // --- Scrollspy for Leistungen Page ---
    const pageNav = document.querySelector('.page-nav');
    if (pageNav) {
        const navLinks = pageNav.querySelectorAll('a');
        const sections = Array.from(navLinks).map(link => document.getElementById(link.hash.substring(1)));
        
        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('is-active', link.hash === `#${id}`);
                    });
                }
            });
        }, { rootMargin: `-${header.offsetHeight + 50}px 0px -40% 0px` });

        sections.forEach(section => {
            if (section) scrollSpyObserver.observe(section);
        });
    }

});