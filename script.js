document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.links-header');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close the menu when a nav link is tapped
    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
});

// Highlight the current page's nav link
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.links-header a').forEach((link) => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Animate stat numbers when they scroll into view
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (!statNumbers.length) return;

    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
        // No IntersectionObserver support — leave the static values as they are
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach((el) => observer.observe(el));
});

// Contact form validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const status = document.querySelector('#form-status');

    const validators = {
        name: (value) => value.trim().length > 0,
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
        message: (value) => value.trim().length > 0,
    };

    const errorMessages = {
        name: 'Please enter your name.',
        email: 'Please enter a valid email address.',
        message: 'Please enter a message.',
    };

    function validateField(field) {
        const validator = validators[field.name];
        if (!validator) return true;

        const errorEl = document.getElementById(`${field.name}-error`);
        const isValid = validator(field.value);

        field.classList.toggle('invalid', !isValid);
        if (errorEl) errorEl.textContent = isValid ? '' : errorMessages[field.name];

        return isValid;
    }

    const requiredFields = form.querySelectorAll('input[required], textarea[required]');

    requiredFields.forEach((field) => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('invalid')) validateField(field);
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let allValid = true;
        let firstInvalid = null;

        requiredFields.forEach((field) => {
            const valid = validateField(field);
            if (!valid) {
                allValid = false;
                if (!firstInvalid) firstInvalid = field;
            }
        });

        if (!allValid) {
            firstInvalid.focus();
            status.textContent = 'Please fix the highlighted fields before sending.';
            status.classList.add('error');
            status.classList.remove('success');
            return;
        }

        // No backend exists yet, so this only simulates a successful submission
        status.textContent = "Thanks — your message has been received. We'll be in touch shortly.";
        status.classList.add('success');
        status.classList.remove('error');
        form.reset();
        requiredFields.forEach((field) => field.classList.remove('invalid'));
    });
});

