# Spec de UI — Turnos para peluquería, MVP Hitos 1 y 2

Pantallas, componentes, contenido, estados y responsive del Hito 1. Criterios:
[casos-de-uso.md](https://github.com/gm2dev/coop-agents-product/blob/po/turnos-peluqueria-mvp/initiatives/turnos-peluqueria-mvp/casos-de-uso.md).
Flujos: [flows.md](flows.md). Prototipo: [`prototypes/turnos-peluqueria-mvp/`](../../prototypes/turnos-peluqueria-mvp/index.html).

Solo se usan tokens semánticos de [`design-system/tokens.json`](../../design-system/tokens.json) (y los
**propuestos** del [README](README.md#tokens-propuestos-provisionales-de-la-iniciativa), marcados con *). En el texto, `token`
= nombre del token, no valor.

## 1. Base común

### Layout

| | Cliente | Panel |
|---|---|---|
| Ancho de contenido | `size.content.max` (40rem), centrado | `size.content.wide`* (64rem) |
| Márgenes laterales | `space.400` | `space.400` |
| Fondo de página / superficies | `surface.subtle` / `surface.default` | ídem |
| Breakpoints | base 320 px (mobile-first) · `breakpoint.md` (40rem): botones en fila, campos en 2 columnas · `breakpoint.lg` (64rem): agenda en columnas | ídem |
| Header | marca (nombre del local, link al paso 1) + “Reserva de turnos” | “Panel · <local>”, usuario, “Salir”, nav de secciones con `aria-current="page"` |
| Footer | nombre, dirección, teléfono del local (link `tel:`), “horarios en hora del local” | — |

Todas las páginas: `lang="es"`, “Saltar al contenido” como primer elemento enfocable, un único `h1`, `<title>`
con el formato `<Paso o pantalla> — <local>` (prefijo `Error: ` cuando la página muestra errores).

### Componentes

| Componente | Uso | Tokens y comportamiento |
|---|---|---|
| **Indicador de progreso** | Pasos 1–5 del cliente | Texto “Paso N de 5 · <nombre>” (`text.muted`, semibold) + barra decorativa `aria-hidden` (completado `action.primary`, pendiente `surface.disabled` con borde `border.strong`). El paso se lee por el texto y el `<title>`, no por la barra. |
| **Volver** | Pasos 2–5 | Link “← Volver: <paso anterior>” arriba del progreso, alto `size.target.comfortable`. Conserva lo elegido (sessionStorage en el prototipo; estado del flujo en el producto). |
| **Selección actual** | Pasos 2–4 | Caja `surface.default` con lo elegido (“Corte y barba · 45 min · con …”) + link “Cambiar”. |
| **Opción (radio-tarjeta)** | Servicio, peluquero | `input type=radio` nativo dentro de `label`; borde `border.strong` 1px*; elegido: `surface.selected`, borde 2px* `border.selected`, texto `text.selected`; foco: anillo `focus.ring` en la tarjeta. |
| **Selector de días** | Paso 3 | `nav` con `ul` de links (7 por vista), el día elegido con `aria-current="date"` (+ fondo, borde 2px* y semibold). Cada día dice su estado en texto (“Hoy”, “Con horarios”, “Sin horarios”, “Cerrado”, “Último día”, “No disponible”). Cerrado / fuera de ventana: no es link, `surface.disabled`, borde punteado, `text.muted`. Nombre accesible completo con texto oculto (“, viernes 16 de octubre”). Navegación “← Semana anterior / Semana siguiente →”. |
| **Horarios** | Paso 3 | `fieldset` + `legend` “Horarios del <día>” + hint (hora de inicio, hora del local, duración). Los turnos pueden empezar cada 15 minutos (S-3, Architect; el intervalo se configura en un solo lugar si producto prefiere 30): la grilla muestra solo los inicios libres con la duración completa, por eso los ejemplos saltan (10:00, 10:45…). Radio group nativo en grilla `auto-fill` (min `size.grid.slot-min`*), cada horario alto `size.target.comfortable`. Elegido: `surface.selected`, borde 2px*, ✓ visible. Flechas para moverse dentro del grupo, Tab para salir. |
| **Campo de texto** | Formularios | `label` visible arriba; “(opcional)” en `text.muted` dentro del label; hint debajo del label asociado con `aria-describedby`; input alto `size.target.comfortable`, fuente `font.size.200` (evita zoom en iOS), borde `border.strong`. |
| **Error de campo** | Formularios | Debajo del input: ✕ (`aria-hidden`) + “Error:” oculto para lector de pantalla + texto en `feedback.danger.text` semibold; input con `aria-invalid="true"` y borde 2px* `feedback.danger.border`; el id del error se agrega a `aria-describedby`. |
| **Resumen de errores** | Formularios | Alerta `danger` arriba del formulario, `role="alert"`, `tabindex="-1"`, recibe el foco al enviar; título con ✕ (`aria-hidden`) + “Error:” oculto + “Revisá N datos para …” + lista de links que llevan el foco a cada campo. |
| **Alerta** | Mensajes | Variantes `danger`, `success`, `warning`, `info` (`feedback.*.text/bg/border`, borde 2px*). Título en negrita + texto. **Ícono por tipo (DD-34):** error = ✕ + “Error:” (oculto si el título ya lo dice), advertencia = ⚠ + “Advertencia:” oculto, éxito = ✓; los íconos van con `aria-hidden`. Errores: `role="alert"` y foco. Estados informativos: `role="status"`. |
| **Bloque “Guardá tu link privado”** | Confirmación | Fondo `feedback.warning.bg`, borde 2px* `feedback.warning.border`, `radius.lg`. h2 con ⚠, frase en negrita, campo de solo lectura con el link (label visible) y botón primario “Copiar link” pegado al campo (arriba del pliegue en 360×640), secundario “Agregar al calendario”, región `role="status"` para el resultado de copiar. |
| **Botones** | Acciones | Primario `action.primary` / `text.on-action` (hover `action.primary-hover`); secundario `surface.default` + borde y texto `action.primary`. Alto `size.target.comfortable`. En celular ocupan el ancho; desde `breakpoint.md`, ancho automático y el primario a la derecha (orden del DOM: primario primero). Enviando: `aria-disabled="true"`, spinner + “Confirmando…”, `surface.disabled`. |
| **Badge** | Estado, avisos | Píldora con borde y texto; siempre con palabra (“✓ Confirmado”, “⚠ Sin servicios”). Confirmado = `success`, avisos = `warning`. No hay badge que distinga de dónde vino el turno: todos se crean desde la web (D-23). |
| **Resumen (dl)** | Revisar, confirmación, link | `dl` en 2 columnas (`dt` en `text.muted`, `dd` semibold): servicio, peluquero, fecha, hora inicio–fin (hora del local), duración, precio (orientativo, se paga en el local) y, en revisar/confirmación, nombre y teléfono. |
| **Cargando** | Listas y envíos | Spinner decorativo + texto en `role="status"`; esqueleto `aria-hidden`. Con `prefers-reduced-motion` el spinner no gira. |
| **Tarjeta de turno** | Agenda | Borde `border.strong` con filete izquierdo `action.primary`; hora inicio–fin (bold) · duración; servicio · cliente; contacto como link `tel:`/`mailto:` o “Sin contacto”; badge de estado. |

## 2. Cliente

### P1 · Servicios (`servicios.html`) — CU-01

- **h1:** “Elegí un servicio”. Intro: “Reservá tu turno en 5 pasos, sin crear cuenta.”
- `fieldset` “Servicio” con hint “Los precios son orientativos: se paga en el local.” (asociado al fieldset).
- Opciones: nombre (semibold) + “45 min · $ 11.000”. Solo activos con al menos un peluquero activo (RN-15).
- Acción: “Continuar”.
- **Estados:** cargando (spinner + “Cargando servicios…”) · **vacío** (`servicios-vacio`: h1 “Por ahora no hay reservas online”, alerta info con el teléfono del local; sin progreso porque no hay flujo) · error (alerta con foco, “Reintentar”, teléfono del local) · éxito = lista.

### P2 · Peluquero (`peluquero.html`) — CU-02, CU-03

- **h1:** “¿Con quién?”. Selección actual (servicio) con “Cambiar servicio”.
- Opciones: **“Cualquiera disponible”** (primera y elegida por defecto; “Ves más horarios. Al confirmar te mostramos con quién quedó tu turno.”) y los peluqueros que hacen el servicio (hint “Solo ves a quienes hacen este servicio.”).
- No hay estado vacío propio: si el servicio no tiene peluqueros, no se lista en P1.

### P3 · Día y horario (`horario.html`) — CU-02

- **h1:** “¿Qué día y a qué hora?”. Selección actual con “Cambiar”.
- Selector de días (semana actual) + hint de ventana: “Podés reservar desde hoy hasta **30** días hacia adelante (hasta el **sábado 14 de noviembre**).” (D-14, RN-14).
- Horarios del día elegido (radio group) + “Continuar”.
- **Estados:**
  - cargando (`horario-cargando`): “Buscando horarios libres…” (RNF-06: < 3 s esperado).
  - **vacío** (`horario-vacio`): alerta info “Sin horarios disponibles” + “El sábado 17 no quedan horarios libres para este servicio. Probá otro día.” + botón “Ver el próximo día con horarios: martes 20”.
  - **fin de ventana** (`horario-limite`): “Semana siguiente” se reemplaza por “Último día: sáb 14 nov”; días posteriores “No disponible” (no seleccionables); alerta info “Se puede reservar hasta 30 días hacia adelante…” con teléfono.
  - error (`horario-error`): alerta con foco, “Reintentar”, “Lo que elegiste hasta ahora queda guardado.”
  - **horario ocupado** (`horario-ocupado`, CU-04): ver P6.
- Horarios pasados o ya empezados no aparecen (hoy muestra solo los futuros).

### P4 · Tus datos (`datos.html`) — CU-03

- **h1:** “Tus datos”. Selección actual (servicio · día y hora · peluquero) con “Cambiar”.
- Campos:
  - **Nombre** (obligatorio, sin marca de “opcional”; `autocomplete="name"`).
  - **Teléfono (opcional)** — hint: “Para que el local pueda contactarte si hay un cambio.” (`type="tel"`, `autocomplete="tel"`).
  - **Email (opcional)** — hint: “Solo lo ve el local.” (`type="email"`, `autocomplete="email"`).
- Nota: “No te vamos a mandar mensajes: tu turno lo ves en la pantalla de confirmación y en tu link privado.”
- Acción: “Continuar” → P5.
- **Errores** (`datos-error`): nombre vacío → “Ingresá tu nombre.”; email inválido → “Revisá el email: tiene que tener la forma nombre@ejemplo.com.”; teléfono inválido → “Revisá el teléfono: tiene que tener entre 8 y 15 números (podés usar espacios o guiones).” (validación laxa: se aceptan espacios, guiones, puntos, paréntesis y +; se guardan solo los dígitos, entre 8 y 15 — S-6, Architect) Resumen con foco + error junto al campo + lo tipeado se conserva. Sin teléfono ni email, avanza igual.

### P5 · Revisá y confirmá (`revisar.html`) — CU-03

- **h1:** “Revisá y confirmá tu turno”. Resumen (dl) con “Cualquiera disponible (te lo asignamos al confirmar)” si corresponde. Links “Cambiar servicio / día u horario / tus datos”. Lugar del local.
- Acción: **“Confirmar turno”**.
- **Estados:** enviando (`revisar-enviando`, botón `aria-disabled` + “Confirmando…” anunciado; evita doble envío) · error de conexión (`revisar-error`: “No pudimos confirmar tu turno. … el turno **no** quedó reservado. Tus datos siguen acá: probá de nuevo.” + “Reintentar”) · horario ocupado → P6 · éxito → P7.

### P6 · Horario ocupado (`horario-ocupado.html`) — CU-04

- Es P3 con: alerta danger arriba (role="alert", foco) **“Ese horario se acaba de ocupar, elegí otro”** + “Alguien reservó el viernes 16 a las 15:30 justo antes que vos. Ya actualizamos los horarios libres.” + “Tu servicio y tus datos quedan guardados: después de elegir otro horario vas directo a confirmar.”
- Horarios del mismo día **actualizados** (sin el ocupado), `legend` “Horarios libres del … (actualizados)”. Botón “Continuar a confirmar” → P5 (no pasa por P4). “← Volver: peluquero” (el anterior del paso 3, coherente con el progreso; para no perder lo elegido, el camino recomendado es “Continuar a confirmar”).
- Con “Cualquiera disponible”, si queda otro peluquero libre, no se ve esta pantalla: se confirma con ese.

### P7 · Confirmación (`confirmacion.html`) — CU-05

Orden (y jerarquía) fijo, pensado para que en 360 px el bloque del link quede en la primera pantalla:

1. **h1** “Tu turno está confirmado” (recibe el foco al llegar) + alerta success de una línea: “✓ **Viernes 16 de octubre, 15:30** · Corte y barba con **Bruno**” (siempre el peluquero asignado).
2. **Bloque “Guardá tu link privado”** (ver componente): “Es la única forma de volver a ver tu turno. No se envía por email, SMS ni WhatsApp.” · campo “Tu link privado” (solo lectura, seleccionable; forma `https://<proyecto>.vercel.app/t/<código>` con código aleatorio de 22 caracteres, sin dominio propio — S-4, Architect; ejemplo del prototipo `https://turnos-la-esquina.vercel.app/t/Q7mK2pXv9RtL4wNc8bHd3s`) con **Copiar link** (primario) pegado al campo (debajo en celular, a la derecha desde 40rem) para que quede arriba del pliegue en 360×640 · región de estado · ayuda “Guardalo en tus notas, o agregá el turno a tu calendario: el evento incluye el link.” · **Agregar al calendario** (secundario, descarga `.ics`).
   - Copiar OK → se anuncia “Link copiado. Pegalo en tus notas o en un chat con vos mismo para tenerlo a mano.”
   - Copiar falla → se selecciona el link y se anuncia “No se pudo copiar automáticamente. El link quedó seleccionado: copialo a mano.”
3. **Resumen del turno:** servicio, peluquero, fecha, hora inicio–fin (hora del local), duración, precio (orientativo, se paga en el local), a nombre de, teléfono (o “No lo dejaste”).
4. **Dónde:** nombre, dirección y teléfono del local + “Si perdés el link o necesitás cambiar algo, llamá al local.”
5. Link “Reservar otro turno”.

**v0.4 (D-24):** dentro del bloque “Guardá tu link privado”, debajo de los botones, línea secundaria
(`font.size.100`) “¿Reservaste por otra persona? Copiá el link y mandáselo.” Sirve al local cuando reserva por
un cliente que llamó (D-23). El sistema no envía nada. Va al final del bloque para no empujar “Copiar link”
debajo del pliegue en 360×640.

**Archivo `.ics`:** `SUMMARY` “<servicio> en <local> (con <peluquero>)”, `DTSTART/DTEND` con la zona del local, `LOCATION` = dirección vigente (CU-16), `DESCRIPTION` con servicio, duración, peluquero, precio orientativo, teléfono del local y el link privado; `URL` = link privado. Líneas ≤ 75 octetos, plegadas con CRLF + espacio (RFC 5545), sin partir caracteres UTF-8. Sin alarmas (`VALARM`): el recordatorio lo decide el calendario del cliente (no prometemos aviso).

### P8 · Link privado H1 (`turno-solo-lectura.html`) — CU-05

- **h1** “Tu turno” + badge “✓ Confirmado” + “Estado actualizado al abrir este link.”
- Resumen (sin nombre ni teléfono del cliente, S-8, confirmado por el Architect) + “Agregar al calendario”.
- Dónde + “Si necesitás cambiar o cancelar el turno, llamá al local: <teléfono>.” (H1). En H2 `turno.html` suma estados y acciones (ver H-P1).
- “Este link es privado: no lo compartas.”
- **Estados:** cargando (`turno-cargando`: spinner + “Cargando tu turno…”; si a los 3 s sigue cargando se suma “Puede tardar unos segundos.” dentro de la misma región `role="status"`. Con la base inactiva la primera carga tarda ~1 s, así que es una protección: P-D5, Architect) · **Turno no encontrado** (`turno-no-encontrado`: h1 “Turno no encontrado”, “Este link no corresponde a ningún turno. Revisá que lo hayas copiado completo.” + teléfono del local + “Reservar un turno”; nunca datos de un turno; misma respuesta para token inválido o inexistente).

## 3. Panel del local

### A1 · Ingresar (`admin-ingresar.html`) — CU-08

- Sin navegación de secciones. **h1** “Ingresar al panel”.
- Campos **Usuario** (`autocomplete="username"`, sin autocapitalizar) y **Contraseña** (`autocomplete="current-password"`) + checkbox “Mostrar contraseña”. Pegar está permitido.
- “Ingresar” (primario). Debajo: “Si olvidaste la contraseña, pedile al equipo que te dio el acceso que la resetee.” (sin link, sin email; un único usuario admin y sin pantalla de cambio de contraseña, D-25, D-28).
- **Estados:** campos vacíos (error junto al campo + resumen) · ingresando (`-cargando`) · **error genérico** (`-error`: “Usuario o contraseña incorrectos. Revisalos y probá de nuevo.”; conserva el usuario, vacía la contraseña; no dice cuál falló) · **demasiados intentos** (`-bloqueado`: “Demasiados intentos. Por seguridad, pausamos el ingreso. Probá de nuevo en 15 minutos.” + texto de reseteo; se activa con 5 intentos fallidos y el bloqueo es fijo de 15 minutos (P-D4, Architect); no revela si el usuario existe ni cuántos intentos quedan) · **sin sesión o sesión vencida** (`admin-sesion`: el mismo formulario con aviso “Para ver el panel, primero iniciá sesión.”; ningún dato del panel). La sesión dura 12 horas y no hay “Recordarme” (P-D7, S-7, Architect).

### A2 · Agenda (`admin-agenda-dia.html`, `-semana`) — CU-12

- **h1** “Agenda”. Barra: control segmentado “Día / Semana” (links con `aria-current`) y filtro **Peluquero** (`select` Todos/Ana/Bruno/Carla + botón “Filtrar”; no cambia solo al elegir).
- Navegación: h2 con el período (“Viernes 16 de octubre” / “Semana del 12 al 18 de octubre”), “← Día anterior · Hoy · Día siguiente →” (o semana). Nota: “Horarios en hora del local. Los turnos nuevos de la web aparecen al abrir o actualizar la agenda.”
- **Día:** una sección por peluquero (h3 con nombre y “N turnos”/“Sin turnos”), lista de tarjetas en orden horario; peluquero sin turnos: “Sin turnos este día.” Celular: secciones apiladas; ≥ 64rem: columnas.
- **Semana:** 7 secciones (h3 “Vie 16 oct”, “Hoy” como badge + borde 2px*), tarjetas compactas (hora · peluquero, servicio · duración · cliente, estado). Días cerrados: “Cerrado”. Celular: apiladas; ≥ 64rem: 7 columnas. La semana del H1 (`admin-agenda-semana.html`) **no muestra bloqueos** (CU-11 es del H2): por eso el lunes 12 (feriado) figura solo como “Cerrado”; el indicador de bloqueo está en `admin-agenda-semana-h2` (DD-36).
- **Filtrado** (`-dia-filtrada`): `role="status"` “Mostrando solo los turnos de Bruno. Ver todos”, solo la columna de ese peluquero.
- **Estados:** cargando · **vacío** (`-vacia`: “No hay turnos este día. Cuando alguien reserve por la web, el turno va a aparecer acá.”) · error (+ Reintentar).
- **H2:** ver H-A1 (`admin-agenda-hoy`). No hay creación de turnos en el panel (D-23).

### A3 · Servicios (`admin-servicios.html`, `admin-servicio-editar.html`) — CU-09

- Lista: “Agregar servicio” (primario) + nota “La web solo muestra los servicios activos que tienen al menos un peluquero asignado.” Cada fila: nombre + badge Activo/Inactivo, “45 min · $ 11.000 (precio de referencia)”, peluqueros, y si no tiene: **badge “⚠ Sin peluqueros asignados” + “No se ofrece en la web hasta que le asignes al menos uno.”** Botón “Editar <nombre>” (nombre accesible completo).
- Formulario: **Nombre** · **Duración (minutos)** (number, `min=5`, `max=480`, `step=5`; hint “De 5 a 480 minutos (8 horas), en múltiplos de 5. Si la cambiás, aplica a las reservas nuevas. Los turnos ya confirmados conservan su duración.”) · **Precio de referencia (opcional)** (hint “Se muestra como orientativo. No se cobra en la web.”) · **Peluqueros que lo hacen** (checkboxes; hint “El cliente solo ve a estos peluqueros. Sin ninguno, el servicio no se ofrece en la web.”) · **Activo** (hint “Si lo desactivás, deja de aparecer en la web. Los turnos ya confirmados se mantienen.”). “Guardar” / “Cancelar”.
- **Estados:** vacío (`-vacio`, explica el efecto en la web) · errores (`admin-servicio-error`: “Ingresá el nombre del servicio.”, “La duración tiene que ser de 5 a 480 minutos (8 horas), en múltiplos de 5.” para vacío, menor que 5, mayor que 480 o no múltiplo de 5; P-D3, Architect) · guardado (`-guardado`: alerta success con foco).

### A4 · Peluqueros (`admin-peluqueros.html`, `admin-peluquero-editar.html`) — CU-10

- Lista: nombre + Activo/Inactivo, servicios, resumen del horario; sin servicios → **badge “⚠ Sin servicios” + “No aparece en la reserva hasta que tenga al menos un servicio.”**
- Formulario: **Nombre** · **Servicios que hace** (checkboxes) · **Horario semanal**: h2 + hint (“Uno o más rangos por día, en hora del local… Si cambiás el horario, los turnos ya confirmados no se borran ni se modifican.”); un `fieldset` por día (legend = día): “No trabaja.” si no hay rangos; cada rango “Desde / Hasta” (`type="time"`, `step="900"`: rangos en pasos de 15 min, S-3, Architect; nombres accesibles “Desde (rango 2)”) + “Quitar” (“Quitar rango 2 del martes”); “+ Agregar rango al <día>”. Agregar/quitar mueve el foco (al nuevo “Desde” / al botón “Agregar”) y se anuncia en `role="status"`. · **Activo** (hint “Sus turnos futuros se mantienen”).
- **Validaciones** (`admin-peluquero-error`): “La hora de fin tiene que ser posterior a la de inicio.” · “Este rango se superpone con el rango 1 (10:00 a 13:00).” — en el rango (inputs `aria-invalid`) y en el resumen (“Martes, rango 2: …”).
- **Estados:** vacío · errores · guardado (“Los turnos ya confirmados no se modifican.”) · H2: turnos afectados (ver H-A5).

### A5 · Datos del local (`admin-local.html`) — CU-16

- **h1** “Datos del local” + “Todos los campos son obligatorios. Se muestran en la web de reservas, en la confirmación y en el evento del calendario.”
- **Nombre del local** (“Como lo ven los clientes.”) · **Dirección** (“Calle, número y barrio o localidad.”) · **Teléfono de contacto** (“Aparece en todos los mensajes que piden ‘llamá al local’.”). Como todos son obligatorios, no se marca ninguno (la frase de arriba lo dice).
- **Estados:** errores junto al campo + resumen (`-error`) · guardado (`-guardado`).

## 3b. Hito 2

Componentes reutilizados: `alert` (success/info/warning/danger, con `role=alert` + foco cuando es error), `badge`
con ícono + texto, `summary` (`dl`), botones primario/secundario/peligro (`btn-danger`, `btn-danger-outline`),
selector de días y horarios de P3, `fieldset` + `legend`, resumen de errores de DD-10. Sin tokens nuevos.

### H-P1 · Link privado H2 (`turno.html` y estados) — CU-05 (H2), CU-06, CU-07

- **h1** “Tu turno” + línea de estado: badge (✓ Confirmado · ✕ Cancelado por el local · ✕ Cancelado por vos · ◷ Turno pasado) + “Estado actualizado al abrir este link.”
- **Movido por el local** (`turno-movido`): alerta info “↻ El local cambió tu turno” · “Ahora es el **sábado 17 de octubre a las 10:00 con Ana**.” · “Si lo tenías en tu calendario, borrá el evento anterior (viernes 16 a las 15:30) y agregá el nuevo.” El resumen ya muestra los datos nuevos; “Agregar al calendario” baja `turno-movido.ics`. Si faltan ≥ 2 h conserva las acciones.
- **Resumen** (sin nombre ni teléfono del cliente, S-8) + “Agregar al calendario”.
- **Acciones (≥ 2 h):** sección h2 “¿Necesitás cambiarlo?”, texto “Podés cambiar el día y el horario, o cancelar, hasta 2 horas antes del turno.”, “Cambiar día u horario” (secundario → `cambiar`), “Cancelar turno” (peligro outline → `cancelar`), “¿Querés otro servicio? Cancelá este turno y reservá uno nuevo.”
- **< 2 h** (`turno-menos-2h`): sin la sección de acciones; alerta warning “◷ Faltan menos de 2 horas para tu turno” · “Para cambiarlo o cancelarlo llamá al local: <a href=tel:>”.
- **Cancelado por el local** (`turno-cancelado-local`): alerta danger “El local canceló tu turno” · “Si tenés dudas, llamá al local: tel: · Si lo tenías en tu calendario, borrá el evento.” · resumen titulado “Turno cancelado” con valores tachados · “Reservar un turno nuevo”. Sin calendario ni acciones.
- **Cancelado por vos** (`turno-cancelado`) y **pasado** (`turno-pasado`: “Este turno ya pasó, así que no se puede cambiar ni cancelar.”): igual estructura, sin acciones.
- **Borde** (`turno-plazo-vencido`): el plazo venció con la página abierta → al enviar, vuelve acá con alerta `role=alert` + foco “Ya faltan menos de 2 horas para tu turno · … Tu turno sigue igual. Para cambiarlo o cancelarlo llamá al local: tel:”.
- Cargando y no encontrado: como P8.

### H-P2 · Cambiar (`cambiar.html` → `cambiar-revisar.html`) — CU-06

- Paso 1 de 2 “¿A qué día y hora lo pasamos?”: recordatorio “Tu turno actual: viernes 16 de octubre, 15:30 · Corte y barba con Bruno” + “Cambiás solo el día y el horario, con el mismo servicio (… 45 min) y como reservaste: con <peluquero | Cualquiera disponible>. ¿Querés otro servicio? Cancelá este turno y reservá uno nuevo.” Selector de días y horarios de P3 (30 días, inicios cada 15 min, “Cerrado”, “Sin horarios”); el horario actual no figura (“Tu horario actual (15:30) no aparece en la lista.”). “Continuar”.
- Paso 2 “Revisá el cambio”: dos bloques **Antes** / **→ Después** (fecha, hora, peluquero; “Cualquiera disponible (te lo asignamos al confirmar)”), línea “Sin cambios: servicio · duración · precio”. “Confirmar cambio” (primario) / “No cambiar, volver a mi turno”.
- **Estados:** cargando · error al cargar (Reintentar + tel) · enviando (`aria-disabled`, “Cambiando tu turno…”) · error de conexión (`-error-envio`, alerta con foco “Tu turno sigue igual (…). Probá de nuevo.”) · **ocupado** (`-ocupado`: vuelve al paso 1, alerta `role=alert` + foco “Ese horario se acaba de ocupar, elegí otro” + “Tu turno sigue igual: …”, horarios “(actualizados)”) · < 2 h (`turno-plazo-vencido`).
- **Cambiado** (`-confirmado`): h1 “Tu turno cambió” (foco) · éxito “✓ Ahora es el martes 20 de octubre a las 11:30 · Corte y barba con Bruno” (peluquero asignado) · warning “Actualizá tu calendario: borrá el evento del viernes 16 a las 15:30 y agregá el nuevo.” · “Agregar al calendario” (`turno-cambiado.ics`) · “Tu link privado sigue siendo el mismo: no hace falta guardarlo de nuevo.” · resumen · “Ver mi turno”.

### H-P3 · Cancelar (`cancelar.html`) — CU-07

- h1 “¿Cancelar tu turno?” · resumen “Turno que vas a cancelar” · “El horario queda libre para otra persona. Si después querés un turno, tenés que reservar de nuevo.” · “Sí, cancelar turno” (`btn-danger`) / “No, mantener turno” (secundario, vuelve a `turno`).
- **Estados:** cancelando · error de conexión (turno vigente, Reintentar) · < 2 h (`turno-plazo-vencido`) · **listo** (`cancelar-listo`: h1 “Cancelaste tu turno”, éxito “… quedó cancelado y el horario está libre.”, warning “Borralo de tu calendario”, “Reservar un turno nuevo”).

### H-A1 · Agenda H2 (`admin-agenda-hoy.html`, `-viernes`, `-semana-h2`) — CU-12 (H2), CU-14

- Igual que A2 + línea “Son las 14:00 (hora del prototipo). La asistencia se marca solo en turnos que ya empezaron.”
- **Resumen de pendientes** (si hay): alerta warning “⚠ 3 turnos pasados sin marcar asistencia” (con “Advertencia:” oculto, DD-34) con links a cada tarjeta (`#t-paula`, que tiene `tabindex=-1`).
- **Tarjeta vigente con inicio pasado:** badge “? Sin marcar” (o “✓ Asistió” / “✕ No asistió”) + `fieldset.attendance` (legend “Asistencia” + oculto “de Paula V., 11:00”) con botones “Asistió” / “No asistió” (`aria-pressed`; el elegido con fondo seleccionado y ✓). Al tocar: cambia el badge y se anuncia en `role=status` “Marcaste “Asistió” para Paula V.” (sin doble punto si el nombre termina en “.”); se puede cambiar. El foco no se mueve.
- **Error al guardar la asistencia** (`admin-agenda-asistencia-error.html`, DD-35): la marca se ve mientras guarda; si falla, botones, `aria-pressed`, badge y filete vuelven al valor previo; debajo de los botones, dentro del `fieldset` de la tarjeta, aparece una alerta `danger` compacta con `role="alert"`: “✕ No pudimos guardar la asistencia” + ““Asistió” no se guardó: Paula V. sigue como estaba (Sin marcar). Revisá tu conexión.” + botón secundario “Probá de nuevo” (nombre accesible “Probá de nuevo a marcar “Asistió” para Paula V.”). El foco queda en el botón tocado, que suma `aria-describedby` al id de la alerta. “Probá de nuevo” o volver a tocar un botón quita la alerta y guarda (anuncio en `role=status`, foco en el botón de la marca guardada). El resumen “N sin marcar” solo baja cuando se guarda. La API la define el Architect.
- **Tarjeta vigente** (pasada o futura): “Mover” y “Cancelar” (nombre accesible “Mover turno de Paula V., 11:00”). Los futuros no tienen asistencia.
- **Cancelada:** borde punteado, fondo `surface.subtle`, hora y servicio tachados, badge “✕ Cancelado por el cliente/local” + “Horario libre”; sin acciones ni asistencia. Encabezado “Ana · 2 turnos, 1 cancelado”.
- `-viernes`: refleja cambios del cliente (turno de Marta cancelado por el cliente) y el turno movido. `-semana-h2`: tarjetas compactas con los mismos badges.
- **Bloqueos en la agenda (DD-36, RN-22) — regla única:** recuadro punteado (`.empty.block-note`, no es un turno: sin acciones) con “⊘ Bloqueado” (ícono `aria-hidden`) + alcance/horario, “Motivo: …” solo si existe (vacío: se omite, nunca “Sin motivo”) y link “Ver bloqueos”.
  - **Todo el día** (local o peluquero): en la vista de día, al inicio de la columna del peluquero afectado (o de todas, si es del local), “⊘ Bloqueado · Todo el día”; en la semana, en el día correspondiente: `-semana-h2` lunes 12 “⊘ Bloqueado · Todo el local · Todo el día · Motivo: Feriado”.
  - **Rango horario:** dentro de la columna del peluquero, en orden cronológico entre los turnos, en la posición de su hora de inicio, con el rango visible: “⊘ Bloqueado · 09:00–13:00”. Los turnos confirmados dentro del rango se siguen mostrando (no se ocultan).
  - Ejemplo de ambos casos en la vista de día: `admin-agenda-dia-bloqueo` (sábado 24 de octubre): Carla con bloqueo 09:00–13:00 “Motivo: Trámite personal” antes de su turno de las 15:00; Ana con bloqueo de todo el día sin motivo (columna “Sin turnos”). Coincide con `admin-bloqueos`.

### H-A2 · Mover (`admin-mover.html`) — CU-13

- “← Volver a la agenda” · h1 “Mover turno” · “Turno actual” (cliente + contacto, servicio · duración, cuándo con peluquero).
- “Nuevo horario”: **Peluquero** (`select`, hint “Solo los peluqueros activos que hacen <servicio>.” — D-31, RN-23: los demás no se ofrecen) · **Fecha** (`type=date`, sin `max`) · **Hora de inicio** (`type=time`, `step=900`, hint “Cada 15 minutos (:00, :15, :30, :45). El turno dura 45 min: termina a las 10:45.”) · nota “Desde el panel podés mover a cualquier fecha (sin el límite de 30 días) y aunque falten menos de 2 horas.” · “Guardar cambio” / “Volver a la agenda sin mover”.
- **Superpuesto** (`-superpuesto`): resumen `role=alert` + foco “No se puede mover a ese horario · Bruno ya tiene un turno de 16:00 a 16:30… · El turno sigue como estaba.” + error junto a “Hora de inicio” (`aria-invalid`, `aria-describedby`). No hay botón para forzar.
- **Advertencia** (`-advertencia` fuera del horario semanal; `-bloqueo` dentro de un bloqueo): alerta warning con foco “⚠ ¿Mover igual?” + motivo concreto (“Ana no trabaja los domingos” / “el martes 20 de octubre Ana tiene un bloqueo de todo el día”) + “Si lo movés igual, el turno queda en ese horario aunque no se ofrezca en la web.” · “Mover igual” (primario) / “Elegir otro horario” (secundario) · resumen “Turno actual” y “Horario elegido”.
- **Validación (Architect, P-D12):** el servidor valida todo de una vez: la superposición gana y no trae advertencias; fuera de horario y bloqueo llegan juntos en la misma advertencia. “Mover igual” revalida antes de guardar: si mientras tanto alguien reservó ese horario, vuelve `-superpuesto` (sin estado nuevo).
- **Estados:** guardando · error de conexión (turno sin cambios) · **movido** (`admin-agenda-movido`: alerta success con foco “✓ Moviste el turno de Lucía al sábado 17 de octubre a las 10:00 con Ana. El horario anterior (…) quedó libre.” + “Avisale al cliente: <tel:>. El sistema no le envía nada.”).

### H-A3 · Cancelar desde el panel (`admin-cancelar.html`) — CU-13

- h1 “¿Cancelar el turno de Vera T.?” · resumen · “El horario queda libre. El link privado del cliente va a mostrar que el local canceló el turno. No se le envía ningún mensaje.” · “Sí, cancelar turno” (peligro) / “No, volver a la agenda”.
- **Estados:** error de conexión · **cancelado** (`admin-agenda-cancelado`: “✓ Cancelaste el turno de Vera T. (…). El horario quedó libre.” + “Avisale al cliente: tel:”) · **sin contacto** (`-cancelado-sin-contacto`: “El cliente no dejó contacto.”).

### H-A4 · Bloqueos (`admin-bloqueos.html`, `admin-bloqueo-nuevo.html`) — CU-11

- Nav del panel: Agenda · Servicios · Peluqueros · **Bloqueos** · Datos del local.
- Lista: h1 “Bloqueos” + “Feriados del local y ausencias de un peluquero. En esos días u horarios la web no ofrece turnos. Los turnos ya confirmados no se cancelan solos.” · “Nuevo bloqueo” · h2 “Próximos y recientes”: por bloqueo, días (h3), “Todo el local · Todo el día” / “Peluquero: Carla · 09:00 a 13:00”, “◷ Ya pasó” si corresponde, si tiene motivo, línea “Motivo: Feriado” (sin motivo no se muestra nada, nunca “Sin motivo”), “Eliminar” (nombre accesible completo). **Vacía** (`-vacio`): explica para qué sirve + “Nuevo bloqueo”.
- Formulario: `fieldset` “¿A quién afecta?” (radios Todo el local / Un peluquero → revela `select` Peluquero) · “¿Qué días?” (Un día / Varios días seguidos → revela “Fecha hasta (inclusive)”) · “¿Qué horario?” (Todo el día / Un rango horario → revela Desde/Hasta `step=900`; hint “En hora del local, cada 15 minutos. Si elegís varios días, el rango se aplica a cada uno.”) · **Motivo (opcional)** (`type=text`, `maxlength=80`, hint “Solo lo ves vos en el panel. Ej.: Feriado, Vacaciones de Ana. Hasta 80 caracteres.” vinculado con `aria-describedby`; vacío no genera error — D-30, RN-22) · “Guardar bloqueo” / “Cancelar”.
- **Errores** (`-error`): resumen “Revisá 2 datos para guardar” + junto al campo (“La fecha “hasta” tiene que ser igual o posterior a la fecha “desde”.”, “La hora de fin tiene que ser posterior a la de inicio.”).
- **Guardado** (`-guardado`) · **con turnos dentro** (`-afectados`: “✓ Guardamos el bloqueo de Bruno, del lunes 2 al viernes 6 de noviembre · Motivo: Vacaciones de Bruno · Hay 2 turnos confirmados dentro. No se cancelaron: decidí si los movés o los cancelás.” + lista con Mover / Cancelar) · **eliminar** (`-eliminar`: “¿Eliminar este bloqueo?” + “Esos horarios vuelven a ofrecerse en la web.” + “Sí, eliminar bloqueo” / “No, volver”) · eliminado (`admin-bloqueos-eliminado`: “✓ Eliminamos el bloqueo de Ana del martes 20 de octubre. Esos horarios vuelven a estar libres en la web.” + línea “Motivo: Vacaciones de Ana”, mismo formato que la lista).
- **Cliente** (`horario-bloqueado`): el martes 20 (bloqueo de Ana de todo el día) se ve “Cerrado” y no es link (DD-08, DD-33). El motivo del bloqueo nunca aparece en la web (D-30).

### H-A5 · Turnos afectados — CU-10 (H2)

- `admin-peluqueros-afectados`: “✓ Guardamos el nuevo horario de Bruno · 2 turnos futuros quedaron fuera del horario nuevo (…). No se borraron ni se modificaron: decidí si los movés o los cancelás.” + h2 “Turnos fuera del nuevo horario de Bruno” con tarjetas (fecha y hora, servicio · cliente · contacto, Mover / Cancelar).
- `admin-peluqueros-desactivado`: “✓ Desactivamos a Carla · Ya no aparece en la reserva. Tiene 3 turnos futuros que se mantienen…” + lista igual.

## 4. Responsive

| Ancho | Cliente | Panel |
|---|---|---|
| 320–639 px | 1 columna; botones a ancho completo, primario arriba; horarios en 2+ columnas (min 5.5rem*); días en 3–4 columnas; resumen `dl` en 2 columnas | Nav de secciones en fila con wrap; barra de herramientas apilada; agenda día y semana apiladas |
| ≥ 640 px (`breakpoint.md`) | Botones en fila (primario a la derecha); campos de a 2; “Antes / Después” lado a lado | Rangos “Desde/Hasta/Quitar” en una fila; campos de servicio, mover y bloqueo de a 2 |
| ≥ 1024 px (`breakpoint.lg`) | Igual (columna de 40rem) | Agenda día en columnas por peluquero; semana en 7 columnas |

Sin anchos fijos: todo en `rem` / grid `auto-fill`, `overflow-wrap: anywhere` para textos largos (link privado, emails).

## 5. Cobertura de criterios

✔ = cubierto en pantalla · — = no aplica a UI (sistema).

| CU | Criterio (resumen) | Pantalla / estado |
|---|---|---|
| CU-01 | Lista de activos con nombre, duración, precio y aclaración | ✔ P1 |
| | Inactivos no aparecen | ✔ P1 (dato de prueba “Tratamiento capilar” inactivo en A3 no figura en P1) |
| | Sin servicios: mensaje + teléfono | ✔ `servicios-vacio` |
| | Sin peluquero activo: no aparece | ✔ P1 (“Alisado” sin peluqueros en A3 no figura en P1) |
| CU-02 | Solo inicios libres con duración completa | ✔ P3 (datos de prueba) / — regla de sistema |
| | “Cualquiera”: unión sin repetidos | ✔ P3 |
| | Pasados no aparecen | ✔ P3 (hoy) |
| | Día sin horarios: mensaje + otro día | ✔ `horario-vacio` |
| | Zona del local | ✔ hints, resumen, footer, `.ics` |
| | Ventana de 30 días (D-14) | ✔ hint + `horario-limite` |
| CU-03 | Confirmar con nombre → confirmación | ✔ P4 → P5 → P7 |
| | “Cualquiera”: muestra el asignado | ✔ P7, P8 |
| | Nombre vacío: error junto al campo | ✔ `datos-error` |
| | Sin tel. ni email: se crea igual | ✔ P4 (validación JS) · resumen “No lo dejaste” |
| | Teléfono opcional con texto recomendado | ✔ P4 |
| | Email/tel. inválido: qué corregir | ✔ `datos-error` / validación JS |
| | Volver conserva lo elegido | ✔ “Volver”, “Cambiar” (sessionStorage en prototipo) |
| CU-04 | Una sola se confirma | — sistema |
| | Mensaje, horarios actualizados, conserva servicio y datos | ✔ P6 |
| | “Cualquiera”: reasigna o mensaje | ✔ P6 (nota) / — sistema |
| CU-05 | Resumen completo + datos del local | ✔ P7 |
| | Link + indicación visible de guardarlo + copiar | ✔ P7 bloque destacado |
| | Link H1: resumen solo lectura “Confirmado”, sin cambiar/cancelar | ✔ P8 `turno-solo-lectura` |
| | (H2) Movido por el admin: datos nuevos + “El local cambió tu turno: ahora es…” | ✔ `turno-movido` |
| | (H2) Cancelado por el admin: cancelado por el local + teléfono, sin botones | ✔ `turno-cancelado-local` |
| | Link inválido: “Turno no encontrado” sin datos | ✔ `turno-no-encontrado` |
| | Agregar al calendario con link en la descripción | ✔ `turno.ics` |
| | No se envía nada | ✔ textos sin promesas de aviso; sin ramas de envío |
| CU-08 | No autenticado: pide sesión, sin datos | ✔ `admin-sesion` |
| | Válidas: accede | ✔ A1 → A2 |
| | Inválidas: error genérico | ✔ `admin-ingresar-error` |
| | (Decisión CDO) límite de intentos | ✔ `admin-ingresar-bloqueado` |
| CU-09 | Crear con nombre, duración, precio | ✔ A3 |
| | Nombre vacío o duración fuera de 5–480 min / no múltiplo de 5: error | ✔ `admin-servicio-error` |
| | Cambio de duración solo para nuevas | ✔ hint + mensaje de guardado |
| | Desactivar | ✔ checkbox Activo + hint |
| | Peluqueros asignados | ✔ checkboxes |
| | Aviso sin peluqueros | ✔ badge en lista |
| CU-10 | Crear con servicios y horario (varios rangos) | ✔ A4 |
| | Sin servicios: aviso | ✔ badge en lista + hint |
| | Rango inválido o superpuesto: error | ✔ `admin-peluquero-error` |
| | Cambio de horario no toca turnos | ✔ hint + mensaje de guardado |
| | (H2) turnos afectados por el cambio de horario, para mover/cancelar | ✔ `admin-peluqueros-afectados` (H-A5) |
| | Desactivar | ✔ checkbox Activo + hint |
| | (H2) turnos futuros del desactivado, para mover/cancelar | ✔ `admin-peluqueros-desactivado` (H-A5) |
| CU-12 | Día por peluquero con hora, duración, servicio, cliente, contacto, estado | ✔ A2 día |
| | Semana con navegación | ✔ A2 semana |
| | Filtro por peluquero | ✔ `admin-agenda-dia-filtrada` |
| | Turno web aparece al actualizar | ✔ turno de “Lucía” 15:30 + nota |
| | (H2) cambios/cancelaciones del cliente reflejados | ✔ `admin-agenda-viernes` (Marta cancelada por el cliente) + nota “aparecen al abrir o actualizar” |
| | (H2) cancelado distinguible y su horario libre | ✔ H-A1: badge + tachado + borde punteado + “Horario libre” |
| | (H2) bloqueo del período con su motivo, si lo tiene (D-30) | ✔ `admin-agenda-semana-h2` lunes 12 (“⊘ Bloqueado … Motivo: Feriado”) y `admin-agenda-dia-bloqueo` (rango horario y todo el día), DD-36 |
| CU-06 | Turno futuro: resumen + “Cambiar” y “Cancelar” | ✔ `turno` (H-P1) |
| | ≥ 2 h: elige día/horario libre (mismo servicio y peluquero o “cualquiera”) y confirma → horario nuevo, original libre, confirmación; “cualquiera” asignado por RN-20 | ✔ `cambiar` → `-revisar` → `-confirmado` (peluquero asignado visible) / — asignación de sistema |
| | 16:00 con turno 18:00: puede (exactamente 2 h) | — regla del servidor; UI: estado `turno` con acciones |
| | 16:01: no puede, mensaje de contactar al local | ✔ `turno-menos-2h`; si vence con la página abierta, `turno-plazo-vencido` |
| | Ventana de 30 días e inicios cada 15 min | ✔ `cambiar` (mismo selector y hint de P3) |
| | Mismo link, “Agregar al calendario” nuevo, aviso de borrar el anterior | ✔ `cambiar-confirmado` + `turno-cambiado.ics` |
| | Otro servicio: no desde “Cambiar”, ve que debe cancelar y reservar | ✔ textos en `turno` y `cambiar` |
| | Horario ocupado al confirmar: mensaje, conserva el original, elige otro | ✔ `cambiar-ocupado` (`role=alert` + foco) |
| | < 2 h al abrir: no puede, mensaje con teléfono | ✔ `turno-menos-2h` |
| | Pasado o cancelado: ve el estado, no puede cambiar | ✔ `turno-pasado`, `turno-cancelado`, `turno-cancelado-local` |
| CU-07 | ≥ 2 h: “Cancelar” + segundo paso → cancelado, horario libre, aviso de borrar del calendario | ✔ `cancelar` → `cancelar-listo` |
| | 16:00 / 18:00: puede | — servidor; UI `turno` con acciones |
| | 16:01: no puede, mensaje | ✔ `turno-menos-2h` / `turno-plazo-vencido` |
| | No confirma el segundo paso: sigue vigente | ✔ “No, mantener turno” → `turno` |
| | < 2 h al abrir: no puede, teléfono | ✔ `turno-menos-2h` |
| | Perdió el link / reservó por teléfono: el admin mueve o cancela | ✔ CU-13 (`admin-mover`, `admin-cancelar`); teléfono del local en todo el cliente |
| CU-11 | Bloqueo de todo el local en fecha o rango: sin horarios para nadie | ✔ `admin-bloqueo-nuevo` (“Todo el local”, un día / varios) + `horario-bloqueado` (“Cerrado”) |
| | Bloqueo de un peluquero: sin horarios de ese peluquero | ✔ `admin-bloqueo-nuevo` (“Un peluquero”) + `horario-bloqueado` (con Ana) |
| | Turnos confirmados dentro: los ve, no se cancelan, decide mover/cancelar | ✔ `admin-bloqueo-afectados` |
| | Eliminar: horarios vuelven a estar libres | ✔ `admin-bloqueo-eliminar` → `admin-bloqueos-eliminado` |
| | (D-30, RN-22) Motivo opcional, solo en el panel (lista y agenda) | ✔ “Motivo (opcional)” en `admin-bloqueo-nuevo` + “Motivo: …” en la lista y en `admin-agenda-semana-h2` / `admin-agenda-dia-bloqueo`; no aparece en `horario-bloqueado` |
| CU-13 | No existe crear turno en el panel | ✔ ninguna acción para crear turnos en la agenda (D-23) |
| | Superposición: error, no se mueve, no se puede forzar | ✔ `admin-mover-superpuesto` |
| | Fuera de horario o bloqueo: advierte motivo y pide confirmación | ✔ `admin-mover-advertencia`, `admin-mover-bloqueo` (“Mover igual” / “Elegir otro horario”) |
| | “Mover igual” revalida; si se ocupó mientras tanto, superposición | ✔ `admin-mover-superpuesto` (P-D12) |
| | Solo inicios cada 15 min | ✔ `type=time step=900` + hint |
| | Mueve (puede ser otro peluquero): horario nuevo, anterior libre, link muestra “El local cambió tu turno” | ✔ `admin-mover` (select peluquero) → `admin-agenda-movido` → `turno-movido` |
| | Cancela: cancelado, horario libre, link muestra cancelado por el local | ✔ `admin-cancelar` → `admin-agenda-cancelado` → `turno-cancelado-local` |
| | < 2 h: el admin puede | ✔ nota en `admin-mover`; Vera (16:00 de hoy) cancelable |
| | Más de 30 días: el admin puede | ✔ fecha sin `max` + nota |
| | El panel no muestra ni recupera el link privado | ✔ ninguna pantalla del panel lo muestra |
| | Sin notificación; muestra el teléfono del cliente | ✔ “Avisale al cliente: tel:” / “El cliente no dejó contacto” |
| CU-14 | Vigente con inicio pasado: marca asistió/no asistió y se ve | ✔ `admin-agenda-hoy` (botones `aria-pressed` + badge) |
| | Error al guardar: vuelve al valor previo y avisa (diseño, DD-35) | ✔ `admin-agenda-asistencia-error` (`role=alert` en la tarjeta + “Probá de nuevo”) |
| | Futuro: no puede marcar | ✔ sin control en futuros (Martín 15:45) |
| | Corrige: queda la última | ✔ botones alternables (JS del prototipo) |
| | Pasados sin marcar identificados | ✔ badge “? Sin marcar” + resumen “3 turnos pasados sin marcar” |
| | Cancelado: no se marca | ✔ cancelados sin control |
| CU-16 | Cargar y guardar nombre, dirección, teléfono | ✔ A5 |
| | Vacío: error junto al campo | ✔ `admin-local-error` |
| | Teléfono nuevo en “contactá al local” | ✔ todos los mensajes usan el mismo dato (footer, vacíos, errores, P8) |
| | Dirección vigente en el calendario | ✔ `.ics` `LOCATION` |
