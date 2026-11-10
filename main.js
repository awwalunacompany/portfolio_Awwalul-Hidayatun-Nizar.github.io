(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Icons */
  if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  window.addEventListener('load', function () {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  });

  $('#year').textContent = new Date().getFullYear();

  /* Nav: mobile toggle, scrolled state, progress bar */
  var nav = $('#nav'), toggle = $('#navToggle'), list = $('#navList'), bar = $('#progress');
  function closeMenu() {
    list.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Buka menu');
  }
  toggle.addEventListener('click', function () {
    var open = list.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  });
  $$('a', list).forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      nav.classList.toggle('is-scrolled', y > 24);
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active nav link */
  var links = $$('.nav__list a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var s = $(a.getAttribute('href'));
      if (s) spy.observe(s);
    });
  }

  /* Scroll reveal */
  var revealEls = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Counters (values are taken from the CV: roles, projects, publications, GPA) */
  function runCounter(el) {
    var target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || '0', 10);
    var fmt = function (v) { return v.toFixed(dec).replace('.', ','); };
    if (reduce) { el.textContent = fmt(target); return; }
    var start = null, dur = 1400;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* Typing animation */
  var typedEl = $('#typed');
  if (typedEl && !reduce) {
    var words = JSON.parse(typedEl.dataset.words), wi = 0, ci = words[0].length, deleting = true;
    function tick() {
      var w = words[wi];
      ci += deleting ? -1 : 1;
      typedEl.textContent = w.slice(0, ci);
      var delay = deleting ? 38 : 80;
      if (!deleting && ci === w.length) { deleting = true; delay = 1700; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    }
    // first word is shown in full, then it is deleted and the cycle begins
    setTimeout(tick, 2200);
  }

  /* About tabs */
  var tabs = $$('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var next = tabs[(tabs.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus(); selectTab(next);
    });
  });
  function selectTab(sel) {
    tabs.forEach(function (t) {
      var on = t === sel;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
  }

  /* Project showcase dialog */
  var projects = {
    pos: {
      img: 'project-pos.webp', alt: 'Ilustrasi tampilan aplikasi kasir café',
      meta: '2026 · Desktop Application',
      title: 'Café Point of Sale Application',
      overview: 'Aplikasi kasir desktop berbasis Python dengan sistem menu dinamis yang terintegrasi dengan file Excel, dirancang untuk mengotomatisasi transaksi penjualan dan meningkatkan efisiensi operasional.',
      tech: ['Python', 'Excel Integration'],
      features: ['Menu dinamis yang terintegrasi file Excel', 'Pencatatan transaksi penjualan', 'Pencatatan stok', 'Pembuatan struk', 'Laporan penjualan harian']
    },
    landing: {
      img: 'project-landing.webp', alt: 'Ilustrasi landing page Coffee Shop dan Wedding',
      meta: '2025 · Web',
      title: 'Responsive Landing Page',
      overview: 'Website responsif untuk usaha Coffee Shop dan layanan Wedding, dibangun untuk memperkuat kehadiran digital klien.',
      tech: ['HTML', 'CSS', 'JavaScript'],
      features: ['Desain mobile-first', 'Layout responsif lintas perangkat', 'Optimasi performa halaman']
    },
    attendance: {
      img: 'project-attendance.webp', alt: 'Ilustrasi tampilan aplikasi absensi siswa',
      meta: '2023 · Desktop Application',
      title: 'Student Attendance Application',
      overview: 'Aplikasi desktop berbasis Python & Tkinter yang terintegrasi dengan database digital untuk mengotomatisasi pencatatan dan pelaporan kehadiran siswa.',
      tech: ['Python', 'Tkinter', 'Database'],
      features: ['Otomatisasi pencatatan kehadiran siswa', 'Penyimpanan data pada database digital', 'Pelaporan kehadiran']
    },
    stock: {
      img: 'project-stock.webp', alt: 'Ilustrasi tampilan aplikasi stok opname',
      meta: 'Application',
      title: 'Stock Opname System',
      overview: 'Aplikasi sistem stok opname untuk mendukung pencatatan dan pengecekan stok barang.',
      tech: ['Python', 'SQL'],
      features: []
    },
    omzet: {
      img: 'project-omzet.webp', alt: 'Ilustrasi tampilan aplikasi rekap omset',
      meta: 'Application',
      title: 'Revenue Recap Application',
      overview: 'Aplikasi rekap omset untuk merangkum dan memantau data pendapatan usaha.',
      tech: ['Python', 'SQL'],
      features: []
    },
    hospital: {
      img: 'project-hospital.webp', alt: 'Ilustrasi website rumah sakit',
      meta: 'Web',
      title: 'Hospital Website',
      overview: 'Pengembangan website rumah sakit untuk menyampaikan informasi layanan kepada pasien dan masyarakat.',
      tech: ['HTML', 'CSS', 'JavaScript', 'PHP'],
      features: []
    },
    property: {
      img: 'project-property.webp', alt: 'Ilustrasi website penjualan properti',
      meta: 'Web',
      title: 'Property Sales Website',
      overview: 'Pengembangan website penjualan properti untuk menampilkan listing rumah, apartemen, dan lahan kepada calon pembeli.',
      tech: ['HTML', 'CSS', 'JavaScript', 'PHP'],
      features: []
    }
  };
  var modal = $('#projectModal'), lastFocus = null;
  function fill(ul, items) {
    ul.textContent = '';
    items.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
  }
  $$('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var p = projects[btn.dataset.open];
      if (!p || !modal) return;
      lastFocus = btn;
      $('#modalMeta').textContent = p.meta;
      $('#modalTitle').textContent = p.title;
      var mi = $('#modalImg'); mi.src = p.img; mi.alt = p.alt;
      $('#modalOverview').textContent = p.overview;
      fill($('#modalTech'), p.tech);
      fill($('#modalFeatures'), p.features);
      $('#modalTechWrap').hidden = !p.tech.length;
      $('#modalFeaturesWrap').hidden = !p.features.length;
      if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    });
  });
  function closeModal() {
    if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open');
    if (lastFocus) lastFocus.focus();
  }
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  /* Contact form: validation, then opens the visitor's mail client (no backend, no keys exposed) */
  var form = $('#contactForm'), status = $('#formStatus');
  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Masukkan nama Anda (minimal 2 karakter).'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Masukkan alamat email yang valid.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Pesan minimal 10 karakter.'; }
  };
  function validate(field) {
    var input = form.elements[field], msg = rules[field](input.value);
    $('#err-' + field).textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  Object.keys(rules).forEach(function (f) {
    form.elements[f].addEventListener('blur', function () { validate(f); });
    form.elements[f].addEventListener('input', function () {
      if (form.elements[f].getAttribute('aria-invalid') === 'true') validate(f);
    });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(rules).map(validate).every(Boolean);
    if (!ok) {
      status.textContent = 'Periksa kembali isian yang ditandai.';
      var bad = $('[aria-invalid="true"]', form); if (bad) bad.focus();
      return;
    }
    var subject = 'Pesan dari portofolio: ' + form.elements.name.value.trim();
    var body = form.elements.message.value.trim() + '\n\n— ' + form.elements.name.value.trim() + ' (' + form.elements.email.value.trim() + ')';
    window.location.href = 'mailto:awwalulhidayatunn@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Membuka aplikasi email Anda. Jika tidak terbuka, kirim langsung ke awwalulhidayatunn@gmail.com.';
  });

  /* Subtle network-node background */
  var canvas = $('#bg-canvas');
  if (canvas && !reduce) {
    var ctx = canvas.getContext('2d'), nodes = [], W = 0, H = 0, raf = null, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var count = window.innerWidth < 700 ? 22 : 48;
    function size() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function init() {
      nodes = [];
      for (var i = 0; i < count; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22 });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        ctx.fillStyle = 'rgba(56,189,248,.55)';
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.4, 0, 6.283); ctx.fill();
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < 14400) {
            ctx.strokeStyle = 'rgba(56,189,248,' + (0.16 * (1 - d / 14400)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    size(); init(); draw();
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); init(); }, 200); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf); } else { draw(); }
    });
  }
})();
