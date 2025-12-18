document.addEventListener('DOMContentLoaded', () => {
    
    // Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, idx * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const burger = document.getElementById('burger');
    const nav = document.querySelector('.nav');
    
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 1000);
    }

    window.acceptCookies = function() {
        localStorage.setItem('cookieConsent', 'all');
        cookieBanner.classList.remove('active');
    };

    window.acceptNecessary = function() {
        localStorage.setItem('cookieConsent', 'necessary');
        cookieBanner.classList.remove('active');
    };

    // Lightbox for Gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        Object.assign(lightbox.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000',
            cursor: 'zoom-out'
        });
        
        const img = document.createElement('img');
        img.style.maxHeight = '90vh';
        img.style.maxWidth = '90vw';
        img.style.objectFit = 'contain';
        
        lightbox.appendChild(img);
        document.body.appendChild(lightbox);

        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const src = item.querySelector('img').src;
                img.src = src;
                lightbox.style.display = 'flex';
            });
        });

        lightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }
});