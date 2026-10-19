# Spec de UI (breve) · spa-reservas-mvp

Baja-media fidelidad. Solo tokens semánticos de `design-system/tokens.json` (espejo en
`prototypes/shared/tokens.css`). Capa tenant: `prototypes/spa-reservas-mvp/tenant-spa-lua.css`.

## Reglas generales

- **Layout.** Clienta y profesional: una columna, `size.content.max` (40rem), padding `space.400`.
  Recepción y administradora: hasta 80rem (L-02); desde `breakpoint.lg` la administradora tiene
  navegación lateral (15rem, L-03) y grillas de 2/3 columnas; debajo, navegación en fila que envuelve.
  Sin estilos inline: todo vive en `styles.css` (utilidades `.u-*` con tokens).
- **Encabezado.** Logo del spa (36 px, L-01, decorativo: `alt=""` porque el nombre va al lado) + nombre +
  navegación principal (`nav aria-label="Principal"`, `aria-current="page"`). Franja superior de
  `space.100` en `color.action.primary` (color del spa). Clienta con pack activo: la navegación suma
  «Mi pack» (DD-12).
- **Acción principal** por pantalla: `.btn` primario, ancho completo en mobile, mínimo
  `size.target.comfortable` (44 px). Destructivas: `color.action.danger` (relleno en la confirmación,
  contorno en la lista).
- **Selección** (servicios, profesional, día, horario, pack): tarjeta seleccionable sobre
  `input` nativo (checkbox/radio) con `label`; seleccionado = `border.selected` 2 px +
  `surface.selected` + marca (círculo/cuadro relleno o ✓); no disponible = `surface.disabled` + tachado +
  texto («completo»). Nunca solo color.
- **Mensajes.** `alert--success` (`role=status`) tras cada acción; `alert--danger` (`role=alert`) para
  errores con salida; `alert--warning` para estados sin horarios / fuera de plazo; `alert--info` para
  explicaciones (política, permiso). Íconos ✓ ✕ ⚠ decorativos + título en texto.
- **Formularios.** `label` visible siempre, hint asociado con `aria-describedby`, error por campo
  (`aria-invalid`, borde `feedback.danger.border` 2 px, texto con ✕) + resumen de errores enfocado con
  links a cada campo. Inputs a `font.size.200` (16 px, sin zoom en iOS).
- **Moneda.** `$ 24.000` (ARS, separador de miles con punto). Fechas `Sábado 28/11` y horas `10:30`.
- **Navegación del prototipo**: `<aside class="proto">` al pie de cada página, fuera del producto.

## Marca (capa tenant)

