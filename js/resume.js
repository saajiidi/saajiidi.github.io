window.addEventListener('DOMContentLoaded', event => {

  // Activate Bootstrap scrollspy on the main nav element
  const sideNav = document.body.querySelector('#sideNav');
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#sideNav',
      offset: 74,
    });
  };

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#sideNav .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });

  // Theme Toggle Logic
  const themeToggle = document.getElementById('themeToggle');
  const icon = themeToggle.querySelector('i');
  const htmlElement = document.documentElement;

  // Check for saved theme
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    htmlElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      document.body.classList.add('light-mode');
    }
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
      htmlElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });

  // AOS Animation Initialization (Optional implementation)
  // const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //             entry.target.classList.add('show');
  //         }
  //     });
  // });

  // const hiddenElements = document.querySelectorAll('.animate-hidden');
  // hiddenElements.forEach((el) => observer.observe(el));

});
