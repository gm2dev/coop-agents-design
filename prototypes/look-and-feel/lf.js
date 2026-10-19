/* lf.js — JS mínimo del comparador de look and feel.
   1) Cambia la dirección (data-dir) y el negocio de ejemplo (tenant).
   2) Implementa la CAPA TENANT: a partir de UN color (brand.primary) deriva
      solid, on-primary, hover, text, subtle y border con las reglas del README (§Theming)
      y las escribe como custom properties --brand-*. Nada más es sobreescribible. */
(function () {
  'use strict';
  var WHITE = '#ffffff', INK = '#111111';

  // ---------- Color: utilidades WCAG ----------
  function hexToRgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; }); }
  function lum(h) { var c = hexToRgb(h).map(function (v) { return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function contrast(a, b) { var x = lum(a), y = lum(b); if (x < y) { var t = x; x = y; y = t; } return (x + 0.05) / (y + 0.05); }
  function mix(a, b, t) { var A = hexToRgb(a), B = hexToRgb(b); return '#' + A.map(function (v, i) { var n = Math.round((v * (1 - t) + B[i] * t) * 255); return ('0' + n.toString(16)).slice(-2); }).join(''); }
  function darkenUntil(c, test) { var k = 0, out = c; while (!test(out) && k < 1) { k += 0.02; out = mix(c, '#000000', k); } return out; }

  // Reglas de derivación (documentadas en initiatives/look-and-feel/README.md §Theming)
  function derive(primary, surfDefault, surfCanvas) {
    var cW = contrast(primary, WHITE), cI = contrast(primary, INK);
    var on = cW >= cI ? WHITE : INK, solid = primary, solidAdjusted = false;
    if (Math.max(cW, cI) < 4.5) { // ni blanco ni casi negro alcanzan: oscurecer el relleno
      solid = darkenUntil(primary, function (c) { return contrast(c, WHITE) >= 4.5; });
      on = WHITE; solidAdjusted = true;
    }
    var hover = on === WHITE ? mix(solid, '#000000', 0.15) : mix(solid, '#ffffff', 0.3);
    var subtle = mix(primary, surfDefault, 0.88);
    var text = darkenUntil(primary, function (c) { return Math.min(contrast(c, surfDefault), contrast(c, surfCanvas), contrast(c, subtle)) >= 4.5; });
    return { primary: primary, solid: solid, on: on, hover: hover, text: text, subtle: subtle, border: text,
      solidAdjusted: solidAdjusted, textAdjusted: text !== primary,
      ratios: { onSolid: contrast(on, solid), onHover: contrast(on, hover), text: contrast(text, surfDefault), textSubtle: contrast(text, subtle) } };
  }

  function applyBrand(el, d) {
    el.style.setProperty('--brand-primary', d.primary);
    el.style.setProperty('--brand-solid', d.solid);
    el.style.setProperty('--brand-on', d.on);
    el.style.setProperty('--brand-hover', d.hover);
    el.style.setProperty('--brand-text', d.text);
    el.style.setProperty('--brand-subtle', d.subtle);
    el.style.setProperty('--brand-border', d.border);
  }

  // ---------- Datos ficticios ----------
  var LOGOS = {
    esmalte: function (c) { return '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="12" fill="' + c + '"/><path d="M16 30V18a4 4 0 018 0v12z" fill="#2b1d24"/><rect x="15" y="10" width="10" height="5" rx="1.5" fill="#2b1d24"/></svg>'; },
    faro: function (c) { return '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="20" fill="#121212"/><path d="M16 31l2-15h4l2 15z" fill="' + c + '"/><path d="M17 12h6l-1-3h-4z" fill="' + c + '"/><path d="M8 13l7 2M32 13l-7 2" stroke="' + c + '" stroke-width="2" stroke-linecap="round"/></svg>'; },
    patas: function (c) { return '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="20" fill="' + c + '"/><ellipse cx="20" cy="25" rx="6.5" ry="5.5" fill="#0f2a33"/><circle cx="12" cy="17" r="3" fill="#0f2a33"/><circle cx="17" cy="12" r="3" fill="#0f2a33"/><circle cx="23" cy="12" r="3" fill="#0f2a33"/><circle cx="28" cy="17" r="3" fill="#0f2a33"/></svg>'; },
    nativa: function (c) { return '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="6" fill="' + c + '"/><path d="M12 30V11l16 19V11" fill="none" stroke="#fff" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/></svg>'; }
  };
  var TENANTS = {
    esmalte: { name: 'Esmalte Studio', color: '#f7a8c8', pro: 'Carla',
      svc: [['Esmaltado semipermanente', '$ 18.000', '60 min'], ['Kapping gel', '$ 24.000', '90 min'], ['Belleza de pies', '$ 21.000', '75 min']],
      cli: ['Lucía M.', 'Sofía R.', 'Valentina G.', 'Ana P.', 'Camila T.', 'Martina L. · 6 semanas', 'Julieta S. · 5 semanas', 'Paula D. · 5 semanas'],
      offer: ['Pack 4 visitas: pagás 3', 'Ideal para venir una vez por mes hasta el otoño. Se paga en el local.'] },
    faro: { name: 'Barbería Don Faro', color: '#f5c400', pro: 'Nico',
      svc: [['Corte clásico', '$ 12.000', '40 min'], ['Corte + barba', '$ 16.500', '60 min'], ['Afeitado con toalla caliente', '$ 9.000', '30 min']],
      cli: ['Martín A.', 'Joaquín F.', 'Tomás B.', 'Diego C.', 'Franco V.', 'Lucas N. · 4 semanas', 'Bruno E. · 5 semanas', 'Iván K. · 4 semanas'],
      offer: ['Abono mensual: 2 cortes', 'Tu corte cada 15 días con precio fijo. Se paga en el local.'] },
    patas: { name: 'Pelos & Patas', color: '#3fb6e0', pro: 'Romi',
      svc: [['Baño y secado', '$ 15.000', '60 min'], ['Baño y corte', '$ 22.000', '90 min'], ['Corte de uñas', '$ 5.000', '15 min']],
      cli: ['Toby (Laura M.)', 'Luna (Pablo S.)', 'Rocco (Inés G.)', 'Mora (Carlos P.)', 'Simón (Eva T.)', 'Nala (Sol L.) · 8 semanas', 'Coco (Ariel S.) · 7 semanas', 'Kira (Dana D.) · 7 semanas'],
      offer: ['Pack primavera: 3 baños', 'Para que llegue al verano con el pelo al día. Se paga en el local.'] },
    nativa: { name: 'Peluquería Nativa', color: '#6d2e8c', pro: 'Flor',
      svc: [['Corte y brushing', '$ 20.000', '60 min'], ['Color raíz', '$ 32.000', '120 min'], ['Nutrición', '$ 14.000', '45 min']],
      cli: ['Carolina M.', 'Daniela R.', 'Agustina G.', 'Mónica P.', 'Belén T.', 'Rocío L. · 8 semanas', 'Laura S. · 7 semanas', 'Irene D. · 7 semanas'],
      offer: ['Color todo el año', 'Un color por mes con 15 % de ahorro. Se paga en el local.'] }
  };

  // ---------- Direcciones: ficha y microcopy (el tono es parte de la personalidad) ----------
  var ABOUT = {
    a: { name: 'A · Sereno', pitch: 'Neutros cálidos de piedra y crema, mucho aire, radios grandes y un verde salvia profundo como acento de la plataforma.',
      neutros: 'Piedra / crema (cálidos)', acento: 'Verde salvia profundo #3d5e4f', forma: 'Radios 8 / 14 / 22 px, sombras suaves y difusas, bordes casi invisibles',
      tipo: 'Títulos ui-serif (Iowan, Palatino, Georgia) + cuerpo del sistema', densidad: 'Baja: controles de 48 px, filas de 56 px',
      iconos: 'Trazo fino de 1,5 redondeado', tono: 'Calmo y cuidado: frases completas, sin signos de exclamación' },
    b: { name: 'B · Preciso', pitch: 'Neutros fríos y puros, radios chicos, bordes finos y densidad media-alta. Acento índigo tinta. La más neutra frente a cualquier rubro.',
      neutros: 'Pizarra (fríos, casi puros)', acento: 'Índigo tinta #3a3f9e', forma: 'Radios 3 / 6 / 8 px, bordes de 1 px, sin sombras (solo en elementos flotantes)',
      tipo: 'Sistema para todo + monoespaciada del sistema para horarios y cifras', densidad: 'Media-alta: controles de 40 px, filas de 40 px (objetivos táctiles de 44 px en la web de la clienta)',
      iconos: 'Trazo medio de 1,75, terminaciones rectas', tono: 'Directo y funcional: verbos al frente, lo justo' },
    c: { name: 'C · Cercano', pitch: 'Neutros apenas cálidos, formas redondeadas y pill, tipografía redondeada y un terracota cálido como acento de la plataforma. Habla como una persona.',
      neutros: 'Arena (apenas cálidos)', acento: 'Terracota #b3472c', forma: 'Radios 10 / 16 / 24 px y botones pill, bordes de 2 px, sombra "apoyada"',
      tipo: 'ui-rounded (SF Pro Rounded) con fallback a Nunito/sistema; títulos en 700', densidad: 'Media-baja: controles de 48 px, filas de 52 px',
      iconos: 'Trazo grueso de 2 redondeado', tono: 'Conversacional y cálido: tuteo, alguna exclamación, sin emojis en la interfaz' }
  };
  var COPY = {
    a: { 'c1-title': '¿Qué te gustaría hacerte?', 'c1-cta': 'Elegir horario', 'c2-title': '¿Cuándo te queda bien?', 'c2-cta': 'Confirmar viernes 23, 15:00',
      'c3-ok': 'Tu turno quedó reservado', 'c3-ok-d': 'Te enviamos el detalle por WhatsApp.', 'c3-title': 'Detalle del turno',
      'c3-remind': 'Te avisamos un día antes. Y cuando sea momento de volver, también.', 'c3-cta': 'Agregar al calendario', 'c3-cancel': 'Cancelar o cambiar el turno', 'foot': 'Reservas con',
      'a-title': 'Agenda de hoy', 'a-cta': 'Nuevo turno', 'a-k2': '31 de 53 clientas', 'a-k3l': 'Suscriptoras activas', 'a-k3': '3 nuevas esta semana', 'a-cap': 'Turnos de hoy · 5',
      'a-rec': 'Es momento de volver', 'a-rec-d': 'Clientas que ya pasaron su frecuencia habitual.',
      'l-title': 'Que cada clienta vuelva a tiempo.', 'l-lead': 'Reservas online, recordatorios y avisos de recompra para tu spa, peluquería o barbería. Con tu logo y tu color.',
      'l-b1': 'Recordatorios por WhatsApp que bajan las ausencias.', 'l-b2': 'Avisos de recompra, ofertas de temporada y packs prepagos.', 'l-b3': 'Tu clienta ve tu marca, no la nuestra.',
      'l-form': 'Ingresá a tu panel', 'l-sub': 'Para administradoras, recepción y profesionales.', 'l-err': 'Revisá el email: le falta el dominio (por ejemplo, @gmail.com).', 'l-cta': 'Ingresar', 'l-new': 'Quiero sumar mi negocio',
      'b-title': 'Marca del negocio' },
    b: { 'c1-title': 'Elegí el servicio', 'c1-cta': 'Continuar', 'c2-title': 'Elegí día y horario', 'c2-cta': 'Confirmar: vie 23, 15:00',
      'c3-ok': 'Turno confirmado', 'c3-ok-d': 'Detalle enviado por WhatsApp.', 'c3-title': 'Resumen',
      'c3-remind': 'Recordatorio: 24 h antes. Aviso de recompra según tu frecuencia.', 'c3-cta': 'Agregar al calendario', 'c3-cancel': 'Cancelar o reprogramar', 'foot': 'Reservas con',
      'a-title': 'Agenda', 'a-cta': '+ Turno', 'a-k2': '31/53 clientas', 'a-k3l': 'Suscriptoras activas', 'a-k3': '+3 en 7 días', 'a-cap': 'Hoy · 5 turnos',
      'a-rec': 'Recompra pendiente', 'a-rec-d': 'Superaron su frecuencia habitual.',
      'l-title': 'Agenda, recordatorios y recompra en un solo panel.', 'l-lead': 'La plataforma de turnos para negocios de belleza y cuidado. Multi-sucursal, con tu marca.',
      'l-b1': 'Recordatorios por WhatsApp: menos ausencias.', 'l-b2': 'Recompra, ofertas de temporada y packs prepagos.', 'l-b3': 'Marca propia en la web de reservas.',
      'l-form': 'Ingresar', 'l-sub': 'Administración, recepción y profesionales.', 'l-err': 'Email inválido: falta el dominio (ej.: @gmail.com).', 'l-cta': 'Ingresar', 'l-new': 'Sumar un negocio',
      'b-title': 'Marca' },
    c: { 'c1-title': '¡Hola! ¿Qué te hacemos hoy?', 'c1-cta': 'Sigamos: elegí horario', 'c2-title': '¿Cuándo venís?', 'c2-cta': 'Me quedo con el viernes 23, 15:00',
      'c3-ok': '¡Listo, te esperamos!', 'c3-ok-d': 'Te pasamos todo por WhatsApp.', 'c3-title': 'Tu turno',
      'c3-remind': 'Te escribimos el día anterior para que no se te pase. Y cuando te toque volver, te avisamos.', 'c3-cta': 'Sumarlo a mi calendario', 'c3-cancel': '¿Te surgió algo? Cambiá o cancelá acá', 'foot': 'Reservas con',
      'a-title': '¡Buen día! Así viene hoy', 'a-cta': 'Agendar turno', 'a-k2': '¡31 de tus 53 clientas!', 'a-k3l': 'Suscriptoras', 'a-k3': '¡3 se sumaron esta semana!', 'a-cap': 'Tus turnos de hoy (5)',
      'a-rec': 'Les toca volver', 'a-rec-d': 'Ya pasó su tiempo de siempre: un mensajito las trae de vuelta.',
      'l-title': 'Tus clientas vuelven. Vos no tenés que acordarte.', 'l-lead': 'Turnos online, recordatorios y avisos de «te toca volver» para tu spa, peluquería o barbería. Con tu logo y tus colores.',
      'l-b1': 'Recordatorios por WhatsApp, para que nadie falte.', 'l-b2': 'Ofertas de temporada y packs para que vuelvan seguido.', 'l-b3': 'Tu clienta ve tu marca, no la nuestra.',
      'l-form': '¡Hola de nuevo!', 'l-sub': 'Entrá a tu panel (administración, recepción o profesionales).', 'l-err': 'Uy, al email le falta el dominio (por ejemplo, @gmail.com).', 'l-cta': 'Entrar', 'l-new': 'Quiero sumar mi negocio',
      'b-title': 'Tu marca' }
  };
  var PRESETS = [['#f7a8c8', 'Rosa claro'], ['#d6337a', 'Fucsia'], ['#f5c400', 'Amarillo'], ['#121212', 'Negro'], ['#3fb6e0', 'Celeste'], ['#2fa36b', 'Verde'], ['#6d2e8c', 'Violeta'], ['#e07a5f', 'Coral']];

  // ---------- Estado y render ----------
  var stage = document.getElementById('escenario');
  var preview = document.querySelector('[data-tenant-scope="preview"]');
  // state = BORRADOR de «Marca del negocio» (solo se ve en la vista previa). saved = lo guardado (se ve en todas las pantallas).
  var state = { dir: 'a', tenant: 'esmalte', color: TENANTS.esmalte.color, logo: null, name: TENANTS.esmalte.name };
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function surfaces() { var cs = getComputedStyle(stage); return [cs.getPropertyValue('--s-default').trim(), cs.getPropertyValue('--s-canvas').trim()]; }
  function logoHtml(logo, color) { return logo ? '<img src="' + logo + '" alt="">' : LOGOS[state.tenant](color); }

  function renderTenantContent() {
    var t = TENANTS[state.tenant];
    $$('[data-svc]').forEach(function (el) { el.textContent = t.svc[+el.getAttribute('data-svc')][0]; });
    $$('[data-price]').forEach(function (el) { el.textContent = t.svc[+el.getAttribute('data-price')][1]; });
    $$('[data-svcmeta]').forEach(function (el) { el.textContent = t.svc[+el.getAttribute('data-svcmeta')][2]; });
    $$('[data-cli]').forEach(function (el) { var first = el.firstChild; if (first && first.nodeType === 3) first.nodeValue = t.cli[+el.getAttribute('data-cli')]; else el.textContent = t.cli[+el.getAttribute('data-cli')]; });
    $$('[data-pro]').forEach(function (el) { el.textContent = t.pro; });
    $$('[data-t="c1-offer-t"]').forEach(function (el) { el.textContent = t.offer[0]; });
    $$('[data-t="c1-offer-d"]').forEach(function (el) { el.textContent = t.offer[1]; });
  }
  // id = {color, logo, name}. Si root es el escenario, se excluye la vista previa y el formulario (borrador).
  function renderIdentity(root, id, excludeDraft) {
    function inDraft(el) { return excludeDraft && (preview.contains(el) || el.closest('#brand-form')); }
    $$('[data-tenant-name]', root).forEach(function (el) { if (!inDraft(el)) el.textContent = id.name; });
    $$('[data-tenant-logo],[data-tenant-logo-sm],[data-tenant-logo-lg]', root).forEach(function (el) { if (!inDraft(el)) el.innerHTML = logoHtml(id.logo, id.color); });
  }
  function renderDir() {
    stage.setAttribute('data-dir', state.dir);
    var a = ABOUT[state.dir], c = COPY[state.dir];
    Object.keys(a).forEach(function (k) { $$('[data-about="' + k + '"]').forEach(function (el) { el.textContent = a[k]; }); });
    Object.keys(c).forEach(function (k) { $$('[data-t="' + k + '"]').forEach(function (el) { el.textContent = c[k]; }); });
    $$('[data-about="tenant"]').forEach(function (el) { el.textContent = TENANTS[state.tenant].name + ' · color ' + TENANTS[state.tenant].color; });
  }

  function fmt(r) { return (Math.floor(r * 100) / 100).toFixed(2).replace('.', ',') + ':1'; }
  function warnHtml(d) {
    var parts = [];
    if (d.solidAdjusted) parts.push('Ni el texto blanco ni el negro se leen bien sobre ' + d.primary + ', así que en botones usamos una versión más oscura (' + d.solid + ').');
    if (d.textAdjusted) parts.push('Sobre fondo claro tu color no se lee bien como texto o link: lo oscurecemos a ' + d.text + ' (' + fmt(d.ratios.text) + ').');
    if (!parts.length) {
      return '<div class="alert alert--success"><svg class="ic" aria-hidden="true"><use href="#i-ok"/></svg><div><strong>Tu color se lee bien</strong><p>Lo usamos tal cual en botones (' + fmt(d.ratios.onSolid) + ' con texto ' + (d.on === WHITE ? 'blanco' : 'negro') + ') y en links (' + fmt(d.ratios.text) + ').</p></div></div>';
    }
    return '<div class="alert alert--warning"><svg class="ic" aria-hidden="true"><use href="#i-warn"/></svg><div><strong>Ajustamos tu color para que se pueda leer</strong>' +
      parts.map(function (p) { return '<p>' + p + '</p>'; }).join('') +
      '<p>Tu color original se sigue viendo en el logo y en los fondos suaves. Si preferís, elegí un tono más oscuro.</p></div></div>';
  }
  function derivedHtml(d) {
    var rows = [[d.primary, 'Tu color', 'brand.primary'], [d.solid, 'Botones', 'brand.solid' + (d.solidAdjusted ? ' · ajustado' : '')],
      [d.on, 'Texto sobre botón', (d.on === WHITE ? 'blanco' : 'casi negro') + ' · ' + fmt(d.ratios.onSolid)],
      [d.hover, 'Botón al pasar el mouse', 'brand.primary-hover · ' + fmt(d.ratios.onHover)],
      [d.text, 'Links y texto', 'brand.text' + (d.textAdjusted ? ' · ajustado' : '') + ' · ' + fmt(d.ratios.text)],
      [d.subtle, 'Fondo de seleccionado', 'brand.subtle']];
    return rows.map(function (r) { return '<li><span class="chip" style="background:' + r[0] + '" aria-hidden="true"></span><span>' + r[1] + ' <span class="num">' + r[0] + '</span></span><small>' + r[2] + '</small></li>'; }).join('');
  }

  var saved = {}; // marca guardada por tenant: {color, logo, name} (la "base de datos" de la demo)
  function savedBrand() { var t = TENANTS[state.tenant]; return saved[state.tenant] || { color: t.color, logo: null, name: t.name }; }

  function renderBrand() {
    var s = surfaces();
    var sb = savedBrand();
    applyBrand(stage, derive(sb.color, s[0], s[1]));
    renderIdentity(stage, sb, true);            // pantallas 1-2 y chip: solo lo guardado
    var dPrev = derive(state.color, s[0], s[1]);
    applyBrand(preview, dPrev);
    renderIdentity(preview, state, false);      // vista previa: el borrador
    var lg = document.querySelector('#brand-form [data-tenant-logo-lg]'); if (lg) lg.innerHTML = logoHtml(state.logo, state.color);
    document.getElementById('derived').innerHTML = derivedHtml(dPrev);
    document.getElementById('b-msg').innerHTML = warnHtml(dPrev);
    $$('#presets .preset').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-c') === state.color.toLowerCase())); });
  }

  // Presets
  var pr = document.getElementById('presets');
  pr.innerHTML = PRESETS.map(function (p) { return '<button type="button" class="preset" data-c="' + p[0] + '" style="background:' + p[0] + '" aria-pressed="false"><span class="sr-only">' + p[1] + ' ' + p[0] + '</span></button>'; }).join('');

  var colorIn = document.getElementById('b-color'), hexIn = document.getElementById('b-hex'), nameIn = document.getElementById('b-name');
  var hexErrId = 'b-hex-err';
  function setColor(c, from) {
    state.color = c.toLowerCase();
    if (from !== 'picker') colorIn.value = state.color;
    if (from !== 'hex') hexIn.value = state.color;
    clearHexError();
    renderBrand();
  }
  function clearHexError() {
    hexIn.removeAttribute('aria-invalid'); hexIn.setAttribute('aria-describedby', 'b-hex-h');
    var e = document.getElementById(hexErrId); if (e) e.remove();
  }
  function showHexError() {
    if (document.getElementById(hexErrId)) return;
    hexIn.setAttribute('aria-invalid', 'true'); hexIn.setAttribute('aria-describedby', 'b-hex-h ' + hexErrId);
    var p = document.createElement('p'); p.className = 'field-error'; p.id = hexErrId;
    p.innerHTML = '<svg class="ic" aria-hidden="true" style="width:18px;height:18px"><use href="#i-warn"/></svg><span>Ese código no es un color. Escribilo como #RRGGBB, por ejemplo #d6337a.</span>';
    hexIn.closest('.color-row').insertAdjacentElement('afterend', p);
  }
  pr.addEventListener('click', function (e) { var b = e.target.closest('.preset'); if (b) setColor(b.getAttribute('data-c'), 'preset'); });
  colorIn.addEventListener('input', function () { setColor(colorIn.value, 'picker'); });
  hexIn.addEventListener('input', function () { var v = hexIn.value.trim(); if (/^#?[0-9a-f]{6}$/i.test(v)) setColor(v[0] === '#' ? v : '#' + v, 'hex'); });
  hexIn.addEventListener('change', function () { if (!/^#?[0-9a-f]{6}$/i.test(hexIn.value.trim())) showHexError(); });
  nameIn.addEventListener('input', function () { state.name = nameIn.value.trim() || TENANTS[state.tenant].name; renderIdentity(preview, state, false); });
  document.getElementById('b-logo').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0]; if (!f) return;
    var r = new FileReader(); r.onload = function () { state.logo = r.result; renderBrand(); }; r.readAsDataURL(f);
  });
  document.getElementById('b-reset').addEventListener('click', function () { setColor(TENANTS[state.tenant].color, 'reset'); });
  document.getElementById('brand-form').addEventListener('submit', function () {
    if (!/^#?[0-9a-f]{6}$/i.test(hexIn.value.trim())) { showHexError(); hexIn.focus(); return; }
    saved[state.tenant] = { color: state.color, logo: state.logo, name: state.name }; renderBrand();
    var d = derive(state.color, surfaces()[0], surfaces()[1]);
    document.getElementById('b-msg').innerHTML = '<div class="alert alert--success"><svg class="ic" aria-hidden="true"><use href="#i-ok"/></svg><div><strong>Guardamos tu marca</strong><p>Ya se ve en tu web de reservas' + (d.solidAdjusted || d.textAdjusted ? ', con el ajuste de contraste aplicado' : '') + '. Color, logo y nombre ya están aplicados en las pantallas de arriba.</p></div></div>';
  });

  function onTenant(id) {
    state.tenant = id; var sb = savedBrand();
    state.color = sb.color; state.logo = sb.logo; state.name = sb.name; nameIn.value = state.name; colorIn.value = state.color; hexIn.value = state.color; clearHexError();
    renderTenantContent(); renderDir(); renderBrand();
  }
  $$('input[name="dir"]').forEach(function (r) { r.addEventListener('change', function () { state.dir = r.value; renderDir(); renderBrand(); }); });
  $$('input[name="tenant"]').forEach(function (r) { r.addEventListener('change', function () { onTenant(r.value); }); });

  // Permite enlazar un estado: index.html#dir=b&tenant=faro
  var h = location.hash.replace('#', '').split('&').reduce(function (o, kv) { var p = kv.split('='); if (p[1]) o[p[0]] = p[1]; return o; }, {});
  if (ABOUT[h.dir]) { state.dir = h.dir; document.getElementById('dir-' + h.dir).checked = true; }
  if (TENANTS[h.tenant]) { document.getElementById('t-' + h.tenant).checked = true; }
  onTenant(TENANTS[h.tenant] ? h.tenant : 'esmalte');

  window.LF = { derive: derive, contrast: contrast }; // para pruebas
})();
