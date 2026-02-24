document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');

            // Clone nav for drawer to avoid layout shifts
            if (!document.querySelector('.mobile-nav-drawer')) {
                const drawer = document.createElement('div');
                drawer.className = 'mobile-nav-drawer';
                drawer.innerHTML = `<ul>${navList.innerHTML}</ul>`;
                mainNav.appendChild(drawer);
            }
            setTimeout(() => {
                 const drawer = document.querySelector('.mobile-nav-drawer');
                 if(drawer) drawer.classList.toggle('is-active');
            }, 10);
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const heroSection = document.querySelector('.hero');
        const triggerHeight = heroSection ? heroSection.offsetHeight / 2 : 300;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > triggerHeight) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        }, { passive: true });
    }

    // --- Lightbox Gallery ---
    const gallery = document.querySelector('.lightbox-gallery');
    if (gallery) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;
        const images = Array.from(gallery.querySelectorAll('a'));

        const showImage = (index) => {
            currentIndex = index;
            lightboxImg.src = images[currentIndex].href;
            lightboxImg.alt = images[currentIndex].querySelector('img').alt;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        images.forEach((imgLink, index) => {
            imgLink.addEventListener('click', (e) => {
                e.preventDefault();
                showImage(index);
            });
        });

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        const showPrev = () => {
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(newIndex);
        };

        const showNext = () => {
            const newIndex = (currentIndex + 1) % images.length;
            showImage(newIndex);
        };

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
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