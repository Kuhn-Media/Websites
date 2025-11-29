document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navList = document.querySelector('.nav-list');
            if (navList && navList.classList.contains('active')) {
                navList.classList.remove('active');
                document.querySelector('.burger-menu').classList.remove('active');
            }
        });
    });

    // Mobile navigation toggle
    const burgerMenu = document.querySelector('.burger-menu');
    const navList = document.querySelector('.nav-list');

    if (burgerMenu && navList) {
        burgerMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
            burgerMenu.classList.toggle('active');
        });
    }

    // Add current year to footer
    const currentYear = new Date().getFullYear();
    const footerText = document.querySelector('.footer-content p');
    if (footerText) {
        footerText.innerHTML = footerText.innerHTML.replace('{{year}}', currentYear);
    }
});