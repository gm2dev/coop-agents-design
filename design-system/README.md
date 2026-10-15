# Design system

Estado: base v0 · Dueño: CDO

## Tokens

[`tokens.json`](tokens.json) sigue el formato W3C Design Tokens (`$value`, `$type`) en dos niveles:

- **Primitivos** (`color.neutral.*`, `color.teal.*`, …): valores crudos. No se usan directo en specs.
- **Semánticos** (`color.text.*`, `color.surface.*`, `color.border.*`, `color.action.*`,
  `color.feedback.*`, `color.focus.*`): propósito. Son los que usan specs y prototipos.

Además: `font.*` (familia, tamaños, pesos, interlineado), `space.*` (escala de 4 px), `radius.*`,
`size.target.*` (objetivos táctiles), `focus.*` (anillo de foco) y `breakpoint.*`.

## Contraste (WCAG 2.2 AA, calculado)

| Par | Ratio | Uso | Mínimo |
|---|---|---|---|
| text.default / surface.default | 16.88:1 | texto | 4.5 |
| text.default / surface.subtle | 15.61:1 | texto | 4.5 |
| text.muted / surface.default | 7.56:1 | texto secundario | 4.5 |
| text.muted / surface.subtle | 6.99:1 | texto secundario | 4.5 |
| text.on-action / action.primary | 6.36:1 | texto de botón | 4.5 |
| action.primary / surface.default | 6.36:1 | links, borde de botón secundario | 4.5 |
| border.strong / surface.default | 4.83:1 | borde de inputs y controles | 3 |
| border.strong / surface.subtle | 4.47:1 | borde de inputs y controles | 3 |
| focus.ring / surface.default | 6.70:1 | indicador de foco | 3 |
| focus.ring / surface.subtle | 6.20:1 | indicador de foco | 3 |
| focus.ring / surface.selected | 5.93:1 | indicador de foco | 3 |
| text.selected / surface.selected | 8.00:1 | opción seleccionada | 4.5 |
| feedback.danger.text / feedback.danger.bg | 7.97:1 | error | 4.5 |
| feedback.danger.border / surface.default | 6.57:1 | borde de campo con error | 3 |
| feedback.success.text / feedback.success.bg | 7.26:1 | éxito | 4.5 |
| feedback.warning.text / feedback.warning.bg | 9.05:1 | advertencia | 4.5 |
| feedback.info.text / feedback.info.bg | 8.01:1 | información | 4.5 |
| text.muted / surface.disabled | 6.51:1 | control deshabilitado | (exento) |

El anillo de foco usa `focus.offset` (2 px) para dibujarse sobre la superficie y no sobre el botón
primario (focus.ring / action.primary sería 1.05:1).

## Reglas

- El estado (error, éxito, seleccionado, no disponible) nunca se comunica solo con color: siempre va
  acompañado de texto, ícono con nombre accesible o cambio de forma (borde, tachado, check).
- Objetivos táctiles: mínimo `size.target.min` (24 px), recomendado `size.target.comfortable` (44 px).
- Tipografía del sistema (sin fuentes remotas).
- Color, tipografía, espaciado, radios, objetivos táctiles y foco salen **siempre** de tokens. Los
  valores **estructurales** que todavía no tienen token (anchos de borde, alturas de progreso, anchos
  máximos de layout, mínimos de grilla, duraciones de animación) se agrupan como variables locales al
  inicio del CSS del prototipo y se documentan como **propuesta** de token (`border.width.*`,
  `layout.*`, `motion.*`) pendiente de aprobación; no se agregan a `tokens.json` sin decisión del CDO.
- `prototypes/shared/tokens.css` es un espejo generado de `tokens.json` (ruta del token unida por
  guiones: `color.feedback.danger.text` → `--color-feedback-danger-text`): regenerar con
  `node scripts/tokens-to-css.mjs` y comprobar con `--check`; no editar a mano.

## Proponer cambios

Un valor que no existe se propone como token nuevo (propósito, valor y contraste calculado) en la
documentación de la iniciativa. Lo decide el CDO y se incorpora en un PR propio.
