document.addEventListener('DOMContentLoaded', function() {

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 150) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNav) {
        const openMenu = () => {
            mobileNav.classList.add('is-open');
            mobileNav.setAttribute('aria-hidden', 'false');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            mobileNav.addEventListener('click', closeMenuOnBackdrop);
            document.addEventListener('keydown', closeMenuOnEsc);
        };

        const closeMenu = () => {
            mobileNav.classList.remove('is-open');
            mobileNav.setAttribute('aria-hidden', 'true');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            mobileNav.removeEventListener('click', closeMenuOnBackdrop);
            document.removeEventListener('keydown', closeMenuOnEsc);
        };

        const closeMenuOnBackdrop = (e) => {
            if (e.target === mobileNav) {
                closeMenu();
            }
        };

        const closeMenuOnEsc = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        };

        mobileNavToggle.addEventListener('click', () => {
            if (mobileNav.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMenu);
        }

        // Mobile dropdown
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle-mobile');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const dropdownMenu = toggle.nextElementSibling;
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                dropdownMenu.style.display = isExpanded ? 'none' : 'block';
            });
        });
    }

    // --- Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.reveal-item');
    if (revealItems.length > 0 && !isReducedMotion) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(item => {
            observer.observe(item);
        });
    }

    // --- Scrolly-telling Process Line ---
    const processLinePath = document.getElementById('process-line-path');
    const processWrapper = document.querySelector('.process-wrapper');
    if (processLinePath && processWrapper && !isReducedMotion) {
        const pathLength = processLinePath.getTotalLength();
        processLinePath.style.strokeDasharray = pathLength;
        processLinePath.style.strokeDashoffset = pathLength;

        window.addEventListener('scroll', () => {
            const scrollPercentage = (window.scrollY - processWrapper.offsetTop) / (processWrapper.offsetHeight - window.innerHeight);
            const drawLength = pathLength * Math.max(0, Math.min(1, scrollPercentage));
            processLinePath.style.strokeDashoffset = pathLength - drawLength;
        });
    }

    // --- Magnetic CTA ---
    const magneticCTAs = document.querySelectorAll('.magnetic-cta');
    if (magneticCTAs.length > 0 && !isReducedMotion) {
        magneticCTAs.forEach(cta => {
            cta.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                this.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
            });
            cta.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(0,0)';
            });
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1500);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA Bar ---
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        const showBarThreshold = 600;
        const footer = document.querySelector('.site-footer');
        let footerOffset = footer ? footer.offsetTop : document.body.scrollHeight;

        window.addEventListener('scroll', () => {
            footerOffset = footer ? footer.offsetTop : document.body.scrollHeight;
            const scrollPosition = window.scrollY + window.innerHeight;

            if (window.scrollY > showBarThreshold && scrollPosition < footerOffset) {
                stickyCtaBar.style.display = 'block';
                setTimeout(() => stickyCtaBar.classList.add('show'), 10);
            } else {
                stickyCtaBar.classList.remove('show');
            }
        });
    }

    // --- Input field animations for contact form ---
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        if (input.value.trim() !== '') {
            input.classList.add('not-empty');
        }
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                input.classList.add('not-empty');
            } else {
                input.classList.remove('not-empty');
            }
        });
        // Add placeholder to satisfy :not(:placeholder-shown)
        if (input.type !== 'checkbox') {
            input.setAttribute('placeholder', ' ');
        }
    });

});