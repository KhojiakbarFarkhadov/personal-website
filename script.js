/* ============================================================
   Portfolio interaktivligi — Farxodov Xojiakbar
   Sof JavaScript, hech qanday kutubxonasiz.
   ============================================================ */

/* JS yoqilganini <html> ga darhol belgilaymiz.
   Bu skript <head> da yuklangani uchun body chizilishidan oldin
   ishlaydi — shu bois reveal animatsiyasida "flash" bo'lmaydi. */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {

    /* -----------------------------------------------------
       1) Scroll bo'yicha "reveal" animatsiyasi
       [data-reveal] elementlar ekranga kirganda ko'rinadi.
    ----------------------------------------------------- */
    var revealEls = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealEls.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        /* Eski brauzerlar uchun zaxira: hammasini ko'rsatamiz */
        revealEls.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    /* -----------------------------------------------------
       2) Loyiha va maqsad kartochkalari uchun bosqichma-bosqich
          (stagger) kechikish — chiroyli ketma-ket paydo bo'lish.
    ----------------------------------------------------- */
    function staggerGroup(selector) {
        document.querySelectorAll(selector).forEach(function (card, index) {
            card.style.transitionDelay = (index % 3) * 80 + 'ms';
        });
    }
    staggerGroup('.projects-grid .project-card');
    staggerGroup('.goals-grid .goal-card');

    /* -----------------------------------------------------
       3) Navbar: scroll qilinganda soya paydo bo'ladi +
          faol bo'lim linki belgilanadi.
    ----------------------------------------------------- */
    var navbar = document.querySelector('.navbar');
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');

    function onScroll() {
        var scrollY = window.scrollY || window.pageYOffset;

        /* Navbar soyasi */
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 8);
        }

        /* Qaysi bo'lim ustidamiz — shuni aniqlaymiz */
        var current = '';
        sections.forEach(function (section) {
            if (scrollY + 130 >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            var isActive = link.getAttribute('href') === '#' + current;
            link.classList.toggle('active', isActive);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* -----------------------------------------------------
       4) Footer'dagi yilni avtomatik yangilash.
    ----------------------------------------------------- */
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

});
