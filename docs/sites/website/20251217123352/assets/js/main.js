document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const isOpen = mobileMenu.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            // Simple hamburger animation toggle
            mobileToggle.classList.toggle('open');
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Accordion
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            // Close others (optional, keep for exclusive open)
            accordions.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            header.classList.toggle('active');
            if (!isActive) {
                body.style.maxHeight = body.scrollHeight + 'px';
            } else {
                body.style.maxHeight = null;
            }
        });
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptAllBtn = document.getElementById('accept-all');
    const acceptEssentialBtn = document.getElementById('accept-essential');

    if (cookieBanner) {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            cookieBanner.classList.remove('hidden');
        }

        const saveConsent = (type) => {
            localStorage.setItem('cookie-consent', type);
            cookieBanner.classList.add('hidden');
        };

        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => saveConsent('all'));
        }

        if (acceptEssentialBtn) {
            acceptEssentialBtn.addEventListener('click', () => saveConsent('essential'));
        }
    }

    // Scroll Reveal (Simple)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});