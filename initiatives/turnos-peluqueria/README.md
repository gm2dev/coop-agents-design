# Turnos para peluquería — Diseño (MVP)

Estado: **v0.2** (menores del Designer Reviewer ronda 2 + recorrido de demo del MVP) · Dueño: CDO ·
Pedido por: Ezequiel Avila · Última revisión: 2026-10-15

> Los casos de uso siguen siendo **tentativos** hasta que el CPO y el PO publiquen casos de uso y criterios
> de aceptación en `gm2dev/coop-agents-product`. Los IDs CU1–CU6 son provisorios.

## Objetivo de experiencia

Que una persona reserve un turno en la peluquería **desde el celular, en menos de un minuto y sin crear
cuenta**, sabiendo en todo momento qué eligió, cuánto dura, cuánto cuesta y cómo cambiarlo después.
Que el staff vea de un vistazo la agenda del día por profesional, cargue turnos pedidos por teléfono y
pueda bloquear horarios y cancelar turnos sin dejar a ninguna clienta sin aviso.

## Casos de uso (tentativos)

| ID | Caso de uso | Actor | Flujo | Pantallas |
|---|---|---|---|---|
| CU1 | Reservar un turno | Cliente | [flows.md#cu1](flows.md#cu1--cliente-reserva-un-turno) | P1–P6 |
| CU2 | Consultar, cancelar o reprogramar (solo con el link del email) | Cliente | [flows.md#cu2](flows.md#cu2--cliente-consulta-cancela-o-reprograma) | P7–P12 |
| CU3 | Ver agenda del día/semana por profesional | Staff | [flows.md#cu3](flows.md#cu3--staff-ve-la-agenda) | S1–S3 |
| CU4 | Bloquear horarios (y editarlos/quitarlos) y cancelar un turno | Staff | [flows.md#cu4](flows.md#cu4--staff-bloquea-horarios-y-cancela-turnos) | S4–S7 |
| CU5 | Ingresar al staff con link mágico | Staff | [flows.md#cu5](flows.md#cu5--staff-ingresa-con-link-mágico) | S0 |
| CU6 | Cargar un turno a mano | Staff | [flows.md#cu6](flows.md#cu6--staff-carga-un-turno-a-mano) | S8–S9 |

Casos de uso oficiales: _pendiente — link a `gm2dev/coop-agents-product` cuando exista_.

## Entregables

| Artefacto | Ruta |
|---|---|
| Flujos (Mermaid) | [flows.md](flows.md) |
| Spec de UI | [spec.md](spec.md) |
| Accesibilidad (WCAG 2.2 AA) | [accessibility.md](accessibility.md) |
| Prototipo (65 pantallas/estados) | [`prototypes/turnos-peluqueria/index.html`](../../prototypes/turnos-peluqueria/index.html) (preview de Vercel: en el PR) |
| Tokens | [`design-system/tokens.json`](../../design-system/tokens.json) → `prototypes/shared/tokens.css` (generado con `node scripts/tokens-to-css.mjs`) |

### Índice de pantallas del prototipo

- **CU1**: [servicio](../../prototypes/turnos-peluqueria/servicio.html) ([error](../../prototypes/turnos-peluqueria/servicio-error.html)) ·
  [profesional](../../prototypes/turnos-peluqueria/profesional.html) ·
  [horario](../../prototypes/turnos-peluqueria/horario.html) ([cargando](../../prototypes/turnos-peluqueria/horario-cargando.html), [vacío](../../prototypes/turnos-peluqueria/horario-vacio.html), [error de red](../../prototypes/turnos-peluqueria/horario-error-red.html)) ·
  [datos](../../prototypes/turnos-peluqueria/datos.html) ([error](../../prototypes/turnos-peluqueria/datos-error.html)) ·
  [revisar](../../prototypes/turnos-peluqueria/revisar.html) ([enviando](../../prototypes/turnos-peluqueria/revisar-enviando.html), [tomado](../../prototypes/turnos-peluqueria/revisar-tomado.html) → [alternativa 16:15](../../prototypes/turnos-peluqueria/revisar-alternativa.html) / [17:00](../../prototypes/turnos-peluqueria/revisar-alternativa-1700.html), [error de red](../../prototypes/turnos-peluqueria/revisar-error-red.html)) ·
  [confirmado](../../prototypes/turnos-peluqueria/confirmado.html)
- **CU2**: [turno](../../prototypes/turnos-peluqueria/turno.html) ([fuera de plazo](../../prototypes/turnos-peluqueria/turno-fuera-de-plazo.html)) ·
  [link inválido](../../prototypes/turnos-peluqueria/link-invalido.html) ·
  [cancelar](../../prototypes/turnos-peluqueria/cancelar.html) ([error](../../prototypes/turnos-peluqueria/cancelar-error.html)) · [cancelado](../../prototypes/turnos-peluqueria/turno-cancelado.html) ·
  [reprogramar](../../prototypes/turnos-peluqueria/reprogramar.html) ([cargando](../../prototypes/turnos-peluqueria/reprogramar-cargando.html), [vacío](../../prototypes/turnos-peluqueria/reprogramar-vacio.html), [error al cargar](../../prototypes/turnos-peluqueria/reprogramar-error-red.html), [tomado](../../prototypes/turnos-peluqueria/reprogramar-tomado.html) → [alternativa 17:00](../../prototypes/turnos-peluqueria/reprogramar-alternativa.html) / [18:30](../../prototypes/turnos-peluqueria/reprogramar-alternativa-1830.html), [error al confirmar](../../prototypes/turnos-peluqueria/reprogramar-error-guardar.html)) · [reprogramado](../../prototypes/turnos-peluqueria/reprogramado.html)
- **CU5**: [ingreso](../../prototypes/turnos-peluqueria/staff-ingreso.html) ([error](../../prototypes/turnos-peluqueria/staff-ingreso-error.html)) · [revisá tu email](../../prototypes/turnos-peluqueria/staff-ingreso-enviado.html) · [link vencido](../../prototypes/turnos-peluqueria/staff-ingreso-vencido.html)
- **CU3**: [agenda](../../prototypes/turnos-peluqueria/staff-agenda.html) ([cargando](../../prototypes/turnos-peluqueria/staff-agenda-cargando.html), [vacía](../../prototypes/turnos-peluqueria/staff-agenda-vacia.html), [error](../../prototypes/turnos-peluqueria/staff-agenda-error.html)) ·
  [semana](../../prototypes/turnos-peluqueria/staff-agenda-semana.html) · [turno](../../prototypes/turnos-peluqueria/staff-turno.html) ([cargado por el staff](../../prototypes/turnos-peluqueria/staff-turno-manual.html))
- **CU4**: [bloquear](../../prototypes/turnos-peluqueria/staff-bloquear.html) ([feriado](../../prototypes/turnos-peluqueria/staff-bloquear-feriado.html), [error](../../prototypes/turnos-peluqueria/staff-bloquear-error.html), [conflicto](../../prototypes/turnos-peluqueria/staff-bloquear-conflicto.html), [confirmar cancelación](../../prototypes/turnos-peluqueria/staff-bloquear-confirmar.html), [error al guardar](../../prototypes/turnos-peluqueria/staff-bloquear-error-guardar.html)) ·
  [bloqueado](../../prototypes/turnos-peluqueria/staff-bloqueado.html) / [con cancelados](../../prototypes/turnos-peluqueria/staff-bloqueado-cancelados.html) ·
  [detalle del bloqueo](../../prototypes/turnos-peluqueria/staff-bloqueo.html) → [editar](../../prototypes/turnos-peluqueria/staff-bloqueo-editar.html) ([error](../../prototypes/turnos-peluqueria/staff-bloqueo-editar-error.html)), [quitar](../../prototypes/turnos-peluqueria/staff-bloqueo-quitar.html) ([error](../../prototypes/turnos-peluqueria/staff-bloqueo-quitar-error.html)), [quitado](../../prototypes/turnos-peluqueria/staff-bloqueo-quitado.html) ·
  [cancelar turno](../../prototypes/turnos-peluqueria/staff-cancelar.html) ([error](../../prototypes/turnos-peluqueria/staff-cancelar-error.html)) → [cancelado](../../prototypes/turnos-peluqueria/staff-turno-cancelado.html)
- **CU6**: [cargar turno](../../prototypes/turnos-peluqueria/staff-cargar.html) ([sin horarios](../../prototypes/turnos-peluqueria/staff-cargar-vacio.html), [error](../../prototypes/turnos-peluqueria/staff-cargar-error.html), [tomado](../../prototypes/turnos-peluqueria/staff-cargar-tomado.html), [error al guardar](../../prototypes/turnos-peluqueria/staff-cargar-error-red.html)) → [cargado](../../prototypes/turnos-peluqueria/staff-cargar-ok.html)

## Alcance de la demo (MVP)

Pedido de Ezequiel (opción B): un **recorrido de demo** con el mínimo para mostrar el MVP. Está arriba en
[`prototypes/turnos-peluqueria/index.html#demo`](../../prototypes/turnos-peluqueria/index.html#demo) (también enlazado desde
`prototypes/index.html`). En el mapa completo cada grupo lleva un Badge existente: `badge-ok` «✓ MVP demo» o
`badge-off` «→ Después del MVP» (ícono + texto, sin tokens nuevos). **No se borró ninguna pantalla**: todas
siguen navegables.

| | Pantallas |
|---|---|
| **MVP demo — clienta** | servicio → profesional → horario (+ horario-vacio) → datos (+ datos-error) → revisar (+ revisar-tomado → revisar-alternativa) → confirmado → turno (link del email) → cancelar → turno-cancelado; link-invalido |
| **MVP demo — peluquería** | staff-ingreso → staff-ingreso-enviado → staff-agenda (día) → staff-turno → staff-bloquear (feriado: staff-bloquear-feriado) → staff-bloqueado |
| **Después del MVP** | reprogramar* y reprogramado (CU2 reprogramar) · staff-cargar*, staff-turno-manual (CU6) · staff-agenda-semana · staff-bloqueo* (editar/quitar) · staff-bloquear-conflicto, -confirmar, staff-bloqueado-cancelados · staff-cancelar*, staff-turno-cancelado · email de recordatorio |

Los estados de soporte de pantallas de la demo (cargando, errores de red, validación, fuera de plazo,
staff-ingreso-vencido, staff-agenda-vacia…) siguen disponibles en el mapa; no son pasos del recorrido.
**Plazo de cancelación: fijo en 2 h** para la demo.

**Links de la demo que llevan a «Después del MVP»** (se dejaron navegables, sin cambiar las pantallas):
- `turno.html` → «Reprogramar» y `cancelar.html` → «Reprogramá en lugar de cancelar» (→ `reprogramar.html`).
- Navegación del staff en `staff-agenda`, `staff-turno`, `staff-bloquear*`, `staff-bloqueado`: «Semana» y «Cargar turno».
- `staff-agenda.html`: los bloques bloqueados enlazan a `staff-bloqueo.html`.
- `staff-turno.html`: «Cancelar turno» (→ `staff-cancelar.html`).
- `staff-bloquear.html` / `-feriado`: «Simular: hay turnos en ese horario» (→ conflicto).

Si para la implementación del MVP se recortan, esos links se ocultan; para la demo conviene no tocarlos.

## Changelog

- **v0.2** — Menores del Designer Reviewer (ronda 2): un solo radio seleccionado en
  `reprogramar-error-guardar`; las alternativas de «horario tomado» ya no confirman solas: llevan a
  `reprogramar-alternativa*.html` / `revisar-alternativa*.html` con el horario preseleccionado y el botón de
  confirmar (4 pantallas nuevas); `staff-bloquear-conflicto` sin botón primario (solo las decisiones del
  Alert); «← Volver al formulario» en `staff-bloquear-confirmar`. Recorrido de demo del MVP y badges en el
  índice. accessibility.md: 31 pantallas con foco inicial; reverificación en 67 páginas.
- **v0.1** — Ronda 1: cambios del Designer Reviewer y decisiones de CPO y Architect.

## Decisiones de diseño (CDO)

- Mobile-first, responsive a desktop (breakpoints `breakpoint.md` 40rem y `breakpoint.lg` 64rem).
- WCAG 2.2 AA como mínimo.
- Español rioplatense (voseo: «Elegí», «Revisá»).
- Sin cuenta para el cliente; la gestión del turno es **solo por el link del email**.
- Color, tipografía, espaciado, radios, objetivos táctiles y foco salen **solo de tokens** de
  `design-system/tokens.json`. Los valores estructurales que todavía no tienen token están listados en
  [Design system](#design-system) como propuesta.

Decisiones del Designer dentro de ese marco:

- **Un paso por pantalla** (5 pasos + confirmación) con resumen de lo elegido arriba y «Cambiar» en
  cada paso.
- **Selector de día y horario con controles nativos**: días como lista de links (`aria-current="date"`)
  y horarios como grupo de radios (`fieldset`/`legend`).
- **Profesional opcional con «Cualquiera disponible» preseleccionado**. Con «cualquiera», el profesional
  se asigna al confirmar: P5 muestra «Cualquier profesional disponible» y P6 muestra el asignado.
- **Revisar antes de confirmar** y confirmación idempotente («no se va a duplicar»).
- **Horario tomado** se resuelve en la misma pantalla (P5, P11, S8) con alternativas y sin perder datos;
  el horario tomado se marca «No disponible», nunca se sigue mostrando como elegido.
- **Ayuda consistente**: pie «¿Necesitás ayuda?» con nombre, teléfono como texto + link `tel:` y dirección,
  en el mismo lugar en todas las pantallas del cliente.
- **Número de referencia** (p. ej. TF-4821): se mantiene solo como referencia para llamar al local
  (confirmación, mi turno, staff). Ya **no** sirve para entrar a gestionar el turno.
- **Reprogramar** tiene pantallas propias dentro de CU2 (no reutiliza las páginas de CU1): el horario
  actual se muestra como referencia y no se preselecciona.
- **Acciones destructivas del staff** (cancelar turnos al bloquear, quitar un bloqueo, cancelar un turno)
  usan botón danger y un paso de confirmación explícito que dice qué se afecta y a quién se avisa.
- **Staff**: agenda del día en columnas por profesional (1 columna en mobile, 3 en desktop); semana como
  tabla de datos con scroll propio. «Cargar turno» como acción principal de la agenda.

## Plazo de cancelación online (S6)

**Para la demo del MVP queda fijo en 2 h.** Antecedente:

Los textos usan **2 h** («Podés cancelar o reprogramar online hasta 2 h antes del turno»; fuera de plazo:
«Faltan menos de 2 h…»). El CPO propone que sea **configurable** por la peluquería; Ezequiel tiene que
decidir entre 12 h fijo y 2 h configurable. El diseño no cambia: **solo cambia el número** en esos textos
(P5, P6, P8, P8 fuera de plazo).

## Supuestos y preguntas — estado v0.1

Estados: **confirmado** (la decisión coincide con el supuesto), **corregido** (la decisión cambió el diseño),
**pendiente** (sin respuesta todavía; el diseño usa el supuesto).

| # | Supuesto / pregunta | Decisión o supuesto vigente | Estado | Fuente |
|---|---|---|---|---|
| S1 | Cliente sin cuenta | Sin cuenta. Se piden nombre, email y celular. | confirmado | CPO |
| S2 / Q11 | Gestión por link o código + celular | **Solo link** por email (token largo que vence cuando pasa el turno). Se eliminó la entrada por código + celular. Link inválido/vencido → pantalla con contacto de la peluquería. | corregido | CPO + Architect |
| S3 / Q3 | Un servicio por reserva | Un servicio por reserva; los combos son un servicio más («Combo corte + brushing»). | confirmado | CPO |
| S4 / Q6 | Celular obligatorio, email opcional; avisos por WhatsApp/SMS | Email **y** celular obligatorios. Avisos **solo por email**. El celular lo usa la peluquería solo para llamar si cancela o mueve el turno. | corregido | CPO |
| S5 | Pago en el local, sin seña | Se mantiene el supuesto. | pendiente de confirmación de producto | CDO (supuesto) |
| S6 / Q2 | Plazo de cancelación 12 h | Textos con 2 h; configurable; decide Ezequiel (ver sección anterior). | pendiente (Ezequiel) | CPO |
| S7 | Bloques según duración; se muestra hora de inicio | Se mantiene el supuesto. | pendiente de confirmación de producto | CDO (supuesto) |
| S8 | «Cualquiera» se asigna al confirmar | Se mantiene; P5 no muestra asignado, P6 sí. | pendiente de confirmación de producto | CDO (supuesto) |
| S9 | Una sola sucursal | Se mantiene el supuesto. | pendiente de confirmación de producto | CDO (supuesto) |
| S10 / Q13 | Acceso del staff fuera de alcance | Login por email con **link mágico**; un solo rol; todos ven todas las agendas. Pantallas S0 agregadas. | corregido | Architect + CPO |
| S11 | Bloquear no cancela solo; el staff decide | Se mantiene; cancelar desde el bloqueo pide confirmación explícita. | pendiente de confirmación de producto | CDO (supuesto) |
| S12 | Avisos al confirmar, reprogramar y cancelar (WhatsApp/SMS y email) | Se mantienen los momentos de aviso, **solo por email**. Recordatorio: «Te mandamos un recordatorio por email el día anterior». | pendiente de confirmación de producto (canal corregido por S4) | CPO / CDO |
| Q1 | ¿Verificar el celular por SMS? | Sin verificación en el MVP (la gestión es por link de email). | pendiente de confirmación de producto | — |
| Q4 | Días hacia adelante y anticipación mínima | Sin definir; el prototipo muestra 7 días. | pendiente de confirmación de producto | — |
| Q5 | ¿Precios fijos o «desde»? | Precios fijos de referencia. | pendiente de confirmación de producto | — |
| Q7 | ¿Reprogramar permite cambiar profesional? | **Decisión CDO v0**: solo día/horario con el mismo profesional; para cambiar de profesional, cancelar y reservar. Queda como pregunta al CPO. | abierta (CPO) | CDO |
| Q8 | ¿El staff carga turnos a mano? | Sí, en el MVP. Pantallas S8–S9 agregadas. | corregido | CPO |
| Q9 | Bloqueos recurrentes y horario por profesional | Fuera del MVP (no hay respuesta). | pendiente de confirmación de producto | — |
| Q10 | ¿Retención temporal del horario? | **No** se retiene; se valida al confirmar. Si está tomado: alternativas, sin aviso de tiempo restante. | confirmado | Architect |
| Q12 | Zona horaria y feriados | Zona horaria fija del local. Feriados = bloqueo de «Toda la peluquería», todo el día, motivo «Feriado». | corregido | Architect + CPO |
| Q14 | ¿Ofrecer «Reenviarme el link por email» en la pantalla de link inválido? | No prototipado; hoy la salida es llamar a la peluquería o reservar de nuevo. | abierta (Architect / CPO) | CDO |
| Q15 | ¿Cuánto dura el link mágico del staff? (el prototipo dice 15 min, un solo uso) | Supuesto de diseño. | abierta (Architect) | CDO |
| Q16 | Cargar turno manual: ¿email de la clienta obligatorio también desde el staff (clientas sin email)? | El prototipo lo pide obligatorio, igual que online. | abierta (CPO) | CDO |

## Design system

**Componentes locales de la iniciativa.** Los componentes de abajo son **locales de esta iniciativa**
(decisión CDO): no forman parte del design system. Su promoción al design system se decide después con la
persona dueña de diseño.

`Button` (primary / secondary / danger / danger-outline / **deshabilitado-ocupado**), `OptionCard`,
`DayPicker`, `SlotPicker`, `SelectionSummary`, `ProgressSteps`, `Alert` (danger / success / warning / info),
`EmptyState`, `Skeleton`, `SummaryList`, `Badge`, `AgendaColumn`, más `ContactFooter` (pie de ayuda del
cliente) agregado en esta ronda.

`Badge`: siempre **ícono + texto** (nunca solo color). Variantes: `badge-ok` «● Confirmado»,
`badge-off` «✕ Cancelado» y «⊘ No disponible». **Cancelado es uno solo**: neutro (`badge-off`) en cliente
y staff (decisión CDO).

**Tokens.** No se agregan tokens en esta iteración (cambiar el design system requiere aprobación de la
persona dueña de diseño). Color, tipografía, espaciado, radios, objetivos táctiles y foco salen de tokens.
Estos valores estructurales **no tienen token** y quedan como **propuesta de tokens nuevos, pendiente de
aprobación**. En `styles.css` están agrupados al inicio como variables locales `--x-*`, así que migrar es
renombrarlas:

| Valor | Uso | Propuesta de token |
|---|---|---|
| 1 px | bordes de controles, paneles, separadores | `border.width.thin` |
| 2 px | seleccionado, error, día actual, encabezado de tabla | `border.width.thick` |
| 6 px | borde izquierdo de Alert y de turno en la agenda | `border.width.accent` |
| 6 px (alto) | barra de progreso | `layout.progress.height` |
| 8 / 16 px | rayado de bloqueos | `layout.stripe.size` |
| 64rem | ancho del área de staff (= `breakpoint.lg`) | `layout.staff.max` |
| minmax 5.5rem / 6.5rem | grillas de días y horarios | `layout.day-picker.min`, `layout.slot-picker.min` |
| .08em | letter-spacing del número de referencia | `font.letter-spacing.wide` |
| 1.4 s | pulso del skeleton (se apaga con `prefers-reduced-motion`) | `motion.duration.pulse` |

## Accesibilidad

Ver [accessibility.md](accessibility.md): verificaciones automáticas con Chromium headless (reflow a 320 y
640 px con y sin override de espaciado de texto, Tab a 375 px, foco inicial) en las 66 páginas de la carpeta del prototipo + el índice general, y
**pendientes** para la persona de diseño (lector de pantalla, celular real).
