# Accesibilidad · spa-reservas-mvp (WCAG 2.2 AA)

Prototipo: `prototypes/spa-reservas-mvp/` (47 páginas HTML). Verificación del 19/10/2026 con
Playwright (Chromium headless) + axe-core, fuera del repo.

## Verificado (ejecutado)

| Chequeo | Cómo | Resultado |
|---|---|---|
| axe (wcag2a/aa, wcag21a/aa, wcag22aa, best-practice) | 47 páginas a 320 px y a 1280 px | **0 violaciones** |
| Reflow 1.4.10 | `scrollWidth <= ancho` en 47 páginas a 320, 360 y 1280 px | **0 desbordes** |
| Espaciado de texto 1.4.12 | line-height 1.5, letter-spacing .12em, word-spacing .16em, párrafos 2em; 320 y 360 px | 0 desbordes (se corrigieron 2: tarjetas seleccionables con precio en `c-pack` y `c-reservar-servicios`) |
| Recursos | `requestfailed` en carga + parser de `href`/`src`/`action` | 0 links rotos, 0 recursos remotos, 0 errores JS |
| Validación y foco | Enviar vacío `c-ingresar`, `c-reservar-servicios`, `r-cargar-turno` | Resumen de errores visible y enfocado, `aria-invalid`, error por campo; no navega |
| Teclado (headless) | Tab en `c-reservar-servicios`, `c-reservar-confirmar`, `a-marca`; Space en checkbox | Orden: saltar al contenido → marca → navegación → volver → controles → CTA; foco visible en todos; Space marca y actualiza el total |
| JS de estados | Recepción «clienta nueva», marca con color de bajo contraste | Muestra/oculta datos; aviso de contraste 2,33:1 con salida |
| CTA en pliegue | `c-reservar-servicios` a 360×640 | Botón «Continuar» fijo visible (borde inferior a 628 px) |

## Contraste (calculado)

Pares del design system: ver `design-system/README.md` (todos ≥ 4,5:1 texto y ≥ 3:1 no texto).
Pares nuevos por la capa tenant (color de ejemplo `#8a2b6a`):

| Par | Ratio | Mínimo |
|---|---|---|
| text.on-action / marca (botón) | 7,97:1 | 4,5 |
| text.on-action / hover derivado `#6e2255` | 10,38:1 | 4,5 |
| marca como link / surface.default | 7,97:1 | 4,5 |
| marca como link / surface.subtle | 7,37:1 | 4,5 |
| marca como border.selected / surface.selected | 7,06:1 | 3 |
| focus.ring / surface.selected | 5,93:1 | 3 |
| Ejemplo rechazado: blanco / `#e88fb4` | 2,33:1 | → solo franja |

**Regla tenant:** el color del spa reemplaza `action.primary`/`text.link`/`border.selected` solo si
da ≥ 4,5:1 contra blanco (`text.on-action`) y contra `surface.default`. Si no, se usa únicamente en la
franja superior (decorativa) y el resto queda con los valores del sistema. El foco nunca usa el color
del spa.

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
  ejercicio cognitivo.

## PENDIENTE (persona de diseño, sobre el preview de Vercel)

- Navegación completa con teclado real en todas las páginas (en headless se recorrieron 3).
- Lector de pantalla (VoiceOver iOS / TalkBack Android / NVDA): anuncios de `role=status/alert`,
  total en vivo, tarjetas seleccionables, tablas apiladas.
- Zoom al 200 % y 400 % reales en navegador de escritorio (headless no reemplaza el zoom).
- Selectores nativos de fecha/hora en iOS y Android a 320 px.
- Revisión con un color de marca real de cada spa del piloto.
