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

  // Force Dark Mode and Clean Up Legacy Theme Settings
  document.body.classList.remove('light-mode');
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');

  // Smooth scroll JS removed in favor of CSS html { scroll-behavior: smooth; }

  // Scroll Progress Bar Logic
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }

    // Show/Hide Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  });

  // Sync Mobile Nav with ScrollSpy active state
  document.body.addEventListener('activate.bs.scrollspy', () => {
    const activeLink = document.querySelector('#sideNav .nav-link.active');
    if (activeLink) {
      const targetId = activeLink.getAttribute('href');
      document.querySelectorAll('.mobile-nav-item').forEach(item => {
        if (item.getAttribute('href') === targetId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  });

  // Intersection Observer for Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, observerOptions);

  // Observe all sections and cards for animation
  document.querySelectorAll('.resume-section, .card-glass, .resume-item').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Mouse tracking for card spotlight effect
  document.getElementById('projectGrid').addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card-glass');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Project Filtering Logic
  window.filterProjects = function (category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.project-filters button');

    // Update active button
    buttons.forEach(btn => {
      btn.classList.remove('btn-primary', 'active');
      btn.classList.add('btn-outline-primary');
    });
    event.currentTarget.classList.remove('btn-outline-primary');
    event.currentTarget.classList.add('btn-primary', 'active');

    // Filter cards
    cards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'block';
        setTimeout(() => card.classList.add('reveal-active'), 10);
      } else {
        card.style.display = 'none';
        card.classList.remove('reveal-active');
      }
    });
  };

  // Sidebar Search Logic
  window.filterContent = function () {
    const searchTerm = document.getElementById('sidebarSearch').value.toLowerCase();
    const searchableElements = document.querySelectorAll('.project-card, .resume-item');

    searchableElements.forEach(el => {
      const text = el.innerText.toLowerCase();
      if (text.includes(searchTerm)) {
        el.style.display = 'block';
        setTimeout(() => el.classList.add('reveal-active'), 10);
      } else {
        el.style.display = 'none';
        el.classList.remove('reveal-active');
      }
    });
  };

  // Filter Skills by Search
  window.filterSkills = function () {
    const searchTerm = document.getElementById('skillSearch').value.toLowerCase();
    const skillCards = document.querySelectorAll('.tech-skill-card');
    const techChips = document.querySelectorAll('.tech-chip');

    skillCards.forEach(card => {
      const text = card.innerText.toLowerCase();
      if (text.includes(searchTerm)) {
        card.parentElement.style.display = 'block';
        setTimeout(() => card.classList.add('reveal-active'), 10);
      } else {
        card.parentElement.style.display = 'none';
        card.classList.remove('reveal-active');
      }
    });

    techChips.forEach(chip => {
      const text = chip.innerText.toLowerCase();
      if (text.includes(searchTerm)) {
        chip.parentElement.style.display = 'block';
        setTimeout(() => chip.classList.add('reveal-active'), 10);
      } else {
        chip.parentElement.style.display = 'none';
        chip.classList.remove('reveal-active');
      }
    });
  };

  // Copy Email to Clipboard
  window.copyEmail = function (email) {
    navigator.clipboard.writeText(email).then(() => {
      const btn = event.currentTarget;
      const originalText = btn.innerHTML;
      const originalClasses = btn.className;

      btn.innerHTML = '<i class="fas fa-check me-2"></i> Copied!';
      btn.classList.add('btn-success');
      btn.classList.remove('btn-primary', 'btn-outline-light', 'btn-outline-primary');

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.className = originalClasses;
      }, 2000);
    });
  };

});
