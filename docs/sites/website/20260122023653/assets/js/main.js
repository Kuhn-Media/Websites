document.addEventListener('DOMContentLoaded', function() {

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu --- 
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('backdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

    const openMenu = () => {
        if (mobileMenu && backdrop) {
            mobileMenu.classList.add('is-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            backdrop.classList.add('is-visible');
            document.body.classList.add('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'true');
        }
    };

    const closeMenu = () => {
        if (mobileMenu && backdrop) {
            mobileMenu.classList.remove('is-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            backdrop.classList.remove('is-visible');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // --- Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealItems.forEach(item => revealObserver.observe(item));

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.maxHeight = isExpanded ? '0' : answer.scrollHeight + 'px';
        });
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            cookieBanner.setAttribute('aria-hidden', 'false');
        } else {
             cookieBanner.style.display = 'none';
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // --- Sticky CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const heroSection = document.querySelector('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.setAttribute('aria-hidden', 'false');
                } else {
                    stickyCta.setAttribute('aria-hidden', 'true');
                }
            });
        }, { threshold: 0 });
        if (heroSection) ctaObserver.observe(heroSection);
    }
    
    // --- Image Carousel ---
    const carousel = document.getElementById('image-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel__track');
        const slides = Array.from(track.children);
        const nextButton = carousel.parentElement.querySelector('.carousel__button--next');
        const prevButton = carousel.parentElement.querySelector('.carousel__button--prev');
        const dotsNav = carousel.parentElement.querySelector('.carousel__dots');
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
            const currentDot = dotsNav.querySelector('.active');
            if(currentDot) currentDot.classList.remove('active');
            dotsNav.children[currentIndex].classList.add('active');
        };

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel__dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(dot);
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });
        
        // Touch controls
        let touchstartX = 0;
        let touchendX = 0;

        track.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        track.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX && currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
            if (touchendX > touchstartX && currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        moveToSlide(0);
    }

    // --- Scrollspy for Leistungen Page ---
    const serviceSections = document.querySelectorAll('.service-detail-section');
    if (serviceSections.length > 0) {
        const navLinks = document.querySelectorAll('.header__nav-link[href^="#"], .mobile-nav__link[href^="#"]');
        const headerHeight = () => document.getElementById('header').offsetHeight;

        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('is-active-scroll');
                        if (link.getAttribute('href').includes(id)) {
                            link.classList.add('is-active-scroll');
                        }
                    });
                }
            });
        }, { rootMargin: `-${headerHeight() + 20}px 0px -60% 0px` });

        serviceSections.forEach(section => {
            scrollSpyObserver.observe(section);
            section.style.scrollMarginTop = `${headerHeight() + 20}px`;
        });
    }
});