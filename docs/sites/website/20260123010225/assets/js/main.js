document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const headerObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('is-scrolled', window.scrollY > 0);
        }, { threshold: 1.0 });

        // Create a dummy element to observe at the top of the body
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = '0';
        sentinel.style.height = '1px';
        sentinel.style.width = '1px';
        document.body.prepend(sentinel);
        headerObserver.observe(sentinel);

        window.addEventListener('scroll', () => {
            header.classList.toggle('is-scrolled', window.scrollY > 0);
        }, { passive: true });
    }

    // --- 2. MOBILE NAVIGATION --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.querySelector('.nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isOpen = navList.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('is-open')) {
                navList.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
                navToggle.focus();
            }
        });
    }

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- 4. ACCORDION (FAQ) --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (header && content) {
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                content.hidden = isExpanded;
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            });
        }
    });

    // --- 5. CAROUSEL --- //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            // Update dots
            const currentDot = dotsNav.querySelector('.active');
            if (currentDot) currentDot.classList.remove('active');
            dotsNav.children[currentIndex].classList.add('active');

            // Update buttons
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
        };

        // Create dots
        slides.forEach((_, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            button.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(button);
        });

        // Event Listeners
        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        // Initialize
        moveToSlide(0);
    }

    // --- 6. STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const contactPage = window.location.pathname.includes('/kontakt');
    if (stickyCTA && !contactPage) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
             stickyCTA.classList.toggle('is-visible', entry.boundingClientRect.bottom < 0);
        }, { threshold: [0, 1] });

        // Observe an element near the top of the page, e.g., the first section
        const firstSection = document.querySelector('main > section:first-of-type');
        if(firstSection) ctaObserver.observe(firstSection);
    }

    // --- 7. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookie_consent');

        if (!cookieConsent) {
            cookieBanner.hidden = false;
            setTimeout(() => {
                cookieBanner.classList.add('is-visible');
            }, 1000);
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookie_consent', consent);
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => {
                cookieBanner.hidden = true;
            }, 500);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }
});