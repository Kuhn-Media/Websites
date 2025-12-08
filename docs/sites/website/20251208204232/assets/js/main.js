document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER --- //
    const header = document.querySelector('.km-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE NAVIGATION --- //
    const burger = document.querySelector('.km-burger');
    const nav = document.querySelector('.km-nav');
    if (burger && nav) {
        const mobileNav = document.createElement('div');
        mobileNav.classList.add('km-mobile-nav');
        mobileNav.innerHTML = nav.innerHTML;
        document.body.appendChild(mobileNav);

        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            mobileNav.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('open');
                mobileNav.classList.remove('open');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // --- FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.km-faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.km-faq-question');
        const answer = item.querySelector('.km-faq-answer');

        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');

            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.km-faq-answer').style.maxHeight = null;
            });

            if (!wasActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- SCROLL REVEAL --- //
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- SMOOTH SCROLL FOR ANCHOR LINKS --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});