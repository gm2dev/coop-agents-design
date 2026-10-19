# Design system

Estado: **v1 «Sereno»** · Dueño: CDO · Decisión: dirección **A · Sereno** del look and feel, elegida por Fidel Cossio
(19/10/2026) y aprobada por el CDO ([`initiatives/look-and-feel/README.md`](../initiatives/look-and-feel/README.md)).

Personalidad: calma y cuidado. Neutros cálidos de piedra y crema, mucho aire, radios grandes (8/14/22 px), sombras
suaves, bordes casi invisibles, títulos en serif del sistema, íconos de trazo fino (1,5) y acento **verde salvia
profundo `#3d5e4f`**. Tono: frases completas, sin exclamaciones.

## Archivos

| Archivo | Qué es |
|---|---|
| [`tokens.json`](tokens.json) | Fuente de verdad. W3C Design Tokens (`$value`, `$type`, `$description`, `$extensions`). |
| [`tokens.css`](tokens.css) | **Generado** desde `tokens.json` (no se edita a mano). Variables `--<ruta-del-token>` en `:root` + media query de densidad táctil. Los prototipos nuevos pueden enlazarlo. |
| [`tools/tokens.py`](tools/tokens.py) | Script sin dependencias: `check` (JSON, referencias, capa tenant, 44 px táctiles y **todos** los contrastes; sale con código 1 si algo falla), `table` (tablas de abajo) y `css` (regenera `tokens.css`). |

Después de cambiar `tokens.json`: `python3 design-system/tools/tokens.py check && python3 design-system/tools/tokens.py css`.

## Tokens: tres capas

1. **Primitivos** (`color.stone.*`, `color.sage.*`, `color.red/green/amber/blue.*`): valores crudos. No se usan
   directo en specs ni prototipos.
2. **Semánticos** (lo que usan specs y prototipos):
   - Color: `color.text.*`, `color.surface.*`, `color.border.*`, `color.action.*`, `color.feedback.*`,
     `color.focus.*`, `color.platform.*` (acento propio de la plataforma) y `color.sidebar.*` (barra lateral del panel).
   - `font.*` (familias base/heading/numeric, tamaños `050`–`600` y `label`, pesos, interlineado, `tracking`, `case`),
     `space.*` (escala de 4 px hasta `800`), `radius.*` (`sm/md/lg/pill` + `control`, `button`), `border.*`
     (anchos), `shadow.*`, `density.*`, `icon.*`, `link.*`, `size.*` (objetivos, contenido, barra lateral, logos,
     muestra de color), `focus.*`, `breakpoint.*` y `component.*` (valores propios de componentes).
