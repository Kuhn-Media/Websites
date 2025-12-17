document.addEventListener('DOMContentLoaded', function() {
    // JS Active Class
    document.documentElement.classList.add('js');

    // Mobile Menu Toggle
    const toggleBtn = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.main-nav');

    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all others
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptAllBtn = document.getElementById('accept-all');
    const acceptEssentialBtn = document.getElementById('accept-essential');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.remove('hidden');
    }

    function hideBanner(mode) {
        localStorage.setItem('cookieConsent', mode);
        cookieBanner.classList.add('hidden');
    }

    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', () => hideBanner('all'));
    }

    if (acceptEssentialBtn) {
        acceptEssentialBtn.addEventListener('click', () => hideBanner('essential'));
    }

    // Scroll Reveal (Simple Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .step, .intro-text').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styling via JS injection or CSS class
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});