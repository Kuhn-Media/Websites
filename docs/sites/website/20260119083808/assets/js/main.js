document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    const stickyCTA = document.getElementById('sticky-cta');
    if (header) {
        const sticky = header.offsetTop;
        const scrollCallback = () => {
            if (window.pageYOffset > sticky + 100) {
                header.classList.add('scrolled');
                if (stickyCTA) stickyCTA.classList.add('visible');
            } else {
                header.classList.remove('scrolled');
                if (stickyCTA) stickyCTA.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', scrollCallback);
        scrollCallback(); // Initial check
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenuWrapper = document.getElementById('main-menu');
    if (navToggle && navMenuWrapper) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenuWrapper.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a staggered delay
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Before/After Slider --- //
    const slider = document.getElementById('project-slider');
    if (slider) {
        const beforeImage = slider.querySelector('.ba-image-before');
        const handle = slider.querySelector('.ba-slider-handle');

        let isDragging = false;

        const startDrag = (e) => {
            isDragging = true;
            slider.classList.add('dragging');
        };

        const stopDrag = () => {
            isDragging = false;
            slider.classList.remove('dragging');
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            const rect = slider.getBoundingClientRect();
            let x = (e.clientX || e.touches[0].clientX) - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;
            beforeImage.style.width = `${percent}%`;
            handle.style.left = `${percent}%`;
        };

        handle.addEventListener('mousedown', startDrag);
        handle.addEventListener('touchstart', startDrag);

        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag);
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
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        // Check if cookie consent is already given
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookieConsent', consent);
            cookieBanner.classList.remove('visible');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

});