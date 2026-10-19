/* JS mínimo del prototipo: validación con resumen de errores, totales en vivo,
   alternar "clienta nueva", vista previa de marca con chequeo de contraste,
   cuenta regresiva de reenvío y confirmación en el lugar. Sin JS todo sigue navegable. */
(function () {
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  // Validación genérica: [data-required] en inputs o fieldsets; data-msg y data-error-id.
  $$('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var errors = [];
      $$('[data-required]', form).forEach(function (el) {
        if (el.closest('[hidden]')) return;
        var target = el, ok;
        if (el.tagName === 'FIELDSET') {
          ok = !!$('input:checked', el);
          target = $('input', el);
        } else if (el.dataset.digits) {
          var n = el.value.replace(/\D/g, '').length;
          ok = n >= Number(el.dataset.digits.split(',')[0]) && n <= Number(el.dataset.digits.split(',')[1]);
        } else {
          ok = el.value.trim() !== '';
        }
        var err = document.getElementById(el.dataset.errorId);
        if (!ok) {
          errors.push({ id: target.id, msg: el.dataset.msg });
          if (err) err.hidden = false;
          if (el.tagName !== 'FIELDSET') el.setAttribute('aria-invalid', 'true');
        } else {
          if (err) err.hidden = true;
          el.removeAttribute('aria-invalid');
        }
      });
      var summary = $('.error-summary', form.parentNode) || $('.error-summary');
      if (errors.length) {
        e.preventDefault();
        if (summary) {
          var ul = $('ul', summary);
          ul.innerHTML = '';
          errors.forEach(function (x) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + x.id;
            a.textContent = x.msg;
            li.appendChild(a);
            ul.appendChild(li);
          });
          summary.hidden = false;
          summary.focus();
        } else if (errors[0].id) {
          document.getElementById(errors[0].id).focus();
        }
      } else if (summary) {
        summary.hidden = true;
      }
    });
  });

  // Total en vivo de servicios elegidos (data-min, data-price en cada checkbox).
  var total = $('[data-total]');
  if (total) {
    var update = function () {
      var min = 0, price = 0, n = 0;
      $$('input[data-min]:checked').forEach(function (i) { n++; min += Number(i.dataset.min); price += Number(i.dataset.price); });
      total.textContent = n === 0 ? 'Todavía no elegiste servicios.' :
        n + (n === 1 ? ' servicio' : ' servicios seguidos') + ' · ' + min + ' min · $ ' + price.toLocaleString('es-AR');
    };
    $$('input[data-min]').forEach(function (i) { i.addEventListener('change', update); });
    update();
  }

  // WCAG 2.4.11: si la barra fija tapa el elemento enfocado, desplazar lo justo para mostrarlo.
  // (Complementa scroll-padding-bottom de styles.css, que Chromium no aplica a todo foco.)
  var bar = $('.summary-bar');
  if (bar) {
    document.addEventListener('focusin', function (e) {
      if (bar.contains(e.target) || getComputedStyle(bar).position !== 'sticky') return;
      var el = e.target.matches('.choice input') ? e.target.nextElementSibling : e.target;
      var r = el.getBoundingClientRect(), top = bar.getBoundingClientRect().top;
      var gap = 8; // space.200
      if (r.bottom + gap > top) window.scrollBy(0, r.bottom + gap - top);
    });
  }

  // Recepción: mostrar datos de clienta nueva.
  $$('input[name="clienta"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var esNueva = $('#clienta-nueva').checked;
      var nueva = $('#datos-nueva');
      var existente = $('#datos-existente');
      if (nueva) nueva.hidden = !esNueva;
      if (existente) existente.hidden = esNueva;
    });
  });

  // Marca: vista previa y regla de contraste (DD-05 / PDS-01).
  // El color del spa se usa en botones y links solo si da >= 4,5:1 contra blanco (text.on-action)
  // Y contra surface.subtle (#f5f6f8, el fondo más oscuro donde aparecen links). Si no, botones,
  // links y borde seleccionado quedan con los valores del sistema y el color va solo a la franja.
  var color = $('#color-marca');
  if (color) {
    // Valores de design-system/tokens.json (no se modifican): action.primary, action.primary-hover,
    // text.link, border.selected, surface.default, surface.subtle.
    var SYS = { primary: '#0e6b63', hover: '#0a524c', link: '#0e6b63', selected: '#0e6b63' };
    var WHITE = '#ffffff', SUBTLE = '#f5f6f8', MIN = 4.5;
    var lum = function (hex) {
      var c = [1, 3, 5].map(function (i) { return parseInt(hex.substr(i, 2), 16) / 255; })
        .map(function (v) { return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    var contrast = function (a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    // Hover (PDS-01): mezcla en sRGB con 20 % de negro: canal * 0,8, redondeado. #8a2b6a -> #6e2255.
    var hoverOf = function (hex) {
      return '#' + [1, 3, 5].map(function (i) {
        var n = Math.round(parseInt(hex.substr(i, 2), 16) * 0.8); return ('0' + n.toString(16)).slice(-2);
      }).join('');
    };
    var fmt = function (n) { return n.toFixed(2).replace('.', ','); };
    var check = function () {
      var c = color.value.toLowerCase();
      var rW = contrast(c, WHITE), rS = contrast(c, SUBTLE);
      var prev = $('#preview');
      var out = $('#contraste');
      var datos = 'Contraste con texto blanco: ' + fmt(rW) + ':1 · como link sobre fondo gris claro: ' + fmt(rS) + ':1 (mínimo 4,5:1 en los dos).';
      var ok = rW >= MIN && rS >= MIN;
      prev.style.setProperty('--color-action-primary', ok ? c : SYS.primary);
      prev.style.setProperty('--color-action-primary-hover', ok ? hoverOf(c) : SYS.hover);
      prev.style.setProperty('--color-text-link', ok ? c : SYS.link);
      prev.style.setProperty('--color-border-selected', ok ? c : SYS.selected);
      if (ok) {
        out.className = 'alert alert--success';
        out.innerHTML = '<p class="alert__title"><span aria-hidden="true">✓ </span>Se lee bien</p><p>' + datos + ' Lo vamos a usar en botones, links y la franja superior.</p>';
      } else {
        out.className = 'alert alert--warning';
        out.innerHTML = '<p class="alert__title"><span aria-hidden="true">⚠ </span>Este color no se lee bien en botones y links</p><p>' + datos + ' Lo vamos a usar solo en la franja superior; botones y links quedan con el color base de la plataforma. Probá un tono más oscuro.</p>';
      }
      $('#franja').style.borderTopColor = c;
    };
    color.addEventListener('input', check);
    $$('[data-try-color]').forEach(function (b) { b.addEventListener('click', function () { color.value = b.dataset.tryColor; check(); }); });
    check();
  }

  // Reenviar código: deshabilitado hasta que termina la cuenta regresiva (data-countdown, en s).
  $$('[data-countdown]').forEach(function (btn) {
    var left = Number(btn.dataset.countdown);
    var label = $('#' + btn.dataset.countdownLabel);
    var tick = function () {
      if (left <= 0) {
        btn.disabled = false;
        if (label) label.textContent = 'Ya podés pedir otro código.';
        return;
      }
      if (label) label.textContent = 'Podés pedir otro en ' + left + ' s.';
      left -= 1;
      setTimeout(tick, 1000);
    };
    btn.disabled = true;
    tick();
    btn.addEventListener('click', function () {
      var st = $('#reenvio-status');
      if (st) st.textContent = 'Te mandamos un código nuevo por WhatsApp.';
      left = Number(btn.dataset.countdown); btn.disabled = true; tick();
    });
  });

  // Confirmación en el lugar (data-confirm-target): muestra el panel de confirmación y enfoca su título.
  $$('[data-confirm-target]').forEach(function (btn) {
    var panel = document.getElementById(btn.dataset.confirmTarget);
    if (!panel) return;
    btn.addEventListener('click', function () {
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      var h = $('[tabindex="-1"]', panel); if (h) h.focus();
    });
    $$('[data-confirm-dismiss]', panel).forEach(function (n) {
      n.addEventListener('click', function () { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); });
    });
  });
})();
