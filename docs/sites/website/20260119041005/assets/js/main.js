document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER --- //
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE MENU --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    }

    if (menuClose && mobileMenu) {
        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };
        menuClose.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in');
    const staggerGroups = document.querySelectorAll('.reveal-stagger-group');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    staggerGroups.forEach(group => {
        const children = group.children;
        for (let i = 0; i < children.length; i++) {
            children[i].style.transitionDelay = `${i * 100}ms`;
            revealObserver.observe(children[i]);
        }
    });

    // --- FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- TESTIMONIAL SLIDER --- //
    const slider = document.getElementById('testimonial-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        const dotsContainer = document.querySelector('.slider-dots');
        let currentIndex = 0;

        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
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

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        });

        // Touch/Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        slider.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        slider.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        }, { passive: true });

        updateSlider();
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
        cookieBanner.setAttribute('aria-hidden', 'false');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // --- CONTEXT CTA --- //
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        contextCta.classList.add('show');
                        contextCta.setAttribute('aria-hidden', 'false');
                    } else {
                        contextCta.classList.remove('show');
                        contextCta.setAttribute('aria-hidden', 'true');
                    }
                });
            }, { threshold: 0 });
            ctaObserver.observe(heroSection);
        }
    }
});