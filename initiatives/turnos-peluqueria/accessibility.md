# Accesibilidad — Turnos para peluquería (borrador v0)

Objetivo: **WCAG 2.2 nivel AA**. En el contenedor de diseño no hay navegador: las verificaciones de
este documento son **estáticas** (HTML/CSS, orden del DOM, estilos de foco, media queries y contraste
calculado de los tokens). Lo que requiere navegador o tecnología asistiva está marcado **PENDIENTE**
para la persona de diseño sobre el preview de Vercel.

## Decisiones de accesibilidad del diseño

- Selector de día = lista de **links** con `aria-current="date"` dentro de un `nav` etiquetado; selector
  de horario = **radios nativos** en `fieldset`/`legend`. Operables con Tab y flechas sin ARIA custom.
- Estados nunca solo por color: seleccionado (radio marcado + borde 2px + fondo), día cerrado (texto
  «Cerrado» + borde punteado), día actual (borde 2px + negrita + `aria-current`), error (ícono ⚠ + texto
  + borde 2px), turno cancelado (tachado + badge «Cancelado»), bloqueado (rayado + «No disponible»),
  progreso («Paso N de 5» en texto).
- Errores: mensaje junto al campo (`aria-describedby`), `aria-invalid`, resumen con links arriba y foco
  al resumen; los datos se conservan.
- Cambios dinámicos: carga en `role="status"`, errores en `role="alert"`; tras confirmar/cancelar, el foco
  va al título del resultado.
- Doble envío: botón en estado `aria-disabled` con texto «Confirmando…».
- Autenticación del cliente sin pruebas cognitivas (código + celular, se puede pegar; 3.3.8).
- No se pide reingresar datos: al volver o ante «horario tomado» se conservan (3.3.7).

## Checklist WCAG 2.2 AA

| Criterio | Cómo lo cubre el diseño | Verificación | Resultado |
|---|---|---|---|
| 1.1.1 Contenido no textual | Íconos (⚠ ✓ ● !) con `aria-hidden` y texto al lado; sin imágenes | estática: grep de íconos | OK |
| 1.3.1 Info y relaciones | landmarks, `h1` único, `fieldset/legend`, `label for`, `dl`, tabla con `th scope` y `caption` | estática: script (1 `h1` por página, `label for` → `id` existente, `aria-describedby` → `id` existente, ids únicos, etiquetas balanceadas) en 35 páginas | OK |
| 1.3.2 Secuencia significativa | orden del DOM = orden visual; acción principal primero en el DOM (`row-reverse` en desktop) | estática: lectura del HTML | OK — revisar visualmente en preview |
| 1.3.5 Propósito de los campos | `autocomplete` name / tel / email | estática | OK |
| 1.4.1 Uso del color | ver «Decisiones» | estática: revisión de CSS y markup | OK |
| 1.4.3 Contraste mínimo | pares de tokens ≥ 4.5:1 (ver tabla en `design-system/README.md`, mín. texto 6.36:1) | calculado (fórmula WCAG) | OK |
| 1.4.4 Cambio de tamaño | tamaños en `rem`, sin alturas fijas en contenedores de texto | estática | PENDIENTE 200 % en preview |
| 1.4.10 Reflow | mobile-first, grillas `auto-fill`, `flex-wrap`; S2 tabla con scroll propio (excepción) | estática: media queries | PENDIENTE 320 px en preview |
| 1.4.11 Contraste no textual | bordes de control `color.border.strong` 4.83:1 / 4.47:1; foco 5.9–6.7:1; error 6.57:1 | calculado | OK |
| 1.4.12 Espaciado de texto | sin alturas fijas en texto; `min-height` en controles | estática | PENDIENTE override en preview |
| 1.4.13 Contenido en hover/foco | no hay tooltips ni popovers | estática | N/A |
| 2.1.1 Teclado | solo elementos nativos (`a`, `button`, `input`, `select`); sin `div` clicables | estática: grep | OK — PENDIENTE prueba real |
| 2.1.2 Sin trampas | sin modales en v0 | estática | OK |
| 2.4.1 Saltar bloques | skip link «Saltar al contenido» en todas las páginas | estática: grep (0 páginas sin skip link) | OK |
| 2.4.2 Título de página | `<title>` por pantalla y estado | estática | OK |
| 2.4.3 Orden del foco | sin `tabindex` positivo; `tabindex="-1"` solo en alertas/títulos que reciben foco | estática: grep | OK |
| 2.4.4 Propósito de links | «Cambiar» con texto oculto («Cambiar servicio»); celdas de S2 con nombre completo | estática | OK |
| 2.4.6 Encabezados y etiquetas | encabezados descriptivos, labels visibles | estática | OK |
| 2.4.7 Foco visible | `:focus-visible` 3px `color.focus.ring` + offset 2px; tarjetas con `:has(:focus-visible)` y anillo del radio como respaldo | estática: CSS, sin `outline: none` | OK — PENDIENTE en preview |
| 2.4.11 Foco no oculto | sin headers fijos ni overlays | estática | OK |
| 2.5.3 Nombre en la etiqueta | nombres accesibles empiezan con el texto visible | estática | OK |
| 2.5.7 Movimientos de arrastre | no hay arrastre (bloquear horario es formulario) | estática | N/A |
| 2.5.8 Tamaño del objetivo | controles ≥ 44px (`size.target.comfortable`); radios/checkbox 24px dentro de etiqueta ≥ 44px; links en texto exentos | estática: CSS | OK |
| 3.1.1 Idioma | `lang="es"` en todas las páginas | estática: grep | OK |
| 3.2.2 Al introducir datos | elegir radio/fecha no navega; cambio de día es un link explícito | estática | OK |
| 3.2.6 Ayuda consistente | teléfono de la peluquería: solo en P8 fuera de plazo | — | Revisar: ¿ayuda/contacto fijo en el pie? (pregunta) |
| 3.3.1 Identificación de errores | texto + ícono + `aria-invalid` + resumen | estática | OK |
| 3.3.2 Etiquetas o instrucciones | labels, hints con formato de ejemplo, opcionales marcados | estática | OK |
| 3.3.3 Sugerencias ante errores | mensajes con cómo corregir («Tiene que tener 10 números. Ej.: …») | estática | OK |
| 3.3.4 Prevención de errores | revisar antes de confirmar; confirmación para cancelar | flujo | OK |
| 3.3.7 Entrada redundante | datos conservados ante errores y al volver | spec | OK (a implementar) |
| 3.3.8 Autenticación accesible | código + celular, sin captcha ni test cognitivo; se permite pegar | spec | OK — Q1 si se agrega verificación por SMS (permitir pegar/autocompletar el código) |
| 4.1.2 Nombre, rol, valor | controles nativos; `aria-current`, `aria-invalid`, `aria-disabled` | estática | OK |
| 4.1.3 Mensajes de estado | `role="status"` (carga, confirmando, éxito staff) y `role="alert"` (errores) | estática | OK — PENDIENTE anuncio real con lector |

