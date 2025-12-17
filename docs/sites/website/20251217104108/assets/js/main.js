document.addEventListener('DOMContentLoaded', function() {
  // 1. JS Enabled Class
  document.documentElement.classList.add('js');

  // 2. Mobile Menu
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function() {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
    });
  }

  // 3. Accessibility Toggle (Font Size)
  const a11yBtn = document.getElementById('a11y-toggle');
  if (a11yBtn) {
    // Check stored preference
    if (localStorage.getItem('a11y-large') === 'true') {
      document.documentElement.classList.add('a11y-large');
    }

    a11yBtn.addEventListener('click', function() {
      document.documentElement.classList.toggle('a11y-large');
      localStorage.setItem('a11y-large', document.documentElement.classList.contains('a11y-large'));
    });
  }

  // 4. Accordion (FAQ)
  const accordions = document.querySelectorAll('.accordion-trigger');
  accordions.forEach(acc => {
    acc.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const expanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close others (optional, keeping it simple for now)
      
      this.setAttribute('aria-expanded', !expanded);
      content.classList.toggle('active');
      
      const icon = this.querySelector('.icon');
      if (icon) icon.textContent = expanded ? '+' : '-';
    });
  });

  // 5. Cookie Banner
  const cookieBanner = document.createElement('div');
  cookieBanner.id = 'cookie-banner';
  cookieBanner.innerHTML = `
    <div class="cookie-text">
      <p>Wir nutzen Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. <a href="datenschutz/index.html">Mehr Infos</a>.</p>
    </div>
    <div class="cookie-actions">
      <button id="cookie-accept" class="btn btn-primary btn-sm">Akzeptieren</button>
      <button id="cookie-essential" class="btn btn-outline btn-sm">Nur Notwendige</button>
    </div>
  `;
  document.body.appendChild(cookieBanner);

  const acceptBtn = document.getElementById('cookie-accept');
  const essentialBtn = document.getElementById('cookie-essential');
  const settingsBtn = document.getElementById('open-cookie-settings');

  if (!localStorage.getItem('cookie-consent')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1000);
  }

  function hideBanner() {
    cookieBanner.classList.remove('visible');
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'all');
      hideBanner();
    });
  }

  if (essentialBtn) {
    essentialBtn.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'essential');
      hideBanner();
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      localStorage.removeItem('cookie-consent');
      cookieBanner.classList.add('visible');
    });
  }

  // 6. Scroll Reveal (Simple Fade In)
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .service-preview, .section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});