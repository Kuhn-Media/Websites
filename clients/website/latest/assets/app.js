
    document.addEventListener('DOMContentLoaded', () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const animatedElements = document.querySelectorAll('[data-animate]');

      if (prefersReducedMotion) {
        animatedElements.forEach(el => el.classList.add('no-animation'));
      } else {
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('is-visible');
              }, index * 90); // Stagger animation
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 }); // Adjust threshold as needed

        animatedElements.forEach(el => {
          observer.observe(el);
        });
      }

      // --- Cookie Consent Logic ---
      const hasAnalytics = false;
      const cookieBanner = document.querySelector('.cookie-banner');
      const acceptCookiesBtn = document.getElementById('acceptCookies');
      const declineCookiesBtn = document.getElementById('declineCookies');

      function setCookie(name, value, days) {
          const d = new Date();
          d.setTime(d.getTime() + (days*24*60*60*1000));
          const expires = "expires=" + d.toUTCString();
          document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
      }

      function getCookie(name) {
          const nameEQ = name + "=";
          const ca = document.cookie.split(';');
          for(let i=0; i < ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0)===' ') c = c.substring(1,c.length);
              if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
          }
          return null;
      }

      function handleCookieConsent() {
        if (hasAnalytics && !getCookie('cookie_consent')) {
          cookieBanner.classList.add('show');
        }

        if (acceptCookiesBtn) {
            acceptCookiesBtn.addEventListener('click', () => {
                setCookie('cookie_consent', 'accepted', 365);
                cookieBanner.classList.remove('show');
                // Placeholder for analytics initialization
                console.log('Cookies accepted. Initialize analytics if present.');
            });
        }

        if (declineCookiesBtn) {
            declineCookiesBtn.addEventListener('click', () => {
                setCookie('cookie_consent', 'declined', 365);
                cookieBanner.classList.remove('show');
                console.log('Cookies declined. Analytics will not be loaded.');
            });
        }
      }
      handleCookieConsent();

      // Simple form submission (no actual backend)
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
          this.reset();
        });
      }
    });
    