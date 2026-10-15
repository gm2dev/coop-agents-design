# Turnos para peluquería — MVP, Hito 1 (demo interna)

- **Estado:** borrador v0.1 para revisión del Designer Reviewer y del CDO
- **Fuente de verdad (producto):** [casos-de-uso.md](https://github.com/gm2dev/coop-agents-product/blob/po/turnos-peluqueria-mvp/initiatives/turnos-peluqueria-mvp/casos-de-uso.md)
  (rama `po/turnos-peluqueria-mvp`, PR #4 del repo de producto, todavía sin merge). Acá se enlazan los CU, reglas
  (RN-…), requisitos (RNF-…), decisiones (D-…) y preguntas (P-…); no se copian.
- **Prototipo:** [`prototypes/turnos-peluqueria-mvp/index.html`](../../prototypes/turnos-peluqueria-mvp/index.html)
  (índice con los dos recorridos de demo y todas las pantallas y estados)
- **Documentos:** [flows.md](flows.md) · [spec.md](spec.md) · [accessibility.md](accessibility.md)

## Objetivo

Que en la demo interna de H1 (D-8: datos de prueba, sin clientes reales) Ezequiel y alguna peluquera puedan
recorrer de punta a punta:

1. **Cliente (celular):** reservar sin cuenta en 5 pasos (servicio → peluquero o “Cualquiera disponible” →
   día y horario → datos → revisar y confirmar) y llevarse el turno **sin que se le envíe nada**: la
   confirmación es el único momento de entrega (D-1, RN-12).
2. **Panel del local (tablet, PC o celular):** ingresar con usuario y contraseña, ver la agenda del día y de la
   semana por peluquero, y configurar servicios, peluqueros con su horario semanal y datos del local.

La pregunta que tiene que contestar la demo: *¿el flujo se entiende sin ayuda y el cliente se da cuenta de que
tiene que guardar su link?*

## Alcance (H1)

| CU | Título | Pantallas del prototipo |
|---|---|---|
| CU-01 | Ver servicios | `servicios`, `-cargando`, `-vacio`, `-error` |
| CU-02 | Ver horarios libres | `peluquero`, `horario`, `-cargando`, `-vacio`, `-limite`, `-error` |
| CU-03 | Reservar un turno | `datos`, `datos-error`, `revisar`, `-enviando`, `-error` |
| CU-04 | Reserva simultánea | `horario-ocupado` |
| CU-05 | Confirmación y calendario | `confirmacion`, `turno.ics`, `turno`, `turno-cargando`, `turno-no-encontrado` |
| CU-08 | Ingresar al panel | `admin-ingresar`, `-cargando`, `-error`, `-bloqueado`, `admin-sesion` |
| CU-09 | Gestionar servicios | `admin-servicios`, `-vacio`, `-guardado`, `admin-servicio-editar`, `admin-servicio-error` |
| CU-10 | Peluqueros y horario semanal | `admin-peluqueros`, `-vacio`, `-guardado`, `admin-peluquero-editar`, `admin-peluquero-error` |
| CU-12 | Agenda del día y de la semana | `admin-agenda-dia`, `-dia-filtrada`, `-semana`, `-vacia`, `-cargando`, `-error` |
| CU-16 | Datos del local | `admin-local`, `-error`, `-guardado` |

Detalle por criterio en [spec.md § Cobertura](spec.md#cobertura-de-criterios).

### Fuera de esta entrega (H2) y dónde se enganchan

No se diseñan ahora. Quedan anotados los puntos de enganche para no tener que rehacer pantallas:

| Qué (H2) | Dónde se engancha |
|---|---|
| CU-06 Cambiar y CU-07 Cancelar desde el link | `turno.html`: debajo del resumen, antes de “Dónde” (hay un comentario HTML en ese lugar). En H1 ese bloque dice “Si necesitás cambiar o cancelar el turno, llamá al local” con el teléfono (RN-17). La confirmación (`confirmacion.html`) no cambia. |
| CU-06/07: mensaje de anticipación mínima | Mismo lugar en `turno.html`, reemplaza las acciones cuando faltan menos de N horas (CU-15). |
| CU-11 Bloqueos | Nueva sección “Bloqueos” en la navegación del panel (después de Peluqueros). En el cliente no cambia la UI: los días bloqueados se ven como “Sin horarios” o “Cerrado” en el selector de días. |
| CU-13 Cargar, mover y cancelar turnos | Agenda: botón “Cargar turno” en la barra de herramientas y acciones por turno (Mover, Cancelar) en cada tarjeta. Se suma el badge “Origen: Panel” (estilo neutro: `surface.subtle` + `text.muted` + `border.strong`, 6.99:1) junto al “Origen: Web” que ya muestra la tarjeta; en H1 no aparece en los datos de ejemplo. |
| CU-14 Asistencia | Agenda: en turnos pasados, badge “Sin marcar” y acciones Asistió / No asistió en la tarjeta. El badge de estado ya reserva el lugar. |
| CU-15 Anticipación mínima | Nueva sección o campo en “Datos del local” (configuración del local). |
| CU-10 (H2) turnos afectados por cambio de horario o desactivación | Mensaje de éxito de `admin-peluqueros-guardado` (hoy dice “Los turnos ya confirmados no se modifican”): en H2 suma la lista de turnos afectados con link a la agenda. |
| CU-12 (H2) turnos cancelados en la agenda | Badge de estado en la tarjeta (“Cancelado”, tachado + texto, nunca solo color). |

## Decisiones de diseño

Las decisiones del CDO para esta entrega se respetan tal cual; acá van cómo se aplicaron y las que tomé yo.

| ID | Decisión | Por qué |
|---|---|---|
| DD-01 | **Confirmación: el aviso “Guardá tu link privado” va segundo, inmediatamente después del título y una línea de éxito, antes del resumen.** Bloque con fondo y borde de advertencia, h2 propio, ícono + texto, link en un campo de solo lectura, botón primario “Copiar link” pegado al campo (termina en y≈594 en 360×640, arriba del pliegue) y secundario “Agregar al calendario”. | Es el único momento de entrega (D-1): si el cliente no guarda el link, lo pierde. No puede quedar debajo del pliegue en un celular de 360 px. |
| DD-02 | **Copiar link** anuncia el resultado en una región `role="status"` (aria-live polite), con alternativa si el portapapeles falla (selecciona el texto y lo dice). | Feedback explícito (principio 5) y criterio 4.1.3. |
| DD-03 | **Texto sin promesas de aviso automático:** “No se envía por email, SMS ni WhatsApp”, “No te vamos a mandar mensajes”, teléfono “para que el local pueda contactarte si hay un cambio”. Nunca “te avisamos” ni “te recordamos”. | D-1, RN-12 y ajuste del PO Reviewer. |
| DD-04 | **Paso extra “Revisar y confirmar” (paso 5).** El flujo de producto dice “datos → confirmar”: lo interpreto como una pantalla de revisión con el botón “Confirmar turno”. | Es el último momento para corregir antes de crear el turno; cada dato tiene “Cambiar” y vuelve con lo elegido conservado. |
| DD-05 | **“Cualquiera disponible” es la opción por defecto** del paso 2 y dice “Al confirmar te mostramos con quién quedó tu turno”. En revisar figura como “Cualquiera disponible (te lo asignamos al confirmar)”; la confirmación y el link siempre muestran el peluquero asignado. | Muestra más horarios y no requiere decidir. El criterio de asignación (P-7) es interno y no cambia la UI. |
| DD-06 | **Selector de día como lista de links con `aria-current="date"`** (7 días por vista con “Semana anterior/siguiente”) y **horarios como radio group nativo** dentro de un `fieldset` con `legend` que nombra el día. | Teclado y lector de pantalla gratis (flechas dentro del grupo); sin widgets a medida. |
| DD-07 | **Ventana de reserva:** el texto “Podés reservar desde hoy hasta 30 días hacia adelante (hasta el sábado 14 de noviembre)” se arma con el parámetro de días; en el último tramo, “Semana siguiente” se reemplaza por “Último día: sáb 14 nov” y los días fuera de la ventana se ven como “No disponible” (no son links). | P-5 tentativo; el valor queda parametrizable. |
| DD-08 | **Día cerrado o fuera de ventana: no es un link** (se ve atenuado, borde punteado y texto “Cerrado” / “No disponible”). **Día sin horarios: sí es un link** y muestra “Sin horarios disponibles” con un botón al próximo día con horarios. | Lo que no se puede elegir no recibe foco; lo que puede quedar vacío se explica. |
| DD-09 | **CU-04:** al fallar la confirmación por horario ocupado, se vuelve al paso 3 con el mensaje “Ese horario se acaba de ocupar, elegí otro” arriba (role="alert", recibe el foco), horarios actualizados y el botón “Continuar a confirmar”, que lleva directo a revisar con servicio y datos conservados. | Decisión del CDO 6; evita re-tipear datos. |
| DD-10 | **Errores de formulario:** resumen arriba (recibe foco, links a cada campo) + mensaje junto al campo asociado con `aria-describedby` + `aria-invalid`; nunca se borra lo tipeado. El título de la página pasa a empezar con “Error:”. | Decisión del CDO 3; WCAG 3.3.1, 3.3.3. |
| DD-11 | **Ingreso del panel:** usuario + contraseña, “Mostrar contraseña”, autocomplete `username`/`current-password` (permite gestores de contraseñas), error genérico “Usuario o contraseña incorrectos”, estado “Demasiados intentos” sin dar detalles del límite, texto “Si olvidaste tu contraseña, pedile a quien administra el panel que te la resetee”. Sin magic link, sin email. | Decisión del CDO 7; WCAG 3.3.8 (autenticación sin prueba cognitiva). |
| DD-12 | **Agenda:** vista Día en columnas por peluquero (apiladas en celular, en grilla desde 1024 px) y vista Semana en 7 días (apilados en celular, 7 columnas en escritorio). Tarjeta de turno: hora inicio–fin, duración, servicio, cliente, contacto (tel/mail como link o “Sin contacto”), badge “Origen: Web” (en H1 todos los turnos vienen de la web; “Panel” llega con CU-13) y estado con ícono + texto. Filtro por peluquero con `select` + botón “Filtrar” (sin cambio de contexto automático). | Decisión del CDO 8; WCAG 3.2.2. |
| DD-13 | **Horario semanal:** un `fieldset` por día con 0..n rangos “Desde/Hasta” (`input type="time"`, pasos de 15 min), “+ Agregar rango” y “Quitar”; los errores (fin ≤ inicio, superposición) se marcan en el rango y en el resumen. | CU-10; varios rangos por día (9–13 y 15–19). |
| DD-14 | **Avisos de configuración incompleta en listas del panel:** badge “⚠ Sin peluqueros asignados” en servicios y “⚠ Sin servicios” en peluqueros, con la consecuencia en texto (“No se ofrece en la web…”). | CU-09, CU-10, RN-15. |
| DD-15 | **El precio de referencia es opcional en el panel.** CU-09 solo valida nombre y duración. | No inventar una validación que producto no pidió. Ver P-D2. |
| DD-16 | **El footer del cliente muestra siempre nombre, dirección y teléfono del local** y aclara que los horarios están en hora del local. | RN-05, RN-17: el teléfono está a mano en todos los estados de error. |

## Supuestos

- S-1. La zona horaria del local es Buenos Aires (UTC−3) y se muestra solo como “hora del local” (RN-05). El `.ics` la declara explícitamente.
- S-2. La “fecha de hoy” del prototipo es el jueves 15 de octubre de 2026; la ventana de 30 días llega al sábado 14 de noviembre.
- S-3. Duraciones múltiplos de 5 min y rangos horarios en pasos de 15 min. Si el Architect usa otra granularidad, cambia solo el `step` de los inputs.
- S-4. El link privado tiene la forma `https://<dominio>/t/<token>`; el dominio real lo define el Architect (sin dominio propio en Hobby, §10).
- S-5. “Agregar al calendario” descarga un `.ics` (funciona en iOS, Android y escritorio). El prototipo incluye un `.ics` de ejemplo con fecha, hora, duración, servicio, dirección vigente y el link privado en la descripción.
- S-6. La validación del teléfono es laxa (números, espacios, guiones, mínimo 8 dígitos) porque es opcional; la regla exacta la define el Architect.
- S-7. El panel no muestra “Recordarme”: la duración de la sesión la define el Architect.
- S-8. En el link privado **no** se muestran nombre ni teléfono del cliente (solo datos del turno y del local), para minimizar datos expuestos si el link se comparte (RNF-04).

## Preguntas abiertas

| ID | Pregunta | Para | Propuesta de diseño |
|---|---|---|---|
| P-D1 | ¿Cómo se ve un turno **movido por el admin** en el link privado en H1? CU-05 dice que muestra el estado vigente; en H1 el admin todavía no puede mover turnos (CU-13 es H2). | CPO | En H1 solo existe “Confirmado”. En H2 sumar un aviso “El local cambió tu turno: ahora es…”. |
| P-D2 | ¿El precio de referencia es obligatorio al crear un servicio? CU-09 no lo valida. | CPO | Opcional; si está vacío la web muestra “Consultá el precio en el local”. |
| P-D3 | ¿Hay un máximo de duración de servicio o un mínimo distinto de 5 min? | CPO / Architect | Mínimo 5 min, sin máximo. |
| P-D4 | ¿Cuánto dura el bloqueo por **demasiados intentos** y cuántos intentos? El texto dice “unos minutos” sin cifra. | Architect | Mostrar el tiempo exacto solo si es fijo (“Probá de nuevo en 15 minutos”). |
| P-D5 | ¿El link privado se puede abrir sin conexión al servidor (arranque en frío, RNF-06)? Diseñé un estado “Cargando tu turno…”; si el arranque en frío supera ~3 s conviene un texto extra (“Puede tardar unos segundos”). | Architect | Agregar el texto después de 3 s. |
| P-D6 | En la agenda semanal, ¿alcanza con la lista por día o la encargada necesita una grilla horaria (eje de horas)? | CPO (validar en la demo) | Lista por día para H1; observar en la demo. |
| P-D7 | ¿El panel necesita un estado “sin sesión / sesión vencida” distinto del de ingreso? Diseñé `admin-sesion` (“Para ver el panel, primero iniciá sesión”). | Architect | Mismo formulario con aviso. |

## Tokens propuestos (decide el CDO)

No se modificó `design-system/tokens.json`. El prototipo los declara en un bloque “PROPUESTOS” al inicio de
`prototypes/turnos-peluqueria-mvp/styles.css`, separado del espejo de tokens (`prototypes/shared/tokens.css`).

| Token propuesto | Valor | Propósito | Contraste / nota |
|---|---|---|---|
| `border.width.default` | `1px` | Contorno de controles, tarjetas y divisores | El color lo da `border.strong` (4.83:1) o `border.default` (decorativo). |
| `border.width.strong` | `2px` | Estado seleccionado, campo con error, alertas, bloque “Guardá tu link” | Refuerza el estado con forma, no solo color (1.4.1). |
| `size.content.wide` | `{breakpoint.lg}` (64rem) | Ancho máximo del panel admin (la agenda necesita más que `size.content.max` = 40rem) | — |
| `size.grid.slot-min` | `5.5rem` | Ancho mínimo de un botón de horario en la grilla | Con 320 px entran 2 columnas; a 200 % de zoom, 1. |
| `size.grid.day-min` | `4.5rem` | Ancho mínimo de un día en el selector | — |
| `size.grid.column-min` | `14rem` | Columna mínima de la agenda (escritorio) y del filtro | — |

Además se agregó `prototypes/shared/tokens.css`, espejo 1:1 de `tokens.json` como variables CSS (sin valores
nuevos). Si el CDO prefiere generarlo con un script, conviene un PR aparte del design system.

## Historial

- v0.1 — primera versión del Hito 1 (flujos, spec, accesibilidad y prototipo). Reemplaza a la iniciativa
  `turnos-peluqueria` (revertida en el PR #2), sin reutilizar sus supuestos (magic link, notificaciones).
- v0.2 — ronda 1 del Designer Reviewer:
  - CU-10 (bloqueante): `legend` del horario semanal sin `float` (el `clear` no llegaba a los rangos cuando
    “No trabaja.” estaba oculto); rangos y filas de listas con `minmax(0,1fr)`/`min-width:0`. Sin scroll
    horizontal a 320 px en las 46 páginas.
  - CU-12: los turnos de ejemplo de H1 son todos “Origen: Web” (sin carga manual hasta CU-13 en H2).
  - Confirmación: “Copiar link” pegado al campo, arriba del pliegue en 360×640 (termina en y≈594).
  - `turno.ics` plegado según RFC 5545 (≤ 75 octetos por línea).
  - Contraseña olvidada: “pedile a quien administra el panel que te la resetee”.
  - `horario-ocupado`: “← Volver: peluquero” (coherente con el paso 3).
  - `accessibility.md`: estados actualizados con la verificación en Chromium headless; pendientes reales:
    lector de pantalla, zoom 200 % y preview de Vercel.
