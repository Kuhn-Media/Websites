document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      const isExpanded = menu.classList.contains('active');
      toggle.setAttribute('aria-expanded', isExpanded);
      toggle.innerHTML = isExpanded ? '&times;' : '&#9776;';
    });
  }

  // Accordion
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(acc => {
    acc.addEventListener('click', () => {
      const expanded = acc.getAttribute('aria-expanded') === 'true';
      acc.setAttribute('aria-expanded', !expanded);
      const content = acc.nextElementSibling;
      
      if (!expanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  // Care Tabs (Signature Component)
  const tabs = document.querySelectorAll('.care-tab-btn');
  const contents = document.querySelectorAll('.care-content');

  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        // Add active
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
      });
    });
  }

  // Scroll Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Cookie Banner
  const banner = document.querySelector('.cookie-banner');
  const acceptBtn = document.querySelector('.js-accept-cookies');
  
  if (banner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => banner.classList.add('show'), 1000);
    
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        banner.classList.remove('show');
      });
    }
  }
});