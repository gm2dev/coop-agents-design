# Accesibilidad · spa-reservas-mvp (WCAG 2.2 AA)

Prototipo: `prototypes/spa-reservas-mvp/` (51 páginas HTML en v0.2). Verificación del 19/10/2026
(v0.2) con Playwright (Chromium headless) + axe-core 4.x, fuera del repo.

## Verificado (ejecutado, v0.2)

| Chequeo | Cómo | Resultado |
|---|---|---|
| axe (wcag2a/aa, wcag21a/aa, wcag22aa, best-practice) | 51 páginas a 320 px y a 1280 px (102 corridas) | **0 violaciones** |
| Reflow 1.4.10 | `scrollWidth <= ancho` en 51 páginas a 320, 360 y 1280 px | **0 desbordes** |
| Espaciado de texto 1.4.12 | line-height 1.5, letter-spacing .12em, word-spacing .16em, párrafos 2em; 320 y 360 px | **0 desbordes** |
| Recursos y links | parser de `href`/`src`/`action` (1144 referencias) + carga en navegador | 0 links rotos, 0 recursos remotos, 0 errores JS, 0 requests fallidos, 0 páginas sin estilos |
| Estilos inline | búsqueda de `style=` en 51 páginas | 0 (pasaron a `styles.css`) |
| **2.4.11 Focus Not Obscured** | Elementos `sticky`/`fixed` en las 51 páginas: solo `.summary-bar` de `c-reservar-servicios`. Tab por 16 paradas a 640×360, 320×256, 360×640, 320×568, 375×667 y 1280×900; % del elemento enfocado tapado por la barra | **0 % en todos los viewports** (v0.1: 100 % de s1/s4 a 640×360 y 320×256; 43–57 % a 360×640). A 640×360 y 320×256 la barra no se fija (`min-height: 30rem`); con la barra fija, `scroll-padding-bottom: 10rem` + ajuste en `focusin`. Alto medido de la barra: 101–125 px. Foco visible en 16/16 paradas |
| Validación y foco | Enviar `r-cargar-error` | Un solo resumen «Revisá estos datos» visible antes y después de enviar (v0.1: dos); recibe el foco; no navega |
| Recepción clienta existente / nueva | `r-cargar-turno`: estado inicial y cambio a «Clienta nueva» | Inicial: WhatsApp `11 5555 0142`, «Encontramos a Lucía Gómez» visible, datos de nueva ocultos. Con «Clienta nueva»: «Encontramos…» oculto, nombre visible |
| Marca (DD-05) | `a-marca`: botones de prueba y `getComputedStyle('#preview .btn').backgroundColor` / link | `#8a2b6a` → botón y link `rgb(138,43,106)` ✓. `#e88fb4` (2,33/2,15) → botón y link `rgb(14,107,99)` = `#0e6b63` del sistema, franja `#e88fb4`, aviso. `#767676` (4,54/4,20) → `#0e6b63`, aviso. `#d81b60` (4,95/4,57) → **pasa la regla** y se aplica (ver README P-11) |
| Reenvío de código | `c-codigo` al cargar y a los 2 s | Botón `disabled`, «Podés pedir otro en 45 s» → «43 s»; se habilita en 0 |
| Cancelar campaña | `a-campana-enviada` | «Cancelar envío» abre confirmación (`aria-expanded=true`, foco al título); «No, mantener» cierra y devuelve el foco al botón; «Sí» navega a `a-campana-cancelada` con mensaje de éxito |
| CTA en pliegue | `c-reservar-servicios` a 360×640 | Barra fija con «Continuar» visible (sigue fija en pantallas ≥ 480 px de alto) |

## Contraste (calculado)

Pares del design system: ver `design-system/README.md` (todos ≥ 4,5:1 texto y ≥ 3:1 no texto).
Pares nuevos por la capa tenant (color de ejemplo `#8a2b6a`):

