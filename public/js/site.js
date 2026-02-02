// Site behavior matching the homepage source-of-truth:
// - Theme toggle
// - Mobile nav toggle
// - Header scroll effect
// - IntersectionObserver fade-in animations

(function () {
  function setTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  function initThemeToggle() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      const current =
        localStorage.getItem('theme') ||
        (html.classList.contains('dark') ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      themeToggle.setAttribute(
        'aria-label',
        next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    });
  }

  function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (!mobileToggle || !mobileNav) return;

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initHeaderScrollEffect() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const updateHeader = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  function initFadeInObserver() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length || typeof IntersectionObserver === 'undefined') return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach((el) => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initThemeToggle();
      initMobileNav();
      initHeaderScrollEffect();
      initFadeInObserver();
    });
  } else {
    initThemeToggle();
    initMobileNav();
    initHeaderScrollEffect();
    initFadeInObserver();
  }
})();

