// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.km-nav__burger');
    const navList = document.querySelector('.km-nav__list');
    const nav = document.querySelector('.km-nav');

    if (burger && navList) {
        burger.addEventListener('click', () => {
            navList.classList.toggle('is-open');
            nav.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll'); // Optional: Prevent body scroll when menu is open
        });

        // Close menu when a navigation link is clicked
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('is-open');
                nav.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.km-faq__question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('is-open');

            // Close all other open answers (optional, as per instructions)
            faqQuestions.forEach(q => {
                if (q !== question && q.classList.contains('is-open')) {
                    q.classList.remove('is-open');
                    q.nextElementSibling.classList.remove('is-open');
                    q.nextElementSibling.style.maxHeight = null;
                }
            });

            if (isOpen) {
                question.classList.remove('is-open');
                answer.classList.remove('is-open');
                answer.style.maxHeight = null;
            } else {
                question.classList.add('is-open');
                answer.classList.add('is-open');
                answer.style.maxHeight = answer.scrollHeight + 'px'; // Set max-height to scrollHeight
            }
        });
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Element becomes visible when 10% of it is in the viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });
});