/*
 * JS mínimo del prototipo, solo para estados de interacción:
 * 1. (v0.7) Ya no hay "Copiar link": el link privado se eliminó (D-33).
 * 2. Validación de formularios con resumen de errores y mensajes junto al campo
 *    (incluye el WhatsApp opcional de CU-16, data-whatsapp; regla provisional, ver DD-38).
 * 3. Foco al mensaje en pantallas de error/estado (simula la respuesta del servidor).
 * 4. "Volver conserva lo elegido": guarda las opciones en sessionStorage.
 * 5. Mostrar contraseña.
 * 6. Agregar/quitar rangos del horario semanal.
 * 7. (H2) Marcar asistencia con botones aria-pressed y resumen de pasados sin marcar;
 *    simulación del error al guardar (vuelve al valor previo + role=alert en la tarjeta).
 * 8. (H2) Mostrar/ocultar campos según la opción elegida (bloqueos).
 * Sin JS, todas las pantallas se pueden recorrer con links y formularios normales.
 */
(function () {
  'use strict';

  /* 2. Validación */
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var telRe = /^[0-9 +().-]+$/; /* S-6: caracteres laxos; se guardan solo los dígitos, entre 8 y 15 */
  function setError(field, msg) {
    var err = document.getElementById(field.id + '-error');
    if (!err) return;
    var desc = (field.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== err.id; });
    if (msg) {
      err.querySelector('.msg').textContent = msg;
      err.hidden = false;
      field.setAttribute('aria-invalid', 'true');
      desc.push(err.id);
    } else {
      err.hidden = true;
      field.removeAttribute('aria-invalid');
    }
    if (desc.length) field.setAttribute('aria-describedby', desc.join(' ')); else field.removeAttribute('aria-describedby');
  }
  function validateField(f) {
    var v = (f.value || '').trim();
    var label = f.getAttribute('data-label') || f.name;
    if (f.hasAttribute('data-required') && !v) return 'Ingresá ' + label + '.';
    if (v && f.type === 'email' && !emailRe.test(v)) return 'Revisá el email: tiene que tener la forma nombre@ejemplo.com.';
    if (v && f.type === 'tel' && !f.hasAttribute('data-whatsapp')) {
      var digits = v.replace(/\D/g, '').length;
      if (!telRe.test(v) || digits < 8 || digits > 15) return 'Revisá el teléfono: tiene que tener entre 8 y 15 números (podés usar espacios o guiones).';
    }
    /* DD-38 (provisional, pendiente de producto): WhatsApp internacional con código de país,
       empieza con +, solo números, espacios y guiones; entre 10 y 15 dígitos. */
    if (v && f.hasAttribute('data-whatsapp')) {
      var waDigits = v.replace(/\D/g, '').length;
      if (!/^\+[0-9][0-9 -]*$/.test(v) || waDigits < 10 || waDigits > 15) return 'Revisá el WhatsApp: escribilo con + y el código de país, por ejemplo +54 9 11 1234-5678.';
    }
    if (f.type === 'number' && f.hasAttribute('data-min')) {
      var n = Number(v);
      var max = f.hasAttribute('data-max') ? Number(f.getAttribute('data-max')) : Infinity;
      var step = f.hasAttribute('data-step') ? Number(f.getAttribute('data-step')) : 0;
      if (!v || isNaN(n) || n < Number(f.getAttribute('data-min')) || n > max || (step && n % step !== 0)) return f.getAttribute('data-min-msg');
    }
    return '';
  }
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (ev) {
      var errors = [];
      form.querySelectorAll('input[id], select[id]').forEach(function (f) {
        var msg = validateField(f);
        setError(f, msg);
        if (msg) errors.push({ id: f.id, msg: msg });
      });
      var summary = document.getElementById('error-summary');
      if (!errors.length) {
        if (summary) summary.hidden = true;
        /* CU-16 / D-36: si el WhatsApp opcional queda vacío, se muestra el guardado que avisa que se verá el teléfono */
        var wa = form.querySelector('[data-whatsapp]');
        if (wa && !wa.value.trim() && form.getAttribute('data-action-empty-whatsapp')) form.action = form.getAttribute('data-action-empty-whatsapp');
        return;
      }
      ev.preventDefault();
      if (!summary) { document.getElementById(errors[0].id).focus(); return; }
      /* DD-34: error = ✕ (decorativo) + "Error:" para lector de pantalla */
      summary.querySelector('.alert-title').innerHTML = '<span aria-hidden="true">✕ </span><span class="visually-hidden">Error: </span>' +
        (errors.length === 1 ? 'Revisá 1 dato para continuar' : 'Revisá ' + errors.length + ' datos para continuar');
      var ul = summary.querySelector('ul');
      ul.innerHTML = '';
      errors.forEach(function (e) {
        var li = document.createElement('li'); var a = document.createElement('a');
        a.href = '#' + e.id; a.textContent = e.msg;
        a.addEventListener('click', function (x) { x.preventDefault(); document.getElementById(e.id).focus(); });
        li.appendChild(a); ul.appendChild(li);
      });
      summary.hidden = false;
      if (document.title.indexOf('Error: ') !== 0) document.title = 'Error: ' + document.title;
      summary.focus();
    });
  });
  /* Links del resumen de errores en páginas estáticas */
  document.querySelectorAll('#error-summary a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (x) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) { x.preventDefault(); t.focus(); }
    });
  });

  /* 3. Foco al mensaje */
  var auto = document.querySelector('[data-autofocus]');
  if (auto) auto.focus();

  /* 4. Conservar lo elegido */
  document.querySelectorAll('form[data-persist]').forEach(function (form) {
    var key = 'turnos-mvp:' + form.getAttribute('data-persist');
    var saved = {};
    try { saved = JSON.parse(sessionStorage.getItem(key) || '{}'); } catch (e) { saved = {}; }
    form.querySelectorAll('input[name]').forEach(function (f) {
      if (!(f.name in saved)) return;
      if (f.type === 'radio') f.checked = (f.value === saved[f.name]);
      else if (f.type !== 'password') f.value = saved[f.name];
    });
    form.addEventListener('change', function () {
      var data = {};
      form.querySelectorAll('input[name]').forEach(function (f) {
        if (f.type === 'radio') { if (f.checked) data[f.name] = f.value; }
        else if (f.type !== 'password') data[f.name] = f.value;
      });
      try { sessionStorage.setItem(key, JSON.stringify(data)); } catch (e) { /* sin almacenamiento: el prototipo sigue funcionando */ }
    });
  });

  /* 4b. Mostrar en el resumen los datos tipeados en el paso anterior (data-fill="clave:campo") */
  document.querySelectorAll('[data-fill]').forEach(function (el) {
    var parts = el.getAttribute('data-fill').split(':');
    try {
      var v = (JSON.parse(sessionStorage.getItem('turnos-mvp:' + parts[0]) || '{}')[parts[1]] || '').trim();
      if (v) el.textContent = v;
      else if (el.hasAttribute('data-empty') && sessionStorage.getItem('turnos-mvp:' + parts[0])) el.textContent = el.getAttribute('data-empty');
    } catch (e) { /* deja el dato de ejemplo */ }
  });

  /* 5. Mostrar contraseña */
  document.querySelectorAll('[data-toggle-password]').forEach(function (cb) {
    var input = document.getElementById(cb.getAttribute('data-toggle-password'));
    cb.addEventListener('change', function () { input.type = cb.checked ? 'text' : 'password'; });
  });

  /* 6. Rangos del horario semanal */
  function renumber(list) {
    var day = list.getAttribute('data-day');
    list.querySelectorAll('.range').forEach(function (r, i) {
      r.querySelectorAll('[data-part]').forEach(function (el) {
        var part = el.getAttribute('data-part');
        if (el.tagName === 'LABEL') el.setAttribute('for', day + '-' + (i + 1) + '-' + el.getAttribute('data-for'));
        else if (el.tagName === 'INPUT') el.id = day + '-' + (i + 1) + '-' + part;
      });
      r.querySelectorAll('.rn').forEach(function (sp) { sp.textContent = ' (rango ' + (i + 1) + ')'; });
      var rm = r.querySelector('.remove');
      if (rm) rm.setAttribute('aria-label', 'Quitar rango ' + (i + 1) + ' del ' + list.getAttribute('data-day-label'));
    });
    var none = list.parentElement.querySelector('.no-ranges');
    if (none) none.hidden = list.querySelectorAll('.range').length > 0;
  }
  document.addEventListener('click', function (ev) {
    var add = ev.target.closest('[data-add-range]');
    var rm = ev.target.closest('.range .remove');
    if (add) {
      var list = document.getElementById(add.getAttribute('data-add-range'));
      var tpl = document.getElementById('range-template');
      list.appendChild(tpl.content.cloneNode(true));
      renumber(list);
      var inputs = list.querySelectorAll('input');
      inputs[inputs.length - 2].focus();
      var st = document.getElementById('ranges-status');
      if (st) st.textContent = 'Rango agregado al ' + list.getAttribute('data-day-label') + '.';
    }
    if (rm) {
      var l = rm.closest('.ranges');
      rm.closest('.range').remove();
      renumber(l);
      var btn = l.parentElement.querySelector('[data-add-range]');
      if (btn) btn.focus();
      var st2 = document.getElementById('ranges-status');
      if (st2) st2.textContent = 'Rango quitado del ' + l.getAttribute('data-day-label') + '.';
    }
  });

  /* 7. Asistencia (CU-14): queda la última marca; se anuncia en role=status.
   *    Error al guardar (admin-agenda-asistencia-error): los fieldsets con data-att-fail fallan una vez:
   *    la marca se muestra, vuelve al valor previo (botones, aria-pressed y badge), aparece un role=alert
   *    dentro de la tarjeta con "Probá de nuevo" y el foco se queda en el botón tocado. */
  var BADGES = {
    asistio: '<span class="badge badge-success" data-att-badge><span aria-hidden="true">✓</span> Asistió</span>',
    noasistio: '<span class="badge badge-neutral" data-att-badge><span aria-hidden="true">✕</span> No asistió</span>'
  };
  var LABELS = { asistio: '“Asistió”', noasistio: '“No asistió”' };
  function sentence(name) { return /\.$/.test(name) ? name : name + '.'; } /* evita "Paula V.." */
  function snapshot(fs, li) {
    var badge = li.querySelector('[data-att-badge]');
    return {
      pressed: Array.prototype.map.call(fs.querySelectorAll('[data-mark]'), function (b) { return b.getAttribute('aria-pressed'); }),
      badge: badge ? badge.outerHTML : '', cls: li.className
    };
  }
  function restore(fs, li, snap) {
    fs.querySelectorAll('[data-mark]').forEach(function (b, i) { b.setAttribute('aria-pressed', snap.pressed[i]); });
    var badge = li.querySelector('[data-att-badge]');
    if (badge && snap.badge) badge.outerHTML = snap.badge;
    li.className = snap.cls;
  }
  function paint(fs, li, mark) {
    fs.querySelectorAll('[data-mark]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mark') === mark ? 'true' : 'false'); });
    var badge = li.querySelector('[data-att-badge]');
    if (badge) badge.outerHTML = BADGES[mark];
    li.classList.remove('is-unmarked'); li.classList.add('is-past');
  }
  function clearError(fs) {
    var err = fs.querySelector('[data-att-error]');
    if (err) err.remove();
    fs.querySelectorAll('[data-mark]').forEach(function (b) { b.removeAttribute('aria-describedby'); });
  }
  function saved(fs, li, mark) {
    var st = document.getElementById('agenda-status');
    if (st) st.textContent = 'Marcaste ' + LABELS[mark] + ' para ' + sentence(fs.getAttribute('data-attendance'));
    var link = document.querySelector('[data-unmarked-summary] a[href="#' + li.id + '"]');
    if (link) {
      var item = link.parentElement, list = item.parentElement; item.remove();
      var left = list.querySelectorAll('li').length;
      var box = document.querySelector('[data-unmarked-summary]');
      if (!left) { box.hidden = true; if (st) st.textContent += ' No quedan turnos pasados sin marcar.'; }
      else { box.querySelector('[data-unmarked-count]').textContent = left; box.querySelector('.alert-title').lastChild.textContent = left === 1 ? ' turno pasado sin marcar asistencia' : ' turnos pasados sin marcar asistencia'; }
    }
  }
  function showError(fs, li, mark, btn) {
    clearError(fs);
    var id = 'att-error-' + li.id;
    var prev = li.querySelector('[data-att-badge]');
    var prevText = prev ? prev.textContent.replace(/^[^A-Za-zÁÉÍÓÚáéíóúÑñ]+/, '').trim() : '';
    var box = document.createElement('div');
    box.className = 'alert alert-danger att-error'; box.id = id;
    box.setAttribute('role', 'alert'); box.setAttribute('data-att-error', '');
    fs.appendChild(box); /* el contenido se agrega después de insertar el contenedor para que se anuncie */
    box.innerHTML = '<p class="alert-title"><span aria-hidden="true">✕ </span><span class="visually-hidden">Error: </span>No pudimos guardar la asistencia</p>' +
      '<p>' + LABELS[mark] + ' no se guardó: ' + fs.getAttribute('data-attendance') + ' sigue como estaba' + (prevText ? ' (' + prevText + ')' : '') + '. Revisá tu conexión.</p>' +
      '<button class="btn btn-secondary btn-sm" type="button" data-att-retry="' + mark + '">Probá de nuevo<span class="visually-hidden"> a marcar ' + LABELS[mark] + ' para ' + fs.getAttribute('data-attendance') + '</span></button>';
    fs.querySelectorAll('[data-mark]').forEach(function (b) { b.setAttribute('aria-describedby', id); });
    btn.focus();
  }
  document.querySelectorAll('[data-attendance]').forEach(function (fs) {
    var li = fs.closest('.appt');
    /* Estado de error ya renderizado (llegada a la página): los botones lo describen */
    var pre = fs.querySelector('[data-att-error]');
    if (pre) fs.querySelectorAll('[data-mark]').forEach(function (b) { b.setAttribute('aria-describedby', pre.id); });
    fs.addEventListener('click', function (ev) {
      var retry = ev.target.closest('[data-att-retry]');
      var btn = ev.target.closest('[data-mark]');
      if (retry) {
        var m = retry.getAttribute('data-att-retry');
        fs.removeAttribute('data-att-fail');
        clearError(fs); paint(fs, li, m); saved(fs, li, m);
        fs.querySelector('[data-mark="' + m + '"]').focus();
        return;
      }
      if (!btn) return;
      var mark = btn.getAttribute('data-mark');
      if (fs.hasAttribute('data-att-fail') && !fs.querySelector('[data-att-error]')) {
        var snap = snapshot(fs, li);
        paint(fs, li, mark); /* se ve la marca mientras "guarda"… */
        setTimeout(function () { restore(fs, li, snap); showError(fs, li, mark, btn); }, 400); /* …y falla */
        return;
      }
      fs.removeAttribute('data-att-fail');
      clearError(fs); paint(fs, li, mark); saved(fs, li, mark);
    });
  });
  /* Links del resumen "sin marcar": llevan el foco a la tarjeta */
  document.querySelectorAll('[data-unmarked-summary] a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (x) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) { x.preventDefault(); t.scrollIntoView({ block: 'center' }); t.focus(); }
    });
  });

  /* 8. Mostrar/ocultar campos (bloqueos) */
  document.querySelectorAll('[data-reveal-form]').forEach(function (form) {
    form.addEventListener('change', function (ev) {
      var r = ev.target;
      if (!r.hasAttribute('data-reveal-group')) return;
      var g = r.getAttribute('data-reveal-group');
      form.querySelectorAll('[data-reveal-group="' + g + '"]').forEach(function (o) {
        var id = o.getAttribute('data-reveal');
        if (id !== 'none') document.getElementById(id).hidden = !o.checked;
      });
      if (g === 'dias') { var t = form.querySelector('.reveal-text'); if (t) t.hidden = r.value !== 'rango'; }
    });
  });
})();
