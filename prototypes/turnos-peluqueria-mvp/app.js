/*
 * JS mínimo del prototipo, solo para estados de interacción:
 * 1. Copiar link con feedback anunciado (aria-live).
 * 2. Validación de formularios con resumen de errores y mensajes junto al campo.
 * 3. Foco al mensaje en pantallas de error/estado (simula la respuesta del servidor).
 * 4. "Volver conserva lo elegido": guarda las opciones en sessionStorage.
 * 5. Mostrar contraseña.
 * 6. Agregar/quitar rangos del horario semanal.
 * Sin JS, todas las pantallas se pueden recorrer con links y formularios normales.
 */
(function () {
  'use strict';

  /* 1. Copiar link */
  document.querySelectorAll('[data-copy-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('data-copy-target'));
      var status = document.getElementById(btn.getAttribute('data-copy-status'));
      var ok = function () { status.textContent = 'Link copiado. Pegalo en tus notas o en un chat con vos mismo para tenerlo a mano.'; };
      var fail = function () {
        input.focus(); input.select();
        status.textContent = 'No se pudo copiar automáticamente. El link quedó seleccionado: copialo a mano.';
      };
      status.textContent = '';
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(input.value).then(ok, fail);
      } else {
        try { input.select(); document.execCommand('copy') ? ok() : fail(); } catch (e) { fail(); }
      }
    });
  });

  /* 2. Validación */
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var telRe = /^[0-9 +()-]{8,20}$/;
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
    if (v && f.type === 'tel' && !telRe.test(v)) return 'Revisá el teléfono: usá solo números, espacios o guiones (mínimo 8 dígitos).';
    if (f.type === 'number' && f.hasAttribute('data-min')) {
      if (!v || Number(v) < Number(f.getAttribute('data-min'))) return f.getAttribute('data-min-msg');
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
      if (!errors.length) { if (summary) summary.hidden = true; return; }
      ev.preventDefault();
      if (!summary) { document.getElementById(errors[0].id).focus(); return; }
      summary.querySelector('.alert-title').textContent =
        errors.length === 1 ? 'Revisá 1 dato para continuar' : 'Revisá ' + errors.length + ' datos para continuar';
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
})();
