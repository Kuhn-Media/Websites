document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.main-nav');
    
    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            nav.classList.toggle('is-open');
            const isOpen = nav.classList.contains('is-open');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // Cookie Banner
    const cookieContainer = document.getElementById('cookie-banner-container');
    if (cookieContainer && !localStorage.getItem('cookiesAccepted')) {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-text">
                <strong>Wir nutzen Cookies</strong><br>
                Um unsere Webseite für Sie optimal zu gestalten, verwenden wir nur technisch notwendige Cookies.
            </div>
            <div class="cookie-btns">
                <button id="accept-cookies" class="btn btn-primary btn-sm">Akzeptieren</button>
            </div>
        `;
        cookieContainer.appendChild(banner);

        document.getElementById('accept-cookies').addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            banner.remove();
        });
    }

    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});