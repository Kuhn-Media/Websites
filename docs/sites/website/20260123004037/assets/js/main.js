document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    // --- Mobile Navigation ---
    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const body = document.body;
        if (!toggleBtn) return;

        const navPanel = document.createElement('div');
        navPanel.className = 'mobile-nav-panel';
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            navPanel.innerHTML = mainNav.innerHTML;
            body.appendChild(navPanel);
        }

        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('nav-open');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('nav-open')) {
                body.classList.remove('nav-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    };

    // --- Scroll Animations ---
    const initScrollAnimations = () => {
        const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger-group');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- FAQ Accordion ---
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });
    };

    // --- Before/After Slider ---
    const initBeforeAfterSlider = () => {
        document.querySelectorAll('.before-after-slider').forEach(slider => {
            const handle = slider.querySelector('.ba-handle');
            const afterImage = slider.querySelector('.ba-after');
            if (!handle || !afterImage) return;

            let isDragging = false;

            const moveHandler = (x) => {
                const rect = slider.getBoundingClientRect();
                let pos = (x - rect.left) / rect.width * 100;
                pos = Math.max(0, Math.min(100, pos));
                handle.style.left = pos + '%';
                afterImage.style.clipPath = `inset(0 0 0 ${pos}%)`;
            };

            handle.addEventListener('mousedown', () => { isDragging = true; });
            handle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
            
            document.addEventListener('mouseup', () => { isDragging = false; });
            document.addEventListener('touchend', () => { isDragging = false; });

            document.addEventListener('mousemove', e => {
                if (isDragging) moveHandler(e.clientX);
            });
            document.addEventListener('touchmove', e => {
                if (isDragging) moveHandler(e.touches[0].clientX);
            }, { passive: true });
        });
    };

    // --- Lightbox for Project Gallery ---
    const initLightbox = () => {
        const gallery = document.getElementById('project-gallery');
        const lightbox = document.getElementById('lightbox');
        if (!gallery || !lightbox) return;

        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDesc = document.getElementById('lightbox-desc');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        const projectLinks = Array.from(gallery.querySelectorAll('.project-card'));
        let currentIndex = 0;

        const showImage = (index) => {
            const link = projectLinks[index];
            lightboxImg.src = link.href;
            lightboxImg.alt = link.querySelector('img').alt;
            lightboxTitle.textContent = link.dataset.title || '';
            lightboxDesc.textContent = link.dataset.description || '';
            currentIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const index = projectLinks.indexOf(e.currentTarget);
            showImage(index);
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            lightbox.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        projectLinks.forEach(link => link.addEventListener('click', openLightbox));

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + projectLinks.length) % projectLinks.length;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % projectLinks.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    };

    // --- Contact Form Handler ---
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Vielen Dank für Ihre Nachricht! Da dies eine Demo-Website ist, wurde Ihre Anfrage nicht versendet. Bitte kontaktieren Sie die Fritsch GmbH direkt.');
            });
        }
    };

    // --- Cookie Banner ---
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => banner.classList.add('visible'), 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('visible');
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initScrollAnimations();
    initFaqAccordion();
    initBeforeAfterSlider();
    initLightbox();
    initContactForm();
    initCookieBanner();
});