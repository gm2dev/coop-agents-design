# Spec de UI — Turnos para peluquería (borrador v0)

Fuente de verdad del comportamiento y el copy; el prototipo lo ilustra
(`prototypes/turnos-peluqueria/`). Si difieren, **gana esta spec** y se reporta la diferencia.
Valores visuales: solo tokens de `design-system/tokens.json` (nombres entre `backticks`).

## Patrones globales

### Layout

- **Mobile (< 40rem)**: una columna, padding lateral `space.400`, ancho completo. Botones de acción a
  ancho completo, apilados; acción principal arriba.
- **≥ 40rem (`breakpoint.md`)**: columna centrada de `size.content.max` (40rem); botones en fila con la
  acción principal a la derecha (orden del DOM: principal primero); campos «Desde/Hasta» en 2 columnas;
  panel con padding `space.600`.
- **≥ 64rem (`breakpoint.lg`)**: el área de staff usa 64rem de ancho y la agenda del día muestra 3
  columnas (una por profesional).
- Todo reflujea a 320 px sin scroll horizontal, salvo la tabla de la semana (S2), que scrollea dentro de
  su contenedor (excepción de 1.4.10 para tablas de datos).

### Estructura de cada pantalla

`skip link «Saltar al contenido»` → `header` (marca; en staff, `nav` «Secciones del staff») → `main`
(volver, progreso, `h1` único, contenido) → pie del prototipo (solo prototipo: navegación de estados).

### Componentes (propuestos al design system, decide el CDO)

| Componente | Uso | Tokens / reglas |
|---|---|---|
| Button primary | 1 acción principal por pantalla | `color.action.primary`, `color.text.on-action`, alto ≥ `size.target.comfortable`, `radius.md` |
| Button secondary | acciones alternativas | fondo `color.surface.default`, borde y texto `color.action.primary` |
| Button danger / danger-outline | cancelar turnos (confirmación / disparador) | `color.action.danger`, `color.feedback.danger.text` |
| Button deshabilitado/ocupado | durante envío | `aria-disabled="true"`, `color.surface.disabled` + `color.text.muted`, texto «Confirmando…» |
| OptionCard | radio nativo visible dentro de tarjeta | borde `color.border.strong`; seleccionada: `color.surface.selected` + borde 2px `color.border.selected` + radio marcado (no solo color); foco: anillo en toda la tarjeta |
| DayPicker | lista de días (links) | día actual `aria-current="date"` + borde 2px + negrita; cerrado: texto «Cerrado», borde punteado, `color.surface.disabled`, no enfocable |
| SlotPicker | `fieldset` + radios con hora de inicio | grilla `auto-fill minmax(6.5rem)`, objetivo ≥ 44px |
| SelectionSummary | resumen de lo elegido + «Cambiar» | borde `color.border.strong` |
| ProgressSteps | «Paso N de 5 · Nombre» en texto + barra decorativa `aria-hidden` | segmentos con borde `color.border.strong` (3:1) |
| Alert | danger / success / warning / info | borde izquierdo 6px + ícono + título textual; pares `color.feedback.*` |
| EmptyState | sin datos con salida | borde punteado, título, explicación y acción |
| Skeleton | carga | `color.surface.disabled`, animación desactivada con `prefers-reduced-motion` |
| SummaryList | `dl` de resumen | `dt` `color.text.muted`, `dd` semibold |
| Badge | estado de turno | texto + ícono + borde (Confirmado / Cancelado / No disponible) |
| AgendaColumn | turnos de un profesional | lista ordenada de turnos; bloqueado: rayado + «No disponible»; cancelado: tachado + «Cancelado» |

### Formularios

- Label visible arriba del campo; ayuda (`hint`) entre label e input, asociada con `aria-describedby`.
- Se marcan los opcionales («(opcional)»), no los obligatorios; aviso al inicio del formulario.
- Validación al enviar: borde 2px `color.feedback.danger.border` + `aria-invalid="true"` + mensaje con
  ícono ⚠ y texto debajo del campo (asociado por `aria-describedby`) + **resumen de errores** arriba con
  links a cada campo; el foco va al resumen. Lo ingresado se conserva.
