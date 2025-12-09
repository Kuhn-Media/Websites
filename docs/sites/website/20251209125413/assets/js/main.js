// JS
document.addEventListener('DOMContentLoaded', () => {

    // Sticky Header
    const header = document.querySelector('.km-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const burger = document.querySelector('.km-burger');
    const nav = document.querySelector('.km-nav');
    const body = document.body;
    const navLinks = document.querySelectorAll('.km-nav-link');

    const toggleMenu = () => {
        nav.classList.toggle('active');
        body.classList.toggle('no-scroll');
    };

    burger.addEventListener('click', toggleMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Scroll Reveal
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // FAQ Accordion
    const accordions = document.querySelectorAll('.km-faq-accordion details');
    accordions.forEach(acc => {
        acc.addEventListener('toggle', (event) => {
            if (acc.open) {
                accordions.forEach(otherAcc => {
                    if (otherAcc !== acc && otherAcc.open) {
                        otherAcc.open = false;
                    }
                });
            }
        });
    });

    // Number Counter Animation
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = +el.getAttribute('data-target');
                let current = 0;
                const increment = target / 100;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        el.innerText = Math.ceil(current) + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.innerText = target + '+';
                    }
                };
                updateCounter();
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.8 });

    document.querySelectorAll('.km-trust-value[data-target]').forEach(el => {
        counterObserver.observe(el);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                 targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});