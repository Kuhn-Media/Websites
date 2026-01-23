document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    };

    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const menu = document.querySelector('.mobile-nav-menu');
        if (!toggleBtn || !menu || !closeBtn) return;

        const openMenu = () => {
            menu.classList.add('open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            menu.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                closeMenu();
            }
        });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    };

    const initCounterAnimation = () => {
        const counters = document.querySelectorAll('.trust-number');
        const speed = 200; // The lower the slower

        const animate = (counter) => {
            const target = +counter.getAttribute('data-counter');
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    };

    const initFaqAccordion = () => {
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
    };

    const initInteractiveHouse = () => {
        const wrapper = document.querySelector('.interactive-house-wrapper');
        if (!wrapper) return;

        const hotspots = wrapper.querySelectorAll('.hotspot');
        const infoBoxes = wrapper.querySelectorAll('.info-box');
        let activeHotspot = null;

        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', () => {
                const targetId = `info-box-${hotspot.dataset.target}`;
                const targetBox = document.getElementById(targetId);

                // Deactivate previous
                if (activeHotspot && activeHotspot !== hotspot) {
                    activeHotspot.classList.remove('active');
                    const activeBoxId = `info-box-${activeHotspot.dataset.target}`;
                    document.getElementById(activeBoxId).classList.remove('active');
                }

                // Toggle current
                hotspot.classList.toggle('active');
                targetBox.classList.toggle('active');
                
                if (hotspot.classList.contains('active')) {
                    activeHotspot = hotspot;
                } else {
                    activeHotspot = null;
                }
            });
        });
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => banner.classList.add('show'), 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('show');
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const showThreshold = 600;

        window.addEventListener('scroll', () => {
            if (window.scrollY > showThreshold) {
                cta.classList.add('show');
            } else {
                cta.classList.remove('show');
            }
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initCounterAnimation();
    initFaqAccordion();
    initInteractiveHouse();
    initCookieBanner();
    initStickyCTA();

});