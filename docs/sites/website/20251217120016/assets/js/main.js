document.addEventListener('DOMContentLoaded', function() {
    // JS enabled class
    document.documentElement.classList.add('js');

    // Mobile Menu Toggle
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-list');
    
    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            nav.style.display = isExpanded ? '' : 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.background = 'white';
            nav.style.padding = '20px';
            nav.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
    }

    // Signature Section Tabs
    const tabs = document.querySelectorAll('.focus-tab');
    const panels = document.querySelectorAll('.focus-panel');

    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                panels.forEach(p => {
                    p.hidden = true;
                    p.classList.remove('active');
                });

                // Activate clicked
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                
                const panelId = tab.getAttribute('aria-controls');
                const panel = document.getElementById(panelId);
                if (panel) {
                    panel.hidden = false;
                    panel.classList.add('active');
                }
            });
        });
    }

    // Cookie Banner (Simple Implementation)
    const cookieKey = 'km_cookie_consent';
    if (!localStorage.getItem(cookieKey)) {
        const banner = document.createElement('div');
        banner.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; background: #334155; color: white; padding: 20px; z-index: 9999; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; box-shadow: 0 -2px 10px rgba(0,0,0,0.1);';
        banner.innerHTML = `
            <div style="flex: 1; min-width: 280px;">
                <p style="margin: 0; font-size: 0.9rem;">Wir nutzen Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. <a href="datenschutz/index.html" style="text-decoration: underline; color: #fff;">Mehr erfahren</a>.</p>
            </div>
            <div>
                <button id="cookie-accept" style="background: #7f1d1d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;">Akzeptieren</button>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('cookie-accept').addEventListener('click', () => {
            localStorage.setItem(cookieKey, 'true');
            banner.remove();
        });
    }
});