- `autocomplete` en nombre (`name`), celular (`tel`), email (`email`). Inputs ≥ 16px (evita zoom en iOS).

### Contenido

- Fechas: «jueves 22 de octubre» (completo) y «Jue 22 oct» (corto). Horas 24 h: «15:30».
  Rangos «15:30 a 16:15».
- Moneda: «$12.000» (punto de miles, sin decimales).
- Duración: «45 min», «2 h».
- Celular: «11 5555 0000» (10 dígitos con código de área, sin 0 ni 15).

---

## CU1 — Reservar

### P1 · Servicio — `servicio.html`
- **h1** «¿Qué te querés hacer?» · Paso 1 de 5.
- `fieldset` «Servicio» con OptionCard por servicio: nombre, duración (meta) y precio a la derecha.
  Datos de ejemplo: Corte de pelo 45 min $12.000 · Corte y barba 60 min $16.000 · Arreglo de barba
  30 min $7.000 · Color 2 h $35.000 · Brushing 40 min $9.000.
- Nota: «Precios de referencia. El pago se hace en el local.» (S5, Q5).
- CTA «Continuar».
- **Validación** (`servicio-error.html`): Alert danger «Falta elegir un servicio» con link al grupo +
  mensaje «Elegí un servicio para continuar.» dentro del `fieldset`, asociado a los radios.
- Responsive: ≥ 40rem igual (lista de una columna; legible y escaneable).

### P2 · Profesional — `profesional.html`
- **h1** «¿Con quién?» · Paso 2 de 5 · SelectionSummary del servicio con «Cambiar».
- `fieldset` «Profesional (opcional)», hint «Si no tenés preferencia, dejá «Cualquiera disponible».»
- OptionCards: **Cualquiera disponible** (preseleccionada; «Te asignamos quien tenga el horario libre.
  Muestra más horarios.»), Lucía, Martín, Sofía (con especialidades).
- CTA «Continuar».
- Pregunta: ¿mostrar foto del profesional? (no en v0: sin imágenes).

### P3 · Día y horario — `horario.html`
- **h1** «¿Qué día y a qué hora?» · Paso 3 de 5 · SelectionSummary (servicio + profesional).
- **Día**: `h2` «Día» + `nav` etiquetada con DayPicker (7 días). Cada día muestra día corto y estado en
  texto («Con turnos», «Sin turnos», «Cerrado»). Elegir un día recarga horarios. «Ver más días» pagina
  la semana siguiente.
- **Horario**: `fieldset` «Horarios del jueves 22 de octubre», hint «Hora de inicio. Duración del
  servicio: 45 min.», SlotPicker con radios (solo horarios disponibles; los ocupados no se muestran).
- CTA «Continuar».
- **Teclado**: Tab entra a los días (links) y al grupo de horarios; dentro del grupo, flechas cambian de
  horario (radios nativos). Sin trampas de foco.
- **Estados**:

| Estado | Archivo | Qué se ve | Anuncio / foco |
|---|---|---|---|
| Cargando | `horario-cargando.html` | «Buscando horarios disponibles…» + skeleton | `role="status"` (polite); el skeleton es `aria-hidden` |
| Vacío | `horario-vacio.html` | EmptyState «No quedan horarios el viernes 23 de octubre» + próximo día con horarios (botón) + otro día / cambiar profesional | foco se queda en el día elegido; título del estado legible en orden |
| Error de red | `horario-error-red.html` | Alert danger «No pudimos cargar los horarios», «Lo que elegiste hasta ahora se mantiene», botón «Reintentar» | `role="alert"` |

- Responsive: días en grilla `auto-fill minmax(5.5rem)` (3–4 por fila en mobile, 7 en desktop);
  horarios `minmax(6.5rem)`.

### P4 · Tus datos — `datos.html`
- **h1** «Tus datos» · Paso 4 de 5 · SelectionSummary (servicio, día y hora, profesional).
- Campos: **Nombre y apellido**; **Celular** (hint con formato y uso: recordatorio por WhatsApp/SMS);
  **Email (opcional)** (hint: confirmación y link de gestión); **Comentario para la peluquería
  (opcional)**, máx. 200 caracteres.
