document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile nav if open
            const navList = document.querySelector('.main-nav .nav-list');
            if (navList && navList.classList.contains('open')) {
                navList.classList.remove('open');
            }
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.main-nav .nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('open');
        });
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');

            // Close all other open FAQs
            document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
                if (openAnswer !== answer) {
                    openAnswer.classList.remove('open');
                    openAnswer.previousElementSibling.classList.remove('active');
                }
            });

            // Toggle current FAQ
            answer.classList.toggle('open');
            button.classList.toggle('active');
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Optional: Add a slight parallax effect to hero media on scroll
    const heroMedia = document.querySelector('.hero-media img');
    if (heroMedia) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroMedia.style.transform = `translateY(${scrollY * 0.1}px)`;
        });
    }
});