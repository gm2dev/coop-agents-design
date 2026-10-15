# Turnos para peluquería — MVP, Hito 1 (demo interna) e Hito 2 (MVP operable)

- **Estado:** borrador v0.4 para revisión del Designer Reviewer y del CDO
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

## Alcance (H1 + H2)

Los nombres son archivos de `prototypes/turnos-peluqueria-mvp/` (sin `.html`); `-x` abrevia el prefijo de la fila.
Detalle criterio por criterio en [spec.md § Cobertura](spec.md#5-cobertura-de-criterios).

### Hito 1 — demo interna

| CU | Título | Pantallas del prototipo |
|---|---|---|
| CU-01 | Ver servicios | `servicios`, `-cargando`, `-vacio`, `-error` |
| CU-02 | Ver horarios libres | `peluquero`, `horario`, `-cargando`, `-vacio`, `-limite`, `-error` |
| CU-03 | Reservar un turno | `datos`, `datos-error`, `revisar`, `-enviando`, `-error` |
| CU-04 | Reserva simultánea | `horario-ocupado` |
| CU-05 | Confirmación y calendario | `confirmacion`, `turno.ics`, `turno-solo-lectura` (link H1), `turno-cargando`, `turno-no-encontrado` |
| CU-08 | Ingresar al panel | `admin-ingresar`, `-cargando`, `-error`, `-bloqueado`, `admin-sesion` |
| CU-09 | Gestionar servicios | `admin-servicios`, `-vacio`, `-guardado`, `admin-servicio-editar`, `admin-servicio-error` |
| CU-10 | Peluqueros y horario semanal | `admin-peluqueros`, `-vacio`, `-guardado`, `admin-peluquero-editar`, `admin-peluquero-error` |
| CU-12 | Agenda del día y de la semana | `admin-agenda-dia`, `-dia-filtrada`, `-semana`, `-vacia`, `-cargando`, `-error` |
| CU-16 | Datos del local | `admin-local`, `-error`, `-guardado` |

### Hito 2 — MVP operable (v0.4)

| CU | Título | Pantallas del prototipo |
|---|---|---|
| CU-05 (H2) | Link privado con estados | `turno` (confirmado, con Cambiar y Cancelar), `turno-menos-2h`, `turno-movido` (+ `turno-movido.ics`), `turno-cancelado-local`, `turno-cancelado` (por vos), `turno-pasado`, `turno-plazo-vencido` (borde), `turno-cargando`, `turno-no-encontrado` |
| CU-06 | Cambiar el turno | `cambiar`, `-cargando`, `-error`, `-ocupado`, `-revisar`, `-enviando`, `-error-envio`, `-confirmado` (+ `turno-cambiado.ics`) |
| CU-07 | Cancelar el turno | `cancelar`, `-enviando`, `-error`, `-listo` |
| CU-11 | Bloqueos | `admin-bloqueos`, `-vacio`, `-eliminado`, `admin-bloqueo-nuevo`, `-error`, `-guardado`, `-afectados`, `-eliminar`; en la web `horario-bloqueado` |
| CU-12 (H2) | Agenda con cambios y cancelados | `admin-agenda-hoy`, `admin-agenda-viernes` (cambios y cancelaciones del cliente), `admin-agenda-semana-h2` |
| CU-13 | Mover y cancelar desde el panel | `admin-mover`, `-superpuesto`, `-advertencia` (fuera de horario), `-bloqueo`, `-guardando`, `-error`, `admin-agenda-movido`; `admin-cancelar`, `-error`, `admin-agenda-cancelado`, `-cancelado-sin-contacto` |
| CU-14 | Marcar asistencia | `admin-agenda-hoy` (resumen “3 turnos pasados sin marcar”, Asistió/No asistió con `aria-pressed`, corregible), `admin-agenda-semana-h2` |
| CU-10 (H2) | Turnos afectados | `admin-peluqueros-afectados` (cambio de horario), `admin-peluqueros-desactivado` |

**No existen** (a propósito): crear turnos en el panel (D-23), ver o recuperar links privados (D-24, D-29),
usuarios/roles/cambio de contraseña (D-25), configuración de la anticipación (2 h fijas, D-13; CU-15 eliminado).

**Datos de ejemplo (hoy jueves 15/10/2026, 14:00):** turno de Bruno a las 15:45 (menos de 2 h); Paula 11:00,
Diego 12:00 y Rocío 13:00 pasados sin marcar; Julián 09:00 “Asistió”; Vera 16:00 cancelable desde el panel y
cancelada por el local en su link; Lucía (viernes 16, 15:30 con Bruno) movida por el local al sábado 17, 10:00
con Ana; Marta (viernes 16, 09:30) cancelada por el cliente.

## Decisiones de diseño

Las decisiones del CDO para esta entrega se respetan tal cual; acá van cómo se aplicaron y las que tomé yo.

| ID | Decisión | Por qué |
|---|---|---|
| DD-01 | **Confirmación: el aviso “Guardá tu link privado” va segundo, inmediatamente después del título y una línea de éxito, antes del resumen.** Bloque con fondo y borde de advertencia, h2 propio, ícono + texto, link en un campo de solo lectura, botón primario “Copiar link” pegado al campo (termina en y≈594 en 360×640, arriba del pliegue) y secundario “Agregar al calendario”. | Es el único momento de entrega (D-1): si el cliente no guarda el link, lo pierde. No puede quedar debajo del pliegue en un celular de 360 px. **v0.4 (D-24):** debajo de los botones, línea secundaria “¿Reservaste por otra persona? Copiá el link y mandáselo.” (no empuja “Copiar link”). |
| DD-02 | **Copiar link** anuncia el resultado en una región `role="status"` (aria-live polite), con alternativa si el portapapeles falla (selecciona el texto y lo dice). | Feedback explícito (principio 5) y criterio 4.1.3. |
| DD-03 | **Texto sin promesas de aviso automático:** “No se envía por email, SMS ni WhatsApp”, “No te vamos a mandar mensajes”, teléfono “para que el local pueda contactarte si hay un cambio”. Nunca “te avisamos” ni “te recordamos”. | D-1, RN-12 y ajuste del PO Reviewer. |
| DD-04 | **Paso extra “Revisar y confirmar” (paso 5).** El flujo de producto dice “datos → confirmar”: lo interpreto como una pantalla de revisión con el botón “Confirmar turno”. | Es el último momento para corregir antes de crear el turno; cada dato tiene “Cambiar” y vuelve con lo elegido conservado. |
| DD-05 | **“Cualquiera disponible” es la opción por defecto** del paso 2 y dice “Al confirmar te mostramos con quién quedó tu turno”. En revisar figura como “Cualquiera disponible (te lo asignamos al confirmar)”; la confirmación y el link siempre muestran el peluquero asignado. | Muestra más horarios y no requiere decidir. El criterio de asignación (P-7) es interno y no cambia la UI. |
| DD-06 | **Selector de día como lista de links con `aria-current="date"`** (7 días por vista con “Semana anterior/siguiente”) y **horarios como radio group nativo** dentro de un `fieldset` con `legend` que nombra el día. | Teclado y lector de pantalla gratis (flechas dentro del grupo); sin widgets a medida. |
| DD-07 | **Ventana de reserva:** el texto “Podés reservar desde hoy hasta 30 días hacia adelante (hasta el sábado 14 de noviembre)”; en el último tramo, “Semana siguiente” se reemplaza por “Último día: sáb 14 nov” y los días fuera de la ventana se ven como “No disponible” (no son links). | D-14, RN-14 (30 días corridos inclusive). |
| DD-08 | **Día cerrado o fuera de ventana: no es un link** (se ve atenuado, borde punteado y texto “Cerrado” / “No disponible”). **Día sin horarios: sí es un link** y muestra “Sin horarios disponibles” con un botón al próximo día con horarios. | Lo que no se puede elegir no recibe foco; lo que puede quedar vacío se explica. |
| DD-09 | **CU-04:** al fallar la confirmación por horario ocupado, se vuelve al paso 3 con el mensaje “Ese horario se acaba de ocupar, elegí otro” arriba (role="alert", recibe el foco), horarios actualizados y el botón “Continuar a confirmar”, que lleva directo a revisar con servicio y datos conservados. | Decisión del CDO 6; evita re-tipear datos. |
| DD-10 | **Errores de formulario:** resumen arriba (recibe foco, links a cada campo) + mensaje junto al campo asociado con `aria-describedby` + `aria-invalid`; nunca se borra lo tipeado. El título de la página pasa a empezar con “Error:”. | Decisión del CDO 3; WCAG 3.3.1, 3.3.3. |
| DD-11 | **Ingreso del panel:** usuario + contraseña, “Mostrar contraseña”, autocomplete `username`/`current-password` (permite gestores de contraseñas), error genérico “Usuario o contraseña incorrectos”, estado “Demasiados intentos” con el tiempo de espera fijo (“Probá de nuevo en 15 minutos”, P-D4) sin decir cuántos intentos quedan, texto “Si olvidaste la contraseña, pedile al equipo que te dio el acceso que la resetee.” (un único usuario admin, D-25; el reseteo lo hace el equipo técnico a mano). Sin magic link, sin email. | Decisión del CDO 7; WCAG 3.3.8 (autenticación sin prueba cognitiva). |
| DD-12 | **Agenda:** vista Día en columnas por peluquero (apiladas en celular, en grilla desde 1024 px) y vista Semana en 7 días (apilados en celular, 7 columnas en escritorio). Tarjeta de turno: hora inicio–fin, duración, servicio, cliente, contacto (tel/mail como link o “Sin contacto”) y estado con ícono + texto. No hay badge que distinga de dónde vino el turno: todos se crean desde la web (D-23), así que no aporta información. Filtro por peluquero con `select` + botón “Filtrar” (sin cambio de contexto automático). | Decisión del CDO 8; WCAG 3.2.2. |
| DD-13 | **Horario semanal:** un `fieldset` por día con 0..n rangos “Desde/Hasta” (`input type="time"`, pasos de 15 min), “+ Agregar rango” y “Quitar”; los errores (fin ≤ inicio, superposición) se marcan en el rango y en el resumen. | CU-10; varios rangos por día (9–13 y 15–19). |
| DD-14 | **Avisos de configuración incompleta en listas del panel:** badge “⚠ Sin peluqueros asignados” en servicios y “⚠ Sin servicios” en peluqueros, con la consecuencia en texto (“No se ofrece en la web…”). | CU-09, CU-10, RN-15. |
| DD-15 | **El precio de referencia es opcional en el panel.** CU-09 solo valida nombre y duración. | D-19 (antes P-D2). |
| DD-16 | **El footer del cliente muestra siempre nombre, dirección y teléfono del local** y aclara que los horarios están en hora del local. | RN-05, RN-17: el teléfono está a mano en todos los estados de error. |
| DD-17 | **Link privado H2: el estado va primero (badge con ícono + texto) y las acciones van en un bloque “¿Necesitás cambiarlo?” debajo del resumen**: “Cambiar día u horario” (secundario) y “Cancelar turno” (peligro outline), con el texto “Podés cambiar el día y el horario, o cancelar, hasta 2 horas antes del turno.” y “¿Querés otro servicio? Cancelá este turno y reservá uno nuevo.” | El cliente primero confirma qué turno es; la regla de 2 h (D-13, RN-08) se dice antes de que choque con ella. Cancelar no es el primario para evitar toques por error. |
| DD-18 | **Menos de 2 horas: no se muestran botones deshabilitados**, se reemplaza el bloque por un aviso “Faltan menos de 2 horas para tu turno” + “Para cambiarlo o cancelarlo llamá al local: <tel:>”. Si el plazo vence con la página abierta, el envío vuelve al link con `role=alert` “Ya faltan menos de 2 horas…” y el turno intacto (`turno-plazo-vencido`). | Un botón deshabilitado no explica qué hacer; el teléfono sí (RN-17). El caso borde 16:00/16:01 lo decide el servidor. |
| DD-19 | **Estados del link con forma además de color:** ✓ Confirmado, ↻ “El local cambió tu turno” (aviso info con día/hora/peluquero nuevos + borrar el evento anterior), ✕ Cancelado por el local (con teléfono), ✕ Cancelado por vos, ◷ Turno pasado. En los cancelados el resumen se titula “Turno cancelado” y el texto va tachado; sin acciones, con “Reservar un turno nuevo”. Nunca nombre ni teléfono del cliente (S-8). | D-18, 1.4.1. Diferenciar “por el local” de “por vos” evita que el cliente crea que canceló sin querer. |
| DD-20 | **CU-06 Cambiar reutiliza el paso “Día y horario” de la reserva** (mismos días, ventana de 30 días, inicios cada 15 min, días “Cerrado”) en 2 pasos: elegir → **revisar Antes/Después** → confirmar. Arriba se recuerda el turno actual y que el servicio no cambia. El horario actual no aparece entre los libres. | Un solo patrón que el cliente ya conoce (principio de reutilizar); la revisión antes/después es la prevención de errores (3.3.4). |
| DD-21 | **Horario ocupado al confirmar el cambio** (`cambiar-ocupado`): vuelve al paso 1 con `role=alert` + foco: “Ese horario se acaba de ocupar, elegí otro. … Tu turno sigue igual: <original>”, horarios actualizados. | Misma solución que CU-04 (DD-09); lo crítico es decir que el turno original no se perdió. |
| DD-22 | **Turno cambiado** (`cambiar-confirmado`): mismo link (“no hace falta guardarlo de nuevo”), aviso de advertencia “Actualizá tu calendario: borrá el evento del <anterior>” y “Agregar al calendario” con el `.ics` del turno nuevo. No se repite el bloque “Guardá tu link”. | CU-06; el calendario del cliente es el único recordatorio (D-1) y queda desactualizado si no lo borra. |
| DD-23 | **CU-07 Cancelar en pantalla propia** “¿Cancelar tu turno?” con resumen, consecuencia (“El horario queda libre…”), “Sí, cancelar turno” (peligro) y “No, mantener turno” (secundario). Resultado con aviso “Borralo de tu calendario” y “Reservar un turno nuevo”. | Segundo paso explícito (CU-07) sin diálogo modal: sin trampas de foco y funciona igual en celular. |
| DD-24 | **CU-13 en la agenda: “Mover” y “Cancelar” solo en turnos vigentes**, con nombre accesible completo (“Mover turno de Lucía, 15:30”). Los cancelados y pasados marcados no tienen acciones. | No ofrecer acciones imposibles; 2.4.4 / 2.5.3. |
| DD-25 | **Mover: formulario en página propia** con el turno actual arriba y “Peluquero” (`select` con los activos que hacen el servicio), “Fecha” (`date`, sin `max`) y “Hora de inicio” (`time`, `step=900`), duración visible (“termina a las 10:45”). Texto: “Desde el panel podés mover a cualquier fecha (sin el límite de 30 días) y aunque falten menos de 2 horas.” | D-7, D-14/RN-14, D-21/RN-19. Sin arrastrar (2.5.7). El admin tipea un horario porque puede elegir horarios no ofrecidos en la web. |
| DD-26 | **Superposición = error (no se puede forzar):** error junto a “Hora de inicio” con el turno que choca + resumen arriba con foco; no hay botón para seguir. **Fuera de horario o sobre bloqueo = advertencia** “¿Mover igual?” con el motivo concreto, consecuencia (“no se ofrece en la web”) y “Mover igual” / “Elegir otro horario”. | RN-01 vs. D-11/RN-16: el error bloquea, la advertencia pide confirmar; visualmente distintos (danger vs. warning) y con verbos distintos. |
| DD-27 | **Éxito de mover/cancelar en la agenda:** alerta de éxito con foco “Moviste el turno de <cliente> al … El horario anterior quedó libre.” + “Avisale al cliente: <tel:>. El sistema no le envía nada.”; sin teléfono: “El cliente no dejó contacto.” (con email, link mailto). | D-1, D-3: el panel no notifica; le da al local lo necesario para avisar. Nunca muestra el link privado (D-29). |
| DD-28 | **Cancelar desde el panel en página propia** “¿Cancelar el turno de <cliente>?” con “El link privado del cliente va a mostrar que el local canceló el turno. No se le envía ningún mensaje.” | Segundo paso; deja claro el efecto en el cliente (D-18). |
| DD-29 | **CU-14 asistencia:** en vigentes con inicio pasado, badge “? Sin marcar” y un grupo `fieldset` “Asistencia” con dos botones “Asistió” / “No asistió” (`aria-pressed`, el elegido con relleno + ✓); se puede cambiar (queda la última). Futuros y cancelados sin control. Arriba de la agenda del día, resumen “N turnos pasados sin marcar asistencia” con links a cada tarjeta. | CU-14; botones de alternancia en vez de radios para marcar con un toque sin “Guardar”. El resumen da el “para completarlos”. |
| DD-30 | **CU-12 cancelados:** tarjeta con borde punteado, fondo atenuado, hora y servicio tachados, badge “✕ Cancelado por el cliente / por el local” y “Horario libre”; el encabezado del peluquero cuenta “2 turnos, 1 cancelado”. | CU-12 (H2): distinguibles sin depender del color (1.4.1). |
| DD-31 | **CU-11 Bloqueos como sección del panel** (después de Peluqueros): lista de próximos y recientes (alcance, días, horario; los pasados con “◷ Ya pasó”); formulario con tres preguntas en `fieldset`: ¿A quién afecta? (todo el local / un peluquero + select), ¿Qué días? (un día / varios días seguidos), ¿Qué horario? (todo el día / rango con `step=900`). Sin motivo/nota (ver P-D9). | Preguntas en lenguaje del local; mostrar solo los campos que aplican. No se inventan campos obligatorios. |
| DD-32 | **Turnos dentro de un bloqueo o afectados por CU-10:** tras guardar, alerta de éxito que dice cuántos turnos quedaron dentro y que **no se cancelaron**, + lista con fecha, servicio, cliente, contacto y “Mover”/“Cancelar” por turno. Eliminar un bloqueo pide confirmación y dice que esos horarios vuelven a ofrecerse. | CU-11, CU-10 (H2): el admin decide; el sistema no toca turnos. |
| DD-33 | **En la web, un día con bloqueo de todo el día se ve como “Cerrado”** (no es link, DD-08); un bloqueo parcial solo quita horarios. No se dice el motivo. | El cliente no necesita saber por qué; reutiliza el patrón de día cerrado. |

## Supuestos

- S-1. La zona horaria del local es Buenos Aires (UTC−3) y se muestra solo como “hora del local” (RN-05). El `.ics` la declara explícitamente.
- S-2. La “fecha de hoy” del prototipo es el jueves 15 de octubre de 2026; la ventana de 30 días llega al sábado 14 de noviembre.
- S-3. ✅ **Confirmado por el Architect y por producto (D-21, RN-19):** rangos horarios en pasos de 15 min (`step="900"`) y los turnos empiezan cada 15 minutos. Los horarios de ejemplo del prototipo caen todos en :00/:15/:30/:45 y muestran solo inicios libres con la duración completa. Las duraciones, en múltiplos de 5 (ver P-D3).
- S-4. ✅ **Confirmado por el Architect:** el link privado tiene la forma `https://<proyecto>.vercel.app/t/<código>`, sin dominio propio, con un código aleatorio de 22 caracteres. Ejemplo ficticio del prototipo: `https://turnos-la-esquina.vercel.app/t/Q7mK2pXv9RtL4wNc8bHd3s` (confirmación, `turno.ics` y su `URL`).
- S-5. “Agregar al calendario” descarga un `.ics` (funciona en iOS, Android y escritorio). El prototipo incluye un `.ics` de ejemplo con fecha, hora, duración, servicio, dirección vigente y el link privado en la descripción.
- S-6. ✅ **Confirmado por el Architect:** validación laxa del teléfono (opcional): se aceptan números, espacios, guiones, puntos, paréntesis y `+`; se guardan solo los dígitos y tienen que ser entre 8 y 15. Error: “Revisá el teléfono: tiene que tener entre 8 y 15 números (podés usar espacios o guiones).”
- S-7. ✅ **Confirmado por el Architect:** sin “Recordarme”; lo cubre la sesión de 12 horas.
- S-8. ✅ **Confirmado por el Architect:** en el link privado **no** se muestran nombre ni teléfono del cliente (solo datos del turno y del local), para minimizar datos expuestos si el link se comparte (RNF-04).

## Preguntas abiertas

| ID | Pregunta | Para | Propuesta de diseño |
|---|---|---|---|
| P-D1 | ¿Cómo se ve un turno **movido por el admin** en el link privado en H1? | CPO | ✅ **Resuelta (D-18):** en H1 solo “Confirmado”; en H2 aviso “El local cambió tu turno: ahora es el <día> a las <hora> con <peluquero>” y estado “Cancelado por el local”. |
| P-D2 | ¿El precio de referencia es obligatorio al crear un servicio? | CPO | ✅ **Resuelta (D-19):** opcional; si falta, la web muestra “Consultá el precio en el local”. |
| P-D3 | ¿Hay un máximo de duración de servicio o un mínimo distinto de 5 min? | CPO / Architect | ✅ **Respondida (Architect):** mínimo 5 min, múltiplos de 5, máximo 8 horas (480 min). Aplicado en `admin-servicio-editar`/`-error` (`min=5 max=480 step=5`, hint y mensaje “La duración tiene que ser de 5 a 480 minutos (8 horas), en múltiplos de 5.”) y en spec/flows. ✅ **Resuelta (D-20):** el máximo de 480 quedó validado por producto (RN-21). |
| P-D4 | ¿Cuánto dura el bloqueo por **demasiados intentos** y cuántos intentos? | Architect | ✅ **Respondida (Architect):** 5 intentos fallidos → bloqueo fijo de 15 minutos. `admin-ingresar-bloqueado` dice “Por seguridad, pausamos el ingreso. Probá de nuevo en 15 minutos.” (antes “unos minutos”); spec y flows actualizados. |
| P-D5 | ¿Cuánto tarda el link privado con arranque en frío (RNF-06)? | Architect | ✅ **Respondida (Architect):** con la base inactiva la primera carga tarda ~1 s. Se mantiene como protección: a los 3 s, `turno-cargando` suma “Puede tardar unos segundos.” dentro del mismo `role="status"` (agregado al prototipo en v0.3; spec y flows). |
| P-D6 | En la agenda semanal, ¿alcanza con la lista por día o el local necesita una grilla horaria (eje de horas)? | CPO (validar en la demo) | ✅ **Resuelta (D-22):** lista por día en H1; la grilla se decide con evidencia de la demo (no bloqueante). |
| P-D8 | Intervalo de inicio de los turnos (15 o 30 min). | CPO | ✅ **Resuelta (D-21, RN-19):** cada 15 minutos, también al mover desde el panel. |
| P-5 / P-7 | Ventana de reserva y criterio de “Cualquiera disponible” (preguntas de producto). | CPO | ✅ **Cerradas:** 30 días inclusive (D-14, RN-14) y peluquero con menos turnos ese día con desempate por orden de carga (D-15, RN-20; interno, no cambia la UI). |
| P-D7 | ¿El panel necesita un estado “sin sesión / sesión vencida” distinto del de ingreso? | Architect | ✅ **Respondida (Architect):** mismo formulario con aviso (`admin-sesion`, sin cambios). La sesión dura 12 horas. |
| P-D9 | ¿El bloqueo necesita un **motivo o nota** (opcional, solo visible en el panel, p. ej. “Feriado”, “Vacaciones de Ana”)? | CPO | Propuesta: campo opcional “Nota (solo la ves vos)”. No se incluyó en el prototipo para no inventar campos (CU-11 no lo pide). |
| P-D10 | Al mover a otro peluquero que **no hace ese servicio**, ¿se permite con advertencia o se impide? | CPO | El prototipo solo lista peluqueros activos que hacen el servicio (lo más seguro). |
| P-D11 | ¿El link privado debe mostrar si el turno fue **marcado “No asistió”**? | CPO | Propuesta: no; el pasado se ve como “Turno pasado” sin marca (la asistencia es interna). |
| P-D12 | Mover desde el panel: ¿el servidor devuelve en una sola respuesta la superposición y las advertencias (fuera de horario + bloqueo a la vez)? | Architect | El diseño muestra todos los motivos juntos en la misma advertencia; la superposición siempre gana (error). |
| P-D13 | En la agenda, el control de asistencia guarda al tocar (sin “Guardar”): ¿qué pasa si falla? | Architect | Propuesta: el botón vuelve al estado anterior y aparece un `role=alert` en la tarjeta “No pudimos guardar la asistencia. Probá de nuevo.” (no prototipado). |
| P-D14 | ¿La grilla horaria para la semana (D-22) se revisa con la demo de H1 antes de cerrar H2? | CDO | El H2 mantiene la lista por día. |

## Tokens propuestos (provisionales de la iniciativa)

**Decisión del CDO (v0.4):** se aceptan como **provisionales de la iniciativa**; se incorporan a
`design-system/tokens.json` en un PR propio del design system más adelante. Hasta entonces se siguen declarando
en el bloque PROPUESTOS. No se modificó `design-system/tokens.json`. **El H2 no agrega tokens nuevos**: reutiliza los mismos (badges, alertas, bordes punteados con `border.width.default`). El prototipo los declara en un bloque “PROPUESTOS” al inicio de
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
  - CU-12: los turnos de ejemplo de H1 vienen todos de la web (el badge que lo indicaba se retiró en v0.4, D-23).
  - Confirmación: “Copiar link” pegado al campo, arriba del pliegue en 360×640 (termina en y≈594).
  - `turno.ics` plegado según RFC 5545 (≤ 75 octetos por línea).
  - Contraseña olvidada: primer ajuste del texto (reemplazado en v0.4 por la versión de D-25).
  - `horario-ocupado`: “← Volver: peluquero” (coherente con el paso 3).
  - `accessibility.md`: estados actualizados con la verificación en Chromium headless; pendientes reales:
    lector de pantalla, zoom 200 % y preview de Vercel.
- v0.3 — respuestas del Architect a las preguntas abiertas (P-D1, P-D2 y P-D6 siguen abiertas para el CPO):
  - P-D4: bloqueo fijo de 15 min tras 5 intentos; `admin-ingresar-bloqueado` dice “Probá de nuevo en 15 minutos”.
  - P-D5: `turno-cargando` suma “Puede tardar unos segundos.” a los 3 s (protección; la carga en frío es ~1 s).
  - P-D7 / S-7: mismo formulario con aviso para sesión vencida; sesión de 12 h, sin “Recordarme”.
  - P-D3: duración de servicio de 5 a 480 min en múltiplos de 5 (input, hint, mensaje de error y validación JS);
    máximo pendiente de validación del CPO.
  - S-3: inicios cada 15 min y rangos en pasos de 15 min; horarios de ejemplo verificados como coherentes.
  - S-4: link `https://<proyecto>.vercel.app/t/<código>` (código de 22 caracteres) en la confirmación y en
    `turno.ics` (replegado ≤ 75 octetos por línea, CRLF).
  - S-6: teléfono con 8 a 15 dígitos (se guardan solo los dígitos); mensaje de error y validación JS ajustados.
  - S-8: confirmado, sin cambios.
- v0.4 — decisiones finales de producto (PR #4 de producto, commit 19364c5) y diseño del Hito 2:
  - Parte A (ajustes al H1): anticipación fija de 2 h sin configuración (D-13); la agenda ya no marca de dónde
    vino cada turno ni ofrece crear turnos (D-23); texto de contraseña olvidada para un único admin (D-25); línea “¿Reservaste
    por otra persona?…” en la confirmación (D-24); P-D1, P-D2, P-D3, P-D6, P-D8, P-5 y P-7 resueltas; tokens
    propuestos aceptados como provisionales de la iniciativa.
  - Parte B (Hito 2): link privado con 6 estados (D-18), CU-06 Cambiar (reusa el paso de horario, revisar
    antes/después, ocupado al confirmar), CU-07 Cancelar en pantalla propia, CU-13 mover/cancelar desde la agenda
    (error de superposición vs. advertencia fuera de horario/bloqueo, “Avisale al cliente”), CU-14 asistencia,
    CU-12 cancelados, CU-11 bloqueos (lista, nuevo, turnos dentro, eliminar, “Cerrado” en la web) y CU-10 turnos
    afectados. DD-17 a DD-33, preguntas P-D9 a P-D14. La tabla de “enganches” se reemplazó por el diseño real.
  - Verificación: Playwright + axe sobre 90 páginas (0 violaciones), sin scroll horizontal a 320/360 px, espaciado
    1.4.12 sin desbordes (se corrigió la tarjeta de la agenda H2), 0 links rotos.
