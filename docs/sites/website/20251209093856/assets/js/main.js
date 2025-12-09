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
    const mobileToggle = document.querySelector('.km-mobile-toggle');
    const nav = document.querySelector('.km-nav');
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-open');
        });

        nav.querySelectorAll('.km-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('mobile-menu-open');
            });
        });
    }

    // --- SMOOTH SCROLL --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- SCROLL REVEAL ANIMATIONS --- //
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.km-faq-item');
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        const answer = item.querySelector('.km-faq-answer');

        summary.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.hasAttribute('open')) {
                answer.style.maxHeight = '0px';
                setTimeout(() => item.removeAttribute('open'), 500);
            } else {
                faqItems.forEach(openItem => {
                    if(openItem.hasAttribute('open')){
                        openItem.querySelector('.km-faq-answer').style.maxHeight = '0px';
                        setTimeout(() => openItem.removeAttribute('open'), 500);
                    }
                })
                item.setAttribute('open', '');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    
    // --- FORM FLOATING LABELS FIX FOR AUTOFILLED FIELDS --- //
    // A little trick to make sure autofilled labels float correctly.
    const inputs = document.querySelectorAll('.km-form-group input, .km-form-group textarea');
    inputs.forEach(input => {
        // Create a placeholder that is just a space to trigger :not(:placeholder-shown)
        if (!input.placeholder) {
            input.setAttribute('placeholder', ' ');
        }
        // On blur, if the input is empty, remove the placeholder to avoid empty space
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.removeAttribute('placeholder');
            }
        });
        // On focus, ensure the placeholder is there
        input.addEventListener('focus', () => {
            if (!input.placeholder) {
                input.setAttribute('placeholder', ' ');
            }
        });
    });

});