| Dato del spa | Dónde se usa | Regla |
|---|---|---|
| Nombre | Encabezado, títulos, mensajes de WhatsApp | Texto; hasta ~30 caracteres, envuelve |
| Logo | Encabezado (36 px), vista previa | PNG/SVG cuadrado ≤ 1 MB; decorativo junto al nombre |
| Color primario | `action.primary`, `action.primary-hover`, `text.link`, `border.selected`, franja | Si contraste ≥ 4,5:1 contra blanco (`text.on-action`) **y** contra `surface.subtle` (#f5f6f8) → todos los usos (≈ ≥ 4,87:1 contra blanco). Si no → solo franja; el resto queda con el valor del sistema (`#0e6b63`). Hover = cada canal × 0,8 (PDS-01) |
| `surface.selected`, `text.selected` | — | No se derivan del spa en el MVP: valores del sistema (DD-10) |

El foco (`color.focus.ring`, 3 px + offset 2 px) no cambia con la marca. Con el color de ejemplo
`#8a2b6a`, el anillo azul sobre la superficie da 6,70:1 (el offset evita medirlo contra el botón).

## Pantallas

### Clienta (mobile-first, 360 px)

| Pantalla | Contenido y acción principal | Estados |
|---|---|---|
| `c-ingresar` | Prefijo +54 9 fijo + número; «Enviarme el código» | Error de formato (10 dígitos) |
| `c-codigo` | Código 6 dígitos (`autocomplete=one-time-code`); «Ingresar»; «Reenviar código» deshabilitado con cuenta regresiva de 45 s (texto asociado), se habilita al llegar a 0 | `c-codigo-error`: intentos restantes · `c-codigo-bloqueado`: sin intentos, espera 15 min, volver a ingresar el número |
| `c-inicio` | Aviso «te toca volver» (info), próximo turno, datos del spa, pack (Fase 2) | Sin turno (CTA reservar) / `c-inicio-con-turno` / `c-inicio-con-pack`: «Mi pack» en la navegación + tarjeta «Mi pack» con «Ver mi pack» y «Darme de baja del pack» |
| `c-reservar-servicios` | Paso 1/4. Checkboxes con duración y precio; barra de resumen con total en vivo (`aria-live=polite`) y «Continuar», fija abajo solo con alto ≥ 30rem | Ninguno elegido → error |
| `c-reservar-profesional` | Paso 2/4. «Cualquier profesional» por defecto + quienes hacen todos los servicios | Paso omitido si el spa lo desactiva |
| `c-reservar-horario` | Paso 3/4. Días (con «completo» deshabilitado) y horarios de inicio; semana siguiente | `c-reservar-sin-horarios`: próximo libre + alternativa |
| `c-reservar-confirmar` | Paso 4/4. Resumen, política de cancelación, opt-in de ofertas (destildado, opcional); «Confirmar turno» | `c-reservar-error`: horario recién ocupado |
| `c-reservado` | Éxito + resumen + qué avisos va a recibir + cómo cancelar | — |
| `c-mis-turnos` | Próximos con plazo de cancelación y «Cancelar turno»; anteriores con estado (badge con texto) | `c-mis-turnos-vacio` |
| `c-cancelar` | Turno + política + «Sí, cancelar» / «No, mantener» | `c-cancelar-fuera-plazo` |
| `c-cancelado` | Éxito + «Elegir otro día y horario» (cancelar y volver a reservar) | — |
| `c-te-toca-volver` | Repetir lo último con la misma profesional; 3 horarios; más días / otros servicios | — |
| `c-whatsapp` | Mock: recordatorios 48 h (con plazo para cancelar) y 2 h, «te toca volver», oferta con BAJA | — |
| `c-pack` (Fase 2) | Pack 3 y 12 meses (sin «elegís profesional», pendiente de P-01), condiciones (pago único, no se renueva, baja); «Pagar con Mercado Pago» | `c-pack-pago-error` |
| `c-pack-activo` | Vigencia, uso del mes, pago; sección «Baja del pack» con «Darme de baja». Accesible siempre desde «Mi pack» en la navegación | — |
| `c-pack-baja`, `c-pack-baja-ok` | Confirmación de baja; comprobante con número de trámite | Reintegro: placeholder a definir |

### Profesional (mobile)

| Pantalla | Contenido | Estados |
|---|---|---|
| `p-agenda` | Día: lista ordenada de turnos y bloqueos (bloqueo con fondo `surface.disabled` + texto «Bloqueado»); día anterior (`p-agenda-dia-anterior`) / siguiente; «Bloquear un horario» | `p-agenda-vacia` |
| `p-agenda-semana` | Resumen por día (cantidad, completo, bloqueos) con link al día | — |
| `p-bloquear` | Día, desde, hasta (pasos de 15 min), motivo opcional | Falta día; `p-bloquear-conflicto` (el bloqueo no cancela turnos) |
| `p-bloqueado` | Éxito + «Deshacer bloqueo» | — |

### Recepción (tablet/desktop)

| Pantalla | Contenido | Estados |
|---|---|---|
| `r-agenda` | Día por profesional en 3 columnas (1 en mobile); «Cargar turno» | — |
| `r-cargar-turno` | Dos bloques: 1. Clienta (existente: WhatsApp → «Encontramos a…» con permiso y cómo se le pide por WhatsApp; nueva: nombre + WhatsApp; el bloque de la otra opción se oculta) · 2. Turno (servicios, profesional, día, horario) | `r-cargar-error`: un único resumen de errores, campos inválidos, sin horarios |
| `r-turno-cargado` | Éxito + «Cargar otro turno» | — |

### Administradora (desktop, responsive)

| Pantalla | Contenido | Estados |
|---|---|---|
| `a-panel` | Período; 3 métricas (turnos, % asistencia, recompra 60 d) con definición en texto; próximos pasos; tabla por profesional | `a-panel-vacio`: checklist de puesta en marcha |
| `a-servicios` | Tabla (apilada < 40rem) + alta: nombre, duración, precio, días para «te toca volver» | Errores por campo |
| `a-profesionales` | Equipo + horario semanal editable por profesional | `a-profesionales-ok` |
| `a-ajustes` | Elegir profesional on/off, política (texto + horas), recordatorios 1 (48 h por defecto) y 2, con aviso de que el primero salga antes del plazo de cancelación | — |
| `a-marca` | Nombre, logo, un color + chequeo de contraste en vivo (blanco y `surface.subtle`) + vista previa; colores de prueba | Color con contraste insuficiente: vista previa con los valores del sistema y aviso |
| `a-campana` | 1. Segmento (único) con conteo con/sin permiso · 2. Plantilla con campos y vista previa · 3. Fecha | Oferta vacía; `a-campana-enviada` → «Cancelar envío» con confirmación → `a-campana-cancelada` |
| `a-importar` | Formato de columnas, planilla de ejemplo, subir archivo | — |
| `a-importar-resultado` | Válidas / con permiso / con error + tabla de errores | `a-importar-ok` |

## Componentes nuevos (PDS-02)

Estados de cada componente propuesto. Foco siempre `color.focus.ring` 3 px + offset 2 px.

| Componente | Reposo | Hover | Foco | Seleccionado / activo | Deshabilitado | Error |
|---|---|---|---|---|---|---|
| Tarjeta seleccionable `.choice` | `surface.default`, borde `border.strong` 1 px, marcador vacío | igual (cursor pointer) | anillo en el `label` (input nativo oculto) | borde `border.selected` 2 px + `surface.selected` + `text.selected` + marcador relleno | `surface.disabled` + `text.muted` + tachado + texto («completo») | el `fieldset` muestra `.field-error` y entra al resumen |
| Días / horarios (`.days`, `.slots`) | como `.choice`, sin marcador | igual | anillo | igual + «✓» textual | igual que `.choice` | — |
| Resumen de errores `.error-summary` | oculto (`hidden`) | — | recibe foco al aparecer (`tabindex=-1`) | `alert--danger` + `role=alert` + links a cada campo | — | — |
| Barra de resumen `.summary-bar` | en el flujo; fija abajo solo con alto ≥ 30rem; `scroll-padding-bottom: 10rem` + ajuste de scroll en `focusin` para no tapar el foco | — | — | total en vivo `aria-live=polite` | — | — |
| Tabla apilada `.table-stack` | < 40rem: cada fila es un bloque con etiqueta (`data-label`) + valor | — | — | — | — | — |
| Burbuja de mensaje `.bubble` | `surface.default`, borde `border.strong`, hora `text.muted` | — | links internos con foco estándar | — | — | — |
| Confirmación en el lugar | oculta | — | el título recibe foco al abrir; al cerrar vuelve al botón | botón disparador `aria-expanded=true` | — | — |
| Botón-link con cuenta regresiva (`.btn--link[data-countdown]`) | `text.link` subrayado | grosor de subrayado | anillo | — | `disabled` + `text.muted`, sin subrayado; texto asociado «Podés pedir otro en N s» | — |

## Excepciones de layout (medidas sin token)

No se agregaron valores a `tokens.json`. Estas medidas son de layout, se usan solo en este prototipo y
se proponen como token si se repiten (PDS-03):

| Id | Medida | Dónde | Motivo |
|---|---|---|---|
| L-01 | 36 px | `.brand__logo` (logo del encabezado) | tamaño de logo legible dentro de un encabezado de 56 px; candidato `size.logo.sm` |
| L-02 | 80rem | `.wide` (recepción, administración), `.proto__inner` | ancho de contenido para tablas y 2 columnas; candidato `size.content.wide` |
| L-03 | 15rem | columna de la navegación lateral de administración | ancho de etiquetas largas («Profesionales y horarios»); candidato `size.sidebar` |
| L-04 | 10rem | `scroll-padding-bottom` cuando hay `.summary-bar` | ≥ alto máximo medido de la barra (129 px) con margen; deriva de un alto, no es token |
| L-05 | 10rem | `.input--narrow` (horas en `a-ajustes`) | campo numérico corto |
| L-06 | 14rem | `.input--date` (fecha de envío en `a-campana`) | fecha sola en una fila |
| L-07 | 30rem | `@media (min-height: 30rem)` de la barra fija | por debajo de 480 px de alto la barra no se fija |
| — | 56 px, 4,5rem, 5,5rem, 6rem, 7rem, 8rem, 32rem, 20 px | alto mínimo del encabezado, columnas de horarios/días, `textarea`, tabla apilada, `.choice__body`, burbuja, marcador | heredadas de v0.1, mismas condiciones |

(Se quitó `min-height: calc(100vh - 60px)` del layout de administración: no era necesario.)

## Responsive

- < 40rem: una columna, tablas apiladas (etiqueta + valor), botones a ancho completo.
- ≥ 40rem: grilla de 3 métricas/columnas de agenda; acciones en fila.
- ≥ 64rem: navegación lateral de administración; formularios de recepción y campaña en 2 columnas.

## Fuera de esta spec

Push, instalación de la PWA, reprogramación en un paso, varias campañas, métricas completas, cobro
recurrente, gift cards, reseñas, historial de clienta, señas, app nativa, login con Google/Apple.
