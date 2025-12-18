document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if(toggle) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Scroll Reveal Animation
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    
    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger once on load

  // Cookie Banner Logic
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  
  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
      if(cookieBanner) cookieBanner.style.display = 'block';
    }, 2000);
  }
  
  if(acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.style.display = 'none';
    });
  }
});