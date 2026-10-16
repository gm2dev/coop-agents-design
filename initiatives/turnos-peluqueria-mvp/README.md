# Turnos para peluquería — MVP, Hito 1 (demo interna) e Hito 2 (MVP operable)

- **Estado:** borrador v0.7 para revisión del Designer Reviewer y del CDO (alcance de producto ronda 7: D-33 a D-36)
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
   confirmación es el único momento de entrega (D-1, RN-12) y después no se puede volver a ver (D-33). Para
   cambiar o cancelar, el cliente le escribe al local por WhatsApp (o lo llama, si no hay WhatsApp cargado:
   D-36); la web se lo dice en la portada y en la confirmación (RN-25, DD-37).
2. **Panel del local (tablet, PC o celular):** ingresar con usuario y contraseña, ver la agenda del día y de la
   semana por peluquero, y configurar servicios, peluqueros con su horario semanal y datos del local.

La pregunta que tiene que contestar la demo: *¿el flujo se entiende sin ayuda y el cliente sabe cómo cambiar o
cancelar su turno?*

## Alcance (H1 + H2)

Los nombres son archivos de `prototypes/turnos-peluqueria-mvp/` (sin `.html`); `-x` abrevia el prefijo de la fila.
Detalle criterio por criterio en [spec.md § Cobertura](spec.md#5-cobertura-de-criterios).

### Hito 1 — demo interna

| CU | Título | Pantallas del prototipo |
|---|---|---|
| CU-01 | Ver servicios + aviso “¿Ya tenés un turno?” (DD-37) | `servicios`, `-sin-whatsapp` (D-36), `-cargando`, `-vacio`, `-error` |
| CU-02 | Ver horarios libres | `peluquero`, `horario`, `-cargando`, `-vacio`, `-limite`, `-error` |
| CU-03 | Reservar un turno | `datos`, `datos-error`, `revisar`, `-enviando`, `-error` |
| CU-04 | Reserva simultánea | `horario-ocupado` |
| CU-05 | Ver la confirmación (solo en pantalla, D-34) | `confirmacion`, `confirmacion-sin-whatsapp` (D-36) |
| CU-08 | Ingresar al panel | `admin-ingresar`, `-cargando`, `-error`, `-bloqueado`, `admin-sesion` |
| CU-09 | Gestionar servicios | `admin-servicios`, `-vacio`, `-guardado`, `admin-servicio-editar`, `admin-servicio-error` |
| CU-10 | Peluqueros y horario semanal | `admin-peluqueros`, `-vacio`, `-guardado`, `admin-peluquero-editar`, `admin-peluquero-error` |
| CU-12 | Agenda del día y de la semana | `admin-agenda-dia`, `-dia-filtrada`, `-semana`, `-vacia`, `-cargando`, `-error` |
| CU-16 | Datos del local (+ WhatsApp opcional, DD-38) | `admin-local`, `-error`, `-guardado`, `-guardado-sin-whatsapp` |

### Hito 2 — MVP operable

| CU | Título | Pantallas del prototipo |
|---|---|---|
| ~~CU-05 (H2), CU-06, CU-07~~ | Eliminados (D-33): link privado, cambiar y cancelar del cliente | — (pantallas borradas en v0.7) |
| CU-11 | Bloqueos | `admin-bloqueos`, `-vacio`, `-eliminado`, `admin-bloqueo-nuevo`, `-error`, `-guardado`, `-afectados`, `-eliminar`; en la web `horario-bloqueado` |
| CU-12 (H2) | Agenda con cancelados | `admin-agenda-hoy`, `admin-agenda-viernes` (con un cancelado), `admin-agenda-semana-h2`, `admin-agenda-dia-bloqueo` (bloqueos en la vista de día) |
| CU-13 | Mover y cancelar desde el panel (incluye los pedidos de clientes por WhatsApp, D-33) | `admin-mover`, `-superpuesto`, `-advertencia` (fuera de horario), `-bloqueo`, `-guardando`, `-error`, `admin-agenda-movido`; `admin-cancelar`, `-error`, `admin-agenda-cancelado`, `-cancelado-sin-contacto` |
| CU-14 | Marcar asistencia | `admin-agenda-hoy` (resumen “3 turnos pasados sin marcar”, Asistió/No asistió con `aria-pressed`, corregible), `admin-agenda-asistencia-error` (error al guardar), `admin-agenda-semana-h2` |
| CU-10 (H2) | Turnos afectados | `admin-peluqueros-afectados` (cambio de horario), `admin-peluqueros-desactivado` |

**No existen** (a propósito): crear turnos en el panel (D-23, D-35: el local reserva desde la web pública),
usuarios/roles/cambio de contraseña (D-25). **Eliminados en v0.7 (D-33, D-34):** link privado y sus estados
(CU-05 H2), CU-06 Cambiar y CU-07 Cancelar del cliente, anticipación mínima (CU-15 eliminado), “Agregar al
calendario” y los `.ics`. Se borraron del prototipo `turno*.html`, `cambiar*.html`, `cancelar*.html` y `*.ics`.

**Datos de ejemplo (hoy jueves 15/10/2026, 14:00):** turno de Bruno a las 15:45 (todavía no empezó, no se
puede marcar asistencia); Paula 11:00, Diego 12:00 y Rocío 13:00 pasados sin marcar; Julián 09:00 “Asistió”;
Vera 16:00 cancelable desde el panel; Lucía (viernes 16, 15:30 con Bruno) pidió por WhatsApp pasarlo y el local
lo movió al sábado 17, 10:00 con Ana; Marta (viernes 16, 09:30) cancelada por el local. WhatsApp del local:
+54 9 11 4000-0000; teléfono: 011 4000-0000.

## Decisiones de diseño

Las decisiones del CDO para esta entrega se respetan tal cual; acá van cómo se aplicaron y las que tomé yo.

| ID | Decisión | Por qué |
|---|---|---|
| DD-01 | ~~Confirmación: aviso “Guardá tu link privado” con “Copiar link” y “Agregar al calendario” antes del resumen.~~ **Obsoleta (v0.7):** no hay link privado ni calendario (D-33, D-34). Reemplazada por DD-37. | — |
| DD-02 | ~~“Copiar link” con anuncio en `role="status"`.~~ **Obsoleta (v0.7):** sin link privado (D-33). | — |
| DD-03 | **Texto sin promesas de aviso automático:** “No se envía por email, SMS ni WhatsApp”, “No te vamos a mandar mensajes”, teléfono “para que el local pueda contactarte si hay un cambio”. Nunca “te avisamos” ni “te recordamos”. | D-1, RN-12 y ajuste del PO Reviewer. |
| DD-04 | **Paso extra “Revisar y confirmar” (paso 5).** El flujo de producto dice “datos → confirmar”: lo interpreto como una pantalla de revisión con el botón “Confirmar turno”. | Es el último momento para corregir antes de crear el turno; cada dato tiene “Cambiar” y vuelve con lo elegido conservado. |
| DD-05 | **“Cualquiera disponible” es la opción por defecto** del paso 2 y dice “Al confirmar te mostramos con quién quedó tu turno”. En revisar figura como “Cualquiera disponible (te lo asignamos al confirmar)”; la confirmación siempre muestra el peluquero asignado. | Muestra más horarios y no requiere decidir. El criterio de asignación (P-7) es interno y no cambia la UI. |
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
| DD-16 | **El footer del cliente muestra siempre nombre, dirección y teléfono del local** y, si está cargado, el **WhatsApp** (link `wa.me`, “se abre WhatsApp” para lector de pantalla); aclara que los horarios están en hora del local. | RN-05, RN-17: el teléfono está a mano en todos los estados de error. v0.7: el pie es el lugar del contacto en los pasos intermedios de la reserva (DD-37, D-36). |
| DD-17 | ~~Link privado H2 con estado y bloque “¿Necesitás cambiarlo?” (Cambiar / Cancelar, regla de 2 h).~~ **Obsoleta (v0.7):** CU-06/CU-07 eliminados, RN-07/RN-08 eliminadas (D-33). | — |
| DD-18 | ~~Aviso “Faltan menos de 2 horas” y `turno-plazo-vencido`.~~ **Obsoleta (v0.7):** no hay anticipación mínima (D-33; D-13 obsoleta). | — |
| DD-19 | ~~Estados del link privado (Confirmado, cambiado por el local, cancelado por el local / por vos, pasado).~~ **Obsoleta (v0.7):** no hay link privado (D-33; D-18 y D-32 obsoletas). | — |
| DD-20 | ~~CU-06 Cambiar reutilizando el paso “Día y horario”, con revisar Antes/Después.~~ **Obsoleta (v0.7):** CU-06 eliminado (D-33). | — |
| DD-21 | ~~Horario ocupado al confirmar el cambio (`cambiar-ocupado`).~~ **Obsoleta (v0.7):** CU-06 eliminado, RN-09 eliminada (D-33). | — |
| DD-22 | ~~Turno cambiado con “Actualizá tu calendario” y `.ics` nuevo.~~ **Obsoleta (v0.7):** CU-06 eliminado y sin calendario (D-33, D-34). | — |
| DD-23 | ~~CU-07 Cancelar en pantalla propia del cliente.~~ **Obsoleta (v0.7):** CU-07 eliminado (D-33). | — |
| DD-24 | **CU-13 en la agenda: “Mover” y “Cancelar” solo en turnos vigentes**, con nombre accesible completo (“Mover turno de Lucía, 15:30”). Los cancelados y pasados marcados no tienen acciones. | No ofrecer acciones imposibles; 2.4.4 / 2.5.3. |
| DD-25 | **Mover: formulario en página propia** con el turno actual arriba y “Peluquero” (`select` con los activos que hacen el servicio), “Fecha” (`date`, sin `max`) y “Hora de inicio” (`time`, `step=900`), duración visible (“termina a las 10:45”). Texto: “Desde el panel podés mover a cualquier fecha y hora, sin el límite de 30 días de la web.” (v0.7: sin mención a las 2 h, D-33) | D-7, D-14/RN-14, D-21/RN-19. Sin arrastrar (2.5.7). El admin tipea un horario porque puede elegir horarios no ofrecidos en la web. |
| DD-26 | **Superposición = error (no se puede forzar):** error junto a “Hora de inicio” con el turno que choca + resumen arriba con foco; no hay botón para seguir. **Fuera de horario o sobre bloqueo = advertencia** “¿Mover igual?” con el motivo concreto, consecuencia (“no se ofrece en la web”) y “Mover igual” / “Elegir otro horario”. | RN-01 vs. D-11/RN-16: el error bloquea, la advertencia pide confirmar; visualmente distintos (danger vs. warning) y con verbos distintos. |
| DD-27 | **Éxito de mover/cancelar en la agenda:** alerta de éxito con foco “Moviste el turno de <cliente> al … El horario anterior quedó libre.” + “Avisale al cliente: <tel:>. El sistema no le envía nada.”; sin teléfono: “El cliente no dejó contacto.” (con email, link mailto). | D-1, D-3: el panel no notifica; le da al local lo necesario para avisar. v0.7: si el cliente lo pidió por WhatsApp, el local le responde por ahí (D-33); sin contacto en la reserva: “Si te lo pidió por WhatsApp, respondele por ahí.” |
| DD-28 | **Cancelar desde el panel en página propia** “¿Cancelar el turno de <cliente>?” con “El horario queda libre. El cliente no se entera por la web ni recibe ningún mensaje: si lo pidió por WhatsApp, respondele vos.” | Segundo paso; deja claro el efecto en el cliente. v0.7: antes decía que lo vería en su link privado (D-18, obsoleta); con D-33 solo se entera si el local lo contacta (D-3). |
| DD-29 | **CU-14 asistencia:** en vigentes con inicio pasado, badge “? Sin marcar” y un grupo `fieldset` “Asistencia” con dos botones “Asistió” / “No asistió” (`aria-pressed`, el elegido con relleno + ✓); se puede cambiar (queda la última). Futuros y cancelados sin control. Arriba de la agenda del día, resumen “N turnos pasados sin marcar asistencia” con links a cada tarjeta. | CU-14; botones de alternancia en vez de radios para marcar con un toque sin “Guardar”. El resumen da el “para completarlos”. |
| DD-30 | **CU-12 cancelados:** tarjeta con borde punteado, fondo atenuado, hora y servicio tachados, badge “✕ Cancelado” y “Horario libre”; el encabezado del peluquero cuenta “2 turnos, 1 cancelado”. | CU-12 (H2): distinguibles sin depender del color (1.4.1). v0.7: el badge ya no dice “por el cliente / por el local”: todas las cancelaciones las hace el admin (CU-13, D-33). |
| DD-31 | **CU-11 Bloqueos como sección del panel** (después de Peluqueros): lista de próximos y recientes (alcance, días, horario; los pasados con “◷ Ya pasó”); formulario con tres preguntas en `fieldset`: ¿A quién afecta? (todo el local / un peluquero + select), ¿Qué días? (un día / varios días seguidos), ¿Qué horario? (todo el día / rango con `step=900`), y después **“Motivo (opcional)”** (texto libre, `maxlength=80`, hint “Solo lo ves vos en el panel. Ej.: Feriado, Vacaciones de Ana. Hasta 80 caracteres.”; vacío no da error). El motivo se muestra como “Motivo: …” en la lista, en “Guardado con turnos dentro”, en el resumen de eliminar y en la agenda (DD-36) cuando existe; si está vacío no se muestra nada. | Preguntas en lenguaje del local; mostrar solo los campos que aplican. No se inventan campos obligatorios. Motivo: **D-30, RN-22** (CPO), solo interno; el cliente nunca lo ve (DD-33). |
| DD-32 | **Turnos dentro de un bloqueo o afectados por CU-10:** tras guardar, alerta de éxito que dice cuántos turnos quedaron dentro y que **no se cancelaron**, + lista con fecha, servicio, cliente, contacto y “Mover”/“Cancelar” por turno. Eliminar un bloqueo pide confirmación y dice que esos horarios vuelven a ofrecerse. | CU-11, CU-10 (H2): el admin decide; el sistema no toca turnos. |
| DD-33 | **En la web, un día con bloqueo de todo el día se ve como “Cerrado”** (no es link, DD-08); un bloqueo parcial solo quita horarios. No se dice el motivo. | El cliente no necesita saber por qué; reutiliza el patrón de día cerrado. |
| DD-34 | **Decisión del CDO (C1): error y advertencia se distinguen también por ícono, en toda la iniciativa.** Error = **✕** + “Error:” y advertencia = **⚠** + “Advertencia:”; el ícono va con `aria-hidden="true"` y la palabra como texto oculto para lector de pantalla cuando el texto visible no la dice (el `<title>` ya empieza con “Error:” / “Advertencia:”). Se aplica a todos los `field-error`, a los resúmenes de errores, a las alertas de error con `role=alert` y a las advertencias (“¿Mover igual?”, “N turnos pasados sin marcar”). Éxito sigue con ✓. Sin cambios de colores ni tokens. **Propuesta de patrón para el design system:** se incorpora en el PR aparte del design system junto con los tokens provisionales. | 1.4.1 (no depender del color: danger y warning tienen tonos cercanos para personas con daltonismo) y 1.1.1/1.3.1 (el tipo de mensaje llega también al lector de pantalla). Antes `field-error` usaba ⚠ igual que las advertencias. |
| DD-35 | **CU-14, error al guardar la asistencia** (`admin-agenda-asistencia-error`): la marca no se da por guardada hasta que responde el servidor; si falla, botones, `aria-pressed` y badge vuelven al valor previo, aparece dentro de la tarjeta un `role=alert` “✕ No pudimos guardar la asistencia · “Asistió” no se guardó: Paula V. sigue como estaba (Sin marcar). Revisá tu conexión.” con el botón “Probá de nuevo”, y el foco queda en el botón tocado (que suma `aria-describedby` a la alerta). El resumen “N sin marcar” solo baja cuando se guarda. | Decisión del CDO (antes P-D13); ✅ **confirmado por el Architect: implementable tal cual.** Revertir evita que el admin crea que quedó guardado; el error local a la tarjeta no le hace perder el lugar en la agenda (3.3.1, 4.1.3, 2.4.3). |
| DD-36 | **Bloqueos en la agenda del panel (RN-22), regla única de ubicación:** recuadro punteado (el mismo `.empty` de “Cerrado”/“Sin turnos”, `.block-note`) con “⊘ Bloqueado” en texto (ícono `aria-hidden`), “Motivo: …” solo si existe (vacío: se omite la línea) y link “Ver bloqueos”; no es un turno, sin acciones. **Todo el día** (local o peluquero): en la vista de día, al inicio de la columna del peluquero afectado (o de todas, si es del local); en la semana, en el día correspondiente (“⊘ Bloqueado · Todo el local · Todo el día”). **Rango horario:** dentro de la columna del peluquero, en orden cronológico entre los turnos, en la posición de su hora de inicio, con el rango visible (“⊘ Bloqueado · 09:00–13:00”); los turnos confirmados dentro del rango se siguen mostrando. Ejemplos: `admin-agenda-semana-h2` (lunes 12, todo el local, “Motivo: Feriado”) y `admin-agenda-dia-bloqueo` (sábado 24: Carla 09:00–13:00 “Motivo: Trámite personal”; Ana todo el día, sin motivo). | D-30/RN-22: el motivo se ve en la lista y en la agenda. Texto + ícono `aria-hidden`, no solo color (1.4.1); reutiliza `.empty`, sin tokens nuevos. El cliente sigue viendo solo “Cerrado” o menos horarios (DD-33). |
| DD-37 | **Decisión del CDO (P-10): ubicación del aviso de contacto para cambios y cancelaciones** (componente en [spec § Aviso de contacto para cambios](spec.md#aviso-de-contacto-para-cambios)). **(1) Servicios (CU-01)** y sus estados cargando y error: región con h2 “¿Ya tenés un turno?” + “Para cambiarlo o cancelarlo, escribinos por WhatsApp.” + link con aspecto de botón secundario “Escribir por WhatsApp al +54 9 11 4000-0000” (`https://wa.me/5491140000000`), **arriba de la lista** y visible sin scroll en 360×640 (termina en y=435, medido con Playwright en v0.7). En el estado **vacío** se integra en la misma alerta informativa que da el teléfono (sin bloque duplicado). **(2) Pasos intermedios** (peluquero, horario, datos, revisar): sin bloque; el contacto queda en el pie (DD-16). **(3) Confirmación (CU-05):** bloque destacado (borde fuerte) “Cambios y cancelaciones” inmediatamente debajo del resumen (servicio, peluquero, fecha y hora, dirección), con el mismo texto y link; el resumen termina con “Guardá estos datos: sacale una captura o anotalos. No te vamos a enviar nada y, al cerrar esta pantalla, no vas a poder volver a verla.” Sin calendario, link privado ni Cambiar/Cancelar. **(4) Sin WhatsApp (D-36):** mismo bloque con “Para cambiarlo o cancelarlo, llamanos al <tel:>” y sin link de WhatsApp (`servicios-sin-whatsapp`, `confirmacion-sin-whatsapp`). **(5) Accesibilidad:** texto del link con “WhatsApp” y el número; ícono `aria-hidden`; “(se abre WhatsApp)” como texto accesible porque abre otra app/pestaña (`target=_blank`); objetivo ≥ 44 px; región `section` + `aria-labelledby` (no `role=alert`, es info estática). | Decisión del CDO sobre P-10 (D-33, RN-25, CU-01, CU-05). Quien quiere cambiar o cancelar entra por la portada: no debe buscarlo. En los pasos intermedios distraería. En la confirmación es el único momento de entrega (D-1) y el cliente no puede volver a ver el turno (D-33). Colores info existentes (texto 15.5:1, título 8.0:1 y link 5.8:1 sobre `feedback.info.bg`), sin tokens nuevos. |
| DD-38 | **CU-16: campo “WhatsApp para cambios y cancelaciones (opcional)”** después de “Teléfono de contacto”, con ayuda de formato “Con + y código de país, por ejemplo +54 9 11 1234-5678.”, error junto al campo y en el resumen (“Revisá el WhatsApp: escribilo con + y el código de país, por ejemplo +54 9 11 1234-5678.”) y la nota permanente “Si lo dejás vacío, los clientes van a ver el teléfono de contacto para pedir cambios o cancelaciones.”; al guardar vacío, la alerta de éxito lo repite (`admin-local-guardado-sin-whatsapp`). **Validación provisional — PENDIENTE DE PRODUCTO:** empieza con `+`, solo números, espacios y guiones, de 10 a 15 dígitos; se guarda en formato internacional sin `+` ni espacios para el `wa.me`. | CU-16, D-36, RN-25. La regla exacta la está precisando producto (observación del PO Reviewer); se eligió un criterio internacional razonable (E.164 admite hasta 15 dígitos) y se reemplaza cuando producto la cierre. |

## Supuestos

- S-1. La zona horaria del local es Buenos Aires (UTC−3) y se muestra solo como “hora del local” (RN-05).
- S-2. La “fecha de hoy” del prototipo es el jueves 15 de octubre de 2026; la ventana de 30 días llega al sábado 14 de noviembre.
- S-3. ✅ **Confirmado por el Architect y por producto (D-21, RN-19):** rangos horarios en pasos de 15 min (`step="900"`) y los turnos empiezan cada 15 minutos. Los horarios de ejemplo del prototipo caen todos en :00/:15/:30/:45 y muestran solo inicios libres con la duración completa. Las duraciones, en múltiplos de 5 (ver P-D3).
- S-4. ~~**Obsoleto (v0.7, D-33):** no hay link privado.~~ Antes: ✅ **Confirmado por el Architect:** el link privado tiene la forma `https://<proyecto>.vercel.app/t/<código>`, sin dominio propio, con un código aleatorio de 22 caracteres. Ejemplo ficticio del prototipo: `https://turnos-la-esquina.vercel.app/t/Q7mK2pXv9RtL4wNc8bHd3s` (confirmación, `turno.ics` y su `URL`).
- S-5. ~~**Obsoleto (v0.7, D-34):** sin calendario.~~ Antes: “Agregar al calendario” descargaba un `.ics` (funciona en iOS, Android y escritorio). El prototipo incluye un `.ics` de ejemplo con fecha, hora, duración, servicio, dirección vigente y el link privado en la descripción.
- S-6. ✅ **Confirmado por el Architect:** validación laxa del teléfono (opcional): se aceptan números, espacios, guiones, puntos, paréntesis y `+`; se guardan solo los dígitos y tienen que ser entre 8 y 15. Error: “Revisá el teléfono: tiene que tener entre 8 y 15 números (podés usar espacios o guiones).”
- S-7. ✅ **Confirmado por el Architect:** sin “Recordarme”; lo cubre la sesión de 12 horas.
- S-8. ~~**Obsoleto (v0.7, D-33):** no hay link privado.~~ Antes: ✅ **Confirmado por el Architect:** en el link privado **no** se muestran nombre ni teléfono del cliente (solo datos del turno y del local), para minimizar datos expuestos si el link se comparte (RNF-04).

## Preguntas abiertas

| ID | Pregunta | Para | Propuesta de diseño |
|---|---|---|---|
| P-D1 | ¿Cómo se ve un turno **movido por el admin** en el link privado en H1? | CPO | **Obsoleta (v0.7, D-33):** no hay link privado. Antes ✅ resuelta (D-18): en H1 solo “Confirmado”; en H2 aviso “El local cambió tu turno: ahora es el <día> a las <hora> con <peluquero>” y estado “Cancelado por el local”. |
| P-D2 | ¿El precio de referencia es obligatorio al crear un servicio? | CPO | ✅ **Resuelta (D-19):** opcional; si falta, la web muestra “Consultá el precio en el local”. |
| P-D3 | ¿Hay un máximo de duración de servicio o un mínimo distinto de 5 min? | CPO / Architect | ✅ **Respondida (Architect):** mínimo 5 min, múltiplos de 5, máximo 8 horas (480 min). Aplicado en `admin-servicio-editar`/`-error` (`min=5 max=480 step=5`, hint y mensaje “La duración tiene que ser de 5 a 480 minutos (8 horas), en múltiplos de 5.”) y en spec/flows. ✅ **Resuelta (D-20):** el máximo de 480 quedó validado por producto (RN-21). |
| P-D4 | ¿Cuánto dura el bloqueo por **demasiados intentos** y cuántos intentos? | Architect | ✅ **Respondida (Architect):** 5 intentos fallidos → bloqueo fijo de 15 minutos. `admin-ingresar-bloqueado` dice “Por seguridad, pausamos el ingreso. Probá de nuevo en 15 minutos.” (antes “unos minutos”); spec y flows actualizados. |
| P-D5 | ¿Cuánto tarda el link privado con arranque en frío (RNF-06)? | Architect | **Obsoleta (v0.7, D-33):** se eliminó `turno-cargando`. Antes ✅ respondida (Architect): con la base inactiva la primera carga tarda ~1 s. Se mantiene como protección: a los 3 s, `turno-cargando` suma “Puede tardar unos segundos.” dentro del mismo `role="status"` (agregado al prototipo en v0.3; spec y flows). |
| P-D6 | En la agenda semanal, ¿alcanza con la lista por día o el local necesita una grilla horaria (eje de horas)? | CPO (validar en la demo) | ✅ **Resuelta (D-22):** lista por día en H1; la grilla se decide con evidencia de la demo (no bloqueante). |
| P-D8 | Intervalo de inicio de los turnos (15 o 30 min). | CPO | ✅ **Resuelta (D-21, RN-19):** cada 15 minutos, también al mover desde el panel. |
| P-5 / P-7 | Ventana de reserva y criterio de “Cualquiera disponible” (preguntas de producto). | CPO | ✅ **Cerradas:** 30 días inclusive (D-14, RN-14) y peluquero con menos turnos ese día con desempate por orden de carga (D-15, RN-20; interno, no cambia la UI). |
| P-D7 | ¿El panel necesita un estado “sin sesión / sesión vencida” distinto del de ingreso? | Architect | ✅ **Respondida (Architect):** mismo formulario con aviso (`admin-sesion`, sin cambios). La sesión dura 12 horas. |
| P-D9 | ¿El bloqueo necesita un **motivo o nota** (opcional, solo visible en el panel, p. ej. “Feriado”, “Vacaciones de Ana”)? | CPO | ✅ **Resuelta (D-30, RN-22):** motivo opcional en texto libre, solo en el panel. Agregado “Motivo (opcional)” al formulario (`maxlength=80`, vacío sin error) y “Motivo: …” en la lista, afectados, eliminar y la agenda cuando existe (DD-31, DD-36). El cliente no lo ve. |
| P-D10 | Al mover a otro peluquero que **no hace ese servicio**, ¿se permite con advertencia o se impide? | CPO | ✅ **Resuelta (D-31, RN-23):** solo se ofrecen los peluqueros que hacen ese servicio; el prototipo ya era así (DD-25). |
| P-D11 | ¿El link privado debe mostrar si el turno fue **marcado “No asistió”**? | CPO | **Obsoleta (v0.7, D-32 obsoleta por D-33):** la web no muestra turnos ya reservados (RN-24). Antes ✅ resuelta: no; “◷ Turno pasado” neutro, sin Cambiar ni Cancelar; la asistencia es dato interno. `turno-pasado` ya era así (verificado, sin cambios). |
| P-D12 | Mover desde el panel: ¿el servidor devuelve en una sola respuesta la superposición y las advertencias (fuera de horario + bloqueo a la vez)? | Architect | ✅ **Respondida (Architect):** valida todo de una vez; superposición = error que gana (sin advertencias); fuera de horario y/o bloqueo = todas las advertencias juntas sin mover; “Mover igual” revalida antes de guardar y, si alguien reservó ese horario mientras tanto, devuelve superposición (`admin-mover-superpuesto`, sin estado nuevo). El diseño ya lo cubría; anotado en spec y flows. |
| P-D13 | Error al guardar la asistencia (DD-35): ¿es implementable? | Architect | ✅ **Confirmada (Architect):** implementable tal cual. |
| P-D14 | ¿La grilla horaria para la semana (D-22) se revisa con la demo de H1 antes de cerrar H2? | CDO | ✅ **Cerrada (D-22, CDO):** el H2 mantiene la lista por día. |
| P-10 (producto) | ¿Dónde va el aviso de WhatsApp para cambios y cancelaciones en la web de reservas? | CDO | ✅ **Resuelta por el CDO (DD-37):** portada de servicios (arriba de la lista, visible sin scroll a 360 px) y confirmación (debajo del resumen); pie en todas las pantallas públicas; no se repite en los pasos intermedios. |
| P-D15 | Regla exacta de validación del WhatsApp en CU-16 (observación del PO Reviewer). | CPO | **Abierta — pendiente de producto.** Provisional en el prototipo (DD-38): `+` y código de país, números/espacios/guiones, 10 a 15 dígitos. |

## Tokens propuestos (provisionales de la iniciativa)

**Decisión del CDO (v0.4):** se aceptan como **provisionales de la iniciativa**; se incorporan a
`design-system/tokens.json` en un PR propio del design system más adelante. Hasta entonces se siguen declarando
en el bloque PROPUESTOS. No se modificó `design-system/tokens.json`. **El H2 y la v0.7 no agregan tokens nuevos** (el aviso de contacto usa `color.feedback.info.*`, `border.width.*`, `radius.*`, `space.*` y `size.target.comfortable`): reutiliza los mismos (badges, alertas, bordes punteados con `border.width.default`). El prototipo los declara en un bloque “PROPUESTOS” al inicio de
`prototypes/turnos-peluqueria-mvp/styles.css`, separado del espejo de tokens (`prototypes/shared/tokens.css`).

| Token propuesto | Valor | Propósito | Contraste / nota |
|---|---|---|---|
| `border.width.default` | `1px` | Contorno de controles, tarjetas y divisores | El color lo da `border.strong` (4.83:1) o `border.default` (decorativo). |
| `border.width.strong` | `2px` | Estado seleccionado, campo con error, alertas, aviso de contacto en la confirmación (DD-37) | Refuerza el estado con forma, no solo color (1.4.1). |
| `size.content.wide` | `{breakpoint.lg}` (64rem) | Ancho máximo del panel admin (la agenda necesita más que `size.content.max` = 40rem) | — |
| `size.grid.slot-min` | `5.5rem` | Ancho mínimo de un botón de horario en la grilla | Con 320 px entran 2 columnas; a 200 % de zoom, 1. |
| `size.grid.day-min` | `4.5rem` | Ancho mínimo de un día en el selector | — |
| `size.grid.column-min` | `14rem` | Columna mínima de la agenda (escritorio) y del filtro | — |

**Propuesta de patrón (v0.5, DD-34):** íconos por tipo de mensaje — error ✕ + “Error:”, advertencia ⚠ +
“Advertencia:”, éxito ✓ — con el ícono `aria-hidden`. Va en el mismo PR del design system que estos tokens.

Además se agregó `prototypes/shared/tokens.css`, espejo 1:1 de `tokens.json` como variables CSS (sin valores
nuevos). Si el CDO prefiere generarlo con un script, conviene un PR aparte del design system.

## Historial

> Las entradas v0.1–v0.6.1 describen pantallas que ya no existen (link privado, CU-06/CU-07, `.ics`); se
> conservan como registro.

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
- v0.5 — ronda v0.4 del Designer Reviewer:
  - CU-14 (mayor): nuevo estado `admin-agenda-asistencia-error` (vuelve al valor previo, `aria-pressed` restaurado,
    `role=alert` en la tarjeta con “Probá de nuevo”, foco en el botón tocado), DD-35; P-D13 sale de preguntas
    abiertas (decisión del CDO: el diseño cubre el estado, la API la define el Architect). Enlazado en el índice
    y en los estados de las agendas H2; spec, flows y accesibilidad actualizados.
  - DD-34 (decisión C1 del CDO): error = ✕ + “Error:”, advertencia = ⚠ + “Advertencia:” en todos los
    `field-error`, resúmenes y alertas de error del prototipo; propuesta de patrón para el design system.
  - RN-17: “llamá al local” en `confirmacion` con el teléfono como link `tel:` en la misma frase (las demás frases
    ya lo tenían).
  - `admin-agenda-hoy`: el anuncio ya no dice “Paula V..”. spec: ancla a los tokens provisionales corregida y
    ventana de 30 días sin “(tentativo)” (D-14).
  - Verificación (Chromium headless): Playwright + axe sobre 90 páginas (0 violaciones), sin scroll horizontal a
    320/360/1280 px, espaciado 1.4.12 sin desbordes, 0 links/anclas rotos, “Copiar link” termina en y=594 en
    360×640; error de asistencia probado con teclado (foco en el botón tocado, `aria-pressed` restaurado,
    `role=alert` en la tarjeta, “Probá de nuevo” guarda). Siguen PENDIENTES lector de pantalla, zoom 200 % y preview.
- v0.6 — respuestas del CPO y del Architect a P-D9 a P-D13:
  - P-D9 → D-30: campo “Motivo (opcional)” en el formulario de bloqueo (`admin-bloqueo-nuevo`, `-error`;
    `maxlength=80`, hint con el límite, vacío no da error) y “Motivo: …” en `admin-bloqueos`, `-guardado`,
    `admin-bloqueos-eliminado` y `admin-bloqueo-afectados` (ejemplos con y sin motivo;
    sin motivo no se muestra texto de relleno). El cliente (`horario-bloqueado`) no cambia. DD-31, spec y flows.
  - RN-22: el motivo también se ve en la agenda: nuevo indicador “⊘ Bloqueado · … · Motivo: Feriado” en
    `admin-agenda-semana-h2` (lunes 12), DD-36. Ejemplos con motivo: Feriado, Vacaciones de Ana, Vacaciones de Bruno.
  - P-D10 (D-31, RN-23), P-D11 (D-32, RN-24) — PR #4 de producto, commit 15f911b —, P-D12, P-D13 (Architect) y
    P-D14 (D-22) resueltas; el prototipo ya las cubría. CU-13: revalidación de “Mover igual” anotada en spec y flows.
  - Pie del prototipo a v0.6.
- v0.6.1 — menores de la revisión v0.6 del Designer Reviewer (el pie del prototipo sigue en v0.6):
  - DD-36 con regla única de ubicación (decisión del CDO): todo el día al inicio de la columna (o en el día de la
    semana); rango horario entre los turnos según su hora de inicio, con el rango visible y sin ocultar turnos
    confirmados. Nueva pantalla `admin-agenda-dia-bloqueo` (sábado 24 de octubre: Carla 09:00–13:00 “Motivo:
    Trámite personal”, Ana todo el día sin motivo), enlazada en el índice (recorrido H2 y lista) y en los estados
    de las agendas H2. Los bloqueos del sábado 24 coinciden en `admin-bloqueos`, `-guardado` y `-eliminado`.
    README, spec, flows y accesibilidad con la misma redacción.
  - `admin-bloqueos-eliminado` (y `admin-bloqueo-guardado`): el motivo va como línea “Motivo: …”, no entre paréntesis.
  - spec: la semana del H1 (`admin-agenda-semana`) no muestra bloqueos (CU-11 es H2); por eso el lunes 12 figura “Cerrado”.
- v0.7 — nuevo alcance de producto (ronda 7, PR #4 de producto, commit 329dfe6: D-33 a D-36) y decisión del CDO sobre P-10:
  - Eliminados del prototipo: link privado y sus estados (`turno`, `-solo-lectura`, `-cargando`, `-no-encontrado`,
    `-menos-2h`, `-movido`, `-cancelado`, `-cancelado-local`, `-pasado`, `-plazo-vencido`), CU-06 (`cambiar*`),
    CU-07 (`cancelar*`) y los cuatro `.ics`. `app.js` sin “Copiar link” ni aviso de carga lenta; `styles.css` sin
    `.keep-link`/`.copy-field`.
  - DD-37 (P-10, CDO): aviso “¿Ya tenés un turno?” en servicios (+ cargando, error; integrado en vacío) y bloque
    “Cambios y cancelaciones” debajo del resumen de la confirmación, con “Guardá estos datos…”. Variantes sin
    WhatsApp (D-36): `servicios-sin-whatsapp`, `confirmacion-sin-whatsapp`. WhatsApp en el pie de las pantallas
    públicas (DD-16). Confirmación: el resumen suma la dirección.
  - DD-38: CU-16 con “WhatsApp para cambios y cancelaciones (opcional)”, error de formato y
    `admin-local-guardado-sin-whatsapp`; regla de validación provisional (P-D15, pendiente de producto).
  - Panel: la agenda ya no muestra cambios/cancelaciones del cliente desde la web; badge “✕ Cancelado” (DD-30);
    textos de cancelar/mover sin link privado ni 2 h (DD-25, DD-27, DD-28). D-30 y D-31 sin cambios.
  - Obsoletas: DD-01, DD-02, DD-17 a DD-23, S-4, S-5, S-8, P-D1, P-D5, P-D11. Índice sin el recorrido “cliente
    gestiona su turno”. Pie del prototipo a v0.7.
  - `accessibility.md` a v0.7: § 4c (aviso de contacto y CU-16), contrastes del aviso con tokens existentes, filas del
    link privado / 2 h / “Copiar link” / `.ics` marcadas como eliminadas. Verificado con Playwright + axe a 360 y
    1280 px sobre las 72 páginas: 0 violaciones y 0 scroll horizontal; 1616 links internos, 0 rotos.
