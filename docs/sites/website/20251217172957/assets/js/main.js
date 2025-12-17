document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const toggleBtn = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            // Toggle Hamburger Icon Animation could go here
        });
    }

    // Close menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
});