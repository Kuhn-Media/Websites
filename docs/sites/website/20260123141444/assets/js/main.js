document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Navigation --- //
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
        });
    }

    // --- 2. Sticky Header --- //
    const header = document.querySelector('.site-header.sticky');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-stagger > *, .reveal-card, .reveal-fade-in');
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isReducedMotion) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('show'), 1000);

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- 5. Back to Top Button --- //
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.hidden = false;
            } else {
                backToTopBtn.hidden = true;
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 6. FAQ Search/Filter --- //
    const faqSearch = document.getElementById('faq-search');
    const faqItems = document.querySelectorAll('.faq-item');
    const noResults = document.getElementById('faq-no-results');

    if (faqSearch && faqItems.length > 0) {
        faqSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            let visibleCount = 0;
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                const isVisible = question.includes(query) || answer.includes(query);
                item.hidden = !isVisible;
                if(isVisible) visibleCount++;
            });
            if (noResults) noResults.hidden = visibleCount > 0;
        });
    }

    // --- 7. Lightbox Gallery --- //
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const images = Array.from(galleryItems).map(item => ({
            src: item.href,
            alt: item.querySelector('img').alt
        }));

        const showImage = (index) => {
            const img = images[index];
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            currentIndex = index;
        };

        const openLightbox = (e, index) => {
            e.preventDefault();
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        const showPrev = () => showImage((currentIndex - 1 + images.length) % images.length);
        const showNext = () => showImage((currentIndex + 1) % images.length);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => openLightbox(e, index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});