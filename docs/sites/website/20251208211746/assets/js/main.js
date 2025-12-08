// JS
document.addEventListener('DOMContentLoaded', () => {

  // Sticky Header
  const header = document.querySelector('.km-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile Menu
  const burger = document.querySelector('.km-burger');
  const nav = document.querySelector('.km-nav');
  const navLinks = document.querySelectorAll('.km-nav-link');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('is-open')) {
                nav.classList.remove('is-open');
                document.body.classList.remove('nav-open');
            }
        });
    });
  }

  // Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.km-faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.km-faq-question');
    const answer = item.querySelector('.km-faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.km-faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Lightbox
  class Lightbox {
      constructor() {
        this.lightboxEl = document.querySelector('.km-lightbox');
        if (!this.lightboxEl) return;
        this.imageEl = this.lightboxEl.querySelector('.km-lightbox-image');
        this.closeBtn = this.lightboxEl.querySelector('.km-lightbox-close');
        this.attachEvents();
      }

      open(src, alt) {
        this.imageEl.src = src;
        this.imageEl.alt = alt || '';
        this.lightboxEl.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      close() {
        this.lightboxEl.classList.remove('active');
        document.body.style.overflow = '';
      }

      attachEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.lightboxEl.addEventListener('click', (e) => {
          if (e.target === this.lightboxEl) this.close();
        });
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.lightboxEl.classList.contains('active')) this.close();
        });
      }
    }

    const lightbox = new Lightbox();
    const galleryImages = document.querySelectorAll('.km-gallery-item img');
    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        lightbox.open(img.src, img.alt);
      });
    });

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});