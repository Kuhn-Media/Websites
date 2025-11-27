// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.main-nav .nav-list a');

    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Optional: prevent scrolling when nav is open
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Smooth scroll for anchor links (if not handled natively by scroll-behavior: smooth)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - (document.querySelector('.site-header')?.offsetHeight || 0);
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Close all other open FAQs
            faqQuestions.forEach(q => {
                if (q !== question && q.classList.contains('active')) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                    q.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current FAQ
            if (isActive) {
                question.classList.remove('active');
                answer.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                question.classList.add('active');
                answer.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});
