document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.km-nav__toggle');
    const mainNav = document.querySelector('.km-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Close mobile nav on link click ---
    const navLinks = document.querySelectorAll('.km-nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (document.body.classList.contains('nav-open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            }
        });
    });

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.km-faq__question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = document.getElementById(question.getAttribute('aria-controls'));

            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    });

    // --- Services Tabs ---
    const tabs = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Deactivate all tabs and hide all panels
            tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
            tabPanels.forEach(p => p.hidden = true);

            // Activate clicked tab and show corresponding panel
            const targetTab = e.currentTarget;
            const targetPanel = document.getElementById(targetTab.getAttribute('aria-controls'));

            targetTab.setAttribute('aria-selected', 'true');
            if (targetPanel) {
                targetPanel.hidden = false;
            }
        });
    });

    // --- Testimonials Carousel ---
    const track = document.querySelector('.km-carousel__track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.km-carousel__button--next');
        const prevButton = document.querySelector('.km-carousel__button--prev');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
            currentIndex = targetIndex;
        };

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });
        
        // Recalculate width on resize
        window.addEventListener('resize', () => {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            track.style.transition = 'none'; // Disable transition for instant resize
            track.style.transform = `translateX(-${newSlideWidth * currentIndex}px)`;
            setTimeout(() => {
                 track.style.transition = 'transform 0.5s ease';
            }, 50);
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Scrollspy for Active Nav Link ---
    const sections = document.querySelectorAll('section[id]');
    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.km-nav__link').forEach(link => {
                    link.classList.remove('is-active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('is-active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px' });

    sections.forEach(section => scrollSpyObserver.observe(section));
});