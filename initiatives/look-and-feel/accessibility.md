# Accesibilidad — Look and feel (3 direcciones)

Contrastes **calculados** con la fórmula de luminancia relativa de WCAG 2.x sobre los valores resueltos de
`tokens-a-sereno.json`, `tokens-b-preciso.json` y `tokens-c-cercano.json` (script de cálculo fuera del repo; mismos
resultados que `LF.contrast()` en `prototypes/look-and-feel/lf.js`). Mínimos: 4.5:1 texto, 3:1 controles/foco (1.4.11).

## 1. Tokens de plataforma por dirección

| Par | Uso | Mín. | A Sereno | B Preciso | C Cercano |
|---|---|---|---|---|---|
| `text.default` / `surface.default` | texto | 4.5 | 14.74 | 18.25 | 16.65 |
| `text.default` / `surface.canvas` | texto sobre fondo de página | 4.5 | 13.42 | 17.00 | 15.63 |
| `text.muted` / `surface.default` | texto secundario | 4.5 | 7.30 | 7.73 | 8.20 |
| `text.muted` / `surface.canvas` | texto secundario | 4.5 | 6.64 | 7.20 | 7.70 |
| `text.muted` / `surface.sunken` | texto en zona hundida / deshabilitado | 4.5 | 5.87 | 6.35 | 6.90 |
| `text.on-action` / `action.primary` | texto de botón de la plataforma | 4.5 | 7.10 | 8.81 | 5.45 |
| `text.on-action` / `action.primary-hover` | botón en hover | 4.5 | 9.56 | 11.70 | 7.73 |
| `text.link` / `surface.default` | links | 4.5 | 7.10 | 8.81 | 5.45 |
| `text.link` / `surface.canvas` | links | 4.5 | 6.46 | 8.21 | 5.11 |
| `text.link` / `platform.accent-subtle` | acento sobre su tinte (nav activa, hero) | 4.5 | 6.16 | 7.75 | 4.84 |
| `text.selected` / `surface.selected` | opción seleccionada | 4.5 | 8.30 | 10.30 | 6.88 |
| `border.strong` / `surface.default` | borde de controles | 3 | 4.38 | 4.85 | 5.01 |
| `border.strong` / `surface.canvas` | borde de controles | 3 | 3.99 | 4.52 | 4.70 |
| `border.selected` / `surface.default` | borde de seleccionado | 3 | 7.10 | 8.81 | 5.45 |
| `focus.ring` / `surface.default` | foco | 3 | 6.60 | 6.70 | 6.70 |
| `focus.ring` / `surface.canvas` | foco | 3 | 6.01 | 6.24 | 6.29 |
| `focus.ring` / `surface.selected` | foco | 3 | 5.73 | 5.90 | 5.96 |
| `focus.ring` / `platform.accent-subtle` | foco sobre hero/nav activa | 3 | 5.73 | 5.90 | 5.96 |
| `feedback.danger.text` / `feedback.danger.bg` | error | 4.5 | 7.97 | 7.97 | 7.97 |
| `feedback.danger.border` / `surface.default` | borde de campo con error | 3 | 6.47 | 6.57 | 6.57 |
| `feedback.success.text` / `feedback.success.bg` | éxito | 4.5 | 7.26 | 7.26 | 7.26 |
| `feedback.warning.text` / `feedback.warning.bg` | advertencia | 4.5 | 9.05 | 9.05 | 9.05 |
| `feedback.info.text` / `feedback.info.bg` | información | 4.5 | 8.01 | 8.01 | 8.01 |
| `text.default` / `feedback.warning.bg` | texto en badge | 4.5 | 14.36 | 17.49 | 15.96 |

