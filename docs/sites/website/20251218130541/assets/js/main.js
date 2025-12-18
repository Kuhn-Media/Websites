document.addEventListener('DOMContentLoaded', () => {
    
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
            // Animate burger
            const spans = burger.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Scroll Reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('cookieBanner');
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 1000);
    }

    window.acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'all');
        cookieBanner.classList.remove('active');
    };

    window.acceptNecessary = () => {
        localStorage.setItem('cookieConsent', 'necessary');
        cookieBanner.classList.remove('active');
    };
});