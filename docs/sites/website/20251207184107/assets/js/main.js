document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.km-nav__toggle');
    const mainNav = document.querySelector('.km-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
        });

        // Close nav when a link is clicked
        mainNav.querySelectorAll('.km-nav__link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.km-faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('.km-faq-question button');
        const answer = item.querySelector('.km-faq-answer');

        if (button && answer) {
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // --- Scroll Reveal Animation ---
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Scrollspy for Active Navigation Link ---
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.km-nav__list a.km-nav__link');

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('is-active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('is-active');
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

});