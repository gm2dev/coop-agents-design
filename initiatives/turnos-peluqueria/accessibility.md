# Accesibilidad — Turnos para peluquería (ronda 1)

Objetivo: **WCAG 2.2 nivel AA**. Conteo único: **63 páginas HTML** = 61 pantallas/estados + el `index.html` de
`prototypes/turnos-peluqueria/` (62 en la carpeta) + `prototypes/index.html`. Las verificaciones de
navegador se hicieron con **Chromium headless (Playwright)** sobre las 62 páginas de la carpeta; las
estáticas, sobre las 63. Lo que requiere tecnología asistiva o dispositivo real queda **PENDIENTE**.

## Decisiones de accesibilidad del diseño

- Selector de día = lista de **links** con `aria-current="date"` dentro de un `nav` etiquetado; selector
  de horario = **radios nativos** en `fieldset`/`legend`.
- Estados nunca solo por color: seleccionado (radio marcado + borde grueso + fondo), día cerrado (texto
  «Cerrado» + borde punteado), día actual (borde grueso + negrita + `aria-current`), error (⚠ + texto +
  borde grueso), turno cancelado (tachado + Badge «✕ Cancelado»), bloqueado (rayado + Badge «⊘ No
  disponible»), horario tomado (Badge «⊘ No disponible» + «Elegí otro horario»), progreso en texto.
- **Todos los Badges llevan ícono + texto**; «Cancelado» es una sola variante neutra en cliente y staff.
- Errores: mensaje junto al campo, `aria-invalid` **y** `aria-describedby` que apunta al hint y al
  mensaje; resumen con links arriba y foco al resumen; los datos se conservan.
- Cambios dinámicos: carga en `role="status"`, errores en `role="alert"`; tras confirmar/cancelar/guardar,
  el foco va al título del resultado o al Alert de error.
- Doble envío: botón `aria-disabled` «Confirmando…» y **sin links para salir** («← Tus datos», «Cambiar»,
  «Volver») mientras se envía.
- Acciones destructivas: botón danger + paso de confirmación explícito (P9, S4 cancelar turnos, S6, S7
  quitar bloqueo) que dice qué se afecta y a quién se avisa (3.3.4).
- **Autenticación sin pruebas cognitivas (3.3.8)**: el cliente entra con el link del email (sin código ni
  contraseña); el staff, con link mágico por email (sin contraseña). Nada que memorizar ni transcribir.
- No se pide reingresar datos: al volver, ante «horario tomado» o error de red se conservan (3.3.7).
- **Ayuda consistente (3.2.6)**: pie «¿Necesitás ayuda?» con nombre de la peluquería, teléfono como texto
  + link `tel:` y dirección, en el **mismo lugar y orden en todas las pantallas del cliente** (verificado:
  presente en las 28 páginas del cliente (27 pantallas + el inicio)). P7 (link inválido) además ofrece «Llamar a la peluquería».

## Checklist WCAG 2.2 AA

| Criterio | Cómo lo cubre el diseño | Verificación | Resultado |
|---|---|---|---|
| 1.1.1 Contenido no textual | Íconos (⚠ ✓ ● ! ✕ ⊘) con `aria-hidden` y texto al lado; sin imágenes | estática | OK |
| 1.3.1 Info y relaciones | landmarks, `h1` único, `fieldset/legend`, `label for`, `dl`, tabla con `th scope` y `caption` | script en 63 páginas | OK |
| 1.3.2 Secuencia significativa | orden del DOM = orden visual; acción principal primero en el DOM | Tab real a 375 px | OK |
| 1.3.5 Propósito de los campos | `autocomplete` name / tel / email (cliente); `off` cuando el staff carga datos de otra persona | estática | OK |
| 1.4.1 Uso del color | ver «Decisiones» | estática | OK |
| 1.4.3 Contraste mínimo | pares de tokens ≥ 4.5:1 (tabla en `design-system/README.md`) | calculado | OK |
| 1.4.4 Cambio de tamaño | tamaños en `rem`; reflow a 640 px (= 200 % de 1280) sin desborde | Chromium 640 px | OK |
| 1.4.10 Reflow | 320 px sin scroll horizontal; S2 scrollea dentro de `.table-wrap` (`position: relative`) | Chromium 320 px | OK — 62/62 (S2: página 320 px, tabla 855 px dentro de un contenedor de 288 px) |
| 1.4.11 Contraste no textual | bordes `color.border.strong` 4.83 / 4.47 / 4.16 (sobre `surface.disabled`) :1; foco ≥ 5.9:1 | calculado | OK |
| 1.4.12 Espaciado de texto | `overflow-wrap: anywhere` en `main`, Alerts y resúmenes | Chromium 320/640 px con override (line-height 1.5, letter .12em, word .16em, párrafo 2em) | OK — 62/62, incluido `reprogramado.html` (antes +5 px) |
| 1.4.13 Contenido en hover/foco | sin tooltips ni popovers | estática | N/A |
| 2.1.1 Teclado | solo elementos nativos | Tab real a 375 px en 62 páginas (1070 paradas) | OK |
| 2.1.2 Sin trampas | sin modales; el recorrido de Tab vuelve al inicio en todas | Chromium | OK |
| 2.4.1 Saltar bloques | skip link en las 63 páginas | estática + 1.ª parada de Tab | OK |
| 2.4.2 Título de página | `<title>` por pantalla y estado | estática | OK |
| 2.4.3 Orden del foco | sin `tabindex` positivo; `tabindex="-1"` solo en alertas/títulos con foco | estática + Tab | OK |
| 2.4.4 Propósito de links | «Cambiar» con texto oculto; celdas de S2 con nombre completo | estática | OK |
| 2.4.6 Encabezados y etiquetas | encabezados descriptivos, labels visibles | estática | OK |
| 2.4.7 Foco visible | `:focus-visible` 3 px `color.focus.ring` + offset; inputs date/time con `:focus-within` | Chromium: anillo ≥ 2 px en cada parada de Tab | OK — 0 paradas sin anillo |
| 2.4.11 Foco no oculto | sin headers fijos ni overlays | Chromium: `elementFromPoint` en cada parada | OK — 0 ocultos |
| 2.5.3 Nombre en la etiqueta | nombres accesibles empiezan con el texto visible | estática | OK |
| 2.5.7 Movimientos de arrastre | no hay arrastre | estática | N/A |
| 2.5.8 Tamaño del objetivo | controles ≥ 44 px; radios dentro de etiqueta ≥ 44 px; links en texto exentos | Chromium 320 px: objetivos < 24 px fuera de texto | OK — solo los links de celda de S2 (12–16 px de ancho visible por el texto oculto; el objetivo real es la celda) — ver deuda |
| 3.1.1 Idioma | `lang="es"` | estática | OK |
| 3.2.2 Al introducir datos | elegir radio/fecha no navega; cambio de día es link explícito | estática | OK |
| 3.2.6 Ayuda consistente | **Decisión:** pie «¿Necesitás ayuda?» con nombre, teléfono (texto + `tel:`) y dirección, mismo lugar en todas las pantallas del cliente | script: 28/28 páginas del cliente con `footer.site-footer` idéntico | OK |
| 3.3.1 Identificación de errores | texto + ícono + `aria-invalid` + `aria-describedby` al mensaje + resumen | script: todo `aria-invalid` tiene `aria-describedby` válido | OK |
| 3.3.2 Etiquetas o instrucciones | labels, hints con ejemplo, opcionales marcados | estática | OK |
| 3.3.3 Sugerencias ante errores | mensajes con cómo corregir | estática | OK |
| 3.3.4 Prevención de errores | revisar antes de confirmar; confirmación de acciones destructivas | flujo | OK |
| 3.3.7 Entrada redundante | datos conservados ante errores, horario tomado y al volver | spec | OK (a implementar) |
| 3.3.8 Autenticación accesible | link por email (cliente y staff), sin contraseña, código ni captcha | spec | OK |
| 4.1.2 Nombre, rol, valor | controles nativos; `aria-current`, `aria-invalid`, `aria-disabled` | estática | OK |
| 4.1.3 Mensajes de estado | `role="status"` y `role="alert"` | estática | OK — PENDIENTE anuncio real con lector |