| Par | Ratio | Mínimo |
|---|---|---|
| text.on-action / marca (botón) | 7,97:1 | 4,5 |
| text.on-action / hover derivado `#6e2255` (canal × 0,8) | 10,38:1 | 4,5 |
| marca como link / surface.default | 7,97:1 | 4,5 |
| marca como link / surface.subtle | 7,37:1 | 4,5 |
| marca como border.selected / surface.selected (del sistema, DD-10) | 7,06:1 | 3 |
| focus.ring / surface.selected | 5,93:1 | 3 |
| Rechazado: `#e88fb4` blanco / surface.subtle | 2,33 / 2,15 | → solo franja |
| Rechazado: `#767676` blanco / surface.subtle | 4,54 / 4,20 | → solo franja |
| Caso límite: `#d81b60` blanco / surface.subtle | 4,95 / 4,57 | → **se aplica** (pasa la regla; P-11) |

**Regla tenant (DD-05, decisión CDO):** el color del spa reemplaza `action.primary` / `text.link` /
`border.selected` solo si da ≥ 4,5:1 contra blanco (`text.on-action`) **y** contra `surface.subtle`
(#f5f6f8), lo que equivale a ≥ 4,87:1 contra blanco. Si no, se usa únicamente en la franja superior
(decorativa) y el resto queda con los valores del sistema. El foco nunca usa el color del spa.
`surface.selected` y `text.selected` no se derivan del spa (DD-10).

## Criterios aplicados en el diseño

- HTML semántico: un `h1`, `header`/`nav`/`main`/`aside`, listas, `fieldset`+`legend`, `table` con
  `caption` y `th scope`; tablas apiladas en mobile con etiqueta visible por celda.
- Controles nativos (`input` radio/checkbox, `select`, `button`, `a`) con `label`; tarjetas
  seleccionables sobre inputs reales.
- Estado nunca solo por color: ✓ en día/horario elegido, cuadro/círculo relleno, borde 2 px, «completo»
  en texto + tachado, badges con texto, íconos ✓ ✕ ⚠ + título textual.
- Objetivos ≥ 44 px en botones, links de navegación y opciones (24 px mínimo en la navegación del
  prototipo).
- `autocomplete` (`tel-national`, `one-time-code`), `inputmode` numérico, 16 px en inputs.
- Mensajes: `role=status` (éxito, sin horarios), `role=alert` (errores), `aria-live=polite` en el total
  de la reserva y en el chequeo de contraste.
- Links repetidos con contexto oculto («Cancelar turno del sábado 28/11», «Editar Carla»).
- `prefers-reduced-motion` respetado (no hay animaciones).
- 3.3.7 Redundant Entry: servicios elegidos se conservan al volver o tras «se ocupó el horario» y tras
  cancelar; «te toca volver» precarga lo último.
- 3.3.8 Accessible Authentication: el código se puede pegar/autocompletar (`one-time-code`), sin
  ejercicio cognitivo. Sin intentos: pantalla con la espera explícita y salida (`c-codigo-bloqueado`).
- 2.2.1 Timing Adjustable: la única espera (reenvío a los 45 s) no corta ninguna tarea; el texto
  asociado al botón dice cuánto falta.
- 2.4.11 Focus Not Obscured: barra de resumen fija solo con alto ≥ 30rem, `scroll-padding-bottom` y
  ajuste de scroll al enfocar.

## PENDIENTE (persona de diseño, sobre el preview de Vercel)

- Navegación completa con teclado real en todas las páginas (en headless: Tab completo en
  `c-reservar-servicios` en 6 viewports, y flujos de `a-campana-enviada` y `c-codigo`).
- 2.4.11 con zoom real al 200 %/400 % y teclado virtual de iOS/Android en `c-reservar-servicios`.
- Lector de pantalla (VoiceOver iOS / TalkBack Android / NVDA): anuncios de `role=status/alert`,
  total en vivo, tarjetas seleccionables, tablas apiladas.
- Zoom al 200 % y 400 % reales en navegador de escritorio (headless no reemplaza el zoom).
- Selectores nativos de fecha/hora en iOS y Android a 320 px.
- Revisión con un color de marca real de cada spa del piloto.
