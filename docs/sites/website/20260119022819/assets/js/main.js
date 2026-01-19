document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '10px 0px 0px 0px' });
        scrollObserver.observe(document.body);
    }

    // --- Mobile Menu --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-drawer');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');

    if (menuToggle && mobileMenu && menuOverlay) {
        const toggleMenu = (open) => {
            const isOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            mobileMenu.classList.toggle('open', isOpen);
            menuOverlay.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', () => toggleMenu());
        menuOverlay.addEventListener('click', () => toggleMenu(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-fade-up, .reveal-stagger');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('visible'), 100);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        });
    }

    // --- Contact Form --- //
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const feedbackEl = document.getElementById('form-feedback');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // This is a dummy submission handler.
            // In a real project, this would send data to a server.
            contactForm.reset();
            feedbackEl.hidden = false;
            setTimeout(() => feedbackEl.hidden = true, 5000);
        });
    }

    // --- Comparison Slider --- //
    const slider = document.querySelector('.comparison-slider');
    if (slider) {
        const handle = slider.querySelector('.comparison-handle');
        const after = slider.querySelector('.comparison-after');
        let isDragging = false;

        const moveHandler = (x) => {
            const rect = slider.getBoundingClientRect();
            let pos = (x - rect.left) / rect.width * 100;
            pos = Math.max(0, Math.min(100, pos));
            handle.style.left = pos + '%';
            after.style.width = (100 - pos) + '%';
        };

        const startDrag = (e) => {
            isDragging = true;
            slider.classList.add('dragging');
        };

        const endDrag = () => {
            isDragging = false;
            slider.classList.remove('dragging');
        };

        handle.addEventListener('mousedown', startDrag);
        handle.addEventListener('touchstart', startDrag, { passive: true });

        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);

        document.addEventListener('mousemove', (e) => {
            if (isDragging) moveHandler(e.clientX);
        });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) moveHandler(e.touches[0].clientX);
        }, { passive: true });
    }
});