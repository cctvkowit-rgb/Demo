(function () {
  var root = document.getElementById('tdss-premium');
  if (root) {

    /* ---------- สไลเดอร์ด้านบน ---------- */
    var slides = root.querySelectorAll('.td-top-slide');
    var cur = 0;

    function loadRest() {
      for (var i = 1; i < slides.length; i++) {
        var s = slides[i];
        if (s.dataset.src) {
          s.src = s.dataset.src;
          s.removeAttribute('data-src');
        }
      }
    }
    function show(n) {
      slides[cur].classList.remove('active');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('active');
    }
    function startSlider() {
      if (slides.length < 2 || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
      loadRest();
      setInterval(function () { show(cur + 1); }, 5000);
    }
    if (document.readyState === 'complete') { setTimeout(startSlider, 1500); }
    else { window.addEventListener('load', function () { setTimeout(startSlider, 1500); }); }

    /* ---------- เมนูมือถือ ---------- */
    var toggle = document.getElementById('td-nav-toggle');
    var links = document.getElementById('td-nav-links');
    function setMenu(open) {
      if (!toggle || !links) return;
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
    }
    if (toggle && links) {
      toggle.addEventListener('click', function () { setMenu(!links.classList.contains('is-open')); });
      links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    }

    /* ---------- ไฮไลต์เมนูตามหัวข้อที่กำลังดู ---------- */
    if ('IntersectionObserver' in window && links) {
      var anchors = links.querySelectorAll('a[href^="#"]');
      var map = {};
      for (var i = 0; i < anchors.length; i++) { map[anchors[i].getAttribute('href').slice(1)] = anchors[i]; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && map[en.target.id]) {
            for (var k in map) { map[k].classList.remove('is-active'); }
            map[en.target.id].classList.add('is-active');
          }
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      for (var id in map) { var sec = document.getElementById(id); if (sec) io.observe(sec); }
    }

    /* ---------- โลโก้ลูกค้า: สร้างสำเนาชุดที่ 2 ให้เลื่อนวนต่อเนื่อง ---------- */
    var track = root.querySelector('.td-marquee-track');
    if (track) {
      [].slice.call(track.children).forEach(function (el) {
        var c = el.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        var im = c.querySelector('img');
        if (im) im.alt = '';
        track.appendChild(c);
      });
    }

    /* ---------- แผนที่ (กดเพื่อโหลด) ---------- */
    var mapBtn = document.getElementById('td-map-btn');
    var mapBox = document.getElementById('td-map');
    if (mapBtn && mapBox) {
      mapBtn.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = mapBtn.getAttribute('data-src');
        f.title = 'แผนที่ TDSS';
        f.loading = 'lazy';
        f.referrerPolicy = 'no-referrer-when-downgrade';
        f.setAttribute('allowfullscreen', '');
        mapBox.insertBefore(f, mapBtn);
        mapBtn.style.display = 'none';
      });
    }

    /* ---------- ฟอร์มติดต่อ: เปิดแอปอีเมลพร้อมข้อความที่กรอก ---------- */
    var form = document.getElementById('td-inquiry-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        function v(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
        var body = 'ชื่อ-นามสกุล: ' + v('td-name') +
          '\r\nเบอร์โทรศัพท์: ' + v('td-phone') +
          '\r\nอีเมล: ' + v('td-email') +
          '\r\n\r\nข้อความ:\r\n' + v('td-msg');
        var subject = 'สอบถามจากเว็บไซต์ TDSS - ' + v('td-name');
        window.location.href = 'mailto:cctvkowit@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      });
    }
  }

  /* ---------- ปุ่มติดต่อลอย ---------- */
  var w = document.getElementById('tdw'), b = document.getElementById('tdw-fab');
  if (w && b) {
    var setOpen = function (o) { w.classList.toggle('open', o); b.setAttribute('aria-expanded', o); };
    b.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!w.classList.contains('open')); });
    document.addEventListener('click', function (e) { if (!w.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }
})();
