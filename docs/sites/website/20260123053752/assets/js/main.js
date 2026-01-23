document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER --- //
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE NAVIGATION --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('nav-open');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- SCROLL ANIMATIONS --- //
    const animatedElements = document.querySelectorAll('.animate-in');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- INTERACTIVE HOUSE --- //
    const hotspots = document.querySelectorAll('.hotspot');
    const infoContents = document.querySelectorAll('.info-content');
    if (hotspots.length > 0 && infoContents.length > 0) {
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', () => {
                const targetId = 'info-' + hotspot.dataset.target;

                // Deactivate all
                hotspots.forEach(h => h.classList.remove('active'));
                infoContents.forEach(info => info.classList.remove('active'));

                // Activate target
                hotspot.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    // --- PROJECTS CAROUSEL --- //
    const carousel = document.querySelector('.projects-carousel');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-controls .prev');
        const nextButton = document.querySelector('.carousel-controls .next');
        
        const scrollStep = () => {
            const slide = carousel.querySelector('.project-slide');
            if (slide) {
                return slide.offsetWidth + parseInt(getComputedStyle(carousel).gap);
            }
            return 300;
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                carousel.scrollBy({ left: scrollStep(), behavior: 'smooth' });
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                carousel.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
            });
        }
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- CONTACT FORM --- //
    const contactForm = document.querySelector('.contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // This is a dummy form submission for demonstration.
            // In a real project, this would send data to a server.
            alert('Vielen Dank für Ihre Nachricht! Ich werde mich in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});