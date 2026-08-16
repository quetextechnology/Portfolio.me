(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const progressBar = document.querySelector('.scroll-progress span');
  const backToTopButton = document.querySelector('.back-to-top');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  function setMenuState(isOpen) {
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu',
    );
    navMenu.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  }

  function setupNavigation() {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      setMenuState(!isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenuState(false);
      }
    });
  }

  function updateScrollInterface() {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

    progressBar.style.width = `${progress}%`;
    header.classList.toggle('scrolled', window.scrollY > 18);
    backToTopButton.classList.toggle('show', window.scrollY > 540);
  }

  function setupScrollInterface() {
    window.addEventListener('scroll', updateScrollInterface, {
      passive: true,
    });

    updateScrollInterface();

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  }

  function setupScrollReveal() {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('.reveal').forEach((element) => {
      revealObserver.observe(element);
    });
  }

  function setupActiveNavigation() {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.hash === `#${entry.target.id}`,
            );
          });
        });
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );

    document.querySelectorAll('main section[id]').forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  function setupRoleAnimation() {
    const roles = [
      'Software Developer',
      'Mobile App Developer',
      'Flutter Developer',
      'Digital Marketing Enthusiast',
    ];
    const roleElement = document.querySelector('#role-text');
    let roleIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;

    function typeRole() {
      if (prefersReducedMotion) {
        roleElement.textContent = roles[0];
        return;
      }

      const currentRole = roles[roleIndex];
      characterIndex += isDeleting ? -1 : 1;
      roleElement.textContent = currentRole.slice(0, characterIndex);

      let delay = isDeleting ? 38 : 72;

      if (!isDeleting && characterIndex === currentRole.length) {
        isDeleting = true;
        delay = 1800;
      } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 260;
      }

      window.setTimeout(typeRole, delay);
    }

    typeRole();
  }

  function setupProjectModal() {
    const projects = {
      quetex: {
        category: 'Mobile Application / Business Software / POS System',
        title: 'QueTex POS',
        content:
          '<p>A mobile point-of-sale and business-management application designed for shops, markets, kiosks, grocery businesses, and similar retail operations.</p><ul><li>Supports product and inventory management, barcode scanning, sales processing, and customer receipts.</li><li>Designed around reports, expenses, suppliers, customer debts and loans, and flexible grocery pricing.</li><li>Built with Flutter and Dart, with backup and cloud-oriented business-data needs in mind.</li></ul>',
      },
      attendance: {
        category: 'Computer Vision / Machine Learning',
        title: 'Face Detection Attendance System',
        content:
          '<p>A facial-recognition attendance system that detects and recognizes student faces in real time, verifies identity, and stores attendance information.</p><ul><li>Built with Python and OpenCV.</li><li>Uses machine-learning techniques for real-time face identification.</li><li>Integrates Firebase for attendance records.</li></ul>',
      },
      heart: {
        category: 'Machine Learning / Data Classification',
        title: 'Heart Disease Classification System',
        content:
          '<p>A machine-learning project that classifies the likelihood of heart disease using medical datasets.</p><ul><li>Explored Decision Tree, Random Forest, and Logistic Regression.</li><li>Used Python, Pandas, and Scikit-learn.</li><li>Evaluated with accuracy, precision, recall, and confusion-matrix metrics.</li></ul>',
      },
    };

    const modal = document.querySelector('#project-modal');
    const modalTitle = document.querySelector('#modal-title');
    const modalCategory = document.querySelector('#modal-category');
    const modalContent = document.querySelector('#modal-content');
    const closeButton = document.querySelector('.modal-close');

    document.querySelectorAll('.project-detail').forEach((button) => {
      button.addEventListener('click', () => {
        const project = projects[button.dataset.project];
        modalCategory.textContent = project.category;
        modalTitle.textContent = project.title;
        modalContent.innerHTML = project.content;
        modal.showModal();
      });
    });

    closeButton.addEventListener('click', () => modal.close());

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.close();
      }
    });
  }

  function setupContactForm() {
    const form = document.querySelector('#contact-form');
    const status = document.querySelector('#form-status');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const requiredFields = ['name', 'email', 'subject', 'message'];
      const email = String(data.get('email')).trim();
      const hasEmptyField = requiredFields.some(
        (field) => !String(data.get(field)).trim(),
      );

      if (hasEmptyField || !/^\S+@\S+\.\S+$/.test(email)) {
        status.textContent =
          'Please complete every field with a valid email address.';
        status.className = 'form-status show error';
        return;
      }

      const subject = encodeURIComponent(
        `[Portfolio] ${data.get('subject').trim()}`,
      );
      const body = encodeURIComponent(
        `Name: ${data.get('name').trim()}\nEmail: ${email}\n\n${data
          .get('message')
          .trim()}`,
      );

      status.textContent = 'Opening your email app...';
      status.className = 'form-status show success';
      window.location.href =
        `mailto:qaidar.qabil@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  function setupCursorGlow() {
    const supportsFinePointer = window.matchMedia('(pointer:fine)').matches;

    if (!supportsFinePointer || prefersReducedMotion) {
      return;
    }

    const glow = document.querySelector('.cursor-glow');

    window.addEventListener(
      'pointermove',
      (event) => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
      },
      { passive: true },
    );
  }

  setupNavigation();
  setupScrollInterface();
  setupScrollReveal();
  setupActiveNavigation();
  setupRoleAnimation();
  setupProjectModal();
  setupContactForm();
  setupCursorGlow();

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
