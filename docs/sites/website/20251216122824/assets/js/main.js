// JS
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

    // Sticky Header
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
        handleScroll(); // Initial check
    }

    // Mobile Menu
    const menuToggle = document.querySelector('.km-header__toggle');
    const mainHeader = document.querySelector('.km-header');
    if (menuToggle && mainHeader) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainHeader.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        const navLinks = mainHeader.querySelectorAll('.km-header__nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainHeader.classList.contains('is-open')) {
                    mainHeader.classList.remove('is-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = (entry.target.dataset.delay || 0) + (index % 5 * 100); // Stagger
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

});
