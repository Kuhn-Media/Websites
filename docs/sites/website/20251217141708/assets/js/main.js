document.addEventListener('DOMContentLoaded', function() {
    // JS Enabled Class
    document.documentElement.classList.add('js');

    // Mobile Menu Toggle
    const toggleBtn = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (toggleBtn && mobileMenu) {
        toggleBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            // Animate Hamburger
            const spans = toggleBtn.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Tab System (Signature Component)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active to clicked
                btn.classList.add('active');
                const target = btn.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptAll = document.getElementById('accept-all');
    const acceptEssential = document.getElementById('accept-essential');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.remove('hidden');
    }

    if (acceptAll) {
        acceptAll.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'all');
            cookieBanner.classList.add('hidden');
        });
    }

    if (acceptEssential) {
        acceptEssential.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'essential');
            cookieBanner.classList.add('hidden');
        });
    }

    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});