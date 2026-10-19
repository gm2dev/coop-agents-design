# Spec de UI (breve) · spa-reservas-mvp

Media fidelidad, look «Sereno» (design system v1, PR #6). Solo tokens semánticos; `prototypes/shared/tokens.css`
se genera desde `design-system/tokens.json` de PR #6 (ver README §Look y tokens). Marca del tenant:
`prototypes/spa-reservas-mvp/tenant-spa-lua.css` (valores derivados).

## Reglas generales

- **Layout.** Clienta y profesional: una columna, `size.content.max` (40rem), padding `space.400`.
  Recepción y administradora: hasta 80rem (L-02); desde `breakpoint.lg` la administradora tiene
  navegación lateral (`size.sidebar-width`, colores `color.sidebar.*`) y grillas de 2/3 columnas; debajo,
  navegación en fila que envuelve. Títulos con `font.family.heading` (serif del sistema); tarjetas con
  `radius.lg` + `shadow.card`; controles con `density.control-height` (44 px).
  Sin estilos inline: todo vive en `styles.css` (utilidades `.u-*` con tokens).
- **Encabezado.** Logo del spa (`size.logo-header`, decorativo: `alt=""` porque el nombre va al lado) +
  nombre + navegación principal (`nav aria-label="Principal"`, `aria-current="page"`). Franja superior de
  `border.width-accent`: en la web de la clienta `brand.primary`; en los paneles `color.platform.accent`
  y el spa como chip (`color.sidebar.chip-*`). Clienta con pack activo: la navegación suma «Mi pack» (DD-12).
- **Acción principal** por pantalla: `.btn` primario, ancho completo en mobile, mínimo
  `size.target.comfortable` (44 px). Destructivas: `color.action.danger` (relleno en la confirmación,
  contorno en la lista).
- **Selección** (servicios, profesional, día, horario, pack): tarjeta seleccionable sobre
  `input` nativo (checkbox/radio) con `label`; seleccionado en la web de la clienta = `brand.border` +
  doble trazo + `brand.subtle` + marcador relleno y «✓ elegido» en días/horarios; en los paneles =
  `border.selected` + `surface.selected` + `text.selected`. No disponible = `surface.disabled` + tachado +
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
| Color principal (`brand.primary`) | franja, logo, base de los derivados | Único color que define el spa (DP-06) |
| Derivados (`brand.solid`, `on-primary`, `primary-hover`, `text`, `text-hover`, `subtle`, `border`) | botones, links, seleccionado de la web de la clienta | Regla de PR #6: `on-primary` blanco o casi negro (el de más contraste); si < 4,5:1, `solid` se oscurece. `text` ≥ 4,5:1 contra `surface.default`, `surface.canvas`/`subtle` y `brand.subtle`; si no, se oscurece en pasos de 2 %. Ajuste automático + aviso; no bloquea. `brand.text` nunca sobre `surface.sunken`/`disabled` |

El foco (`color.focus.ring` + offset) no cambia con la marca.

## Pantallas

### Clienta (mobile-first, 360 px)

| Pantalla | Contenido y acción principal | Estados |
|---|---|---|
| `c-ingresar` | Prefijo +54 9 fijo + número; «Enviarme el código» | Error de formato (10 dígitos) |
| `c-codigo` | Código 6 dígitos (`autocomplete=one-time-code`); «Ingresar»; «Reenviar código» deshabilitado con cuenta regresiva de 45 s (texto asociado), se habilita al llegar a 0 | `c-codigo-error`: intentos restantes · `c-codigo-bloqueado`: sin intentos, espera 15 min, volver a ingresar el número |
| `c-inicio` | Aviso «te toca volver» (info), próximo turno, datos del spa, pack (Fase 2) | Sin turno (CTA reservar) / `c-inicio-con-turno` / `c-inicio-con-pack`: «Mi pack» en la navegación + tarjeta «Mi pack» con «Ver mi pack» y «Darme de baja del pack» |
| `c-reservar-servicios` | Paso 1/3 (sin pack). Checkboxes con duración y precio; barra de resumen con total en vivo (`aria-live=polite`) y «Continuar», fija abajo solo con alto ≥ 30rem | Ninguno elegido → error |
| `c-reservar-servicios-pack` | Paso 1/4 (con pack, entrada desde `c-inicio-con-pack`, `c-pack-activo` y «Reservar» de la navegación con pack). Servicio del mes (radio, «Incluido en tu pack», con precio de lista como referencia) + servicios extra opcionales a precio de lista; barra de resumen «$ X a pagar en el local» | Falta el servicio del mes → error; link «Reservar sin usar el pack» |
| `c-reservar-profesional` | Paso 2/4. Solo con pack y beneficio activo (DP-03): badge «Beneficio de tu pack»; «La primera profesional disponible» + quienes hacen todos los servicios | Sin pack: no aparece |
| `c-reservar-horario-pack`, `c-reservar-confirmar-pack`, `c-reservado-pack` | Pasos 3/4 y 4/4 y éxito con la profesional elegida («Con Carla»); el servicio del mes con badge «Incluido en tu pack»; «A pagar: $ 6.000 en el local» solo por los extras; reservado muestra «Usaste el servicio de diciembre (1 de 3)» | Cancelar dentro del plazo devuelve el servicio al pack |
| `c-reservar-horario` | Paso 2/3 (sin pack). «Con la primera profesional disponible»; días (con «completo» deshabilitado) y horarios donde entra el bloque entero | `c-reservar-sin-horarios`: próximo libre + servicios más cortos |
| `c-reservar-confirmar` | Paso 3/3 (sin pack). Resumen (con quién quedó asignada), política (12 h), opt-in de ofertas (destildado); «Confirmar turno» | `c-reservar-error`: horario tomado mientras confirmaba (no se reserva antes) |
| `c-reservado` | Éxito + resumen + qué avisos va a recibir + cómo cancelar | — |
| `c-mis-turnos` | Próximos con plazo de cancelación y «Cancelar turno»; anteriores con estado (badge con texto) | `c-mis-turnos-vacio` |
| `c-cancelar` | Turno + política + «Sí, cancelar» / «No, mantener» | `c-cancelar-fuera-plazo` |
| `c-cancelado` | Éxito + «Elegir otro día y horario» (cancelar y volver a reservar) | — |
| `c-te-toca-volver` | Repetir lo último (primera profesional disponible); 3 horarios; más días / otros servicios | — |
| `c-whatsapp` | Mock: recordatorios 24 h (con plazo para cancelar) y 2 h, «te toca volver», primera oferta con baja en un toque, confirmación del pago del pack, comprobante de baja | — |
| `c-whatsapp-baja-ofertas` | Resultado de la baja en un toque, sin sesión; los recordatorios siguen | — |
| `c-pack` (Fase 2) | Pack 3 y 12 meses: 1 servicio por mes de la lista del spa a precio de pack (menor que el de lista de todos los servicios incluidos) + elegís profesional; condiciones (pago único, no se renueva, devolución); aviso «propuesta provisoria, sin revisión legal» | `c-pack-pago-pendiente`, `c-pack-pago-error` (ambos sin sesión) |
| `c-pack-activo` | Vigencia, qué incluye, usados, pago y precio por servicio; «Baja del pack» con reglas de devolución | — |
| `c-pack-baja`, `c-pack-baja-ok` | «Te devolvemos $X por N servicios sin usar»; comprobante con trámite, uso y devolución | Dentro de 10 días sin uso: devolución total |

### Profesional (mobile)

| Pantalla | Contenido | Estados |
|---|---|---|
| `p-agenda` | Día: lista ordenada de turnos y bloqueos (bloqueo con fondo `surface.sunken` + texto «Bloqueado»); en cada turno, asistencia («Asistió» / «No vino», `aria-pressed`, estado en texto); día anterior / siguiente; «Bloquear un horario» | `p-agenda-vacia`; turno «Sin marcar» |
| `p-agenda-semana` | Resumen por día (cantidad, completo, bloqueos) con link al día | — |
| `p-bloquear` | Día, desde, hasta (pasos de 15 min), motivo opcional | Falta día; `p-bloquear-conflicto` (el bloqueo no cancela turnos) |
| `p-bloqueado` | Éxito + «Deshacer bloqueo» | — |

### Recepción (tablet/desktop)

| Pantalla | Contenido | Estados |
|---|---|---|
| `r-agenda` | Día por profesional en 3 columnas (1 en mobile); el contador de turnos coincide con los listados (no cuenta bloqueos ni libres); marcar o corregir asistencia de **todos** los turnos que ya empezaron; «Cargar turno» | — |
| `r-cargar-turno` | Dos bloques: 1. Clienta (existente: WhatsApp → «Encontramos a…» con permiso; nueva: nombre + WhatsApp; en ambos, checkbox «Me dijo en persona que acepta recibir ofertas», destildado, DP-05) · 2. Turno (servicios, profesional, día, horario). **Profesional (DP-03 en recepción, decisión provisoria del CDO):** si la clienta encontrada tiene pack activo, el resumen muestra «Tiene pack» y se puede elegir profesional (`r-cargar-turno`); si no tiene pack o es nueva, se muestra «La primera profesional disponible» sin selector (`r-cargar-turno-sin-pack`, y al alternar a «Clienta nueva») | `r-cargar-error`: un único resumen de errores que se rehace al alternar «Ya es clienta» (no lista campos ocultos), sin horarios |
| `r-turno-cargado` | Éxito + permiso registrado (quién, cuándo, «en persona») + «Cargar otro turno» | — |

### Administradora (desktop, responsive)

| Pantalla | Contenido | Estados |
|---|---|---|
| `a-panel` | Período; 3 métricas (turnos con desglose «sin marcar», % asistencia sobre turnos marcados, recompra 60 d) con definición en texto; tarjeta «N turnos sin marcar» con marcado en el lugar; tabla por profesional con columna «Sin marcar» | `a-panel-vacio`: checklist de puesta en marcha |
| `a-servicios` | Tabla (apilada < 40rem) + alta: nombre, duración, precio, días para «te toca volver» | Errores por campo |
| `a-profesionales` | Equipo + horario semanal editable por profesional | `a-profesionales-ok` |
| `a-ajustes` | Política (texto + horas, 12 por defecto), recordatorios 1 (24 h) y 2 (2 h); remite a «Pack» para elegir profesional | — |
| `a-pack` (Fase 2) | Servicios del pack, precio por servicio (3 y 12 meses), beneficio «Elegir profesional», cobro «Configurado» (credenciales cargadas a mano en el piloto); aviso de propuesta provisoria | Precio del pack mayor que el de lista de algún servicio incluido: aviso «El precio del pack tiene que ser menor que el de lista» (`role=status`) con el servicio y el monto; no bloquea el guardado |
| `a-marca` | Nombre, logo, un color; derivación en vivo (PR #6) con contrastes contra `surface.default`, `canvas` y `brand.subtle`; vista previa con link sobre fondo de página y sobre blanco, seleccionado y botón | Color ajustado: aviso con el tono usado y su contraste (se puede guardar) |
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
| Burbuja de mensaje `.bubble` | `surface.default`, borde `border.default`, `shadow.card`, hora `text.muted`; el chat usa `surface.sunken` y por eso los links van solo dentro de la burbuja | — | links internos con foco estándar | — | — | — |
| Asistencia `.attendance` | estado en texto («Asistencia: Sin marcar») + 2 botones secundarios chicos (44 px) | como `.btn--secondary` | anillo | `aria-pressed=true`: `surface.selected` + `border.selected` + «✓»; badge «Asistió» (success) / «No vino» (danger) | — | — |
| Confirmación en el lugar | oculta | — | el título recibe foco al abrir; al cerrar vuelve al botón | botón disparador `aria-expanded=true` | — | — |
| Botón-link con cuenta regresiva (`.btn--link[data-countdown]`) | `text.link` subrayado | grosor de subrayado | anillo | — | `disabled` + `text.muted`, sin subrayado; texto asociado «Podés pedir otro en N s» | — |

## Excepciones de layout (medidas sin token)

No se agregaron valores a `tokens.json`. Estas medidas son de layout, se usan solo en este prototipo y
se proponen como token si se repiten (PDS-03):

| Id | Medida | Dónde | Motivo |
|---|---|---|---|
| L-01 | ~~36 px~~ | `.brand__logo` | resuelto con `size.logo-header` (Sereno) |
| L-02 | 80rem | `.wide` (recepción, administración), `.proto__inner` | ancho de contenido para tablas y 2 columnas; candidato `size.content.wide` |
| L-03 | ~~15rem~~ | navegación lateral | resuelto con `size.sidebar-width` (Sereno) |
| L-04 | 10rem | `scroll-padding-bottom` cuando hay `.summary-bar` | ≥ alto máximo medido de la barra (129 px) con margen; deriva de un alto, no es token |
| L-05 | 10rem | `.input--narrow` (horas en `a-ajustes`) | campo numérico corto |
| L-06 | 14rem | `.input--date` (fecha de envío en `a-campana`) | fecha sola en una fila |
| L-07 | 30rem | `@media (min-height: 30rem)` de la barra fija | por debajo de 480 px de alto la barra no se fija |
| — | 56 px, 6rem, 7rem, 8rem, 32rem, 20 px | alto mínimo del encabezado, `textarea`, tabla apilada, `.choice__body`, burbuja, marcador | heredadas de v0.1; columnas de días/horarios pasan a `component.day-min-width`/`slot-min-width` |

(Se quitó `min-height: calc(100vh - 60px)` del layout de administración: no era necesario.)

## Responsive

- < 40rem: una columna, tablas apiladas (etiqueta + valor), botones a ancho completo.
- ≥ 40rem: grilla de 3 métricas/columnas de agenda; acciones en fila.
- ≥ 64rem: navegación lateral de administración; formularios de recepción y campaña en 2 columnas.

## Fuera de esta spec

Push, instalación de la PWA, reprogramación en un paso, varias campañas, métricas completas, cobro
recurrente, gift cards, reseñas, historial de clienta, señas, app nativa, login con Google/Apple.
