# Spec de UI — Turnos para peluquería, MVP Hito 1

Pantallas, componentes, contenido, estados y responsive del Hito 1. Criterios:
[casos-de-uso.md](https://github.com/gm2dev/coop-agents-product/blob/po/turnos-peluqueria-mvp/initiatives/turnos-peluqueria-mvp/casos-de-uso.md).
Flujos: [flows.md](flows.md). Prototipo: [`prototypes/turnos-peluqueria-mvp/`](../../prototypes/turnos-peluqueria-mvp/index.html).

Solo se usan tokens semánticos de [`design-system/tokens.json`](../../design-system/tokens.json) (y los
**propuestos** del [README](README.md#tokens-propuestos-decide-el-cdo), marcados con *). En el texto, `token`
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
| **Horarios** | Paso 3 | `fieldset` + `legend` “Horarios del <día>” + hint (hora de inicio, hora del local, duración). Radio group nativo en grilla `auto-fill` (min `size.grid.slot-min`*), cada horario alto `size.target.comfortable`. Elegido: `surface.selected`, borde 2px*, ✓ visible. Flechas para moverse dentro del grupo, Tab para salir. |
| **Campo de texto** | Formularios | `label` visible arriba; “(opcional)” en `text.muted` dentro del label; hint debajo del label asociado con `aria-describedby`; input alto `size.target.comfortable`, fuente `font.size.200` (evita zoom en iOS), borde `border.strong`. |
| **Error de campo** | Formularios | Debajo del input: ⚠ + texto en `feedback.danger.text` semibold; input con `aria-invalid="true"` y borde 2px* `feedback.danger.border`; el id del error se agrega a `aria-describedby`. |
| **Resumen de errores** | Formularios | Alerta `danger` arriba del formulario, `role="alert"`, `tabindex="-1"`, recibe el foco al enviar; título “Revisá N datos para …” + lista de links que llevan el foco a cada campo. |
| **Alerta** | Mensajes | Variantes `danger`, `success`, `warning`, `info` (`feedback.*.text/bg/border`, borde 2px*). Título en negrita + texto. Errores: `role="alert"` y foco. Estados informativos: `role="status"`. |
| **Bloque “Guardá tu link privado”** | Confirmación | Fondo `feedback.warning.bg`, borde 2px* `feedback.warning.border`, `radius.lg`. h2 con ⚠, frase en negrita, campo de solo lectura con el link (label visible) y botón primario “Copiar link” pegado al campo (arriba del pliegue en 360×640), secundario “Agregar al calendario”, región `role="status"` para el resultado de copiar. |
| **Botones** | Acciones | Primario `action.primary` / `text.on-action` (hover `action.primary-hover`); secundario `surface.default` + borde y texto `action.primary`. Alto `size.target.comfortable`. En celular ocupan el ancho; desde `breakpoint.md`, ancho automático y el primario a la derecha (orden del DOM: primario primero). Enviando: `aria-disabled="true"`, spinner + “Confirmando…”, `surface.disabled`. |
| **Badge** | Estado, origen, avisos | Píldora con borde y texto; siempre con palabra (“Origen: Web”, “✓ Confirmado”, “⚠ Sin servicios”). Web = `info` (en H1 todos los turnos son Web; “Origen: Panel” neutro llega con CU-13 en H2), Confirmado = `success`, avisos = `warning`. |
| **Resumen (dl)** | Revisar, confirmación, link | `dl` en 2 columnas (`dt` en `text.muted`, `dd` semibold): servicio, peluquero, fecha, hora inicio–fin (hora del local), duración, precio (orientativo, se paga en el local) y, en revisar/confirmación, nombre y teléfono. |
| **Cargando** | Listas y envíos | Spinner decorativo + texto en `role="status"`; esqueleto `aria-hidden`. Con `prefers-reduced-motion` el spinner no gira. |
| **Tarjeta de turno** | Agenda | Borde `border.strong` con filete izquierdo `action.primary`; hora inicio–fin (bold) · duración; servicio · cliente; contacto como link `tel:`/`mailto:` o “Sin contacto”; badges de origen y estado. |

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
- Selector de días (semana actual) + hint de ventana: “Podés reservar desde hoy hasta **30** días hacia adelante (hasta el **sábado 14 de noviembre**).” (cifra y fecha parametrizables, P-5).
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
- **Errores** (`datos-error`): nombre vacío → “Ingresá tu nombre.”; email inválido → “Revisá el email: tiene que tener la forma nombre@ejemplo.com.”; teléfono inválido → “Revisá el teléfono: usá solo números, espacios o guiones (mínimo 8 dígitos).” Resumen con foco + error junto al campo + lo tipeado se conserva. Sin teléfono ni email, avanza igual.

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
2. **Bloque “Guardá tu link privado”** (ver componente): “Es la única forma de volver a ver tu turno. No se envía por email, SMS ni WhatsApp.” · campo “Tu link privado” (solo lectura, seleccionable) con **Copiar link** (primario) pegado al campo (debajo en celular, a la derecha desde 40rem) para que quede arriba del pliegue en 360×640 · región de estado · ayuda “Guardalo en tus notas, o agregá el turno a tu calendario: el evento incluye el link.” · **Agregar al calendario** (secundario, descarga `.ics`).
   - Copiar OK → se anuncia “Link copiado. Pegalo en tus notas o en un chat con vos mismo para tenerlo a mano.”
   - Copiar falla → se selecciona el link y se anuncia “No se pudo copiar automáticamente. El link quedó seleccionado: copialo a mano.”
3. **Resumen del turno:** servicio, peluquero, fecha, hora inicio–fin (hora del local), duración, precio (orientativo, se paga en el local), a nombre de, teléfono (o “No lo dejaste”).
4. **Dónde:** nombre, dirección y teléfono del local + “Si perdés el link o necesitás cambiar algo, llamá al local.”
5. Link “Reservar otro turno”.

**Archivo `.ics`:** `SUMMARY` “<servicio> en <local> (con <peluquero>)”, `DTSTART/DTEND` con la zona del local, `LOCATION` = dirección vigente (CU-16), `DESCRIPTION` con servicio, duración, peluquero, precio orientativo, teléfono del local y el link privado; `URL` = link privado. Sin alarmas (`VALARM`): el recordatorio lo decide el calendario del cliente (no prometemos aviso).

### P8 · Link privado (`turno.html`) — CU-05

- **h1** “Tu turno” + badge “✓ Confirmado” + “Estado actualizado al abrir este link.”
- Resumen (sin nombre ni teléfono del cliente, S-8) + “Agregar al calendario”.
- Dónde + “Si necesitás cambiar o cancelar el turno, llamá al local: <teléfono>.” (H1). **Enganche H2:** acciones Cambiar / Cancelar en este lugar.
- “Este link es privado: no lo compartas.”
- **Estados:** cargando (`turno-cargando`) · **Turno no encontrado** (`turno-no-encontrado`: h1 “Turno no encontrado”, “Este link no corresponde a ningún turno. Revisá que lo hayas copiado completo.” + teléfono del local + “Reservar un turno”; nunca datos de un turno; misma respuesta para token inválido o inexistente).

## 3. Panel del local

### A1 · Ingresar (`admin-ingresar.html`) — CU-08

- Sin navegación de secciones. **h1** “Ingresar al panel”.
- Campos **Usuario** (`autocomplete="username"`, sin autocapitalizar) y **Contraseña** (`autocomplete="current-password"`) + checkbox “Mostrar contraseña”. Pegar está permitido.
- “Ingresar” (primario). Debajo: “Si olvidaste tu contraseña, pedile a quien administra el panel que te la resetee.” (sin link, sin email).
- **Estados:** campos vacíos (error junto al campo + resumen) · ingresando (`-cargando`) · **error genérico** (`-error`: “Usuario o contraseña incorrectos. Revisalos y probá de nuevo.”; conserva el usuario, vacía la contraseña; no dice cuál falló) · **demasiados intentos** (`-bloqueado`: “Demasiados intentos. Por seguridad, el ingreso quedó pausado un rato. Esperá unos minutos y probá de nuevo.” + texto de reseteo; no revela si el usuario existe) · **sin sesión** (`admin-sesion`: formulario con aviso “Para ver el panel, primero iniciá sesión.”; ningún dato del panel).

### A2 · Agenda (`admin-agenda-dia.html`, `-semana`) — CU-12

- **h1** “Agenda”. Barra: control segmentado “Día / Semana” (links con `aria-current`) y filtro **Peluquero** (`select` Todos/Ana/Bruno/Carla + botón “Filtrar”; no cambia solo al elegir).
- Navegación: h2 con el período (“Viernes 16 de octubre” / “Semana del 12 al 18 de octubre”), “← Día anterior · Hoy · Día siguiente →” (o semana). Nota: “Horarios en hora del local. Los turnos nuevos de la web aparecen al abrir o actualizar la agenda.”
- **Día:** una sección por peluquero (h3 con nombre y “N turnos”/“Sin turnos”), lista de tarjetas en orden horario; peluquero sin turnos: “Sin turnos este día.” Celular: secciones apiladas; ≥ 64rem: columnas.
- **Semana:** 7 secciones (h3 “Vie 16 oct”, “Hoy” como badge + borde 2px*), tarjetas compactas (hora · peluquero, servicio · duración · cliente, origen, estado). Días cerrados: “Cerrado”. Celular: apiladas; ≥ 64rem: 7 columnas.
- **Filtrado** (`-dia-filtrada`): `role="status"` “Mostrando solo los turnos de Bruno. Ver todos”, solo la columna de ese peluquero.
- **Estados:** cargando · **vacío** (`-vacia`: “No hay turnos este día. Cuando alguien reserve por la web, el turno va a aparecer acá.”) · error (+ Reintentar).
- **Enganche H2:** “Cargar turno” en la barra; Mover/Cancelar y Asistió/No asistió en la tarjeta; estados Cancelado y Sin marcar como badges con texto.

### A3 · Servicios (`admin-servicios.html`, `admin-servicio-editar.html`) — CU-09

- Lista: “Agregar servicio” (primario) + nota “La web solo muestra los servicios activos que tienen al menos un peluquero asignado.” Cada fila: nombre + badge Activo/Inactivo, “45 min · $ 11.000 (precio de referencia)”, peluqueros, y si no tiene: **badge “⚠ Sin peluqueros asignados” + “No se ofrece en la web hasta que le asignes al menos uno.”** Botón “Editar <nombre>” (nombre accesible completo).
- Formulario: **Nombre** · **Duración (minutos)** (number, min 5, paso 5; hint “Si la cambiás, aplica a las reservas nuevas. Los turnos ya confirmados conservan su duración.”) · **Precio de referencia (opcional)** (hint “Se muestra como orientativo. No se cobra en la web.”) · **Peluqueros que lo hacen** (checkboxes; hint “El cliente solo ve a estos peluqueros. Sin ninguno, el servicio no se ofrece en la web.”) · **Activo** (hint “Si lo desactivás, deja de aparecer en la web. Los turnos ya confirmados se mantienen.”). “Guardar” / “Cancelar”.
- **Estados:** vacío (`-vacio`, explica el efecto en la web) · errores (`admin-servicio-error`: “Ingresá el nombre del servicio.”, “La duración tiene que ser de al menos 5 minutos.”) · guardado (`-guardado`: alerta success con foco).

### A4 · Peluqueros (`admin-peluqueros.html`, `admin-peluquero-editar.html`) — CU-10

- Lista: nombre + Activo/Inactivo, servicios, resumen del horario; sin servicios → **badge “⚠ Sin servicios” + “No aparece en la reserva hasta que tenga al menos un servicio.”**
- Formulario: **Nombre** · **Servicios que hace** (checkboxes) · **Horario semanal**: h2 + hint (“Uno o más rangos por día, en hora del local… Si cambiás el horario, los turnos ya confirmados no se borran ni se modifican.”); un `fieldset` por día (legend = día): “No trabaja.” si no hay rangos; cada rango “Desde / Hasta” (`type="time"`, paso 15 min; nombres accesibles “Desde (rango 2)”) + “Quitar” (“Quitar rango 2 del martes”); “+ Agregar rango al <día>”. Agregar/quitar mueve el foco (al nuevo “Desde” / al botón “Agregar”) y se anuncia en `role="status"`. · **Activo** (hint “Sus turnos futuros se mantienen”).
- **Validaciones** (`admin-peluquero-error`): “La hora de fin tiene que ser posterior a la de inicio.” · “Este rango se superpone con el rango 1 (10:00 a 13:00).” — en el rango (inputs `aria-invalid`) y en el resumen (“Martes, rango 2: …”).
- **Estados:** vacío · errores · guardado (“Los turnos ya confirmados no se modifican.”; enganche H2: turnos afectados).

### A5 · Datos del local (`admin-local.html`) — CU-16

- **h1** “Datos del local” + “Todos los campos son obligatorios. Se muestran en la web de reservas, en la confirmación y en el evento del calendario.”
- **Nombre del local** (“Como lo ven los clientes.”) · **Dirección** (“Calle, número y barrio o localidad.”) · **Teléfono de contacto** (“Aparece en todos los mensajes que piden ‘llamá al local’.”). Como todos son obligatorios, no se marca ninguno (la frase de arriba lo dice).
- **Estados:** errores junto al campo + resumen (`-error`) · guardado (`-guardado`).

## 4. Responsive

| Ancho | Cliente | Panel |
|---|---|---|
| 320–639 px | 1 columna; botones a ancho completo, primario arriba; horarios en 2+ columnas (min 5.5rem*); días en 3–4 columnas; resumen `dl` en 2 columnas | Nav de secciones en fila con wrap; barra de herramientas apilada; agenda día y semana apiladas |
| ≥ 640 px (`breakpoint.md`) | Botones en fila (primario a la derecha); campos de a 2 | Rangos “Desde/Hasta/Quitar” en una fila; campos de servicio de a 2 |
| ≥ 1024 px (`breakpoint.lg`) | Igual (columna de 40rem) | Agenda día en columnas por peluquero; semana en 7 columnas |

Sin anchos fijos: todo en `rem` / grid `auto-fill`, `overflow-wrap: anywhere` para textos largos (link privado, emails).

## 5. Cobertura de criterios

✔ = cubierto en pantalla · — = no aplica a UI (sistema) · H2 = fuera de esta entrega.

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
| | Ventana de 30 días (tentativo) | ✔ hint + `horario-limite` |
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
| | Link abre resumen solo lectura con estado vigente | ✔ P8 (ver P-D1) |
| | Link inválido: “Turno no encontrado” sin datos | ✔ `turno-no-encontrado` |
| | Agregar al calendario con link en la descripción | ✔ `turno.ics` |
| | No se envía nada | ✔ textos sin promesas de aviso; sin ramas de envío |
| CU-08 | No autenticado: pide sesión, sin datos | ✔ `admin-sesion` |
| | Válidas: accede | ✔ A1 → A2 |
| | Inválidas: error genérico | ✔ `admin-ingresar-error` |
| | (Decisión CDO) límite de intentos | ✔ `admin-ingresar-bloqueado` |
| CU-09 | Crear con nombre, duración, precio | ✔ A3 |
| | Nombre vacío o duración 0: error | ✔ `admin-servicio-error` |
| | Cambio de duración solo para nuevas | ✔ hint + mensaje de guardado |
| | Desactivar | ✔ checkbox Activo + hint |
| | Peluqueros asignados | ✔ checkboxes |
| | Aviso sin peluqueros | ✔ badge en lista |
| CU-10 | Crear con servicios y horario (varios rangos) | ✔ A4 |
| | Sin servicios: aviso | ✔ badge en lista + hint |
| | Rango inválido o superpuesto: error | ✔ `admin-peluquero-error` |
| | Cambio de horario no toca turnos | ✔ hint + mensaje de guardado |
| | (H2) turnos afectados | H2 — enganche en mensaje de guardado |
| | Desactivar | ✔ checkbox Activo + hint |
| | (H2) turnos futuros del desactivado | H2 |
| CU-12 | Día por peluquero con hora, duración, servicio, cliente, contacto, origen, estado | ✔ A2 día |
| | Semana con navegación | ✔ A2 semana |
| | Filtro por peluquero | ✔ `admin-agenda-dia-filtrada` |
| | Turno web aparece al actualizar | ✔ turno de “Lucía” 15:30 (origen Web) + nota |
| | (H2) cambios/cancelaciones del cliente; cancelados distinguibles | H2 |
| CU-16 | Cargar y guardar nombre, dirección, teléfono | ✔ A5 |
| | Vacío: error junto al campo | ✔ `admin-local-error` |
| | Teléfono nuevo en “contactá al local” | ✔ todos los mensajes usan el mismo dato (footer, vacíos, errores, P8) |
| | Dirección vigente en el calendario | ✔ `.ics` `LOCATION` |