3. **Tenant** (grupo `brand`): ver [§Marca del tenant](#marca-del-tenant-white-label).

`$extensions["com.coop-agents.tenant"].overridable` marca qué puede sobreescribir el negocio: **solo**
`brand.primary`, `brand.logo` y `brand.name` (el script lo valida). Neutros, feedback, foco, tipografía, espaciado y
radios son de la plataforma.

### Compatibilidad con la base v0

Todos los nombres de v0 siguen existiendo con valores Sereno (78 de 78), así que los prototipos que los usan no se rompen:

- **Semánticos de v0 sin cambio de nombre:** `color.text.*`, `color.surface.*`, `color.border.*`, `color.action.*`,
  `color.feedback.*`, `color.focus.ring`, `font.*`, `space.*`, `radius.*`, `size.target.*`, `size.content.max`,
  `focus.*`, `breakpoint.*`. Cambian sus **valores** (ver abajo).
- **Alias documentados (`$deprecated`):** los primitivos de v0 se renombraron. `color.neutral.{0,50,100,500,600,900}`
  → `color.stone.*` y `color.teal.{50,600,700}` → `color.sage.*`. Se mantienen como referencias; no usarlos en diseño
  nuevo.
- **`color.surface.subtle`** queda como alias de `color.surface.canvas` (fondo de página), mismo valor `#f6f2eb`.
- **`icon.size`** de la propuesta A pasa a `icon.size.md` (22 px) con `sm` (16) y `lg` (28).

Cambios de valor que se notan en prototipos existentes: blanco puro → crema `#fffdf9` en `surface.default`; teal
`#0e6b63` → salvia `#3d5e4f` en acción y links; radios 4/8/12 → 8/14/22; `font.size.400/500` 22/28 → 24/32 px;
interlineado 1.25/1.5 → 1.2/1.6; `border.default` `#eceef2` → `#ddd4c5`.

### Tokens nuevos respecto de v0

| Grupo | Tokens |
|---|---|
| Color | `surface.canvas`, `surface.sunken`, `text.link-hover`, `action.danger-hover`, `platform.accent/-strong/-subtle`, `sidebar.*` (13), primitivos `stone.200`, `sage.100` |
| Tenant | `brand.primary`, `solid`, `on-primary`, `primary-hover`, `text`, `text-hover`, `subtle`, `border`, `logo`, `name` |
| Tipografía | `font.family.heading` (serif del sistema), `font.family.numeric`, `font.size.050/075/600/label`, `font.weight.heading/kpi/hero`, `font.tracking.heading/label/caps`, `font.case.label` |
| Forma | `space.800`, `radius.control`, `radius.button`, `border.width` (1), `border.width-strong` (2), `border.width-accent` (4), `shadow.card`, `shadow.raised` |
| Densidad | `density.control-height` (48), `row-height` (56), `card-padding`, `section-gap`, `control-height-touch`, `row-height-touch`, `target-touch` (44) |
| Íconos | `icon.stroke-width` (1.5), `linecap`, `linejoin`, `size.sm/md/lg` (16/22/28), `style` |
| Links | `link.underline-offset` (3 px), `underline-thickness` (1), `underline-thickness-hover` (2) |
| Tamaños | `size.sidebar.width` (220 px), `size.logo.wordmark` (28), `wordmark-sm` (16), `header` (40), `preview` (56), `upload-box` (64), `size.swatch` (24) |
| Componentes | `component.client.*`, `panel.*`, `kpi.*`, `card.*`, `nav.*`, `badge.*`, `day.radius`, `day.min-width` (56 px), `slot.min-width` (5.5rem), `preset.border-width`, `notice.border-width`, `swatch.size`, `sidebar.width`, `hero.*` |

## Contraste (WCAG 2.2 AA, calculado)

Calculado con `python3 design-system/tools/tokens.py table` (luminancia relativa WCAG 2.x, ratio **truncado** a 2
decimales) sobre los valores resueltos de `tokens.json`. Mínimos: 4.5 texto; 3 bordes de controles, foco y estados
(1.4.11). **57 pares, todos cumplen**; peor par de texto 5.86:1 (`text.muted` sobre `surface.sunken`/`disabled`);
peor par no textual 3.52:1 (`border.strong` sobre `surface.sunken`).

| Par | Colores | Ratio | Uso | Mín. |
|---|---|---|---|---|
| `text.default` / `surface.default` | #2b2621 / #fffdf9 | 14.74:1 | texto | 4.5 |
| `text.default` / `surface.subtle` | #2b2621 / #f6f2eb | 13.42:1 | texto sobre fondo de página (= canvas) | 4.5 |
| `text.default` / `surface.sunken` | #2b2621 / #ebe4d8 | 11.85:1 | texto en zona hundida / chip neutro | 4.5 |
| `text.default` / `surface.selected` | #2b2621 / #e8efe9 | 12.80:1 | texto en opción seleccionada | 4.5 |
| `text.muted` / `surface.default` | #5d544a / #fffdf9 | 7.29:1 | texto secundario | 4.5 |
| `text.muted` / `surface.subtle` | #5d544a / #f6f2eb | 6.64:1 | texto secundario | 4.5 |
| `text.muted` / `surface.sunken` | #5d544a / #ebe4d8 | 5.86:1 | texto secundario en zona hundida | 4.5 |
| `text.muted` / `surface.disabled` | #5d544a / #ebe4d8 | 5.86:1 | control deshabilitado (exento 1.4.3, se mantiene ≥ 4.5) | 4.5 |
| `text.on-action` / `action.primary` | #fffdf9 / #3d5e4f | 7.09:1 | texto de botón primario | 4.5 |
| `text.on-action` / `action.primary-hover` | #fffdf9 / #2e4a3d | 9.55:1 | botón primario en hover | 4.5 |
| `text.on-action` / `action.danger` | #fffdf9 / #b42318 | 6.47:1 | botón destructivo | 4.5 |
| `text.on-action` / `action.danger-hover` | #fffdf9 / #912018 | 8.52:1 | botón destructivo en hover | 4.5 |
| `text.link` / `surface.default` | #3d5e4f / #fffdf9 | 7.09:1 | links | 4.5 |
| `text.link` / `surface.subtle` | #3d5e4f / #f6f2eb | 6.46:1 | links sobre fondo de página | 4.5 |
| `text.link` / `platform.accent-subtle` | #3d5e4f / #e8efe9 | 6.16:1 | acento sobre su tinte (nav activa, hero) | 4.5 |
| `text.link-hover` / `surface.default` | #2e4a3d / #fffdf9 | 9.55:1 | link en hover | 4.5 |
| `text.link-hover` / `surface.subtle` | #2e4a3d / #f6f2eb | 8.70:1 | link en hover | 4.5 |
| `text.selected` / `surface.selected` | #2e4a3d / #e8efe9 | 8.30:1 | opción seleccionada | 4.5 |
| `action.primary` / `surface.default` | #3d5e4f / #fffdf9 | 7.09:1 | borde/texto de botón secundario | 4.5 |
| `action.primary` / `surface.subtle` | #3d5e4f / #f6f2eb | 6.46:1 | borde/texto de botón secundario | 4.5 |
| `border.strong` / `surface.default` | #80766a / #fffdf9 | 4.38:1 | borde de inputs y controles | 3 |
| `border.strong` / `surface.subtle` | #80766a / #f6f2eb | 3.98:1 | borde de inputs y controles | 3 |
| `border.strong` / `surface.sunken` | #80766a / #ebe4d8 | 3.52:1 | borde de controles en zona hundida | 3 |
| `border.selected` / `surface.default` | #3d5e4f / #fffdf9 | 7.09:1 | borde de seleccionado | 3 |
| `border.selected` / `surface.selected` | #3d5e4f / #e8efe9 | 6.16:1 | borde de seleccionado sobre su fondo | 3 |
| `focus.ring` / `surface.default` | #1d4ed8 / #fffdf9 | 6.59:1 | indicador de foco | 3 |
| `focus.ring` / `surface.subtle` | #1d4ed8 / #f6f2eb | 6.00:1 | indicador de foco | 3 |
| `focus.ring` / `surface.sunken` | #1d4ed8 / #ebe4d8 | 5.30:1 | indicador de foco | 3 |
| `focus.ring` / `surface.selected` | #1d4ed8 / #e8efe9 | 5.72:1 | indicador de foco | 3 |
| `focus.ring` / `platform.accent-subtle` | #1d4ed8 / #e8efe9 | 5.72:1 | foco sobre hero / nav activa | 3 |
| `feedback.danger.text` / `feedback.danger.bg` | #912018 / #fef3f2 | 7.96:1 | error | 4.5 |
| `feedback.danger.border` / `surface.default` | #b42318 / #fffdf9 | 6.47:1 | borde de campo con error | 3 |
| `feedback.danger.border` / `feedback.danger.bg` | #b42318 / #fef3f2 | 6.04:1 | borde de aviso de error | 3 |
| `feedback.success.text` / `feedback.success.bg` | #05603a / #ecfdf3 | 7.26:1 | éxito | 4.5 |
| `feedback.success.border` / `feedback.success.bg` | #05603a / #ecfdf3 | 7.26:1 | borde de aviso de éxito | 3 |
| `feedback.warning.text` / `feedback.warning.bg` | #7a2e0e / #fffaeb | 9.04:1 | advertencia | 4.5 |
| `feedback.warning.border` / `feedback.warning.bg` | #7a2e0e / #fffaeb | 9.04:1 | borde de aviso de advertencia | 3 |
| `feedback.info.text` / `feedback.info.bg` | #1e40af / #eff6ff | 8.01:1 | información | 4.5 |
| `feedback.info.border` / `feedback.info.bg` | #1e40af / #eff6ff | 8.01:1 | borde de aviso de información | 3 |
| `text.default` / `feedback.warning.bg` | #2b2621 / #fffaeb | 14.35:1 | texto en badge de aviso | 4.5 |
| `sidebar.text` / `sidebar.bg` | #2b2621 / #fffdf9 | 14.74:1 | ítems de la barra lateral | 4.5 |
| `sidebar.muted` / `sidebar.bg` | #5d544a / #fffdf9 | 7.29:1 | texto secundario de la barra lateral | 4.5 |
| `sidebar.text` / `sidebar.item-hover` | #2b2621 / #f6f2eb | 13.42:1 | ítem en hover | 4.5 |
| `sidebar.item-active-text` / `sidebar.item-active-bg` | #2e4a3d / #e8efe9 | 8.30:1 | ítem activo | 4.5 |
| `sidebar.indicator` / `sidebar.item-active-bg` | #3d5e4f / #e8efe9 | 6.16:1 | marca del ítem activo | 3 |
| `sidebar.chip-text` / `sidebar.chip-bg` | #2b2621 / #f6f2eb | 13.42:1 | chip del negocio | 4.5 |
| `sidebar.tag-border` / `sidebar.bg` | #80766a / #fffdf9 | 4.38:1 | borde de etiqueta «provisorio» | 3 |
| `sidebar.focus-ring` / `sidebar.bg` | #1d4ed8 / #fffdf9 | 6.59:1 | foco en la barra lateral | 3 |
| `sidebar.focus-ring` / `sidebar.item-active-bg` | #1d4ed8 / #e8efe9 | 5.72:1 | foco en ítem activo | 3 |
| `brand.on-primary` / `brand.solid` | #fffdf9 / #3d5e4f | 7.09:1 | texto sobre marca (default) | 4.5 |
| `brand.on-primary` / `brand.primary-hover` | #fffdf9 / #2e4a3d | 9.55:1 | botón de marca en hover (default) | 4.5 |
| `brand.text` / `surface.default` | #3d5e4f / #fffdf9 | 7.09:1 | link de marca (default) | 4.5 |
| `brand.text` / `surface.subtle` | #3d5e4f / #f6f2eb | 6.46:1 | link de marca (default) | 4.5 |
| `brand.text` / `brand.subtle` | #3d5e4f / #e8efe9 | 6.16:1 | check «elegido» (default) | 4.5 |
| `brand.text-hover` / `surface.default` | #2e4a3d / #fffdf9 | 9.55:1 | link de marca en hover (default) | 4.5 |
| `brand.text-hover` / `surface.subtle` | #2e4a3d / #f6f2eb | 8.70:1 | link de marca en hover (default) | 4.5 |
| `brand.border` / `surface.default` | #3d5e4f / #fffdf9 | 7.09:1 | borde de seleccionado de marca (default) | 3 |

El anillo de foco usa `focus.offset` (2 px) para dibujarse sobre la superficie y no sobre el botón primario.
`border.default` (`#ddd4c5`) es solo decorativo (divisores, tarjetas): no delimita controles.

## Marca del tenant (white-label)

El negocio define **un color** (`brand.primary`), su logo y su nombre. Todo lo demás se **deriva** al guardar (en el
servidor, cacheado por tenant); el prototipo de look and feel lo demuestra en `prototypes/look-and-feel/lf.js` y
`tools/tokens.py` (`derive_brand`) es la implementación de referencia que valida el script.

Constantes: blanco `#ffffff`, casi negro `#111111`. «Mezclar con X al k %» = interpolación lineal en sRGB.
**Superficies donde aparece la marca:** `color.surface.default` (`#fffdf9`), `color.surface.subtle`/`canvas`
(`#f6f2eb`) y `brand.subtle`. La derivación se calcula contra **todas**, no solo contra blanco.

| Token | Regla | Garantía verificable |
|---|---|---|
| `brand.on-primary` | El de mayor contraste con `primary` entre blanco y casi negro | ≥ 4.5:1 sobre `brand.solid` |
| `brand.solid` | = `primary` si `on-primary` llega a 4.5:1; si no, `primary` mezclado con negro en pasos de 2 % hasta ≥ 4.5:1 con blanco (y `on-primary` = blanco) | Relleno de botones; nunca indica «seleccionado» |
| `brand.primary-hover` | `on` blanco → `solid` + 15 % negro; `on` casi negro → `solid` + 30 % blanco | Siempre **aumenta** el contraste con `on-primary` (el script falla si baja) |
| `brand.subtle` | 12 % `primary` + 88 % `surface.default` | Fondo de seleccionado y tintes |
| `brand.text` | `primary` mezclado con negro en pasos de 2 % hasta ≥ 4.5:1 contra `surface.default`, `surface.subtle` **y** `brand.subtle` | Links y texto de marca, check «elegido» |
| `brand.text-hover` | `brand.text` + 15 % negro | Más oscuro que `brand.text` ⇒ ≥ 4.5:1 en las mismas superficies; el hover además engrosa el subrayado (`link.underline-thickness-hover`), no depende solo del color |
| `brand.border` | = `brand.text` | Borde de seleccionado ≥ 3:1 (de hecho ≥ 4.5:1) |

- **Ajuste automático + aviso:** si `solid` o `text` tuvieron que oscurecerse, «Marca del negocio» muestra a la
  administradora un aviso (`role=status`) con qué se ajustó, el valor resultante y su contraste, y sugiere un tono más
  oscuro. El color original se conserva en el logo y en `brand.subtle`. Nunca se bloquea el guardado.
- **Del sistema, no de la marca (v1):** `color.surface.selected` y `color.text.selected` (y `border.selected`) son de la
  plataforma y no se derivan del tenant en esta versión. Dentro del área del tenant (web de la clienta), el seleccionado
  usa `brand.subtle` + `brand.border` + doble trazo + «✓ elegido».
- El tenant nunca cambia foco, feedback, neutros, tipografía, espaciado ni radios.
- **Dónde manda cada marca:** web de la clienta = marca del negocio (con pie «Reservas con …»); login/landing y
  chrome del panel = plataforma (el negocio aparece como chip con logo y nombre).
- En `tokens.css`, `--brand-*` tienen los valores por defecto (= acento de la plataforma). Para aplicar un tenant se
  escriben **todos** los `--brand-*` derivados sobre el contenedor del tenant (sobreescribir solo `--brand-primary` no
  recalcula `text`/`hover`).

Derivación verificada por el script con negocios ficticios y casos extremos (ratios truncados; «text peor» = mínimo
contra `surface.default`, `surface.subtle` y `brand.subtle`):

| Negocio | primary | solid | on | hover | text | text-hover | subtle | on/solid | on/hover | text peor (default·subtle·brand.subtle) | text-hover peor | Ajuste |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Esmalte Studio | `#f7a8c8` | `#f7a8c8` | casi negro | `#f9c2d8` | `#8f6174` | `#7a5263` | `#fef3f3` | 10.24 | 12.35 | 4.55 | 5.85 | text + aviso |
| Barbería Don Faro | `#f5c400` | `#f5c400` | casi negro | `#f8d64c` | `#846a00` | `#705a00` | `#fef6db` | 11.49 | 13.23 | 4.65 | 5.97 | text + aviso |
| Pelos & Patas | `#3fb6e0` | `#3fb6e0` | casi negro | `#79cce9` | `#28748f` | `#22637a` | `#e8f4f6` | 8.07 | 10.45 | 4.69 | 6.00 | text + aviso |
| Peluquería Nativa | `#6d2e8c` | `#6d2e8c` | blanco | `#5d2777` | `#6d2e8c` | `#5d2777` | `#ede4ec` | 8.67 | 10.38 | 6.98 | 9.30 | no |
| Preset fucsia | `#d6337a` | `#d6337a` | blanco | `#b62b68` | `#bc2d6b` | `#a0265b` | `#fae5ea` | 4.55 | 5.94 | 4.68 | 6.43 | text + aviso |
| Preset negro | `#121212` | `#121212` | blanco | `#0f0f0f` | `#121212` | `#0f0f0f` | `#e3e1dd` | 18.73 | 19.16 | 14.34 | 17.17 | no |
| Preset verde | `#2fa36b` | `#2fa36b` | casi negro | `#6dbf97` | `#23794f` | `#1e6743` | `#e6f2e8` | 5.90 | 8.58 | 4.65 | 6.11 | text + aviso |
| Preset coral | `#e07a5f` | `#e07a5f` | casi negro | `#e9a28f` | `#a15844` | `#894b3a` | `#fbede7` | 6.40 | 9.01 | 4.59 | 6.01 | text + aviso |
| Gris medio | `#8a8a8a` | `#8a8a8a` | casi negro | `#adadad` | `#6c6c6c` | `#5c5c5c` | `#f1efec` | 5.46 | 8.41 | 4.57 | 5.99 | text + aviso |
| Amarillo puro | `#ffff00` | `#ffff00` | casi negro | `#ffff4c` | `#707000` | `#5f5f00` | `#fffddb` | 17.58 | 17.67 | 4.69 | 6.02 | text + aviso |
| Blanco (extremo) | `#ffffff` | `#ffffff` | casi negro | `#ffffff` | `#6b6b6b` | `#5b5b5b` | `#fffdfa` | 18.88 | 18.88 | 4.77 | 6.08 | text + aviso |
| Crema = canvas (extremo) | `#f6f2eb` | `#f6f2eb` | casi negro | `#f9f6f1` | `#6c6a67` | `#5c5a58` | `#fefcf7` | 16.92 | 17.51 | 4.83 | 6.15 | text + aviso |

## Reglas

- **Color nunca como única señal:** error, éxito, seleccionado y no disponible siempre llevan texto, ícono con nombre
  accesible o cambio de forma (borde, doble trazo, tachado, check).
- **Tipografía del sistema, sin fuentes remotas.** Cuerpo: `font.family.base` (sans del sistema). **Títulos** (h1–h3,
  cifras de KPI, titular de landing): `font.family.heading` = `ui-serif, "Iowan Old Style", "Palatino Linotype",
  Palatino, Georgia, serif`, peso `font.weight.heading` (500), interlineado `font.line-height.tight`. Se ve Iowan/New
  York en Apple, Palatino Linotype o Georgia en Windows y la serif por defecto en Android (Noto Serif): aceptable, la
  jerarquía la dan tamaño y peso. Horarios y cifras: `font.family.numeric` con `font-variant-numeric: tabular-nums`.
- **Objetivos táctiles:** mínimo `size.target.min` (24 px) en desktop con puntero; **44 px** en mobile/táctil
  (`< breakpoint.lg` o `pointer:coarse`) vía `density.*-touch` y `density.target-touch`, y siempre en la web de la
  clienta. En Sereno los controles ya miden 48 px y las filas 56 px.
- **Íconos:** trazo `icon.stroke-width` (1.5) redondeado, sin relleno; tamaños `icon.size.sm/md/lg`. Decorativos con
  `aria-hidden`; un ícono-botón ocupa al menos `size.target.comfortable` aunque el dibujo sea de 22 px.
- **Links:** subrayados, `link.underline-offset` 3 px; hover = `text.link-hover`/`brand.text-hover` + subrayado de 2 px.
- **Avisos:** fondo `feedback.*.bg`, texto `feedback.*.text`, borde izquierdo `component.notice.border-width` (4 px)
  en `feedback.*.border`, ícono + título.
- **Foco:** `focus.ring` 3 px sólido con offset 2 px, igual en todo y no sobreescribible.
- **Densidad baja (riesgo conocido):** en el panel con mucho volumen se ven menos turnos por pantalla; si hace falta,
  se propone una densidad compacta como token nuevo, no con valores sueltos.

## Proponer cambios

Un valor que no existe se propone como token nuevo (propósito, valor y contraste calculado con `tools/tokens.py`) en
la documentación de la iniciativa. Lo decide el CDO y se incorpora en un PR propio.
