document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainMenu = document.querySelector('.main-menu');

  if (navToggle && mainMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mainMenu.classList.toggle('is-open');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });
  }

  // --- 2. Sticky Header Shrink on Scroll ---
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

  // --- 3. Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
        const children = entry.target.children;
        if (children.length > 0 && delay > 0) {
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    child.classList.add('is-visible');
                }, index * delay);
            });
        } else {
            entry.target.classList.add('is-visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- 4. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        answer.hidden = isExpanded;
      });
    }
  });

  // --- 5. Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // --- 6. Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
          }
      }
    });
  });

  // --- 7. Sticky CTA Bar ---
  const stickyCtaBar = document.getElementById('sticky-cta-bar');
  if (stickyCtaBar) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > window.innerHeight * 0.5) { // Show after 50% of viewport height scroll
              stickyCtaBar.classList.add('show');
          } else {
              stickyCtaBar.classList.remove('show');
          }
      });
  }

  // --- 8. Lightbox Gallery ---
  const galleries = document.querySelectorAll('.lightbox-gallery');
  if (galleries.length > 0) {
    galleries.forEach(gallery => {
      gallery.addEventListener('click', function(e) {
        e.preventDefault();
        const link = e.target.closest('a');
        if (!link) return;

        const imageUrl = link.href;
        createLightbox(imageUrl);
      });
    });

    function createLightbox(imageUrl) {
      const lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
        z-index: 9999; cursor: pointer; opacity: 0; transition: opacity 0.3s ease;
      `;

      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.cssText = `
        max-width: 90%; max-height: 90%; object-fit: contain;
        box-shadow: 0 0 40px rgba(0,0,0,0.5);
        transform: scale(0.9); transition: transform 0.3s ease;
      `;
      
      lightbox.appendChild(img);
      document.body.appendChild(lightbox);

      setTimeout(() => {
        lightbox.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, 20);

      lightbox.addEventListener('click', () => {
        lightbox.style.opacity = '0';
        img.style.transform = 'scale(0.9)';
        setTimeout(() => document.body.removeChild(lightbox), 300);
      });

      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              lightbox.click();
          }
      }, { once: true });
    }
  }

});