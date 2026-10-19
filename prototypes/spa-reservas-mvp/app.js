/* JS mínimo del prototipo: validación con resumen de errores, totales en vivo,
   alternar "clienta nueva" (actualiza el resumen de errores), asistencia, vista previa de marca (derivación PR #6),
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
        n + (n === 1 ? ' servicio' : ' servicios seguidos') + ' · ' + min + ' min · $ ' + price.toLocaleString('es-AR') + (total.dataset.totalSuffix || '');
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
      // DP-03 en recepción: una clienta nueva no tiene pack, así que no elige profesional.
      if ($('[data-no-pack]')) {
        $$('[data-pack-only]').forEach(function (el) { el.hidden = esNueva; });
        $$('[data-no-pack]').forEach(function (el) { el.hidden = !esNueva && $$('[data-pack-only]').length > 0; });
      }
      // El resumen de errores lista solo campos visibles: al alternar, se rehace con los que siguen marcados.
      var summary = $('.error-summary');
      if (summary && !summary.hidden) {
        var ul = $('ul', summary);
        $$('li', ul).forEach(function (li) {
          var a = $('a', li), t = a && document.getElementById(a.getAttribute('href').slice(1));
          if (t && t.closest('[hidden]')) li.hidden = true;
          else if (t && t.getAttribute('aria-invalid') === 'true') li.hidden = false;
        });
        var visibles = $$('li', ul).filter(function (li) { return !li.hidden; }).length;
        summary.hidden = visibles === 0;
      }
    });
  });

  // a-pack: avisar si el precio por servicio del pack supera el precio de lista de algún servicio incluido.
  var packPrices = $$('[data-pack-price]');
  var packWarn = $('#pk-precio-aviso');
  if (packPrices.length && packWarn) {
    var checkPack = function () {
      var incl = $$('input[data-list-price]:checked');
      var problems = [];
      packPrices.forEach(function (inp) {
        var v = Number(inp.value);
        var caros = incl.filter(function (c) { return v > Number(c.dataset.listPrice); });
        if (caros.length) problems.push(inp.dataset.packPrice + ': $ ' + v.toLocaleString('es-AR') + ' es más que el precio de lista de ' +
          caros.map(function (c) { return c.dataset.name + ' ($ ' + Number(c.dataset.listPrice).toLocaleString('es-AR') + ')'; }).join(', '));
        inp.setAttribute('aria-invalid', caros.length ? 'true' : 'false');
      });
      $('ul', packWarn).innerHTML = '';
      problems.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; $('ul', packWarn).appendChild(li); });
      packWarn.hidden = problems.length === 0;
    };
    packPrices.concat($$('input[data-list-price]')).forEach(function (i) { i.addEventListener('input', checkPack); i.addEventListener('change', checkPack); });
    checkPack();
  }

  // Asistencia: «Asistió» / «No vino» con aria-pressed; el estado se anuncia en texto (aria-live).
  $$('.attendance').forEach(function (g) {
    var badge = $('[data-att-badge]', g), by = $('[data-att-by]', g);
    $$('[data-att]', g).forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        $$('[data-att]', g).forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        var v = on ? b.dataset.att : null;
        if (on) b.setAttribute('aria-pressed', 'true');
        badge.className = 'badge ' + (v === 'si' ? 'badge--success' : v === 'no' ? 'badge--danger' : 'badge--neutral');
        badge.textContent = v === 'si' ? 'Asistió' : v === 'no' ? 'No vino' : 'Sin marcar';
        by.textContent = v ? ' · marcado recién' : '';
      });
    });
  });

  // Marca: vista previa con la derivación de PR #6 (design-system/README.md §Marca del tenant;
  // misma lógica que design-system/tools/tokens.py derive_brand). Nunca bloquea el guardado: si hubo que
  // oscurecer solid o text, muestra un aviso (role=status) con el valor resultante y su contraste.
  var color = $('#color-marca');
  if (color) {
    var WHITE = '#ffffff', NEAR_BLACK = '#111111', BLACK = '#000000';
    var SURF_DEFAULT = '#fffdf9', SURF_CANVAS = '#f6f2eb'; // color.surface.default y color.surface.canvas (= subtle)
    var rgb = function (h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; }); };
    var lum = function (hex) {
      var c = rgb(hex).map(function (v) { return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    var contrast = function (a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    var trunc = function (r) { return Math.floor(r * 100) / 100; };          // nunca redondear hacia arriba
    // round() de Python 3 (mitad al par): 76.5 → 76, como tools/tokens.py. Math.round daría 77.
    var pyRound = function (x) { var r = Math.round(x); return Math.abs(x % 1) === 0.5 ? 2 * Math.round(x / 2) : r; };
    var mix = function (a, b, t) {                                           // interpolación lineal en sRGB
      var A = rgb(a), B = rgb(b);
      return '#' + [0, 1, 2].map(function (i) { return ('0' + pyRound((A[i] * (1 - t) + B[i] * t) * 255).toString(16)).slice(-2); }).join('');
    };
    var darkenUntil = function (c, ok) {                                     // pasos de 2 % hacia negro
      var k = 0, out = c;
      while (!ok(out) && k < 1) { k = pyRound((k + 0.02) * 100) / 100; out = mix(c, BLACK, k); }
      return out;
    };
    var derive = function (primary) {
      var on = contrast(WHITE, primary) >= contrast(NEAR_BLACK, primary) ? WHITE : NEAR_BLACK;
      var solid = primary;
      if (contrast(on, primary) < 4.5) { solid = darkenUntil(primary, function (c) { return contrast(c, WHITE) >= 4.5; }); on = WHITE; }
      var hover = on === WHITE ? mix(solid, BLACK, 0.15) : mix(solid, WHITE, 0.30);
      var subtle = mix(primary, SURF_DEFAULT, 0.88);
      var surfaces = [SURF_DEFAULT, SURF_CANVAS, subtle];
      var text = darkenUntil(primary, function (c) { return surfaces.every(function (s) { return contrast(c, s) >= 4.5; }); });
      return { primary: primary, solid: solid, on: on, hover: hover, subtle: subtle, text: text,
        textHover: mix(text, BLACK, 0.15), border: text, surfaces: surfaces };
    };
    var fmt = function (n) { return trunc(n).toFixed(2).replace('.', ','); };
    var check = function () {
      var c = color.value.toLowerCase();
      var t = derive(c);
      var prev = $('#preview');
      [['primary', t.primary], ['solid', t.solid], ['on-primary', t.on], ['primary-hover', t.hover], ['text', t.text],
        ['text-hover', t.textHover], ['subtle', t.subtle], ['border', t.border]].forEach(function (x) {
        prev.style.setProperty('--brand-' + x[0], x[1]);
      });
      var out = $('#contraste');
      var rText = t.surfaces.map(function (s) { return fmt(contrast(t.text, s)); });
      var datos = 'Botones: texto ' + (t.on === WHITE ? 'blanco' : 'casi negro') + ' sobre ' + t.solid + ' = ' + fmt(contrast(t.on, t.solid)) +
        ':1. Links y textos de marca (' + t.text + '): ' + rText[0] + ':1 sobre blanco, ' + rText[1] + ':1 sobre el fondo de página y ' +
        rText[2] + ':1 sobre el tinte de tu color (mínimo 4,5:1 en todos).';
      var adjusted = [];
      if (t.solid !== c) adjusted.push('los botones usan ' + t.solid);
      if (t.text !== c) adjusted.push('los links y textos de marca usan ' + t.text);
      if (!adjusted.length) {
        out.className = 'alert alert--success';
        out.innerHTML = '<p class="alert__title"><span aria-hidden="true">✓ </span>Se lee bien tal cual</p><p>' + datos + '</p>';
      } else {
        out.className = 'alert alert--warning';
        out.innerHTML = '<p class="alert__title"><span aria-hidden="true">⚠ </span>Ajustamos tu color para que se lea bien</p><p>' +
          'Tu color (' + c + ') queda en la franja, el logo y los fondos suaves; ' + adjusted.join(' y ') + ', un tono más oscuro. ' +
          datos + ' Podés guardar igual; si preferís elegirlo vos, probá un tono más oscuro.</p>';
      }
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
