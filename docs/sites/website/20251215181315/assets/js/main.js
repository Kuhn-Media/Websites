document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burger-menu');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;

    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            burgerMenu.classList.toggle('active');
            body.classList.toggle('nav-open');
        });
    }

    // Close mobile nav on link click
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                burgerMenu.classList.remove('active');
                body.classList.remove('nav-open');
            }
        });
    });
});
