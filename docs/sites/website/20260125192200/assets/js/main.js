document.addEventListener('DOMContentLoaded', () => {

    // --- Global Modules --- //
    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    };

    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        if (!toggleBtn) return;
        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            document.body.classList.toggle('nav-open');
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
        });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('[data-reveal]');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.reveal) * 100 || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => observer.observe(el));
    };

    const initContextualCta = () => {
        const cta = document.getElementById('context-cta');
        if (!cta) return;
        const scrollHandler = () => {
            if (window.scrollY > window.innerHeight * 0.75) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookie_consent')) {
            setTimeout(() => banner.classList.add('visible'), 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            banner.classList.remove('visible');
        });
    };

    // --- Page-Specific Modules --- //
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
            });
        });
    };

    const initCarousel = () => {
        const wrapper = document.querySelector('.carousel-wrapper');
        if (!wrapper) return;

        const container = wrapper.querySelector('.carousel-container');
        const slides = Array.from(container.children);
        const nextBtn = wrapper.querySelector('.next');
        const prevBtn = wrapper.querySelector('.prev');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        const slideWidth = slides[0].getBoundingClientRect().width;

        const moveToSlide = (index) => {
            container.style.transform = `translateX(-${index * slideWidth}px)`;
            currentIndex = index;
            updateDots();
        };

        // Dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = Array.from(dotsContainer.children);
        const updateDots = () => {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            moveToSlide(newIndex);
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(newIndex);
        });

        // Touch/Swipe
        let startX, isDragging = false;
        container.addEventListener('touchstart', (e) => { startX = e.touches[0].pageX; isDragging = true; }, { passive: true });
        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].pageX;
            const diff = startX - currentX;
            container.style.transform = `translateX(-${currentIndex * slideWidth + diff}px)`;
        }, { passive: true });
        container.addEventListener('touchend', (e) => {
            isDragging = false;
            const diff = startX - e.changedTouches[0].pageX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextBtn.click();
                else prevBtn.click();
            } else {
                moveToSlide(currentIndex);
            }
        });

        updateDots();
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const content = lightbox.querySelector('.km-lightbox-content');
        const imgEl = content.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
        let currentGroup = [];
        let currentIndex = -1;

        const showImage = (index) => {
            if (index < 0 || index >= currentGroup.length) return;
            currentIndex = index;
            const trigger = currentGroup[currentIndex];
            const imagePath = trigger.dataset.kmImage || trigger.src;
            const altText = trigger.alt || 'Großansicht';
            imgEl.src = (imagePath.startsWith('assets') ? '../' : '') + imagePath;
             // Adjust path for subpages
            if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                if (!imgEl.src.includes('../')) {
                    const pathParts = imgEl.src.split('/');
                    const assetsIndex = pathParts.indexOf('assets');
                    if (assetsIndex > -1) {
                        imgEl.src = '../' + pathParts.slice(assetsIndex).join('/');
                    }
                }
            }
            imgEl.alt = altText;
            prevBtn.style.display = index > 0 ? 'flex' : 'none';
            nextBtn.style.display = index < currentGroup.length - 1 ? 'flex' : 'none';
        };

        const openLightbox = (e) => {
            const trigger = e.target.closest('.lightbox-trigger');
            if (!trigger) return;

            const groupName = trigger.dataset.lightboxGroup;
            currentGroup = groupName ? Array.from(document.querySelectorAll(`.lightbox-trigger[data-lightbox-group='${groupName}']`)) : [trigger];
            const index = currentGroup.indexOf(trigger);

            showImage(index);
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const showNext = () => showImage(currentIndex + 1);
        const showPrev = () => showImage(currentIndex - 1);

        document.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        });
    };

    // --- Initialize all --- //
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initContextualCta();
    initCookieBanner();
    initFaqAccordion();
    initCarousel();
    initLightbox();
});