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
(y unos pocos ajustes de personalidad por dirección en `stage-admin.css`) y el microcopy.

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
  de 1 px, sin sombras salvo elementos flotantes, densidad media-alta (controles y filas de 40 px en el panel; 44 px se
  mantiene en la web de la clienta). Todo en tipografía del sistema, con monoespaciada del sistema para horarios y
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
| `brand.solid` | = P si `on-primary` llega a 4,5:1. Si ninguno llega, P mezclado con negro en pasos de 2 % hasta 4,5:1 con blanco, y `on-primary` = blanco | Relleno de botones y día elegido |
| `brand.primary-hover` | Si `on` es blanco: `solid` + 15 % negro. Si es casi negro: `solid` + 30 % blanco | Aumenta el contraste con `on` (verificado en la tabla) |
| `brand.text` | P mezclado con negro en pasos de 2 % hasta ≥ 4,5:1 sobre `surface.default`, `surface.canvas` y `brand.subtle` | Links, texto de marca, check de seleccionado |
| `brand.subtle` | 12 % P + 88 % `surface.default` | Fondo de seleccionado y tintes |
| `brand.border` | = `brand.text` | Borde de seleccionado ≥ 3:1 (de hecho ≥ 4,5:1) |

- Si hubo que oscurecer `solid` o `text`, la pantalla «Marca del negocio» muestra una **advertencia** (`role=status`)
  explicando qué se ajustó, con el valor y el contraste, y sugiriendo elegir un tono más oscuro. El color original se
  conserva en el logo y en `brand.subtle`.
- Nada se apoya solo en el color de marca: seleccionado = borde + check + «Elegido».
- En producción esto se calcula en el servidor al guardar (y se cachea por tenant); el JS del prototipo es solo demo.

### Negocios de ejemplo (ficticios)

| Negocio | Rubro | Color | Qué demuestra |
|---|---|---|---|
| Esmalte Studio | Spa de uñas | `#f7a8c8` rosa claro | Texto negro sobre botón; links oscurecidos a `#8f6174` + advertencia |
| Barbería Don Faro | Barbería | `#f5c400` amarillo | Caso más exigente: links a `#846a00`/`#896e00` + advertencia |
| Pelos & Patas | Peluquería canina | `#3fb6e0` celeste | Texto negro sobre botón; links oscurecidos |
| Peluquería Nativa | Peluquería | `#6d2e8c` violeta | Color que pasa tal cual (control) |

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
7. Si se elige C: ¿aceptamos que la tipografía redondeada solo se vea en Apple, o evaluamos autoalojar una fuente
   (hoy el design system prohíbe fuentes remotas; una fuente local empaquetada no sería remota)? (CDO)
8. Tamaño y formato del logo: el prototipo muestra 40 px de alto en el header; ¿pedimos versión cuadrada y horizontal? (CPO)

## Propuestas al design system (las decide el CDO)

- Agregar el grupo `brand` y la extensión `com.coop-agents.tenant` (qué se puede sobreescribir).
- `color.surface.canvas`, `color.surface.sunken`, `color.platform.*`, `radius.control`, `radius.button`, `border.width`,
  `shadow.*`, `density.*`, `icon.*`, `font.family.heading`, `font.family.numeric`, `font.tracking.*`.
- Solo si se elige B: `color.chrome.*` y `color.focus.ring-on-dark` (#8ab4ff).

## Archivos

- `initiatives/look-and-feel/README.md` (este), `accessibility.md`, `tokens-a-sereno.json`, `tokens-b-preciso.json`,
  `tokens-c-cercano.json`.
- `prototypes/look-and-feel/index.html` (comparador), `tokens.css` (generado desde los JSON: los valores no se editan a
  mano), `comparador.css`, `stage.css`, `stage-admin.css`, `lf.js`.
