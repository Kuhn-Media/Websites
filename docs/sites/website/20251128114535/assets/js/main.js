// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });

            // Optional: Update URL hash without jumping
            history.pushState(null, null, targetId);
        }
    });
});

// Intersection Observer for fade-in/slide-up animations
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

revealElements.forEach(element => {
    observer.observe(element);
});

// Active navigation link on scroll (optional, more complex for onepagers)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.main-nav a');

const activateNavLink = () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) { // Adjust offset as needed
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', activateNavLink);
window.addEventListener('load', activateNavLink);
