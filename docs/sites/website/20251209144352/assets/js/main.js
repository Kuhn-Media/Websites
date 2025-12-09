// JS
document.addEventListener('DOMContentLoaded', () => {

    // Sticky Header
    const header = document.querySelector('.km-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Navigation
    const burgerMenu = document.querySelector('.km-burger-menu');
    const nav = document.querySelector('.km-nav');
    if (burgerMenu && nav) {
        const mobileNav = document.createElement('div');
        mobileNav.className = 'km-mobile-nav-overlay';
        mobileNav.innerHTML = nav.innerHTML;
        document.body.appendChild(mobileNav);

        burgerMenu.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }

    // FAQ Accordion
    const accordionItems = document.querySelectorAll('.km-accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.km-accordion-header');
        const content = item.querySelector('.km-accordion-content');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            accordionItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.km-accordion-content').style.maxHeight = null;
            });

            // Open the clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Lightbox
    const lightbox = document.querySelector('.km-lightbox');
    const lightboxImage = lightbox.querySelector('.km-lightbox-image');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const galleryItems = document.querySelectorAll('.km-gallery-item img');

    function openLightbox(src, alt) {
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

});