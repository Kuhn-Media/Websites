// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        // Close mobile nav if open
        const mobileNav = document.getElementById('mobileNav');
        const burgerMenu = document.getElementById('burgerMenu');
        if (mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            burgerMenu.classList.remove('active');
        }
    });
});

// Mobile Navigation Toggle
const burgerMenu = document.getElementById('burgerMenu');
const mobileNav = document.getElementById('mobileNav');

burgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    burgerMenu.classList.toggle('active');
});

// FAQ Accordion
document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
        const accordionContent = button.nextElementSibling;
        
        button.classList.toggle('active');
        accordionContent.classList.toggle('active');

        if (accordionContent.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
        } else {
            accordionContent.style.maxHeight = '0';
        }

        // Change icon based on active state
        const icon = button.querySelector('.icon');
        if (button.classList.contains('active')) {
            icon.textContent = '–'; // Minus sign
        } else {
            icon.textContent = '+'; // Plus sign
        }
    });
});