## Registro de verificación (ronda 1)

| Check | Cómo se verificó | Resultado |
|---|---|---|
| Links y `action` relativos resuelven | script Python sobre 63 HTML | OK, 0 rotos |
| Anclas internas (`#id`) existen | script | OK |
| Un `h1` por página | script | OK (63/63) |
| `label for`, `aria-describedby`, `aria-labelledby` → ids existentes; ids únicos | script | OK |
| Inputs de texto con `label` | script | OK |
| `aria-invalid` siempre con `aria-describedby` | script | OK |
| Etiquetas HTML balanceadas | parser HTML de Python | OK |
| `lang="es"`, viewport, skip link y `main#main` | script | OK (63/63) |
| Sin `tabindex` positivo, sin `<script>`, sin recursos remotos | script | OK |
| Sin colores hex en el prototipo de la iniciativa (solo variables) | grep | OK (`prototypes/index.html`, el índice general, tiene estilos propios) |
| Variables CSS usadas existen en `tokens.css` o en el bloque `--x-*` | `comm` entre usadas y definidas | OK, 0 faltantes |
| `tokens.css` = espejo de `tokens.json` | `node scripts/tokens-to-css.mjs --check` | OK (78 tokens) |
| Reflow 320 y 640 px, con y sin override de espaciado | Chromium headless (Playwright), `scrollWidth − clientWidth` + elementos fuera del viewport | OK, 0 desbordes en 62 páginas × 4 condiciones |
| Tab a 375 px: anillo visible y no oculto | Chromium, recorrido completo de Tab por página | OK, 0 sin anillo, 0 ocultos |
| Foco inicial (`autofocus`) en errores y éxitos | Chromium, `document.activeElement` al cargar | OK: 28 páginas de error/éxito con foco en el Alert o el `h1`; las demás empiezan en `body` |
| Todas las pantallas enlazadas desde `prototypes/turnos-peluqueria/index.html` | script | OK (61/61 pantallas) |
| Contraste de pares nuevos | fórmula WCAG | ver tabla en `design-system/README.md` |

## PENDIENTE — persona de diseño sobre el preview de Vercel

- [ ] Lector de pantalla (VoiceOver iOS + NVDA o TalkBack): anuncio de `role="status"`/`alert`, días con
      `aria-current`, grupo de horarios, resumen de errores, pie de ayuda.
- [ ] Zoom real del navegador al 200 % y 400 % (se verificó por viewport equivalente).
- [ ] Objetivos táctiles en un celular real.
- [ ] Foco en OptionCards en Safari (depende de `:has()`; respaldo: anillo del radio).

## Notas para implementación (Architect / Coder)

- Regiones vivas presentes en el DOM antes del cambio (en el prototipo son páginas estáticas).
- El foco tras navegar entre pasos debería ir al `h1` de cada paso.
- «Horario tomado»: se detecta al confirmar (no hay retención, Q10).
- Con «Todo el día» marcado en S4, deshabilitar Desde/Hasta (requiere JS).
- Los links de celda de S2 deberían ocupar la celda completa en producto (objetivo ≥ 24 px).
