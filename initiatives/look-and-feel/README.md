# Look and feel de la plataforma — 3 direcciones

Estado: propuesta para decidir · Pedido: Fidel Cossio (socio) · Coordina: CDO · Diseño: Designer

**Prototipo:** [`prototypes/look-and-feel/index.html`](../../prototypes/look-and-feel/index.html) (comparador: elegís dirección y
negocio de ejemplo; se puede enlazar un estado con `#dir=b&tenant=faro`).
**Tokens:** [`tokens-a-sereno.json`](tokens-a-sereno.json) · [`tokens-b-preciso.json`](tokens-b-preciso.json) ·
[`tokens-c-cercano.json`](tokens-c-cercano.json) · **Contrastes y verificación:** [`accessibility.md`](accessibility.md)

## Objetivo

Definir la imagen de nuestra empresa SaaS de reservas con foco en recompra (MVP: spas de uñas; después peluquerías,
barberías y peluquerías caninas; de 3 a 100 negocios). Tiene que cumplir dos cosas a la vez:

1. Servir de base visual a toda la app (panel de administradora, recepción y profesionales; web/PWA de la clienta).
2. Ser lo bastante neutra para que **cada negocio ponga su logo y su color** (white-label por tenant) sin romper la
   legibilidad ni la accesibilidad.

Contexto de producto: `gm2dev/coop-agents-product`, rama `po/spa-roadmap-presentacion`,
`roadmap-mvp-reservas/presentacion-ejecutiva.html` (perfiles, PWA, «marca del spa: logo y colores» en Fase 1).

Estas son **propuestas**: no modifican `design-system/tokens.json` ni `principles.md`. La dirección elegida se
incorpora al design system en un PR propio, decidido por el CDO.

## Dónde vive cada marca (decisión CDO)

| Superficie | Marca que manda | Rastro de la plataforma |
|---|---|---|
| Login / landing de la plataforma | Plataforma (100 %) | — |
| Panel de administradora, recepción, profesionales | Plataforma (chrome: wordmark, navegación, acento, botones) | El negocio aparece como contexto (chip con logo y nombre), no tiñe el panel |
| Web de reservas de la clienta (PWA) | Negocio: logo, nombre y `brand.primary` | Pie discreto «Reservas con Nombre» |
| Mensajes de WhatsApp | Negocio | (a definir con producto) |

## Las 3 direcciones

Las cuatro pantallas son idénticas en estructura en las tres direcciones; cambia solo lo que viene de los tokens
(incluidos los ajustes de personalidad, ahora tokenizados: ver §Ajustes de personalidad) y el microcopy.

### A · Sereno

- **Personalidad:** calma, cuidado, tiempo para una. Neutros cálidos de piedra y crema, mucho aire, radios grandes
  (8/14/22 px), sombras suaves y difusas, bordes casi invisibles. Títulos en `ui-serif` (Iowan/Palatino/Georgia),
  cuerpo del sistema. Íconos de trazo fino (1,5). Acento **verde salvia profundo `#3d5e4f`** (7,10:1 sobre su superficie).
- **Tono:** frases completas, sin exclamaciones. «Es momento de volver», «Que cada clienta vuelva a tiempo.»
- **Cuándo conviene:** si el foco comercial sigue siendo spas, estética y bienestar, y queremos que la plataforma se
  sienta «premium tranquila».
- **Riesgos:** el serif y la crema pueden leerse «de spa» y alejar a barberías; densidad baja = menos turnos visibles
  por pantalla en el panel; el fondo crema tiñe levemente los colores de tenant (los rosas se ven más cálidos).

### B · Preciso

