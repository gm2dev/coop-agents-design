/* JS mínimo del prototipo: validación con resumen de errores, totales en vivo,
   alternar "clienta nueva" y vista previa de marca con chequeo de contraste. */
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

  // Recepción: mostrar datos de clienta nueva.
  $$('input[name="clienta"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var nueva = $('#datos-nueva');
      if (nueva) nueva.hidden = !$('#clienta-nueva').checked;
    });
  });

  // Marca: vista previa y contraste del color contra blanco.
  var color = $('#color-marca');
  if (color) {
    var lum = function (hex) {
      var c = [1, 3, 5].map(function (i) { return parseInt(hex.substr(i, 2), 16) / 255; })
        .map(function (v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    var check = function () {
      var ratio = (1.05) / (lum(color.value) + 0.05);
      var r = ratio.toFixed(2).replace('.', ',');
      var prev = $('#preview');
      var out = $('#contraste');
      if (ratio >= 4.5) {
        prev.style.setProperty('--color-action-primary', color.value);
        prev.style.setProperty('--color-text-link', color.value);
        out.className = 'alert alert--success';
        out.innerHTML = '<p class="alert__title"><span aria-hidden="true">✓ </span>Se lee bien</p><p>Contraste con texto blanco: ' + r + ':1 (mínimo 4,5:1). Lo vamos a usar en botones y links.</p>';
      } else {
        prev.style.removeProperty('--color-action-primary');
        prev.style.removeProperty('--color-text-link');
        out.className = 'alert alert--warning';
        out.innerHTML = '<p class="alert__title"><span aria-hidden="true">⚠ </span>Este color no se lee bien en botones</p><p>Contraste con texto blanco: ' + r + ':1 (mínimo 4,5:1). Lo vamos a usar solo en la franja superior; botones y links quedan con el color base. Probá un tono más oscuro.</p>';
      }
      $('#franja').style.borderTopColor = color.value;
    };
    color.addEventListener('input', check);
    check();
  }
})();
