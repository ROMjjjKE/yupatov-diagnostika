/* Юпатов: меню, выбор зоны проверки, поиск марки, форма */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* меню */
  var drw = $('#drawer'), burger = $('#burger'), close = $('#drawerClose');
  function openM() {
    if (!drw) return;
    drw.classList.add('on'); document.body.style.overflow = 'hidden';
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var f = $('a,button', drw); if (f) f.focus();
  }
  function closeM() {
    if (!drw) return;
    drw.classList.remove('on'); document.body.style.overflow = '';
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.focus(); }
  }
  if (burger) burger.addEventListener('click', openM);
  if (close) close.addEventListener('click', closeM);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drw && drw.classList.contains('on')) closeM();
    if (e.key === 'Tab' && drw && drw.classList.contains('on')) {
      var items = $$('a,button', drw), first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* аккордеон */
  $$('.faq__q').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      var a = b.nextElementSibling;
      if (a) a.classList.toggle('on', !open);
    });
  });

  /* выбор зоны проверки */
  var zones = window.YUP_ZONES || null;
  var pick = $('.pick');
  if (pick && zones) {
    var title = $('#pTitle'), text = $('#pText'), meta = $('#pMeta'), list = $('#pList'), wa = $('#pWa');
    function show(k) {
      var z = zones[k]; if (!z) return;
      $$('.pick__list button', pick).forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-zone') === k ? 'true' : 'false');
      });
      title.textContent = z.t;
      text.textContent = z.d;
      meta.innerHTML = z.meta.map(function (m) { return '<span>' + m + '</span>'; }).join('');
      list.innerHTML = z.list.map(function (i) { return '<li>' + i + '</li>'; }).join('');
      wa.href = 'https://wa.me/375333005911?text=' + encodeURIComponent('Здравствуйте! Нужна диагностика: ' + z.t + '. Подскажите, когда можно приехать?');
    }
    $$('.pick__list button', pick).forEach(function (b) {
      b.addEventListener('click', function () { show(b.getAttribute('data-zone')); });
    });
    show(Object.keys(zones)[0]);
  }

  /* поиск марки */
  var q = $('#brandQ'), bl = $('#brandList'), bn = $('#brandN'), be = $('#brandEmpty');
  if (q && bl) {
    var chips = $$('span', bl);
    q.addEventListener('input', function () {
      var v = q.value.trim().toLowerCase(), n = 0;
      chips.forEach(function (c) {
        var hit = !v || c.textContent.toLowerCase().indexOf(v) > -1;
        c.classList.toggle('hide', !hit); if (hit) n++;
      });
      bn.textContent = n + (n % 10 === 1 && n % 100 !== 11 ? ' марка' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? ' марки' : ' марок'));
      be.style.display = n ? 'none' : 'block';
    });
  }

  /* форма */
  var form = $('form.form'), msg = $('#formMsg');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get('name') || '').toString().trim();
      var phone = (d.get('phone') || '').toString().trim();
      var car = (d.get('car') || '').toString().trim();
      if (name.length < 2 || phone.length < 6) {
        msg.textContent = 'Нужны имя и телефон, иначе не перезвонить.'; return;
      }
      var lines = ['Заявка на диагностику с сайта', 'Имя: ' + name, 'Телефон: ' + phone];
      if (car) lines.push('Авто и вопрос: ' + car);
      msg.textContent = 'Открываю WhatsApp с готовым сообщением.';
      window.open('https://wa.me/375333005911?text=' + encodeURIComponent(lines.join('\n')), '_blank');
    });
  }
})();
