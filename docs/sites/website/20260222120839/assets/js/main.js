document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Mobile Navigation --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('scrolling-locked', isOpen);
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('button');

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- 5. FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
        });
    });

    // --- 6. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    const cookieConsent = localStorage.getItem('cookie_consent');

    if (!cookieConsent) {
        cookieBanner.hidden = false;
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookie_consent', consent);
        cookieBanner.hidden = true;
    };

    if(acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if(declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

    // --- 7. Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    const galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
    let currentImageIndex;

    const showImage = (index) => {
        const imgElement = galleryImages[index];
        const imgSrc = imgElement.getAttribute('data-km-image') || imgElement.src;
        const imgAlt = imgElement.alt;
        // Adjust path for display from subpages
        const displaySrc = window.location.pathname.includes('/index.html') || window.location.pathname === '/' ? imgSrc : `../${imgSrc}`;
        lightboxImg.src = displaySrc;
        lightboxImg.alt = imgAlt;
        currentImageIndex = index;
    };

    const openLightbox = (index) => {
        showImage(index);
        lightbox.hidden = false;
        document.body.classList.add('scrolling-locked');
        document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        document.body.classList.remove('scrolling-locked');
        document.removeEventListener('keydown', handleKeydown);
    };

    const showPrevImage = () => {
        const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage(newIndex);
    };

    const showNextImage = () => {
        const newIndex = (currentImageIndex + 1) % galleryImages.length;
        showImage(newIndex);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    };

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    if (lightbox) {
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    
    // --- 8. Sticky CTA Bar --- //
    const stickyBar = document.getElementById('sticky-cta-bar');
    if (stickyBar) {
        const showBarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the first section is out of view
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyBar.classList.add('visible');
                } else {
                    stickyBar.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        const firstSection = document.querySelector('main > section:first-of-type');
        if (firstSection) {
            showBarObserver.observe(firstSection);
        }
    }

    // --- 9. Contact Form Submission --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a static site, so we just show a confirmation.
            // In a real application, this would send data to a server.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});