- CTA «Revisar turno».
- **Validación** (`datos-error.html`): resumen «Revisá 2 datos para continuar» con links; mensajes
  «Escribí tu nombre.» y «Tiene que tener 10 números. Ej.: 11 5555 0000.»
- Responsive: una columna siempre (campos cortos, mejor lectura).

### P5 · Revisar y confirmar — `revisar.html`
- **h1** «Revisá tu turno» · Paso 5 de 5.
- SummaryList: Servicio, Profesional (si eligió «cualquiera» se indica el asignado), Día y hora (rango),
  Precio («se paga en el local»), A nombre de, Dónde. Cada dato editable con «Cambiar» (nombre accesible
  completo: «Cambiar servicio», etc.).
- Política: «Podés cancelar o reprogramar sin costo hasta 12 h antes» (S6, Q2).
- Acciones: **Confirmar turno** (primary) · Volver (secondary).
- **Estados**:

| Estado | Archivo | Qué se ve | Anuncio / foco |
|---|---|---|---|
| Confirmando | `revisar-enviando.html` | botón «Confirmando…» `aria-disabled`, Alert info «Estamos confirmando tu turno. No cierres esta pantalla.»; sin links «Cambiar» | `role="status"`; evita doble envío |
| Horario tomado | `revisar-tomado.html` | Alert danger «Alguien reservó las 15:30 mientras completabas tus datos», «Tus datos quedan guardados», 2 horarios cercanos como botones + «Ver todos los horarios» | `role="alert"` + foco al Alert |
| Error de red | `revisar-error-red.html` | Alert danger «No pudimos confirmar tu turno… todavía no está reservado. Probá de nuevo; no se va a duplicar.» + «Reintentar confirmación» | `role="alert"` + foco al Alert |

### P6 · Confirmado — `confirmado.html`
- Alert success con **h1** «¡Listo, tu turno está confirmado!» (foco al cargar) y canales de aviso.
- «Código de tu turno» **TF-4821** (grande) + explicación + link de gestión.
- SummaryList sin «Cambiar».
- Acciones: «Gestionar mi turno» (primary) · «Agregar al calendario» (secondary; archivo .ics, a
  validar con tech).

## CU2 — Gestionar

### P7 · Buscar turno — `gestion.html`
- **h1** «Gestionar mi turno». Aclaración: con el link no hace falta completar.
- Campos: Código del turno (hint «Ej.: TF-4821»), Celular con el que reservaste. CTA «Buscar turno».
- **Error** (`gestion-error.html`): Alert «No encontramos un turno con esos datos» + cómo resolverlo; no
  revela cuál de los dos datos falló (seguridad, Q11).

### P8 · Mi turno — `turno.html`
- **h1** «Tu turno», Badge «● Confirmado» + código, SummaryList.
- Acciones: **Reprogramar** (primary) · **Cancelar turno** (danger-outline).
- **Fuera de plazo** (`turno-fuera-de-plazo.html`): Alert warning «Ya no se puede cambiar online.
  Faltan menos de 12 h…» y acción «Llamar a la peluquería» (`tel:`).

### P9 · Cancelar — `cancelar.html`
- **h1** «¿Cancelar tu turno?», resumen en una línea, Motivo (opcional, select), consecuencia
  («El horario queda libre… no se puede deshacer»).
- Acciones: **Sí, cancelar turno** (danger) · No, mantener turno (secondary). Atajo «Reprogramá en
  lugar de cancelar».

### P10 · Cancelado — `turno-cancelado.html`
- Alert success con **h1** «Cancelaste tu turno», Badge «Cancelado», CTA «Reservar otro turno».

### P11 · Reprogramar — `reprogramar.html`
- **h1** «Elegí el nuevo día y horario», «Turno actual: …». Mismo DayPicker/SlotPicker y estados que
  P3; mismo profesional (Q7). CTA «Confirmar nuevo horario». Horario tomado: patrón de P5.

### P12 · Reprogramado — `reprogramado.html`
- Alert success con **h1** «Reprogramaste tu turno», «Tu turno anterior quedó liberado. El código sigue
  siendo TF-4821.», SummaryList nuevo.

