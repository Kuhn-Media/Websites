document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const navToggle = document.getElementById('nav-toggle');
    const mainMenu = document.getElementById('main-menu');
    if (navToggle && mainMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('is-scrolled', !entry.isIntersecting);
        }, { rootMargin: '200px 0px 0px 0px' });
        scrollObserver.observe(document.body);
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: unobserve after revealing
                    // observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // --- Testimonial Carousel --- //
    const carouselContainer = document.getElementById('testimonial-carousel');
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carouselContainer.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((slide, i) => {
            slide.style.width = '100%';
            slide.style.flexShrink = '0';
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        carouselContainer.style.display = 'flex';
        carouselContainer.style.transition = 'transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)';

        const dots = dotsContainer.querySelectorAll('.dot');

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        goToSlide(0);
    }

    // --- Project Gallery Filter & Lightbox --- //
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('lightbox');

    if (filterBtns.length > 0 && galleryCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                galleryCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        let currentImageIndex;
        let visibleImages = [];

        const updateLightboxNav = () => {
            prevBtn.style.display = currentImageIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentImageIndex < visibleImages.length - 1 ? 'block' : 'none';
        };

        const showImage = (index) => {
            const imgLink = visibleImages[index];
            lightboxImg.src = imgLink.href;
            lightboxCaption.textContent = imgLink.dataset.title || '';
            currentImageIndex = index;
            updateLightboxNav();
        };

        galleryCards.forEach((card, index) => {
            card.addEventListener('click', e => {
                e.preventDefault();
                visibleImages = Array.from(document.querySelectorAll('.gallery-card')).filter(c => c.style.display !== 'none');
                const clickedIndex = visibleImages.findIndex(c => c === card);
                lightbox.hidden = false;
                document.body.style.overflow = 'hidden';
                showImage(clickedIndex);
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        });

        nextBtn.addEventListener('click', () => {
            if (currentImageIndex < visibleImages.length - 1) showImage(currentImageIndex + 1);
        });

        prevBtn.addEventListener('click', () => {
            if (currentImageIndex > 0) showImage(currentImageIndex - 1);
        });

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeBtn.click();
        });

        document.addEventListener('keydown', e => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
            }
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            cookieBanner.hidden = false;
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.hidden = true;
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            const ctaObserver = new IntersectionObserver(([entry]) => {
                stickyCTA.classList.toggle('visible', !entry.isIntersecting);
            }, { threshold: 0 });
            ctaObserver.observe(heroSection);
        }
    }
});