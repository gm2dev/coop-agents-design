# Spec de UI — Turnos para peluquería (v0.2)

Fuente de verdad del comportamiento y el copy; el prototipo lo ilustra
(`prototypes/turnos-peluqueria/`). Si difieren, **gana esta spec** y se reporta la diferencia.
Color, tipografía, espaciado, radios, objetivos táctiles y foco: solo tokens de
`design-system/tokens.json` (nombres entre `backticks`). Valores estructurales sin token: ver
[README § Design system](README.md#design-system) (propuesta pendiente de aprobación).

## Patrones globales

### Layout

- **Mobile (< 40rem)**: una columna, padding lateral `space.400`, ancho completo. Botones de acción a
  ancho completo, apilados; acción principal arriba.
- **≥ 40rem (`breakpoint.md`)**: columna centrada de `size.content.max` (40rem); botones en fila con la
  acción principal a la derecha (orden del DOM: principal primero); campos «Desde/Hasta» en 2 columnas;
  panel con padding `space.600`.
- **≥ 64rem (`breakpoint.lg`)**: el área de staff usa 64rem de ancho y la agenda del día muestra 3
  columnas (una por profesional).
- Todo reflujea a 320 px sin scroll horizontal, salvo la tabla de la semana (S2), que scrollea **dentro de
  su contenedor** (`.table-wrap` con `position: relative` para contener el texto oculto de las celdas).

### Estructura de cada pantalla

`skip link «Saltar al contenido»` → `header` (marca; en staff logueado, `nav` «Secciones del staff»:
Agenda del día · Semana · Cargar turno · Bloquear horario · Salir) → `main` (volver, progreso, `h1` único,
contenido) → **pie de ayuda** (solo cliente) → pie del prototipo (`aside`, solo prototipo: estados).

### Pie de ayuda del cliente (ContactFooter) — 3.2.6

En **todas** las pantallas del cliente, en el mismo lugar (después de `main`), con el mismo orden:

> **¿Necesitás ayuda?** · **Tijera Fina** · Teléfono: [11 5555 0100](tel:+541155550100) (texto visible +
> link `tel:`) · Av. Siempreviva 742, CABA · Martes a sábado, de 9 a 19 h (dirección y horario opcionales,
> según configure la peluquería).

`footer` con `h2` «¿Necesitás ayuda?», fondo `color.surface.default`, borde superior `color.border.strong`,
link con alto ≥ `size.target.min`.

### Componentes locales de la iniciativa

Son **locales de esta iniciativa** (decisión CDO); su promoción al design system se decide después con la
persona dueña de diseño.

| Componente | Uso | Tokens / reglas |
|---|---|---|
| Button primary | 1 acción principal por pantalla | `color.action.primary`, `color.text.on-action`, alto ≥ `size.target.comfortable`, `radius.md` |
| Button secondary | acciones alternativas | fondo `color.surface.default`, borde y texto `color.action.primary` |
| Button danger | confirmar una acción destructiva (cancelar turnos, quitar bloqueo) | `color.action.danger`, `color.text.on-action` |
| Button danger-outline | disparar una acción destructiva que lleva a confirmación | borde `color.action.danger`, texto `color.feedback.danger.text` |
| Button deshabilitado/ocupado | durante envío | `aria-disabled="true"`, `color.surface.disabled` + `color.text.muted`, texto «Confirmando…» |
| OptionCard | radio nativo visible dentro de tarjeta | borde `color.border.strong`; seleccionada: `color.surface.selected` + borde grueso `color.border.selected` + radio marcado; foco en toda la tarjeta |
| DayPicker | lista de días (links) | día actual `aria-current="date"` + borde grueso + negrita; cerrado: texto «Cerrado», borde punteado, `color.surface.disabled`, no enfocable |
| SlotPicker | `fieldset` + radios con hora de inicio | grilla `auto-fill`, objetivo ≥ 44px |
| SelectionSummary | resumen de lo elegido + «Cambiar» | borde `color.border.strong` |
| ProgressSteps | «Paso N de 5 · Nombre» en texto + barra decorativa `aria-hidden` | segmentos con borde `color.border.strong` |
| Alert | danger / success / warning / info | borde izquierdo de acento + ícono + título textual; pares `color.feedback.*` |
| EmptyState | sin datos con salida | borde punteado, título, explicación y acción |
| Skeleton | carga | `color.surface.disabled`, animación desactivada con `prefers-reduced-motion` |
| SummaryList | `dl` de resumen | `dt` `color.text.muted`, `dd` semibold |
| Badge | estado | **siempre ícono + texto**: `badge-ok` «● Confirmado»; `badge-off` (neutro: `color.text.muted` sobre `color.surface.disabled`, borde `color.border.strong`) «✕ Cancelado» y «⊘ No disponible». Cancelado es **uno solo** en cliente y staff. |
| AgendaColumn | turnos de un profesional | lista ordenada; bloqueado: rayado + Badge «No disponible» (enlaza a S7); cancelado: tachado + Badge «Cancelado» |
| ContactFooter | ayuda consistente del cliente | ver arriba |

### Formularios

- Label visible arriba del campo; ayuda (`hint`) entre label e input, asociada con `aria-describedby`.
- Se marcan los opcionales («(opcional)»), no los obligatorios; aviso al inicio del formulario.
- Validación al enviar: borde grueso `color.feedback.danger.border` + `aria-invalid="true"` +
  `aria-describedby` que incluye el hint **y** el mensaje de error (ícono ⚠ + texto) + **resumen de
  errores** arriba con links a cada campo; el foco va al resumen. Lo ingresado se conserva.
- `autocomplete` en nombre (`name`), celular (`tel`), email (`email`) para la clienta; `off` cuando el staff
  carga datos de otra persona. Inputs ≥ 16px.

### Errores al guardar una acción (patrón)

Alert danger con foco, título «No pudimos …», y **qué quedó como estaba** («Tu turno sigue reservado»,
«El horario no quedó bloqueado y no se canceló ningún turno», «El turno todavía no está cargado y no le
mandamos nada a la clienta»). El formulario conserva lo cargado; el botón principal pasa a «Reintentar …».
Reintentar no duplica (idempotencia, a implementar).

### Contenido

- Fechas: «jueves 22 de octubre» (completo) y «Jue 22 oct» (corto). Horas 24 h: «15:30».
  Rangos «15:30 a 16:15». Zona horaria fija del local (Q12): no se muestra zona.
- Moneda: «$12.000». Duración: «45 min», «2 h», «1 h 15 min».
- Celular: «11 5555 0000» (10 dígitos con código de área, sin 0 ni 15).
- Plazo de cancelación: **2 h** en todos los textos (pendiente de Ezequiel; solo cambia el número).
- Avisos: **solo por email**. Recordatorio: «Te mandamos un recordatorio por email el día anterior».

---

## CU1 — Reservar

### P1 · Servicio — `servicio.html`
- **h1** «¿Qué te querés hacer?» · Paso 1 de 5.
- `fieldset` «Servicio» con OptionCard por servicio: nombre, duración y precio. Datos de ejemplo: Corte de
  pelo 45 min $12.000 · Corte y barba 60 min $16.000 · Arreglo de barba 30 min $7.000 · Color 2 h
  $35.000 · Brushing 40 min $9.000 · **Combo corte + brushing 1 h 15 min $19.000** (combo = un servicio
  más, S3).
- Nota: «Un servicio por turno: los combos figuran como un servicio más. Precios de referencia; el pago se
  hace en el local.»
- **Validación** (`servicio-error.html`): Alert danger «Falta elegir un servicio» con link al grupo +
  mensaje dentro del `fieldset`, asociado a los radios.

### P2 · Profesional — `profesional.html`
- **h1** «¿Con quién?» · Paso 2 de 5 · SelectionSummary con «Cambiar».
- `fieldset` «Profesional (opcional)». OptionCards: **Cualquiera disponible** (preseleccionada), Lucía,
  Martín, Sofía.

### P3 · Día y horario — `horario.html`
- **h1** «¿Qué día y a qué hora?» · Paso 3 de 5 · SelectionSummary.
- **Día**: `h2` «Día» + `nav` etiquetada con DayPicker (7 días) con estado en texto.
- **Horario**: `fieldset` «Horarios del jueves 22 de octubre», hint «Hora de inicio, en horario de la
  peluquería. Duración del servicio: 45 min.», SlotPicker (solo horarios disponibles).

| Estado | Archivo | Qué se ve | Anuncio / foco |
|---|---|---|---|
| Cargando | `horario-cargando.html` | «Buscando horarios disponibles…» + skeleton | `role="status"`; skeleton `aria-hidden` |
| Vacío | `horario-vacio.html` | EmptyState + próximo día con horarios + otro día / cambiar profesional | foco en el día elegido |
| Error de red | `horario-error-red.html` | Alert danger «No pudimos cargar los horarios» + «Reintentar» | `role="alert"` |

### P4 · Tus datos — `datos.html`
- **h1** «Tus datos» · Paso 4 de 5 · SelectionSummary. Aviso: «No hace falta crear una cuenta.»
- Campos, **todos obligatorios** salvo el comentario:
  - **Nombre y apellido**.
  - **Email** — hint «Te mandamos la confirmación, el recordatorio y el link para cancelar o reprogramar.»
  - **Celular** — hint «Con código de área, sin 0 ni 15. Ej.: 11 5555 0000. La peluquería lo usa solo para
    llamarte si tiene que cancelar o mover tu turno.»
  - **Comentario para la peluquería (opcional)**, máx. 200 caracteres.
- **Validación** (`datos-error.html`): resumen «Revisá 3 datos para continuar» (Nombre, Email, **Celular**
  — mismo nombre que el campo) con links; mensajes junto a cada campo.

### P5 · Revisar y confirmar — `revisar.html`
- **h1** «Revisá tu turno» · Paso 5 de 5.
- SummaryList: Servicio, **Profesional** («Cualquier profesional disponible (te lo asignamos al
  confirmar)» si eligió cualquiera; nunca un asignado en esta pantalla), Día y hora, Precio, A nombre de
  (nombre · email · celular), Dónde. Cada dato con «Cambiar …».
- «Podés cancelar o reprogramar online hasta 2 h antes del turno. Te mandamos la confirmación y un
  recordatorio por email.»
- Acciones: **Confirmar turno** · Volver.

| Estado | Archivo | Qué se ve | Anuncio / foco |
|---|---|---|---|
| Confirmando | `revisar-enviando.html` | botón «Confirmando…» `aria-disabled`; Alert info; **sin** «← Tus datos», sin «Cambiar» ni «Volver» | `role="status"`; evita doble envío |
| Horario tomado | `revisar-tomado.html` | Alert danger «Alguien reservó las 15:30 mientras completabas tus datos» + alternativas (Jue 22 · 16:15 / 17:00, llevan a `revisar-alternativa.html` / `revisar-alternativa-1700.html`) + «Ver todos los horarios». En el resumen, Día y hora: «15:30» con Badge «⊘ No disponible» y «Elegí otro horario.»; CTA «Elegir otro horario» (no «Confirmar») | `role="alert"` + foco al Alert |
| Con alternativa | `revisar-alternativa.html` · `revisar-alternativa-1700.html` | resumen con el horario nuevo (16:15 a 17:00 / 17:00 a 17:45); Alert info «Cambiaste el horario… Tus datos se conservaron»; **Confirmar turno** | `role="status"` |
| Error de red | `revisar-error-red.html` | Alert danger «…todavía no está reservado. Probá de nuevo; no se va a duplicar.» + «Reintentar confirmación» | `role="alert"` + foco |

No hay retención del horario ni aviso de tiempo restante (Architect, Q10).

### P6 · Confirmado — `confirmado.html`
- Alert success con **h1** «¡Listo, tu turno está confirmado!» (foco al cargar): «Te mandamos la
  confirmación a ana@ejemplo.com, con el link para cancelar o reprogramar.» + «**Te mandamos un
  recordatorio por email el día anterior.**»
- SummaryList: Profesional **asignado** («Martín (te lo asignamos: elegiste «cualquier profesional»)»),
  Día y hora, Precio, A nombre de, Dónde, **Referencia TF-4821 (si llamás a la peluquería)**.
- Bloque «¿Necesitás cancelar o cambiar el horario?»: «Usá el link del email de confirmación. Podés
  cancelar o reprogramar online hasta 2 h antes del turno. Después, llamá a la peluquería.»
- Acción: «Agregar al calendario» (secondary; .ics, a validar con tech).
- **Número de referencia**: decisión CDO — se mantiene solo como referencia para hablar con el local y
  para el staff; no da acceso a nada.

## CU2 — Gestionar (solo con el link del email)

### P7 · Link inválido o vencido — `link-invalido.html`
- Reemplaza el formulario código + celular (eliminado: `gestion.html`, `gestion-error.html`).
- Alert warning con **h1** «Este link no funciona» (foco): «Puede que esté incompleto, que el turno ya haya
  pasado o que lo hayan cancelado.»
- «¿Qué podés hacer?»: abrir el link completo desde el email; llamar a la peluquería (teléfono como texto +
  `tel:`). Acciones: **Llamar a la peluquería** · Reservar un turno nuevo.
- Pregunta abierta (Q14): «Reenviarme el link por email».

### P8 · Mi turno — `turno.html`
- Aviso «Entraste con el link de tu email de confirmación.» · **h1** «Tu turno» · Badge «● Confirmado» ·
  Referencia · SummaryList · «Podés cancelar o reprogramar online hasta 2 h antes del turno.»
- Acciones: **Reprogramar** (primary) · **Cancelar turno** (danger-outline).
- **Fuera de plazo** (`turno-fuera-de-plazo.html`): Alert warning «Ya no se puede cambiar online. Faltan
  menos de 2 h…» + «Llamar a la peluquería» (`tel:`).

### P9 · Cancelar — `cancelar.html`
- **h1** «¿Cancelar tu turno?», resumen, Motivo (opcional), consecuencia, «Te mandamos la confirmación por
  email.» Acciones: **Sí, cancelar turno** (danger) · No, mantener turno. Atajo «Reprogramá en lugar de
  cancelar».
- **Error al cancelar** (`cancelar-error.html`): Alert danger «No pudimos cancelar tu turno. … Tu turno
  **sigue reservado**. Probá de nuevo o llamá a la peluquería.» + «Reintentar cancelación».

### P10 · Cancelado — `turno-cancelado.html`
- Alert success **h1** «Cancelaste tu turno», email de confirmación, Badge «✕ Cancelado» (neutro), CTA
  «Reservar otro turno».

### P11 · Reprogramar — `reprogramar*.html` (pantallas propias de CU2)
- «← Tu turno» · **h1** «Elegí el nuevo día y horario».
- Referencia: «**Tu turno actual:** jue 22, 15:30 · Corte de pelo · con Martín». El horario actual **no** se
  preselecciona ni figura en la grilla («Tu horario actual (15:30) no figura.»).
- «Podés cambiar el día y el horario con el mismo profesional. Si querés otro profesional, cancelá y
  reservá un turno nuevo.» (Q7, decisión CDO v0).
- DayPicker propio (enlaza a `reprogramar.html` / `reprogramar-vacio.html`, nunca a CU1) + SlotPicker sin
  selección. Acciones: **Confirmar nuevo horario** · No cambiar mi turno.

| Estado | Archivo | Qué se ve | Anuncio / foco |
|---|---|---|---|
| Cargando | `reprogramar-cargando.html` | «Buscando horarios…» + skeleton | `role="status"` |
| Vacío | `reprogramar-vacio.html` | «No quedan horarios con Martín el viernes 23» + próximo día + volver sin cambiar | — |
| Error al cargar | `reprogramar-error-red.html` | Alert danger «No pudimos cargar los horarios… Tu turno sigue igual.» + «Reintentar» | `role="alert"` |
| Horario tomado | `reprogramar-tomado.html` | Alert danger «Alguien reservó el jueves 22 a las 16:15 antes que vos… tu turno sigue igual» + alternativas (17:00 / 18:30); las 16:15 ya no figuran | `role="alert"` + foco |
| Alternativa elegida | `reprogramar-alternativa.html` · `reprogramar-alternativa-1830.html` | horario de la alternativa preseleccionado, Alert info «Elegiste… Hasta que confirmes, tu turno sigue igual»; reprograma recién con **Confirmar nuevo horario** | `role="status"` |
| Error al confirmar | `reprogramar-error-guardar.html` | Alert danger «No pudimos reprogramar tu turno… Tu turno sigue igual (jue 22, 15:30)» + selección conservada (11:30, una sola) + «Reintentar» | `role="alert"` + foco |

### P12 · Reprogramado — `reprogramado.html`
- Alert success **h1** «Reprogramaste tu turno», «Tu turno anterior (jueves 22, 15:30) quedó liberado.
  Te mandamos la confirmación por email, con el link actualizado.», SummaryList nuevo. El texto largo
  hace `overflow-wrap` (sin desborde a 320 px con override de espaciado, 1.4.12).

## CU5 — Ingreso del staff (link mágico)

Sin `nav` de staff (todavía no entró). Sin contraseña.

### S0 · Ingresar — `staff-ingreso.html`
- **h1** «Ingresar al staff»; «Te mandamos un link a tu email para entrar. No hace falta contraseña.»
- Campo **Email** (hint «El email con el que la peluquería te dio de alta.»). CTA «Mandarme el link».
- **Validación** (`staff-ingreso-error.html`): resumen + mensaje «Falta el @ o el dominio…».
- **Enviado** (`staff-ingreso-enviado.html`): **h1** «Revisá tu email»; «Si lucia@tijerafina.com está dado
  de alta en el staff, te mandamos un link… Vence en 15 minutos y se usa una sola vez.» (no revela si el
  email existe). «¿No te llegó?» + «Usar otro email o pedir otro link».
- **Link vencido/usado** (`staff-ingreso-vencido.html`): **h1** «Este link ya no sirve» + «Pedir un link
  nuevo».
- Duración del link: supuesto (Q15). Un solo rol: todos ven todas las agendas.

## CU3 — Agenda (staff)

### S1 · Agenda del día — `staff-agenda.html`
- **h1** «Agenda · jueves 22 de octubre» + botón **Cargar turno** (primary, entrada a CU6).
- Filtros (Día, Profesional, «Ver») y navegación de días.
- AgendaColumn por profesional: turno (link a S3), bloqueado (link a **S7 detalle del bloqueo**),
  cancelado (tachado + «✕ Cancelado», no enlaza).
- **Estados**: cargando, vacío, error, éxito tras cancelar (`staff-turno-cancelado.html`).

### S2 · Semana — `staff-agenda-semana.html`
- Tabla profesionales × días; celdas con nombre accesible completo. Scroll horizontal dentro de
  `.table-wrap` (región enfocable `tabindex="0"`, etiquetada, `position: relative`): la página queda en 320 px.

### S3 · Detalle del turno — `staff-turno.html` · `staff-turno-manual.html`
- **h1** «Turno de Ana P.», Badge, SummaryList (servicio, profesional, día y hora, clienta con `tel:`,
  **Reservado**: «Online, 15 de octubre» o «Cargado por el staff, 20 de octubre»). Acción «Cancelar turno»
  (danger-outline).

## CU4 — Bloquear y cancelar (staff)

### S4 · Bloquear horario — `staff-bloquear.html`
- Campos: Profesional (incluye «Toda la peluquería»), Día, «Todo el día», Desde / Hasta, Motivo (opcional,
  solo staff). Hint de motivo: «Ej.: Almuerzo, Capacitación, Feriado.»
- **Feriado** (`staff-bloquear-feriado.html`): ejemplo «Toda la peluquería» + «Todo el día» + motivo
  «Feriado», con nota «No hay calendario de feriados automático en el MVP.» (Q12).
- **Validación** (`staff-bloquear-error.html`).
- **Conflicto** (`staff-bloquear-conflicto.html`): Alert warning «Hay 2 turnos reservados en ese horario»
  con lista; «Bloquear sin cancelar los turnos» (secondary) · «Bloquear y cancelar los 2 turnos…»
  (danger-outline, lleva a confirmación). En este estado **no** hay botón primario «Bloquear horario»: solo
  las decisiones del Alert y «Cancelar».
- **Confirmar cancelación** (`staff-bloquear-confirmar.html`): **h1** «¿Bloquear y cancelar 2 turnos?»;
  qué período; lista de turnos con nombre y email de cada clienta; Motivo para las clientas (se incluye en
  el email); Alert warning «A cada clienta le avisamos por email que su turno se canceló. Esta acción no se
  puede deshacer.» Acciones: **Sí, bloquear y cancelar 2 turnos** (danger) · No, volver. Link superior «← Volver al formulario».
- **Error al guardar** (`staff-bloquear-error-guardar.html`): «No pudimos guardar el bloqueo… El horario no
  quedó bloqueado y no se canceló ningún turno.» + «Reintentar».

### S5 · Bloqueado — `staff-bloqueado.html` · `staff-bloqueado-cancelados.html`
- Sin turnos afectados: **h1** «Bloqueaste el horario» + detalle.
- Con cancelación: **h1** «Bloqueaste el horario y cancelaste 2 turnos» + «Les avisamos por email a Tomás L.
  y Ana P. que su turno se canceló.»
- Acciones: «Ver agenda» · «Bloquear otro horario».

### S7 · Detalle del bloqueo — `staff-bloqueo.html`
- Desde el bloqueo en la agenda. **h1** «Bloqueo de Lucía», Badge «⊘ No disponible», SummaryList
  (profesional, día y hora, motivo, creado). Acciones: **Editar bloqueo** · **Quitar bloqueo**
  (danger-outline).
- **Editar** (`staff-bloqueo-editar.html`): mismo formulario que S4 con los datos cargados; «Guardar
  cambios». Si el nuevo período se superpone con turnos → advertencia de S4 (conflicto). Error
  (`staff-bloqueo-editar-error.html`): «El bloqueo sigue como estaba».
- **Quitar** (`staff-bloqueo-quitar.html`): **h1** «¿Quitar el bloqueo de Lucía?»; «Ese período vuelve a
  estar disponible para reservar online. Los turnos cancelados al crear el bloqueo no se recuperan.»
  **Sí, quitar bloqueo** (danger) · No, volver. Error (`staff-bloqueo-quitar-error.html`): «El horario sigue
  bloqueado». Éxito (`staff-bloqueo-quitado.html`).

### S6 · Cancelar turno — `staff-cancelar.html`
- **h1** «¿Cancelar el turno de Ana P.?», Motivo para la clienta, checkbox «Avisar a la clienta por email
  (ana@ejemplo.com)» (marcado). **Sí, cancelar turno** (danger) · No, volver.
- **Error** (`staff-cancelar-error.html`): «El turno sigue reservado y no le avisamos nada a la clienta.»
- Éxito: S1 con Alert y el turno tachado.

## CU6 — Cargar turno a mano (staff)

### S8 · Cargar turno — `staff-cargar.html`
- Entrada: botón «Cargar turno» de la agenda y `nav` del staff. «← Agenda del día».
- **h1** «Cargar turno»; «Para turnos pedidos por teléfono o en el local. La clienta recibe la misma
  confirmación por email que si reservara online.»
- `fieldset` «Turno»: Servicio (select, incluye combos), Profesional (select), DayPicker, SlotPicker
  (reutilizados de CU1). `fieldset` «Datos de la clienta»: Nombre y apellido, Email, Celular (mismas
  validaciones y formatos que P4; `autocomplete="off"`).
- Acciones: **Cargar turno** · Cancelar.

| Estado | Archivo | Qué se ve | Anuncio / foco |
|---|---|---|---|
| Sin horarios | `staff-cargar-vacio.html` | EmptyState «Martín no tiene horarios libres el viernes 23» + próximo día | — |
| Validación | `staff-cargar-error.html` | resumen «Revisá 3 datos» (Horario, Email, Celular) + mensajes por campo | `role="alert"` + foco |
| Horario tomado | `staff-cargar-tomado.html` | «Las 16:15 con Martín se reservaron recién. El turno no se cargó. Los datos de la clienta se mantienen» y las 16:15 ya no figuran | `role="alert"` + foco |
| Error al guardar | `staff-cargar-error-red.html` | «El turno todavía no está cargado y no le mandamos nada a la clienta… no se va a duplicar» + «Reintentar» | `role="alert"` + foco |

### S9 · Turno cargado — `staff-cargar-ok.html`
- Alert success **h1** «Cargaste el turno de Rosa Gómez» + detalle + «Le mandamos la confirmación a
  rosa@ejemplo.com, con el link para cancelar o reprogramar.» Acciones: Ver agenda · Ver el turno
  (`staff-turno-manual.html`) · Cargar otro turno.

## Fuera de alcance

Bloqueos recurrentes (Q9), pagos/señas (S5), multi-sucursal (S9), avisos por WhatsApp/SMS, notificaciones
in-app, reenvío del link de gestión (Q14, pregunta abierta), roles de staff.