- **Personalidad:** herramienta profesional B2B. Neutros fríos casi puros (pizarra), radios chicos (3/6/8 px), bordes
  de 1 px, sin sombras salvo elementos flotantes, densidad media-alta (controles y filas de 40 px en el panel en desktop
  con puntero; **44 px en mobile/táctil** (< 64rem o `pointer:coarse`) y siempre en la web de la clienta). Todo en tipografía del sistema, con monoespaciada del sistema para horarios y
  cifras. Íconos de trazo medio y terminaciones rectas. Barra lateral oscura. Acento **índigo tinta `#3a3f9e`** (8,81:1).
- **Tono:** directo y funcional, verbos al frente. «Recompra pendiente», «+ Turno», «Turno confirmado».
- **Cuándo conviene:** si priorizamos escalar a muchos rubros (barberías, caninas, lo que venga) y el panel es el
  producto que vendemos. Es la más neutra frente a cualquier color de tenant: el blanco puro no altera la marca del negocio.
- **Riesgos:** puede sentirse fría o «de oficina» para la clienta final y para dueñas de spa; el chrome oscuro exige un
  foco propio (`chrome.focus-ring` #8ab4ff, porque el azul estándar da 2,72:1 sobre `slate.900`): propuesta de token nueva.

### C · Cercano

- **Personalidad:** amable, conversacional, de barrio. Neutros apenas cálidos (arena), formas redondeadas (10/16/24 px)
  y botones pill, bordes de 2 px, sombra «apoyada». Tipografía `ui-rounded` (SF Pro Rounded) con fallback a Nunito o
  al sistema; títulos en 700. Íconos de trazo grueso redondeado. Acento **terracota `#b3472c`** (5,45:1).
  Lo ajustamos desde «coral» a terracota: un coral claro no da 4,5:1 con texto blanco; el terracota sí y sigue siendo cálido.
- **Tono:** tuteo y algo de exclamación, sin emojis en la interfaz. «¡Listo, te esperamos!», «Les toca volver: un
  mensajito las trae de vuelta.»
- **Cuándo conviene:** si la diferenciación es la cercanía con negocios chicos y la clienta por WhatsApp; buena
  coherencia con el canal.
- **Riesgos:** el acento cálido de la plataforma puede competir con tenants rojos/naranjas en el panel (en la web de la
  clienta no aparece); `ui-rounded` solo existe en Apple: en Android/Windows cae a Nunito (si está instalada) o al
  sistema, así que la personalidad depende más de las formas que de la letra; el microcopy expresivo cansa si se abusa.

### Comparativa

| | A · Sereno | B · Preciso | C · Cercano |
|---|---|---|---|
| Neutros | Piedra/crema cálidos (`#fffdf9`, `#f6f2eb`) | Pizarra fríos (`#ffffff`, `#f5f7fa`) | Arena apenas cálidos (`#ffffff`, `#fbf7f4`) |
| Acento plataforma | Salvia `#3d5e4f` | Índigo `#3a3f9e` | Terracota `#b3472c` |
| Radios sm/md/lg · botón | 8/14/22 · md | 3/6/8 · sm | 10/16/24 · pill |
| Bordes / sombras | 1 px tenue · sombra difusa | 1 px nítido · sin sombra | 2 px · sombra apoyada |
| Densidad (control / fila) | 48 / 56 px | 40 / 40 px | 48 / 52 px |
| Tipografía | ui-serif títulos + sistema | Sistema + mono para cifras | ui-rounded (fallback Nunito/sistema) |
| Íconos | 1,5 redondeado | 1,75 recto | 2 redondeado |
| Tono | Calmo, completo | Directo, funcional | Conversacional, cálido |
| Neutralidad frente al tenant | Media (la crema tiñe) | **Alta** | Media-alta |
| Afinidad spa / barbería / canina | Alta / baja / media | Media / alta / alta | Alta / media / alta |
| Panel con mucho volumen | Regular | **Mejor** | Bien |
| Contraste mínimo de texto (peor par) | 5,87:1 | 6,35:1 | 4,84:1 |

Recomendación del Designer (para que decida el CDO con Fidel): **B como base del panel** por neutralidad y densidad,
evaluando si se toman de C las formas redondeadas y el tono para la web de la clienta. Mezclar direcciones es posible
porque comparten estructura semántica, pero conviene decidir una personalidad principal.

## Theming por tenant (común a las 3 direcciones)

### Tres capas

1. **Primitivos de la plataforma** (`color.stone.*`, `color.slate.*`, `color.sage.*`…): valores crudos por dirección.
2. **Semánticos de la plataforma** (`color.text.*`, `color.surface.*`, `color.border.*`, `color.action.*`,
   `color.feedback.*`, `color.focus.*`, `color.platform.*`, más `font.*`, `space.*`, `radius.*`, `density.*`, `shadow.*`,
   `icon.*`). Misma estructura que `design-system/tokens.json`, con algunas extensiones marcadas como propuesta
   (`surface.canvas`, `surface.sunken`, `color.platform.*`, `radius.control/button`, `border.width`, `shadow.*`,
   `density.*`, `icon.*`, `font.family.heading/numeric`, `font.tracking.*`).
3. **Tenant** (grupo `brand`): el negocio solo puede definir **`brand.primary`** (un color), **`brand.logo`** y
   **`brand.name`**. Marcado en los JSON con `$extensions["com.coop-agents.tenant"].overridable = true`.
   El tenant **nunca** cambia neutros, feedback (error/éxito/aviso/info), foco, tipografía, espaciado ni radios
   (`overridable: false`).

### Reglas de derivación (implementadas en `prototypes/look-and-feel/lf.js`, función `derive`)

Entrada: `brand.primary` (P) y las superficies claras de la dirección (`surface.default`, `surface.canvas`).
Constantes: blanco `#ffffff`, casi negro `#111111`. Contraste = fórmula WCAG 2.x.

| Token derivado | Regla | Garantía |
|---|---|---|
| `brand.on-primary` | El de mayor contraste con P entre blanco y casi negro | ≥ 4,5:1 sobre `brand.solid` |
| `brand.solid` | = P si `on-primary` llega a 4,5:1. Si ninguno llega, P mezclado con negro en pasos de 2 % hasta 4,5:1 con blanco, y `on-primary` = blanco | Relleno de botones (nunca para indicar «seleccionado») |
| `brand.primary-hover` | Si `on` es blanco: `solid` + 15 % negro. Si es casi negro: `solid` + 30 % blanco | Aumenta el contraste con `on` (verificado en la tabla) |
| `brand.text` | P mezclado con negro en pasos de 2 % hasta ≥ 4,5:1 sobre `surface.default`, `surface.canvas` y `brand.subtle` | **Todos los links del área del tenant** (web de la clienta y vista previa: `.phone`, `.mini`, `[data-tenant-scope]`), texto de marca, check de seleccionado |
| `brand.subtle` | 12 % P + 88 % `surface.default` | Fondo de seleccionado y tintes |
| `brand.border` | = `brand.text` | Borde de seleccionado ≥ 3:1 (de hecho ≥ 4,5:1) |

- Si hubo que oscurecer `solid` o `text`, la pantalla «Marca del negocio» muestra una **advertencia** (`role=status`)
  explicando qué se ajustó, con el valor y el contraste, y sugiriendo elegir un tono más oscuro. El color original se
  conserva en el logo y en `brand.subtle`.
- Nada se apoya solo en el color de marca: seleccionado = borde `brand.border` + doble trazo + «✓ Elegido/elegido»,
  igual en servicios, días y horarios (el día elegido ya no usa relleno `brand.solid`).
- «Marca del negocio»: mientras se edita, color, logo y nombre se ven **solo en la vista previa**; al «Guardar marca»
  los tres se aplican a todas las pantallas (web de la clienta y chip del panel), coherente con «Ya se ve en tu web».
- En producción esto se calcula en el servidor al guardar (y se cachea por tenant); el JS del prototipo es solo demo.

### Negocios de ejemplo (ficticios)

| Negocio | Rubro | Color | Qué demuestra |
|---|---|---|---|
| Esmalte Studio | Spa de uñas | `#f7a8c8` rosa claro | Texto negro sobre botón; links oscurecidos a `#8f6174` + advertencia |
| Barbería Don Faro | Barbería | `#f5c400` amarillo | Caso más exigente: links a `#846a00`/`#896e00` + advertencia |
| Pelos & Patas | Peluquería canina | `#3fb6e0` celeste | Texto negro sobre botón; links oscurecidos |
| Peluquería Nativa | Peluquería | `#6d2e8c` violeta | Color que pasa tal cual (control) |

## Ajustes de personalidad (tokenizados en esta ronda)

Los ajustes que antes eran selectores `[data-dir]` en `stage-admin.css` ahora son tokens de cada dirección
(PROPUESTA, dentro de la iniciativa) y `stage-admin.css` ya no tiene reglas por dirección:

| Token | A · Sereno | B · Preciso | C · Cercano |
|---|---|---|---|
| `font.size.label` / `font.case.label` | 100 / none | **075 / uppercase** | 100 / none |
| `font.weight.kpi` · `component.kpi.font-family` · `component.kpi.size` | 500 · heading · 500 | 700 · **numeric** · 400 | 700 · heading · 500 |
| `font.weight.hero` | heading (500) | heading (600) | **black (800)** |
| `component.client.body-padding-top` | space.600 | space.500 | space.500 |
| `component.panel.content-padding` / `-gap` | space.500 | space.400 | space.500 |
| `component.card.border-width` | 1px | 1px | border.width (2px) |
| `component.nav.radius` · `component.nav.indicator-width` | radius.md · 3px | radius.md · 3px | **pill · 0** |
| `component.badge.radius` · `component.day.radius` | sm · control | sm · control | **pill · pill** |
| `component.hero.bg` · `component.hero.divider` | platform.accent-subtle (sólido; antes degradado) · — | surface.default · border.default | platform.accent-subtle · — |
| `component.hero.icon-bg/-padding/-box` | — | — | surface.default · 6px · 36px |
| `color.sidebar.*` (barra lateral) | superficie clara + acento | **chrome oscuro** (`color.chrome.*`) | superficie clara + acento |
| `density.control-height-touch` / `row-height-touch` | = desktop (48/56) | **44 / 44** | = desktop (48/52) |
| `font.size.075` / `font.size.050` / `font.tracking.caps` | microtexto «elegido/ocupado», etiqueta «provisorio» | ídem | ídem |

**A tokenizar al consolidar** (quedan como valores fijos de componente, comunes a las 3 direcciones, no de personalidad):
ancho de la barra lateral (220 px), tamaños de logo (28/40/56/64 px), chip de color derivado (24 px), borde del
preset (2 px), offset de subrayado de links (3 px), borde izquierdo de avisos (4 px), ancho mínimo de día (56 px)
y columna de horarios (5.5rem).

El **marco del comparador** (tarjetas de pantalla, contorno del teléfono y de la ventana, cabecera y controles) no es
parte de ninguna dirección: declara sus valores como `--frame-*` en un único bloque comentado al inicio de
`comparador.css`, con el token de `design-system/tokens.json` al lado cuando existe.

## Decisiones

- **D1 (CDO) — Marca por superficie:** en la web de la clienta manda la marca del negocio; la de la plataforma solo en
  login/landing, chrome del panel y pie «Reservas con <Marca>».
- **D2 (CDO) — Tokens nuevos como propuesta:** `brand` + extensión tenant, `surface.canvas/sunken`, `platform.*`,
  `radius.control/button`, `border.width`, `shadow.*`, `density.*` (incluido `*-touch`), `font.family.heading/numeric`,
  `font.tracking.*`, `component.*`, `color.sidebar.*`, etc. siguen como **PROPUESTA dentro de la iniciativa**. Se
  incorporan a `design-system/tokens.json` en un PR propio cuando se elija una dirección.
- **D3 (CDO) — Foco sobre oscuro en B:** `color.focus.ring-on-dark` / `color.chrome.focus-ring` #8ab4ff queda
  **aceptado como propuesta**.
- **D4 (CDO) — Controles de 40 px en el panel de B:** aceptables en desktop con puntero; en mobile/táctil (< 64rem o
  `pointer:coarse`) van a **44 px** (`density.control-height-touch` / `row-height-touch`, aplicado en `tokens.css`
  con media query generada desde el JSON).
- **D5 (CDO) — Fuente local para C:** pregunta abierta; **no se empaqueta ahora**.
- **D6 (CDO) — Marco del comparador:** valores en variables `--frame-*` en un solo bloque de `comparador.css`; todo lo
  demás sale de tokens de la dirección.
- **D7 (Designer) — Seleccionado nunca solo por color:** servicios, días y horarios comparten patrón (borde
  `brand.border` + doble trazo + «✓ elegido»).

## Preguntas abiertas

1. **Nombre de la empresa SaaS** (todavía no definido). El wordmark «Nombre» con la etiqueta «provisorio» y el ícono de
   borde punteado son placeholders: se reemplazan en un solo `<symbol id="wm-mark">` y en el texto. (Fidel / socios)
2. **Logo de la plataforma:** ¿lo diseñamos internamente o se encarga? Condiciona la dirección (un logo geométrico pide B;
   uno caligráfico, A). (CDO)
3. ¿El tenant podrá elegir más de un color (secundario) en algún momento? Hoy la recomendación es **no**: un color
   alcanza para diferenciar y mantiene la accesibilidad controlable. Roadmap B dice «logo y colores». (CPO)
4. ¿Modo oscuro? No está contemplado; la derivación habría que repetirla contra superficies oscuras. (CDO)
5. ¿La clienta ve «Reservas con Nombre» también en los mensajes de WhatsApp? (CPO)
6. ¿Planes pagos pueden ocultar el pie «Reservas con»? (CPO, comercial)
7. Si se elige C: ¿aceptamos que la tipografía redondeada solo se vea en Apple, o evaluamos autoalojar una fuente?
   **Sigue abierta** (decisión CDO: no se empaqueta ahora; ver §Decisiones).
8. Tamaño y formato del logo: el prototipo muestra 40 px de alto en el header; ¿pedimos versión cuadrada y horizontal? (CPO)

## Propuestas al design system (las decide el CDO)

- Agregar el grupo `brand` y la extensión `com.coop-agents.tenant` (qué se puede sobreescribir).
- `color.surface.canvas`, `color.surface.sunken`, `color.platform.*`, `radius.control`, `radius.button`, `border.width`,
  `shadow.*`, `density.*`, `icon.*`, `font.family.heading`, `font.family.numeric`, `font.tracking.*`.
- `density.control-height-touch` / `density.row-height-touch`, `font.size.075/050/label`, `font.case.label`,
  `font.weight.kpi/hero`, `font.tracking.caps`, `component.*` (ajustes de personalidad) y `color.sidebar.*`.
- Solo si se elige B: `color.chrome.*` y `color.focus.ring-on-dark` (#8ab4ff, aceptado como propuesta, D3).
- Todo esto entra a `design-system/tokens.json` en un PR propio cuando se elija dirección (D2).

## Archivos

- `initiatives/look-and-feel/README.md` (este), `accessibility.md`, `tokens-a-sereno.json`, `tokens-b-preciso.json`,
  `tokens-c-cercano.json`.
- `prototypes/look-and-feel/index.html` (comparador), `tokens.css` (generado desde los JSON: los valores no se editan a
  mano; incluye la media query de `density.*-touch`), `comparador.css` (marco del comparador, `--frame-*`), `stage.css`,
  `stage-admin.css`, `lf.js`.
