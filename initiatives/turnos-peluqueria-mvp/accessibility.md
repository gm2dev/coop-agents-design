# Accesibilidad — Turnos para peluquería, MVP Hitos 1 y 2

- **Estándar:** WCAG 2.2 nivel AA como piso (incluye el 2.1 AA que pide RNF-02 del
  [documento de producto](https://github.com/gm2dev/coop-agents-product/blob/po/turnos-peluqueria-mvp/initiatives/turnos-peluqueria-mvp/casos-de-uso.md#7-requisitos-no-funcionales)).
  Aplica a la web del cliente **y** al panel.
- **Qué se verificó:** de forma **estática** (HTML, CSS, orden del DOM, referencias ARIA, links y contraste
  calculado de los tokens) y **en navegador** con Playwright + Chromium headless sobre las 46 páginas del
  prototipo (45 de la iniciativa + el índice general), por el Designer Reviewer y repetido por el Designer en la
  ronda 1: axe-core 0 violaciones (WCAG 2.0/2.1/2.2 A y AA + best-practice), reflow a 320 px sin scroll
  horizontal (`scrollWidth ≤ 320`, también a 360 y 1280 px), espaciado de texto 1.4.12 sin desbordes, teclado
  básico (Tab, flechas en radios, foco visible), resumen de errores con foco, `aria-describedby` y “Copiar link”
  con anuncio en `role="status"`.
- **v0.4 (H1 + H2):** repetido por el Designer sobre las **90 páginas** (89 de la iniciativa + el índice general)
  con Playwright + Chromium headless: axe-core **0 violaciones** (ninguna de ningún nivel; tags WCAG 2.0/2.1/2.2
  A y AA + best-practice, a 320 px), **0 páginas con scroll horizontal a 320 y a 360 px**, espaciado 1.4.12
  sin desbordes (había 6 agendas H2 con desborde de 12–15 px por botones y badges `nowrap`: corregido con
  `min-width:0`, `overflow-wrap:anywhere` y `white-space:normal` en la tarjeta), **0 recursos que fallan al
  cargar** y “Copiar link” en la confirmación termina en y=594 en 360×640 (arriba del pliegue). Script estático:
  1984 `href`/`src` resueltos, 0 rotos, 0 problemas (lang, h1, títulos, labels, ARIA, ids, tabindex, estilos).
- **PENDIENTE** (persona de diseño): lector de pantalla (VoiceOver iOS + NVDA o TalkBack), zoom al 200 % real
  del navegador y la prueba sobre el preview de Vercel. No se reporta como hecho nada que no se haya ejecutado.

## 1. Verificación estática realizada

| Check | Cómo se verificó | Resultado |
|---|---|---|
| Links relativos sin rotos | Script (v0.4): 1984 `href`/`src` resueltos a archivos existentes; anclas `#id` existen | OK (0 rotos) |
| Sin recursos remotos | Script: sin URL `http(s)://` ni `//` salvo el link a la documentación en GitHub del índice; CSS sin `url()` ni `@import` | OK |
| `lang="es"` | Script, todas las páginas | OK |
| Un único `h1` y sin saltos de nivel | Script, todas las páginas | OK |
| `<title>` único por paso/estado; prefijo “Error:” en páginas con errores | Script + revisión (11 páginas con “Error:”; el JS lo agrega al validar) | OK |
| Todo input con label | Script: `label for` existente o input dentro de `label` (los inputs del `<template>` de rangos reciben `id`/`for` desde el JS al clonarse) | OK |
| `aria-describedby` / `aria-labelledby` apuntan a ids existentes; sin ids duplicados | Script | OK |
| Sin `tabindex` positivo | Script (solo `-1` en mensajes que reciben foco programático) | OK |
| Sin estilos en línea ni valores sueltos | Script sobre `styles.css`: sin hex ni px fuera del bloque de tokens propuestos y del ocultamiento accesible | OK |
| Foco visible | `:focus-visible` global con `focus.ring` 3px + offset 2px; en radio-tarjetas y horarios el anillo se dibuja en el `label` (`:has(input:focus-visible)`) | OK (estático) |
| Movimiento reducido | `@media (prefers-reduced-motion: reduce)` detiene el spinner | OK (estático) |
| Saltar al contenido | Primer elemento de cada página, visible al recibir foco | OK (estático) |
| JS sin errores de sintaxis | `node` parsea `app.js` | OK |

## 2. Contraste (calculado de los tokens)

Pares ya documentados en [design-system/README.md](../../design-system/README.md#contraste-wcag-22-aa-calculado),
más los pares nuevos que usa este prototipo (calculados con la fórmula de luminancia relativa de WCAG):

| Par | Uso | Ratio | Mínimo | |
|---|---|---|---|---|
| text.link / surface.subtle | links sobre el fondo de página | 5.88 | 4.5 | OK |
| text.muted / surface.subtle | texto secundario sobre el fondo | 6.99 | 4.5 | OK |
| text.muted / surface.disabled | día “Cerrado” / “No disponible” | 6.51 | 4.5 | OK |
| border.strong / surface.disabled | borde de día cerrado | 4.16 | 3 | OK |
| text.default / feedback.warning.bg | label del link en el bloque “Guardá tu link” | 16.18 | 4.5 | OK |
| feedback.warning.text / feedback.warning.bg | texto del bloque “Guardá tu link”, badges de aviso | 9.05 | 4.5 | OK |
| feedback.warning.border / surface.default | borde del bloque “Guardá tu link” | 9.44 | 3 | OK |
| focus.ring / feedback.warning.bg | foco dentro del bloque del link | 6.42 | 3 | OK |
| focus.ring / feedback.danger.bg · success.bg · info.bg | foco en alertas que reciben foco | 6.16 · 6.35 · 6.16 | 3 | OK |
| text.on-action / action.primary-hover | botón primario en hover | 9.04 | 4.5 | OK |
| text.link / surface.selected | botón secundario en hover | 5.63 | 4.5 | OK |
| text.selected / surface.selected | opción y horario elegidos | 8.00 | 4.5 | OK |
| border.selected / surface.default | borde de elegido | 6.36 | 3 | OK |
| action.primary / surface.disabled | barra de progreso: hecho vs pendiente | 5.48 | 3 | OK (además es decorativa: el paso está en texto) |
| feedback.info.text / feedback.info.bg | badge “Hoy”, alertas info | 8.01 | 4.5 | OK |
| feedback.success.text / feedback.success.bg | badge “Confirmado”, alertas de éxito | 7.26 | 4.5 | OK |
| feedback.danger.text / surface.default | error junto al campo, botón “Quitar” | 8.66 | 4.5 | OK |
| feedback.danger.border / surface.default | borde de campo con error | 6.57 | 3 | OK |
| text.link / surface.disabled | links de la barra del prototipo (no es producto) | 5.48 | 4.5 | OK |

## 3. Checklist WCAG 2.2 AA

Estado: **OK (estático)** = verificado en el código · **Diseño** = resuelto en la spec, a confirmar en
implementación · **PENDIENTE** = requiere navegador o tecnología asistiva · **N/A**.

### Perceptible

| Criterio | Cómo se cumple | Estado |
|---|---|---|
| 1.1.1 Contenido no textual | Íconos (✓ ✕ ⚠) decorativos con `aria-hidden`; siempre acompañados de texto. Spinner `aria-hidden` + texto. Sin imágenes. | OK (estático) |
| 1.3.1 Info y relaciones | Landmarks (`header`, `nav`, `main`, `footer`, `aside`), `fieldset/legend` en radios, checkboxes y días de la semana, `dl` en resúmenes, listas, `section` con `aria-labelledby`. | OK (estático) |
| 1.3.2 Secuencia significativa | Orden del DOM = orden visual. En botones, el primario va primero en el DOM; desde 640 px se muestra a la derecha con `row-reverse` (el orden de foco sigue siendo primario → secundario). | OK (estático) · PENDIENTE confirmar que no confunde en el preview |
| 1.3.4 Orientación | Sin bloqueo de orientación. | OK (estático) |
| 1.3.5 Propósito de los campos | `autocomplete` name, tel, email, username, current-password, organization, street-address. | OK (estático) |
| 1.4.1 Uso del color | Elegido: fondo + borde 2px + ✓/semibold; errores: ✕ + “Error:” + texto + borde, advertencias: ⚠ + “Advertencia:” (DD-34); estados con palabra; día cerrado con borde punteado + texto; día actual con `aria-current`; links subrayados. | OK (estático) |
| 1.4.3 Contraste mínimo | Ver § 2. | OK (calculado) |
| 1.4.4 Cambio de tamaño | Tipografía en `rem`; sin alturas fijas en contenedores de texto. | OK (estático) · PENDIENTE (zoom 200 % real en el preview) |
| 1.4.10 Reflow | Mobile-first, grids `auto-fill`, `overflow-wrap: anywhere` (link privado, emails), sin anchos fijos. Objetivo 320 px (producto pide 360 px). Rangos horarios y filas de listas con `minmax(0,1fr)`/`min-width:0`. | OK (Playwright v0.4: 90 páginas, `scrollWidth ≤ 320` y `≤ 360`) |
| 1.4.11 Contraste no textual | Bordes de controles `border.strong` (4.83:1), foco ≥ 6:1, elegido 6.36:1. | OK (calculado) |
| 1.4.12 Espaciado de texto | Sin alturas fijas en texto; contenedores crecen. | OK (Playwright: estilos 1.4.12 inyectados a 320 px, sin desbordes) |
| 1.4.13 Contenido al pasar el puntero | No hay tooltips ni contenido en hover. | N/A |

### Operable

| Criterio | Cómo se cumple | Estado |
|---|---|---|
| 2.1.1 Teclado | Solo controles nativos (`a`, `button`, `input`, `select`); radios con flechas; sin `div` clicables. | OK (Playwright: Tab, flechas en radios) · recorrido completo en el preview pendiente |
| 2.1.2 Sin trampas | No hay diálogos ni widgets que capturen el foco. | OK (estático) |
| 2.4.1 Saltar bloques | “Saltar al contenido” en todas las páginas. | OK (estático) |
| 2.4.2 Título de página | Un título por paso y estado (“Paso 3 de 5: Elegí día y horario — La Esquina Peluquería”). | OK (estático) |
| 2.4.3 Orden del foco | DOM lineal, sin `tabindex` positivo; foco programático solo en mensajes de error/éxito y en el h1 de la confirmación. | OK (Playwright: resumen de errores recibe el foco) |
| 2.4.4 Propósito de los links | Textos explícitos (“Volver: peluquero”, “Ver el próximo día con horarios: martes 20”, “Editar Corte y barba” con texto oculto). | OK (estático) |
| 2.4.6 Encabezados y etiquetas | h1 por pantalla, h2/h3 por sección; labels descriptivos. | OK (estático) |
| 2.4.7 Foco visible | Ver § 1. | OK (Playwright) |
| 2.4.11 Foco no oculto (mínimo) | Sin headers sticky ni overlays. | OK (estático) |
| 2.5.3 Etiqueta en el nombre | El nombre accesible empieza con el texto visible (días: “Vie 16 Con horarios, viernes 16 de octubre”; rangos: “Desde (rango 2)”; “Editar Corte y barba”). | OK (estático) |
| 2.5.7 Movimientos de arrastre | No hay arrastre: mover un turno (CU-13) es un formulario con peluquero, fecha y hora. | OK (estático) |
| 2.5.8 Tamaño del objetivo (mínimo) | Botones, opciones, horarios, links de navegación y checkboxes con alto `size.target.comfortable` (44 px); radios y checkboxes de 24 px dentro de labels de 44 px. Links en texto corrido exentos. | OK (estático) |

### Comprensible

| Criterio | Cómo se cumple | Estado |
|---|---|---|
| 3.1.1 Idioma | `lang="es"`. | OK (estático) |
| 3.2.1 / 3.2.2 Al recibir foco / al cambiar | Elegir una opción o un horario no navega: siempre hay “Continuar”. Filtro de agenda con botón “Filtrar”. | OK (estático) |
| 3.2.3 Navegación coherente | Header, footer y nav del panel iguales en todas las páginas. | OK (estático) |
| 3.2.6 Ayuda consistente | Teléfono del local en el footer de todas las pantallas del cliente y en cada estado de error/vacío. | OK (estático) |
| 3.3.1 Identificación de errores | Mensaje en texto junto al campo + resumen; `aria-invalid`. | OK (estático) |
| 3.3.2 Etiquetas o instrucciones | Labels visibles, “(opcional)” en el label, hints antes del input, formato del email en el error. | OK (estático) |
| 3.3.3 Sugerencia ante errores | Cada error dice cómo corregir (“tiene que tener la forma nombre@ejemplo.com”, “posterior a la de inicio”, “se superpone con el rango 1 (10:00 a 13:00)”). | OK (estático) |
| 3.3.4 Prevención de errores | Paso “Revisá y confirmá” antes de crear el turno, con “Cambiar” por dato. | OK (estático) |
| 3.3.7 Entrada redundante | Volver/Cambiar conservan lo elegido; en CU-04 no se re-tipean datos; en error de ingreso se conserva el usuario. | Diseño · OK en prototipo con sessionStorage |
| 3.3.8 Autenticación accesible (mínimo) | Usuario y contraseña con `autocomplete`, pegar permitido, “Mostrar contraseña”; sin captcha ni pruebas cognitivas. | OK (estático) |

### Robusto

| Criterio | Cómo se cumple | Estado |
|---|---|---|
| 4.1.2 Nombre, rol, valor | Controles nativos; `aria-current` en paso de nav, día y sección; `aria-disabled` en botón enviando. | OK (estático) |
| 4.1.3 Mensajes de estado | “Link copiado” en `role="status"` (aria-live polite); cargando con `role="status"`; errores con `role="alert"` + foco; agregar/quitar rango anunciado; filtro aplicado anunciado. | OK (Playwright: “Copiar link” escribe el resultado en `role="status"`) · PENDIENTE (lector de pantalla) |

## 4. Puntos de atención para la implementación

- **Foco tras navegación:** al llegar a una pantalla con error (CU-04, error de confirmación, resumen de errores)
  el foco va al mensaje; al llegar a la confirmación, al h1. En una SPA esto hay que hacerlo a mano en cada cambio de ruta y actualizar `document.title`.
- **Copiar link:** usar la API del portapapeles con alternativa (seleccionar el texto) y anunciar siempre el resultado.
- **Horarios:** mantener el radio group nativo (no `div` con `onclick`); si se usan botones, `aria-pressed` y gestión de flechas.
- **Doble envío:** el botón “Confirmar turno” queda `aria-disabled` mientras se envía (no `disabled`, para que no pierda el foco).
- **Mensajes de error del servidor** (CU-04, ingreso) con `role="alert"` y foco programático.
- **H2:** ver § 4b.

## 4b. Hito 2 — decisiones de accesibilidad

| Tema | Cómo se resolvió | Criterios | Estado |
|---|---|---|---|
| Estados del link privado | Badge con ícono (✓ ✕ ◷ ↻, `aria-hidden`) + texto; cancelados con resumen tachado **y** título “Turno cancelado” (el tachado no es la única señal). | 1.4.1, 1.3.1 | OK (estático) |
| Menos de 2 horas | No se muestran botones deshabilitados; aviso con el teléfono como link `tel:`. | 3.3.2, 3.2.6 | OK (estático) |
| Errores de servidor (ocupado, plazo vencido, conexión, superposición) | `role=alert` + `tabindex=-1` + foco al cargar; el texto dice que el turno original sigue igual. | 3.3.1, 3.3.3, 4.1.3 | OK (estático) · PENDIENTE lector |
| Superposición al mover | Error junto a “Hora de inicio” (`aria-invalid`, `aria-describedby`) + resumen con foco; título “Error: …”. | 3.3.1 | OK (estático) |
| Advertencia fuera de horario / bloqueo | Alerta warning con foco, motivo en texto y dos botones con verbos distintos (“Mover igual” / “Elegir otro horario”). | 3.3.4 | OK (estático) |
| Segundo paso de cancelar / eliminar | Pantalla propia, sin modal (sin trampas de foco); botón de peligro con texto explícito. | 3.3.4, 2.1.2 | OK (estático) |
| Asistencia | `fieldset` con legend “Asistencia” + nombre del cliente y hora ocultos; botones `aria-pressed`; resultado anunciado en `role=status`; el elegido con fondo + ✓ (no solo color). Resumen de pendientes con links a cada tarjeta (`tabindex=-1` en la tarjeta destino). | 4.1.2, 4.1.3, 1.4.1, 2.4.1 | OK (estático + Playwright axe) · PENDIENTE lector |
| Acciones repetidas en tarjetas | “Mover” / “Cancelar” / “Eliminar” con texto oculto que completa el nombre (“Mover turno de Paula V., 11:00”); el nombre empieza con el texto visible. | 2.4.4, 2.5.3 | OK (estático) |
| Mover sin arrastre | Formulario con controles nativos (`select`, `date`, `time step=900`). | 2.5.7, 2.1.1 | OK (estático) |
| Campos que aparecen (bloqueos) | Radios que revelan campos debajo (`hidden`), sin mover el foco ni cambiar de página. | 3.2.2 | OK (estático) |
| Motivo del bloqueo (opcional) | `label` visible “Motivo (opcional)”, hint con el límite vinculado por `aria-describedby`, `maxlength=80`; vacío no genera error. | 3.3.2, 1.3.1 | OK (Playwright) |
| Bloqueo en la agenda (DD-36) | “⊘ Bloqueado” en texto (ícono `aria-hidden`) + alcance, horario y motivo (si existe); recuadro punteado, no depende del color. En la vista de día va en el orden del DOM: al inicio de la columna (todo el día) o entre los turnos según su hora de inicio (rango), así el orden de lectura coincide con el cronológico (1.3.2). | 1.4.1, 1.3.1, 1.3.2 | OK (Playwright + axe) |
| Reflow de tarjetas con muchas acciones | Botones y badges pueden partir línea dentro de la tarjeta. | 1.4.10, 1.4.12 | OK (Playwright) |

Para la implementación: tras mover/cancelar, el foco va a la alerta de éxito de la agenda; al guardar la
asistencia, no mover el foco (solo anunciar); si falla, revertir el botón y anunciar con `role=alert` dentro de la tarjeta, sin mover el foco del botón tocado (DD-35, `admin-agenda-asistencia-error`).

## 5. PENDIENTE — para la persona de diseño sobre el preview de Vercel

Ya verificado en Chromium headless (no repetir salvo regresión): axe-core, reflow 320 px, espaciado de texto,
teclado básico, foco en resumen de errores, anuncio de Copiar. Queda:

1. Zoom real al 200 % del navegador (cliente y panel, en especial agenda semanal y horario por día).
2. Recorridos completos solo con teclado en un navegador real (Safari/Firefox además de Chromium).
3. VoiceOver en iOS (Safari) y TalkBack o NVDA: confirmación (anuncio de “Link copiado”), CU-04 (lectura del mensaje con foco), errores de datos, días con `aria-current`; H2: estados del link privado, `cambiar-ocupado`, advertencia “¿Mover igual?”, botones de asistencia (`aria-pressed` + anuncio) y resumen de pendientes.
4. Descargar `turno.ics`, `turno-cambiado.ics` y `turno-movido.ics` y abrirlo en iOS, Android y un calendario de escritorio (fecha, hora en zona del local, link en la descripción).
5. Revisar el preview de Vercel (links relativos desde la URL del PR).
