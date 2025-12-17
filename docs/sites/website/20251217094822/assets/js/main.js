document.addEventListener('DOMContentLoaded', function() {
    // JS Enabled Flag
    document.documentElement.classList.add('js');

    // Mobile Menu
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('is-open');
            const spans = mobileToggle.querySelectorAll('span');
            // Simple animation toggle logic could go here
        });
    }

    // Accordion
    const accordionTriggers = document.querySelectorAll('.accordion__trigger');
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            item.classList.toggle('active');
        });
    });

    // Cookie Banner
    const cookieBanner = document.createElement('div');
    cookieBanner.id = 'cookie-banner';
    cookieBanner.innerHTML = `
        <div class="cookie-text">
            <p><strong>Wir nutzen Cookies</strong>, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. Einige sind notwendig, andere helfen uns bei der Verbesserung.</p>
        </div>
        <div class="cookie-actions">
            <button id="cookie-accept" class="btn btn--primary">Alle akzeptieren</button>
            <button id="cookie-essential" class="btn btn--secondary">Nur notwendige</button>
        </div>
    `;
    document.body.appendChild(cookieBanner);

    const acceptBtn = document.getElementById('cookie-accept');
    const essentialBtn = document.getElementById('cookie-essential');

    // Check local storage
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'all');
            cookieBanner.classList.remove('visible');
        });
    }

    if (essentialBtn) {
        essentialBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'essential');
            cookieBanner.classList.remove('visible');
        });
    }

    // Sticky Header Shrink (Optional visual polish)
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
        } else {
            header.style.padding = '1rem 0';
        }
    });
});