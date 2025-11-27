document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile nav if open
                const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
                const siteHeader = document.querySelector('.site-header');
                if (siteHeader.classList.contains('nav-open')) {
                    siteHeader.classList.remove('nav-open');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - (siteHeader ? siteHeader.offsetHeight + 20 : 0), // Offset by header height + some padding
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const siteHeader = document.querySelector('.site-header');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            siteHeader.classList.toggle('nav-open');
        });
    }

    // Close mobile nav when clicking outside (optional)
    // document.addEventListener('click', (event) => {
    //     if (siteHeader.classList.contains('nav-open') &&
    //         !siteHeader.contains(event.target) &&
    //         !mobileNavToggle.contains(event.target)) {
    //         siteHeader.classList.remove('nav-open');
    //     }
    // });
});