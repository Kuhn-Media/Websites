document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  
  // Mobile Menu
  const toggle = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  
  if (toggle && overlay) {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      overlay.classList.toggle('open');
      document.body.style.overflow = isExpanded ? '' : 'hidden'; // Prevent scrolling
    });
  }

  // Accordion
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(acc => {
    acc.addEventListener('click', () => {
      const expanded = acc.getAttribute('aria-expanded') === 'true';
      const content = acc.nextElementSibling;
      
      // Close others
      accordions.forEach(other => {
        if (other !== acc) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      acc.setAttribute('aria-expanded', !expanded);
      if (!expanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  // Comfort Selector (Signature Component)
  const comfortBtns = document.querySelectorAll('.comfort-btn');
  const comfortTexts = document.querySelectorAll('.comfort-text');

  if (comfortBtns.length > 0) {
    comfortBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        comfortBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');

        // Hide all texts
        comfortTexts.forEach(t => t.classList.remove('active'));
        // Show target text
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.classList.add('active');
      });
    });
  }

  // Cookie Banner (Simple Implementation)
  const cookieKey = 'km_cookies_accepted';
  if (!localStorage.getItem(cookieKey)) {
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#1e293b;color:white;padding:1rem;z-index:9999;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;box-shadow:0 -4px 10px rgba(0,0,0,0.1);font-family:sans-serif;font-size:0.9rem;';
    banner.innerHTML = `
      <div>Wir nutzen Cookies, um Ihnen den besten Service zu bieten. <a href="datenschutz/" style="text-decoration:underline;color:white;">Mehr Infos</a></div>
      <button id="acceptCookies" style="background:#14532d;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:bold;">Akzeptieren</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('acceptCookies').addEventListener('click', () => {
      localStorage.setItem(cookieKey, 'true');
      banner.remove();
    });
  }
});