## CU3 — Agenda (staff)

Navegación del staff en el header: «Agenda del día» · «Semana» · «Bloquear horario» (página actual con
`aria-current="page"`, fondo seleccionado **y** subrayado).

### S1 · Agenda del día — `staff-agenda.html`
- **h1** «Agenda · jueves 22 de octubre».
- Barra de filtros (`form`): Día (input date), Profesional (select: Todos/…), «Ver»; navegación
  «← Día anterior · Hoy · Día siguiente →».
- AgendaColumn por profesional (`section` con `h2` «Lucía · 3 turnos»), lista ordenada por hora:
  - Turno: «09:30 – 10:15 · Corte de pelo · Carla M.» (link al detalle S3).
  - Bloqueado: rayado + Badge «No disponible» + motivo (link a S4).
  - Cancelado: tachado + Badge «Cancelado» (no enlaza).
- Responsive: 1 columna (< 64rem), 3 columnas (≥ 64rem).
- **Estados**: cargando (`staff-agenda-cargando.html`, `role="status"`), vacío (`staff-agenda-vacia.html`,
  «No hay turnos para el jueves 22 de octubre» + «Bloquear un horario»), error
  (`staff-agenda-error.html`, `role="alert"` + «Reintentar»), éxito tras cancelar
  (`staff-turno-cancelado.html`).

### S2 · Semana — `staff-agenda-semana.html`
- **h1** «Semana del 22 al 28 de octubre», navegación de semanas.
- Tabla: filas = profesionales (`th scope="row"`), columnas = días (`th scope="col"`), celda = «N turnos»
  / «Sin turnos» / «No disponible» / «—» (Cerrado, con texto oculto). Cada celda enlaza a S1 de ese día
  con nombre accesible completo («4 turnos · Lucía, Jue 22»). `caption` oculto describe la tabla.
- Responsive: scroll horizontal dentro de una región enfocable (`tabindex="0"`, etiquetada).
- Pregunta: ¿vista semana con detalle por hora en desktop? (fuera de v0).

### S3 · Detalle del turno — `staff-turno.html`
- **h1** «Turno de Ana P.», Badge, SummaryList (servicio, profesional, día y hora, cliente con `tel:`,
  origen). Acción: «Cancelar turno» (danger-outline).

## CU4 — Bloquear y cancelar (staff)

### S4 · Bloquear horario — `staff-bloquear.html`
- **h1** «Bloquear horario» + explicación.
- Campos: Profesional (incluye «Toda la peluquería»), Día, «Todo el día» (checkbox), Desde / Hasta
  (`input time`, paso 15 min), Motivo (opcional, solo staff). Acciones: **Bloquear horario** · Cancelar.
- **Validación** (`staff-bloquear-error.html`): «Hasta: tiene que ser después de «Desde»».
- **Conflicto** (`staff-bloquear-conflicto.html`): Alert warning «Hay 2 turnos reservados en ese
  horario» con lista y decisión explícita: «Bloquear y cancelar los 2 turnos» / «Bloquear sin cancelar» (S11).
- Pendiente: con «Todo el día» marcado, Desde/Hasta se deshabilitan (requiere JS; no en v0).

### S5 · Bloqueado — `staff-bloqueado.html`
- Alert success con **h1** «Bloqueaste el horario» + detalle. Acciones: «Ver agenda» · «Bloquear otro horario».

### S6 · Cancelar turno — `staff-cancelar.html`
- **h1** «¿Cancelar el turno de Ana P.?», Motivo para la clienta (se incluye en el aviso), checkbox
  «Avisar a la clienta por WhatsApp/SMS y email» (marcado). Acciones: **Sí, cancelar turno** (danger) ·
  No, volver. Éxito: S1 con Alert «Cancelaste el turno de Ana P. …» y el turno tachado.

## Fuera de alcance de v0

Login del staff, creación manual de turnos por el staff (Q8), bloqueos recurrentes (Q9), pagos/señas,
multi-sucursal, recordatorios configurables, notificaciones in-app.
