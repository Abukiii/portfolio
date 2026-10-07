(function () {
  'use strict';

  var root = document.documentElement;

  // ---------- Projects ----------
  var grid = document.getElementById('project-grid');
  var TYPE_LABELS = { code: 'Code', design: 'Design', writing: 'Writing' };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  (window.PROJECTS || []).forEach(function (p) {
    var li = el('li', 'card reveal');
    li.dataset.type = p.type;

    var media = el('div', 'card-media');
    if (p.image) {
      var img = el('img');
      img.src = p.image;
      img.alt = p.title;
      img.loading = 'lazy';
      media.appendChild(img);
    } else {
      media.appendChild(el('span', 'card-initial', p.title.charAt(0)));
    }
    li.appendChild(media);

    var body = el('div', 'card-body');
    body.appendChild(el('span', 'card-type', TYPE_LABELS[p.type] || p.type));
    body.appendChild(el('h3', null, p.title));
    body.appendChild(el('p', null, p.description));

    if (p.tags && p.tags.length) {
      var tags = el('ul', 'card-tags');
      p.tags.forEach(function (t) { tags.appendChild(el('li', null, t)); });
      body.appendChild(tags);
    }

    if (p.links && p.links.length) {
      var links = el('div', 'card-links');
      p.links.forEach(function (l) {
        var a = el('a', null, l.label + ' →');
        a.href = l.url;
        if (/^https?:/.test(l.url)) { a.target = '_blank'; a.rel = 'noopener'; }
        links.appendChild(a);
      });
      body.appendChild(links);
    }

    li.appendChild(body);
    grid.appendChild(li);
  });

  // ---------- Filters ----------
  var filters = document.querySelectorAll('.filter');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active);
      });
      grid.querySelectorAll('.card').forEach(function (card) {
        card.hidden = !(f === 'all' || card.dataset.type === f);
      });
    });
  });

  // ---------- Theme toggle ----------
  document.querySelector('.theme-toggle').addEventListener('click', function () {
    var current = root.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // ---------- Mobile menu ----------
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('nav-links');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // ---------- Active nav link ----------
  var sectionLinks = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    sectionLinks[a.getAttribute('href').slice(1)] = a;
  });
  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Object.keys(sectionLinks).forEach(function (id) {
            sectionLinks[id].classList.toggle('is-current', id === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(sectionLinks).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) navObserver.observe(s);
    });
  }

  // ---------- Scroll reveal ----------
  var reveals = document.querySelectorAll('.reveal');
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (r) { r.classList.add('is-visible'); });
  } else {
    root.classList.add('js-reveal');
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (r) { revealObserver.observe(r); });
  }

  // ---------- Footer year ----------
  document.getElementById('year').textContent = new Date().getFullYear();
})();