Todos los pares cumplen. El anillo de foco (`color.focus.ring` #1d4ed8, 3 px, offset 2 px) es común a las tres
direcciones y no lo puede cambiar el tenant; el offset hace que se dibuje sobre la superficie y no sobre el botón.

### Chrome oscuro de B (barra lateral del panel)

| Par | Uso | Mín. | Ratio |
|---|---|---|---|
| `chrome.text` / `chrome.bg` | ítems de navegación | 4.5 | 14.99 |
| `chrome.text-strong` / `chrome.item-active` | ítem activo | 4.5 | 13.77 |
| `chrome.text-strong` / `chrome.chip-bg` | nombre del negocio | 4.5 | 15.89 |
| `slate.200` / `chrome.bg` | etiqueta "provisorio" | 4.5 | 12.87 |
| `chrome.indicator` / `chrome.item-active` | marca del ítem activo | 3 | 6.30 |
| `chrome.focus-ring` / `chrome.bg` | foco sobre chrome | 3 | 8.74 |
| `chrome.focus-ring` / `chrome.item-active` | foco sobre ítem activo | 3 | 6.59 |
| `focus.ring` / `chrome.bg` | foco azul estándar (NO alcanza → por eso focus-ring propio) | 3 | 2.72 ❌ (no se usa) |

**Propuesta al design system:** si se elige B, hace falta `color.focus.ring-on-dark` (#8ab4ff) para superficies oscuras.

## 2. Capa tenant: derivación de `brand.*`

Reglas en el README (§Theming). Se calculan contra `surface.default` y `surface.canvas` de **cada dirección**; abajo, peor caso de las tres.
`on` = texto sobre `brand.solid`; `text` = links/texto de marca sobre fondos claros y sobre `brand.subtle`.

| Negocio | primary | solid | on | on/solid | on/hover | text | text/fondo (peor) | text/subtle | ¿Ajuste? |
|---|---|---|---|---|---|---|---|---|---|
| Esmalte Studio (uñas) | `#f7a8c8` | `#f7a8c8` | casi negro | 10.24 | 12.35 | `#8f6174` | 4.56 | 4.68 | texto oscurecido |
| Barbería Don Faro | `#f5c400` | `#f5c400` | casi negro | 11.49 | 13.23 | `#846a00` / `#896e00` | 4.56 | 4.59 | texto oscurecido |
| Pelos & Patas (canina) | `#3fb6e0` | `#3fb6e0` | casi negro | 8.07 | 10.45 | `#28748f` / `#2a7894` | 4.64 | 4.51 | texto oscurecido |
| Peluquería Nativa | `#6d2e8c` | `#6d2e8c` | blanco | 8.68 | 10.39 | `#6d2e8c` | 7.78 | 6.99 | no |
| Preset fucsia | `#d6337a` | `#d6337a` | blanco | 4.55 | 5.94 | `#bc2d6b` / `#c12e6e` | 5.04 | 4.57 | texto oscurecido |
| Preset negro | `#121212` | `#121212` | blanco | 18.73 | 19.17 | `#121212` | 16.79 | 14.34 | no |
| Preset verde | `#2fa36b` | `#2fa36b` | casi negro | 5.91 | 8.59 | `#23794f` / `#247c51` | 4.80 | 4.54 | texto oscurecido |
| Preset coral | `#e07a5f` | `#e07a5f` | casi negro | 6.40 | 9.02 | `#a15844` | 4.71 | 4.60 | texto oscurecido |
| Gris medio (caso extremo) | `#8a8a8a` | `#8a8a8a` | casi negro | 5.47 | 8.41 | `#6c6c6c` / `#6e6e6e` | 4.71 | 4.51 | texto oscurecido |
| Amarillo puro (caso extremo) | `#ffff00` | `#ffff00` | casi negro | 17.58 | 17.68 | `#707000` / `#757500` | 4.55 | 4.80 | texto oscurecido |

Ningún color de la tabla queda bajo 4.5:1 después de derivar. La barbería amarilla (#f5c400) y el rosa claro
de Esmalte Studio fuerzan el ajuste del texto de marca (links, check de seleccionado, borde de seleccionado) y disparan
la advertencia a la administradora. El relleno se oscurece solo cuando ni blanco ni casi negro llegan a 4.5:1
(colores medios, p. ej. #8a8a8a): con #111111 como "negro" eso casi nunca pasa.

**Límite conocido:** `brand.solid` claro (amarillo, rosa) tiene < 3:1 contra el fondo; no es requisito para un botón con
texto (el texto del botón es el que comunica, 1.4.11 no exige contraste del contorno de un botón identificable por su
etiqueta), pero el estado **seleccionado** nunca se apoya en `solid`: usa `brand.border` (= `brand.text`, ≥ 4.5:1) +
check + texto «Elegido». Los días elegidos usan `solid` como relleno con `on` como texto (≥ 4.5:1) y además están marcados
como `:checked` en un radio nativo.

## 3. Verificación en navegador (Playwright + axe-core, headless Chromium)

Corrido el 19/10/2026 sobre `file://` con Playwright (Chromium headless) + axe-core, reglas `wcag2a`, `wcag2aa`,
`wcag21a`, `wcag21aa`, `wcag22aa` y `best-practice`. Scripts fuera del repo (skill `prototype-browser-check`).

| Prueba | Alcance | Resultado |
|---|---|---|
| axe (0 violaciones) | `look-and-feel/index.html` a 360 y 1280 px × 3 direcciones × 4 negocios (24 corridas) + 320 px × 3 direcciones con Barbería Don Faro + `prototypes/index.html` a 320/360/1280 | **0 violaciones** en las 30 corridas |
| axe `color-contrast` | B + Don Faro a 1280 px | 226 nodos aprobados, 0 incompletos |
| Reflujo 1.4.10 (`scrollWidth ≤ ancho`) | mismas 30 corridas, incluye 320 px | **OK** en todas |
| Espaciado de texto 1.4.12 (line-height 1.5, letter-spacing .12em, word-spacing .16em, párrafos 2em) | mismas 30 corridas | **OK** en todas (sin desborde horizontal) |
| Recursos rotos / errores JS | mismas 30 corridas (`requestfailed` en fase de carga, `pageerror`) | 0 / 0 |
| Theming | B + Don Faro: `--brand-solid` #f5c400, `--brand-on` #111111, `--brand-text` #896e00, advertencia visible | OK |
| Interacción «Marca del negocio» | preset negro → «Tu color se lee bien»; fucsia → advertencia con #c12e6e (5,40:1); hex «rojo» → `aria-invalid` + error asociado; hex válido limpia el error; Guardar → éxito y el escenario toma el color guardado | OK; axe tras la interacción: 0 violaciones |
| Teclado | flecha derecha en el grupo de direcciones cambia de B a C | OK |

No reemplaza: lector de pantalla real, zoom 200 % real, Safari/iOS ni Android (PENDIENTES, ver §4).

## 4. Checklist WCAG 2.2 AA del prototipo

- [x] 1.3.1 Estructura: `header`/`main`, h1 → h2 por pantalla → h3/h4 dentro del marco; radios nativos agrupados en `fieldset`/`legend`; tabla de agenda con `caption` y `th scope`.
- [x] 1.4.1 Uso del color: seleccionado = borde + check + «Elegido»; ocupado = tachado + borde punteado + texto «ocupado»; estados de turno con texto e ícono; advertencias con ícono + título.
- [x] 1.4.3 / 1.4.11 Contraste: tablas 1 y 2; axe `color-contrast` sin violaciones en las 12 combinaciones dirección × negocio.
- [x] 1.4.10 Reflujo a 320 px y 1.4.12 espaciado de texto: medido (ver §3).
- [x] 2.1.1 Teclado: todo es nativo (radios, botones, links, inputs); flechas cambian dirección y negocio; la tabla con scroll horizontal es enfocable (`tabindex=0`, `role=region`).
- [x] 2.4.1 Saltar al escenario; 2.4.7 / 2.4.13 foco 3 px con offset 2 px, propio sobre el chrome oscuro de B.
- [x] 2.5.8 Objetivos ≥ 44 px en botones, opciones, horarios, días y presets de color; en B los controles del panel son de 40 px (≥ 24 px mínimo).
- [x] 3.3.1 / 3.3.3 Errores: email sin dominio y código de color inválido con `aria-invalid`, mensaje asociado por `aria-describedby`, ícono y cómo corregir.
- [x] 4.1.3 Mensajes de estado: advertencia de contraste y «Guardamos tu marca» en `role=status` con `aria-live=polite`; la ficha de la dirección se anuncia al cambiar.
- [ ] **PENDIENTE (persona de diseño, preview de Vercel):** lector de pantalla real (VoiceOver iOS / NVDA), zoom 200 % real, teclado en Safari, y cómo se ve `ui-rounded` / `ui-serif` en Android y Windows (caen a Nunito/Georgia o al sistema).
