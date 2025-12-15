document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.querySelector('.km-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

    // --- Mobile Navigation ---
    const burger = document.querySelector('.km-burger');
    const mobileNav = document.querySelector('.km-nav-mobile');
    if (burger && mobileNav) {
        const toggleNav = () => {
            const isOpen = burger.classList.toggle('open');
            burger.setAttribute('aria-expanded', isOpen);
            mobileNav.classList.toggle('open');
            document.body.classList.toggle('km-no-scroll', isOpen);
        };

        burger.addEventListener('click', toggleNav);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && burger.classList.contains('open')) {
                toggleNav();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.km-reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- Accordion (FAQ) ---
    const accordionItems = document.querySelectorAll('.km-accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const toggle = item.querySelector('.km-accordion-toggle');
            const content = item.querySelector('.km-accordion-content');

            if (toggle && content) {
                toggle.addEventListener('click', () => {
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    toggle.setAttribute('aria-expanded', !isExpanded);
                    if (!isExpanded) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    } else {
                        content.style.maxHeight = '0';
                    }
                });
            }
        });
    }

});