document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.km-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.km-nav-link');

    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Optional: prevent scrolling when nav is open
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header height if needed
                const headerOffset = document.querySelector('.km-header')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px' // Relative to the viewport
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.km-accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.closest('.km-accordion-item');
            const content = currentItem.querySelector('.km-accordion-content');

            // Close other open items
            accordionHeaders.forEach(otherHeader => {
                const otherItem = otherHeader.closest('.km-accordion-item');
                if (otherItem !== currentItem && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherItem.querySelector('.km-accordion-content').classList.remove('active');
                }
            });

            // Toggle current item
            header.classList.toggle('active');
            content.classList.toggle('active');
        });
    });
});