document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.km-nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
        document.querySelectorAll('.km-nav-mobile a').forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('nav-open');
            });
        });
    }
    
    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100); // Staggered delay
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- Menu Filter ---
    const menuFilters = document.querySelectorAll('.km-menu-filter');
    const menuItems = document.querySelectorAll('.km-menu-item');
    
    if (menuFilters.length > 0 && menuItems.length > 0) {
        const filterItems = (category) => {
            menuItems.forEach(item => {
                if (item.dataset.category === category) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };

        menuFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                menuFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                filterItems(filter.dataset.category);
            });
        });

        // Initial filter
        filterItems('group_coffee');
    }

    // --- Testimonials Carousel ---
    const carousels = document.querySelectorAll('.km-carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.km-carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.km-carousel-next');
        const prevButton = carousel.querySelector('.km-carousel-prev');
        const dotsNav = carousel.querySelector('.km-carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
        };

        // Create dots
        if (dotsNav) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('km-carousel-dot');
                if (i === 0) dot.classList.add('active');
                dotsNav.appendChild(dot);
                dot.addEventListener('click', () => moveToSlide(i));
            });
        }

        const dots = dotsNav ? Array.from(dotsNav.children) : [];
        const updateDots = (targetIndex) => {
            if (!dotsNav) return;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === targetIndex);
            });
        };

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });
        
        // Auto-rotate
        let autoRotateInterval = setInterval(() => {
            nextButton.click();
        }, 8000);

        carousel.addEventListener('mouseenter', () => clearInterval(autoRotateInterval));
        carousel.addEventListener('mouseleave', () => {
            autoRotateInterval = setInterval(() => nextButton.click(), 8000);
        });

        // Resize handling
        window.addEventListener('resize', () => {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = 'translateX(-' + newSlideWidth * currentIndex + 'px)';
        });
    });
});