/* ============================================
   Khojiakbar Farkhadov — portfolio scripts
   jQuery 3.x — typewriter, road progress,
   scrollspy, filters, reveal, mobile nav.
   ============================================ */

$(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Mobile menu ----------
  var $burger = $('.nav__burger');
  var $menu = $('.nav__menu');

  function closeMenu() {
    $burger.removeClass('open').attr('aria-expanded', 'false');
    $menu.removeClass('open');
    $('body').removeClass('no-scroll');
  }

  $burger.on('click', function () {
    var open = !$menu.hasClass('open');
    $burger.toggleClass('open', open).attr('aria-expanded', String(open));
    $menu.toggleClass('open', open);
    $('body').toggleClass('no-scroll', open);
  });

  $menu.find('a').on('click', closeMenu);

  // ---------- Smooth scroll for in-page anchors ----------
  $('a[href^="#"]').on('click', function (e) {
    var hash = $(this).attr('href');
    if (hash.length < 2) return;
    var $target = $(hash);
    if (!$target.length) return;
    e.preventDefault();
    var top = $target.offset().top - 64;
    if (reduceMotion) {
      window.scrollTo(0, top);
    } else {
      $('html, body').stop(true).animate({ scrollTop: top }, 550);
    }
    if (history.pushState) history.pushState(null, '', hash);
  });

  // ---------- Typewriter ----------
  var phrases = [
    'I write docs developers actually read.',
    'I document complex financial APIs.',
    'I build .NET & PHP backends.',
    'I bridge engineering and clarity.'
  ];
  var $tw = $('#typewriter');

  if (!reduceMotion && $tw.length) {
    var pi = 0;
    var ci = phrases[0].length; // start fully typed (matches initial HTML)
    var deleting = true;

    var tick = function () {
      var phrase = phrases[pi];
      if (deleting) {
        ci--;
        $tw.text(phrase.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, 420);
        } else {
          setTimeout(tick, 26);
        }
      } else {
        phrase = phrases[pi];
        ci++;
        $tw.text(phrase.slice(0, ci));
        if (ci === phrase.length) {
          deleting = true;
          setTimeout(tick, 2400);
        } else {
          setTimeout(tick, 52);
        }
      }
    };

    setTimeout(tick, 2600);
  }

  // ---------- Reveal on scroll ----------
  var revealEls = $('.reveal').toArray();

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var d = entry.target.getAttribute('data-delay');
            if (d) entry.target.style.transitionDelay = d + 'ms';
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    $(revealEls).addClass('in');
  }

  // ---------- Scroll-driven bits (rAF-throttled) ----------
  var $win = $(window);
  var $navBar = $('.nav');
  var $progressBar = $('.progress-bar');
  var $toTop = $('.to-top');
  var $roadWrap = $('.road__wrap');
  var $roadProgress = $('.road__progress');
  var $roadItems = $('.road__item');
  var $navLinks = $('.nav__menu a');
  var $sections = $('section[id]');
  var ticking = false;

  function onScroll() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var wh = window.innerHeight;
    var dh = document.documentElement.scrollHeight;

    // top progress bar
    var pct = dh > wh ? (st / (dh - wh)) * 100 : 0;
    $progressBar.css('width', pct + '%');

    // nav shadow + back-to-top
    $navBar.toggleClass('scrolled', st > 10);
    $toTop.toggleClass('show', st > 600);

    // road fill follows the viewport center
    if ($roadWrap.length) {
      var rect = $roadWrap[0].getBoundingClientRect();
      var center = wh * 0.5;
      var p = (center - rect.top) / rect.height;
      p = Math.max(0, Math.min(1, p));
      $roadProgress.css('height', p * 100 + '%');

      $roadItems.each(function () {
        var dot = this.querySelector('.road__dot');
        if (!dot) return;
        var r = dot.getBoundingClientRect();
        $(this).toggleClass('is-passed', r.top + r.height / 2 <= center + 4);
      });
    }

    // scrollspy
    var currentId = null;
    $sections.each(function () {
      if (this.getBoundingClientRect().top <= 120) currentId = this.id;
    });
    $navLinks.each(function () {
      var $a = $(this);
      $a.toggleClass('active', $a.attr('href') === '#' + currentId);
    });

    ticking = false;
  }

  $win.on('scroll resize', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  });
  onScroll();

  // ---------- Project filters ----------
  $('.filter-btn').on('click', function () {
    var filter = $(this).data('filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    $('.project').each(function () {
      var $card = $(this);
      var show = filter === 'all' || $card.data('cat') === filter;
      if (show) {
        $card.stop(true, true).fadeIn(240);
      } else {
        $card.stop(true, true).fadeOut(180);
      }
    });
  });

  // ---------- Cursor glow ----------
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    var $glow = $('.cursor-glow');
    var gx = window.innerWidth / 2;
    var gy = -300;
    var tx = gx;
    var ty = gy;

    $(document).on('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
    });

    (function glowLoop() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      $glow.css('transform', 'translate(' + (gx - 280) + 'px,' + (gy - 280) + 'px)');
      window.requestAnimationFrame(glowLoop);
    })();
  }
});
