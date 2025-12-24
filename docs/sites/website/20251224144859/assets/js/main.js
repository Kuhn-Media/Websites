document.addEventListener('DOMContentLoaded', function () {

    // Sticky Header
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Navigation
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            mobileNavToggle.classList.toggle('open');
        });
    }

    // FAQ Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';

                // Close all other items
                // accordionItems.forEach(otherItem => {
                //     if (otherItem !== item) {
                //         otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                //         otherItem.querySelector('.accordion-content').style.maxHeight = null;
                //     }
                // });

                // Toggle the clicked item
                if (isExpanded) {
                    header.setAttribute('aria-expanded', 'false');
                    content.style.maxHeight = null;
                } else {
                    header.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }

});