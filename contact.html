/* ============================================================
   NEW SHREE SAINATH DRIVING SCHOOL — script.js
   Pure vanilla JS — works on GitHub Pages, local, anywhere
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    headerScroll();
    hamburgerMenu();
    setActiveNav();
    counterAnimation();
    testimonialSlider();
    scrollReveal();
    faqAccordion();
    contactForm();
  }

  /* ----------------------------------------------------------
     1. HEADER — add shadow on scroll
  ---------------------------------------------------------- */
  function headerScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     2. HAMBURGER MENU
  ---------------------------------------------------------- */
  function hamburgerMenu() {
    var btn = document.getElementById('hamburgerBtn');
    var nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('nav-open');
      btn.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when a nav link is clicked
    var links = nav.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      var header = document.getElementById('siteHeader');
      if (header && !header.contains(e.target)) {
        nav.classList.remove('nav-open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------
     3. ACTIVE NAV LINK
  ---------------------------------------------------------- */
  function setActiveNav() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href === page || (page === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
     4. COUNTER ANIMATION
  ---------------------------------------------------------- */
  function counterAnimation() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.done) {
          entry.target.dataset.done = '1';
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1800;
    var steps = 50;
    var step = 0;
    var timer = setInterval(function () {
      step++;
      var val = Math.round((step / steps) * target);
      el.textContent = val.toLocaleString();
      if (step >= steps) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      }
    }, duration / steps);
  }

  /* ----------------------------------------------------------
     5. TESTIMONIAL SLIDER
  ---------------------------------------------------------- */
  function testimonialSlider() {
    var slides   = document.querySelectorAll('.testimonial-slide');
    var dotsWrap = document.getElementById('sliderDots');
    var prevBtn  = document.getElementById('prevSlide');
    var nextBtn  = document.getElementById('nextSlide');

    if (!slides.length || !dotsWrap) return;

    var current = 0;
    var timer   = null;

    // Build dots
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        resetTimer();
      });
      dotsWrap.appendChild(dot);
    });

    function goTo(n) {
      slides[current].classList.remove('active');
      dotsWrap.querySelectorAll('.dot')[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dotsWrap.querySelectorAll('.dot')[current].classList.add('active');
    }

    function startTimer() {
      timer = setInterval(function () { goTo(current + 1); }, 5500);
    }
    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });
    }

    startTimer();
  }

  /* ----------------------------------------------------------
     6. SCROLL REVEAL
  ---------------------------------------------------------- */
  function scrollReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------
     7. FAQ ACCORDION
  ---------------------------------------------------------- */
  function faqAccordion() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        // Close all
        items.forEach(function (i) { i.classList.remove('open'); });
        // Open this one if it wasn't already open
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ----------------------------------------------------------
     8. CONTACT FORM
     Validates required fields then redirects to thank-you.html
     Works on GitHub Pages, local server, everywhere.
  ---------------------------------------------------------- */
 function contactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameEl    = document.getElementById('f-name');
    var phoneEl   = document.getElementById('f-phone');
    var emailEl   = document.getElementById('f-email');
    var serviceEl = document.getElementById('f-service');
    var timingEl  = document.getElementById('f-timing');
    var messageEl = document.getElementById('f-message');

    var name    = nameEl    ? nameEl.value.trim() : '';
    var phone   = phoneEl   ? phoneEl.value.trim() : '';
    var email   = emailEl   ? emailEl.value.trim() : '';
    var service = serviceEl ? serviceEl.value : '';
    var timing  = timingEl  ? timingEl.value : '';
    var message = messageEl ? messageEl.value.trim() : '';

    // --- VALIDATION ---
    if (!name) {
      showError(nameEl, 'Please enter your full name.');
      return;
    }

    var digits = phone.replace(/\D/g, '');
    if (!phone || digits.length < 10) {
      showError(phoneEl, 'Please enter a valid 10-digit phone number.');
      return;
    }

    if (!service) {
      showError(serviceEl, 'Please select a service.');
      return;
    }

    // --- EMAILJS SEND ---
    emailjs.send("service_2v17tuw", "template_vy5fe0d", {
      name: name,
      phone: phone,
      email: email,
      service: service,
      timing: timing,
      message: message
    })
    .then(function () {
      window.location.href = 'thank-you.html';
    })
    .catch(function (error) {
      alert('Something went wrong. Please call us directly.');
      console.log(error);
    });
  });

  var inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(function (el) {
    el.addEventListener('input', function () { clearError(el); });
    el.addEventListener('change', function () { clearError(el); });
  });
}

  function showError(el, msg) {
    if (!el) return;
    clearError(el);
    el.style.borderColor = '#E31E24';
    el.style.boxShadow = '0 0 0 3px rgba(227,30,36,0.15)';
    var err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'display:block;font-size:0.75rem;color:#E31E24;margin-top:4px;font-family:Outfit,sans-serif;';
    err.textContent = msg;
    el.parentNode.appendChild(err);
    el.focus();
  }

  function clearError(el) {
    el.style.borderColor = '';
    el.style.boxShadow = '';
    var prev = el.parentNode ? el.parentNode.querySelector('.field-error') : null;
    if (prev) prev.remove();
  }

})();
