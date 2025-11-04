document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        document.querySelectorAll('[data-animate]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.classList.add('is-visible');
        });
        return;
    }

    const animateElements = document.querySelectorAll('[data-animate]');

    if (animateElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const parentElement = entry.target;
                    const children = parentElement.querySelectorAll('*'); // Or more specific children
                    
                    // Apply animation to parent if no relevant children, or to children
                    if (children.length === 0 || parentElement.dataset.animate === 'fadeIn' || parentElement.dataset.animate === 'slideUp' || parentElement.dataset.animate === 'scaleIn') {
                         parentElement.classList.add('reveal');
                         parentElement.classList.add('is-visible');
                    } else {
                        // Stagger effect for children
                        Array.from(children).forEach((child, index) => {
                            child.classList.add('reveal');
                            child.style.setProperty('--stagger-delay', `${index * 90}ms`);
                            requestAnimationFrame(() => {
                                child.classList.add('is-visible');
                            });
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
});
