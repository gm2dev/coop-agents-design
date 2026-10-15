# Turnos para peluquería — Diseño (MVP)

Estado: **borrador v0** · Dueño: CDO · Pedido por: Ezequiel Avila · Última revisión: 2026-10-15

> Este borrador se basa en **casos de uso tentativos**. El CPO y el PO están definiendo los casos de uso
> y criterios de aceptación en `gm2dev/coop-agents-product` (todavía vacío). Cuando estén, este diseño
> se ajusta a ellos y se enlazan acá; los IDs CU1–CU4 son provisorios.

## Objetivo de experiencia

Que una persona reserve un turno en la peluquería **desde el celular, en menos de un minuto y sin crear
cuenta**, sabiendo en todo momento qué eligió, cuánto dura, cuánto cuesta y cómo cambiarlo después.
Que el staff vea de un vistazo la agenda del día por profesional y pueda bloquear horarios y cancelar
turnos sin dejar a ningún cliente sin aviso.

## Casos de uso (tentativos)

| ID | Caso de uso | Actor | Flujo | Pantallas |
|---|---|---|---|---|
| CU1 | Reservar un turno | Cliente | [flows.md#cu1](flows.md#cu1--cliente-reserva-un-turno) | P1–P6 |
| CU2 | Consultar, cancelar o reprogramar (link/código) | Cliente | [flows.md#cu2](flows.md#cu2--cliente-consulta-cancela-o-reprograma) | P7–P12 |
| CU3 | Ver agenda del día/semana por profesional | Staff | [flows.md#cu3](flows.md#cu3--staff-ve-la-agenda) | S1–S3 |
| CU4 | Bloquear horarios y cancelar un turno | Staff | [flows.md#cu4](flows.md#cu4--staff-bloquea-horarios-y-cancela-turnos) | S4–S6 |

Casos de uso oficiales: _pendiente — link a `gm2dev/coop-agents-product` cuando exista_.

## Entregables

| Artefacto | Ruta |
|---|---|
| Flujos (Mermaid) | [flows.md](flows.md) |
| Spec de UI | [spec.md](spec.md) |
| Accesibilidad (WCAG 2.2 AA) | [accessibility.md](accessibility.md) |
| Prototipo | [`prototypes/turnos-peluqueria/index.html`](../../prototypes/turnos-peluqueria/index.html) (preview de Vercel: en el PR) |
| Tokens | [`design-system/tokens.json`](../../design-system/tokens.json) vía `prototypes/shared/tokens.css` |

## Decisiones de diseño (CDO)

- Mobile-first, responsive a desktop (breakpoints `breakpoint.md` 40rem y `breakpoint.lg` 64rem).
- WCAG 2.2 AA como mínimo.
- Español rioplatense (voseo: «Elegí», «Revisá»).
- Sin login para el cliente en el MVP; gestión del turno por link o código + celular.
- Solo tokens de `design-system/tokens.json`.

Decisiones del Designer dentro de ese marco (a validar en revisión):

- **Un paso por pantalla** (5 pasos + confirmación) con resumen de lo elegido arriba y «Cambiar» en
  cada paso. Prioriza claridad en mobile sobre densidad.
- **Selector de día y horario con controles nativos**: días como lista de links (`aria-current="date"`)
  y horarios como grupo de radios (`fieldset`/`legend`). Evita una grilla de calendario custom: es
  operable por teclado y lector de pantalla sin ARIA compleja.
- **Profesional opcional con «Cualquiera disponible» preseleccionado**: reduce un paso de decisión.
- **Revisar antes de confirmar** y confirmación idempotente («no se va a duplicar»).
- **Horario tomado** se resuelve en la misma pantalla de revisión, con alternativas cercanas y sin
  perder los datos.
- **Staff**: agenda del día en columnas por profesional (1 columna en mobile, 3 en desktop); semana como
  tabla de datos.

## Supuestos (a validar con producto)

| # | Supuesto | Impacto si es falso |
|---|---|---|
| S1 | El cliente no tiene cuenta ni login; se identifica con nombre + celular. | Cambia P4 y todo CU2. |
| S2 | La gestión del turno es por **link** (enviado por WhatsApp/SMS/email) o **código + celular**. | Cambia P7. |
| S3 | Una reserva = **un servicio**. Combos se modelan como servicio («Corte y barba»). | Multi-servicio cambia P1, P3 y la duración. |
| S4 | El celular es obligatorio y el email opcional. | Cambia validaciones de P4 y canal de avisos. |
| S5 | Se paga en el local; no hay seña ni pago online. | Agregar pago implica pasos nuevos. |
| S6 | Cancelar/reprogramar online se permite hasta **12 h antes**; después, por teléfono. | Copy de P5, P8 y estado «fuera de plazo». |
| S7 | Horarios en bloques según duración del servicio; se muestra hora de inicio. | Cambia P3. |
| S8 | Con «Cualquiera», el sistema asigna profesional al confirmar y se muestra en el resumen. | P5/P6. |
| S9 | Una sola sucursal. | Multi-sede agrega un paso. |
| S10 | El staff entra con un acceso propio (fuera del alcance de este borrador); todo el staff ve todas las agendas. | Roles/permisos en S1–S6. |
| S11 | Bloquear un horario **no** cancela automáticamente los turnos existentes; el staff decide. | S4 conflicto. |
| S12 | Avisos automáticos al cliente al confirmar, reprogramar y cancelar (WhatsApp/SMS y email). | Copy de P6, P10, P12, S6. |

## Preguntas abiertas

| # | Pregunta | Dueño | Estado |
|---|---|---|---|
| Q1 | ¿Confirmamos reserva sin login? ¿Hace falta verificar el celular (código por SMS) para evitar reservas falsas? | CPO | Abierta |
| Q2 | ¿Política de cancelación real (plazo, penalidad, seña)? | CPO | Abierta |
| Q3 | ¿Se pueden reservar varios servicios en un mismo turno? | CPO | Abierta |
| Q4 | ¿Cuántos días hacia adelante se puede reservar? ¿Hay anticipación mínima (p. ej., 2 h)? | CPO | Abierta |
| Q5 | ¿Se muestran precios? ¿Son fijos o «desde»? | CPO | Abierta |
| Q6 | ¿Canal de avisos: WhatsApp, SMS, email? ¿Recordatorio previo al turno? | CPO / Architect | Abierta |
| Q7 | ¿Reprogramar mantiene el mismo profesional o permite cambiarlo? (borrador: mantiene, con opción de cambiar) | CPO | Abierta |
| Q8 | ¿El staff puede crear turnos manuales (por teléfono/mostrador)? No está en CU3/CU4. | CPO | Abierta |
| Q9 | ¿Bloqueos recurrentes (todos los lunes) y horarios de atención por profesional? | CPO | Abierta |
| Q10 | ¿Cómo se evita la doble reserva? ¿Retención temporal del horario mientras se completan los datos? | Architect | Abierta |
| Q11 | ¿Formato y vida útil del link/código de gestión? ¿Es seguro solo con código + celular? | Architect | Abierta |
| Q12 | ¿Zona horaria y feriados? | Architect / CPO | Abierta |
| Q13 | ¿Cómo accede el staff (login, roles, dispositivo principal: tablet en el mostrador o celular)? | CPO / Architect | Abierta |

## Design system

- Se usan solo tokens existentes (color semántico, `font.*`, `space.*`, `radius.*`, `size.target.*`, `focus.*`).
- Componentes definidos en este borrador (propuestos para el design system, **decide el CDO**):
  `Button` (primary/secondary/danger/danger-outline), `OptionCard` (radio en tarjeta), `DayPicker`
  (lista de días), `SlotPicker` (grupo de radios), `SelectionSummary`, `Alert` (danger/success/warning/info),
  `EmptyState`, `Skeleton`, `SummaryList`, `Badge`, `ProgressSteps`, `AgendaColumn`.
- Sin tokens nuevos propuestos.

## Accesibilidad

Ver [accessibility.md](accessibility.md): verificaciones estáticas hechas y **pendientes** para la persona
de diseño sobre el preview de Vercel (teclado real, reflow 320 px/200 %, lector de pantalla).