## Registro de verificación estática (hecho)

| Check | Cómo se verificó | Resultado |
|---|---|---|
| Links y `action` relativos resuelven a archivos existentes | script Python sobre 36 HTML (`prototypes/`) | OK, 0 rotos |
| Anclas internas (`#id`) existen | script | OK |
| Un `h1` por página | script | OK (36/36) |
| `label for`, `aria-describedby`, `aria-labelledby` apuntan a ids existentes; ids únicos | script | OK |
| Etiquetas HTML balanceadas | parser HTML de Python | OK |
| `lang="es"`, viewport, skip link y `main#main` en todas las páginas | grep | OK |
| Sin `tabindex` positivo | grep | OK |
| Sin recursos remotos, `@import` ni `<script>` | grep | OK (prototipo 100 % HTML/CSS, sin JS) |
| Sin colores sueltos en CSS/HTML del prototipo (solo variables de tokens) | grep de hex | OK |
| `:focus-visible` definido, sin `outline: none` que deje sin foco | lectura de CSS | OK |
| `prefers-reduced-motion` desactiva la animación del skeleton | lectura de CSS | OK |
| Contraste de pares de tokens | cálculo con fórmula de luminancia relativa WCAG | OK (tabla en `design-system/README.md`) |

## PENDIENTE — persona de diseño sobre el preview de Vercel

- [ ] Recorrer CU1–CU4 solo con teclado (Tab/Shift+Tab, flechas en radios, Enter/Espacio).
- [ ] Ver el foco en OptionCards (depende de `:has()`; respaldo: anillo del radio) y que `autofocus` en
      alertas y títulos de éxito mueva el foco como se espera.
- [ ] Reflow a 320 px y zoom 200 % (sin scroll horizontal salvo la tabla de S2).
- [ ] Override de espaciado de texto (1.4.12).
- [ ] Lector de pantalla (VoiceOver iOS + NVDA o TalkBack): anuncio de `role="status"`/`alert`,
      lectura de días con `aria-current`, grupo de horarios, resumen de errores.
- [ ] Objetivos táctiles en un celular real.

## Notas para implementación (Architect / Coder)

- En producto, el estado «cargando», los errores y los anuncios deben gestionarse con regiones vivas
  presentes en el DOM antes del cambio (en el prototipo son páginas estáticas).
- El foco tras navegar entre pasos debería ir al `h1` de cada paso.
- Para «horario tomado» se necesita detectar el conflicto al confirmar (Q10).
