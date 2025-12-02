document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navList = document.querySelector('.km-nav-list');
            if (navList && navList.classList.contains('is-open')) {
                navList.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Mobile Navigation Toggle
    const burgerMenu = document.querySelector('.km-burger-menu');
    const navList = document.querySelector('.km-nav-list');
    const body = document.body;

    if (burgerMenu && navList) {
        burgerMenu.addEventListener('click', () => {
            navList.classList.toggle('is-open');
            body.classList.toggle('no-scroll'); // Prevent body scroll when menu is open
        });
    }

    // FAQ Accordion
    document.querySelectorAll('.km-faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const parentItem = question.closest('.km-faq-item');
            const answer = parentItem.querySelector('.km-faq-answer');
            const icon = question.querySelector('.km-faq-icon');

            const isOpen = question.classList.contains('is-open');

            // Close all other open answers
            document.querySelectorAll('.km-faq-question.is-open').forEach(openQuestion => {
                if (openQuestion !== question) {
                    openQuestion.classList.remove('is-open');
                    openQuestion.closest('.km-faq-item').querySelector('.km-faq-answer').classList.remove('is-open');
                    openQuestion.querySelector('.km-faq-icon').style.transform = 'rotate(0deg)';
                }
            });

            // Toggle current answer
            question.classList.toggle('is-open');
            answer.classList.toggle('is-open');
            icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(45deg)';
        });
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
});
