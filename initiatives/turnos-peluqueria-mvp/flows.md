# Flujos — Turnos para peluquería, MVP Hitos 1 y 2

Un diagrama por caso de uso del Hito 1 y del Hito 2 (desde [§ Hito 2](#hito-2)), con camino principal, errores, vacíos y salidas. Los nodos entre
corchetes llevan el nombre del archivo del prototipo (`prototypes/turnos-peluqueria-mvp/<archivo>.html`).
Criterios y reglas: [casos-de-uso.md](https://github.com/gm2dev/coop-agents-product/blob/po/turnos-peluqueria-mvp/initiatives/turnos-peluqueria-mvp/casos-de-uso.md).

Convención: rectángulo = pantalla o estado; rombo = decisión del sistema o del usuario; `-.->` = salida
alternativa.

## Vista general del cliente

```mermaid
flowchart LR
  A[servicios<br/>Paso 1] --> B[peluquero<br/>Paso 2] --> C[horario<br/>Paso 3] --> D[datos<br/>Paso 4] --> E[revisar<br/>Paso 5]
  E -->|Confirmar turno| F{¿Horario sigue libre?}
  F -->|Sí| G[confirmacion]
  F -->|No| C2[horario-ocupado<br/>CU-04]
  C2 --> E
  G -->|Reservar otro turno| A
  E -.->|Cambiar| A & C & D
  B -.->|Volver| A
  C -.->|Volver| B
  D -.->|Volver| C
```

Desde v0.7 (D-33, D-34) no hay link privado, “Agregar al calendario” ni cambio o cancelación por el cliente:
después de cerrar la confirmación, la web no vuelve a mostrar el turno. El aviso de contacto para cambios
(DD-37) está en `servicios` (portada) y en `confirmacion`; en los pasos intermedios el contacto queda en el pie.

## Cliente quiere cambiar o cancelar su turno (D-33, RN-25)

```mermaid
flowchart TD
  need([Cliente con turno quiere cambiarlo o cancelarlo]) --> where{¿Dónde lo ve?}
  where -->|Entra a la web| s[servicios<br/>'¿Ya tenés un turno?' arriba de la lista]
  where -->|Todavía en la confirmación| c[confirmacion<br/>bloque 'Cambios y cancelaciones'<br/>debajo del resumen]
  s & c --> wa{¿El local cargó WhatsApp? CU-16}
  wa -->|Sí| link[Link 'Escribir por WhatsApp al número'<br/>abre wa.me con el número del local]
  wa -->|No, D-36| tel[Texto 'llamanos al teléfono'<br/>link tel:, sin WhatsApp]
  link --> chat([Le escribe al local por WhatsApp<br/>fuera del sistema, no es notificación: RN-12])
  tel --> call([Llama al local])
  chat & call --> admin[Admin en el panel: agenda → Mover / Cancelar<br/>CU-13]
  admin --> mv[admin-mover → admin-agenda-movido]
  admin --> cc[admin-cancelar → admin-agenda-cancelado]
  mv & cc --> reply([El local le responde al cliente por su cuenta<br/>el sistema no le envía nada, D-1, D-3])
```

## CU-01 — Ver servicios

```mermaid
flowchart TD
  start([Cliente entra a la web]) --> load[servicios-cargando<br/>con aviso '¿Ya tenés un turno?' arriba]
  load --> ok{¿Respuesta?}
  ok -->|Error de red| err[servicios-error<br/>alerta + Reintentar + teléfono del local<br/>+ aviso de cambios debajo]
  err -->|Reintentar| load
  ok -->|OK| any{¿Hay servicios activos<br/>con al menos 1 peluquero activo?}
  any -->|No| empty[servicios-vacio<br/>'Por ahora no hay reservas online'<br/>+ teléfono del local y, en la misma alerta,<br/>WhatsApp para cambios]
  empty --> exit1([Salida: llama al local])
  any -->|Sí| list[servicios<br/>aviso '¿Ya tenés un turno?' + WhatsApp<br/>nombre · duración · precio<br/>'orientativos, se paga en el local']
  list -.->|Quiere cambiar o cancelar| wa([WhatsApp del local → CU-13])
  list -->|Elige y Continuar| next([Paso 2: peluquero])
```

Inactivos y sin peluqueros no se listan (RN-15): no hay estado de UI para ellos del lado del cliente.
Sin WhatsApp cargado (D-36), el aviso dice “llamanos al <teléfono>” (`servicios-sin-whatsapp`).

## CU-02 — Ver horarios libres

```mermaid
flowchart TD
  p2[peluquero<br/>'Cualquiera disponible' por defecto] -->|Continuar| p3[horario<br/>semana actual, día elegido]
  p3 --> day{Elige un día}
  day -->|Día cerrado o fuera de ventana| noop[No es un link: no se puede elegir]
  day -->|Día con horarios| load[horario-cargando] --> r{¿Respuesta?}
  r -->|Error| err[horario-error<br/>Reintentar, conserva lo elegido]
  err -->|Reintentar| load
  r -->|Sin horarios| empty[horario-vacio<br/>'Sin horarios disponibles'<br/>+ botón al próximo día con horarios]
  empty -->|Otro día| day
  r -->|Con horarios| slots[Radio group de horarios<br/>solo inicios libres, futuros, hora del local]
  p3 -->|Semana siguiente| more{¿Pasa de 30 días?}
  more -->|No| p3
  more -->|Último tramo| lim[horario-limite<br/>'Podés reservar hasta 30 días'<br/>días posteriores no seleccionables]
  slots -->|Elige y Continuar| next([Paso 4: datos])
  slots -.->|Volver| p2
```

Con “Cualquiera disponible” los horarios son la unión sin repetidos de los peluqueros que hacen el servicio.

## CU-03 — Reservar un turno

```mermaid
flowchart TD
  d[datos<br/>Nombre · Teléfono opcional · Email opcional] -->|Continuar| v{¿Válido?}
  v -->|Nombre vacío / email o tel. con formato inválido| de[datos-error<br/>resumen con foco + error junto a cada campo<br/>se conserva lo tipeado]
  de -->|Corrige| v
  v -->|Sí, aunque no haya tel. ni email| rv[revisar<br/>resumen completo + 'Cambiar' por dato]
  rv -.->|Cambiar servicio / horario / datos| back([Paso elegido, con lo demás conservado])
  rv -->|Confirmar turno| send[revisar-enviando<br/>botón deshabilitado + 'Confirmando…']
  send --> res{Resultado}
  res -->|Error de conexión| re[revisar-error<br/>'El turno NO quedó reservado' + Reintentar]
  re -->|Reintentar| send
  res -->|Horario ocupado| cu4([CU-04])
  res -->|Confirmado, si eligió 'Cualquiera', se asigna peluquero| ok([CU-05: confirmacion])
```

## CU-04 — Reserva simultánea del mismo horario

```mermaid
flowchart TD
  c([Confirmar turno]) --> srv{¿El peluquero sigue libre?}
  srv -->|Sí| ok([confirmacion])
  srv -->|No| anyp{¿Reservó con 'Cualquiera disponible'?}
  anyp -->|Sí| other{¿Otro peluquero del servicio<br/>libre en ese horario?}
  other -->|Sí: se asigna, criterio P-7| ok
  other -->|No| busy
  anyp -->|No| busy[horario-ocupado<br/>'Ese horario se acaba de ocupar, elegí otro'<br/>foco al mensaje, horarios actualizados<br/>servicio, peluquero y datos conservados]
  busy -->|Elige otro horario → 'Continuar a confirmar'| rv[revisar] --> c
  busy -.->|Otro día| busy
```

La reasignación con “Cualquiera disponible” es transparente: el cliente solo ve el peluquero final en la confirmación.

## CU-05 — Ver la confirmación

```mermaid
flowchart TD
  conf[confirmacion<br/>1. título + línea de éxito<br/>2. resumen: servicio, peluquero, fecha y hora, dirección<br/>+ 'Guardá estos datos: captura o anotalos'<br/>3. bloque 'Cambios y cancelaciones'] --> wa{¿WhatsApp cargado?}
  wa -->|Sí| l[Link 'Escribir por WhatsApp al número'<br/>se abre WhatsApp]
  wa -->|No, D-36| t[confirmacion-sin-whatsapp<br/>'llamanos al tel:']
  conf -->|Reservar otro turno| s1([servicios])
  conf -->|Cierra la pantalla| gone([No puede volver a ver el turno, D-33])
```

No hay ninguna rama de envío (email, SMS, WhatsApp del sistema): RN-12. Sin link privado, calendario ni
Cambiar/Cancelar (D-33, D-34; CU-06 y CU-07 eliminados).

## CU-08 — Ingresar al panel

```mermaid
flowchart TD
  any([Abre cualquier URL del panel]) --> auth{¿Sesión válida?<br/>dura 12 h}
  auth -->|Sí| agenda([admin-agenda-dia])
  auth -->|No| ses[admin-sesion<br/>mismo formulario con aviso<br/>'Para ver el panel, primero iniciá sesión'<br/>sin datos de agenda ni clientes]
  login[admin-ingresar] & ses -->|Ingresar| val{¿Campos completos?}
  val -->|No| fe[Error junto al campo + resumen con foco]
  fe --> val
  val -->|Sí| send[admin-ingresar-cargando] --> chk{Resultado}
  chk -->|Credenciales válidas| agenda
  chk -->|Inválidas| err[admin-ingresar-error<br/>'Usuario o contraseña incorrectos'<br/>conserva el usuario, vacía la contraseña]
  err --> val
  chk -->|5 intentos fallidos| blk[admin-ingresar-bloqueado<br/>'Demasiados intentos'<br/>'Probá de nuevo en 15 minutos']
  blk -.->|Después de 15 min| login
  login -.->|Olvidó la contraseña| manual([Texto: 'pedile al equipo que te dio<br/>el acceso que la resetee'<br/>reseteo manual, sin email, D-25])
```

## CU-09 — Gestionar servicios

```mermaid
flowchart TD
  l{¿Hay servicios?} -->|No| e[admin-servicios-vacio<br/>explica el efecto en la web + 'Agregar el primer servicio']
  l -->|Sí| list[admin-servicios<br/>nombre, duración, precio, activo,<br/>peluqueros, badge 'Sin peluqueros asignados']
  e & list -->|Agregar / Editar| f[admin-servicio-editar<br/>nombre, duración min, precio ref. opcional,<br/>peluqueros, activo]
  f -->|Guardar| v{¿Nombre y duración<br/>de 5 a 480 min, múltiplo de 5?}
  v -->|No| fe[admin-servicio-error<br/>resumen + error junto al campo, no se guarda]
  fe --> v
  v -->|Sí| ok[admin-servicios-guardado<br/>'Aplica a reservas nuevas, los confirmados<br/>conservan su duración']
  f -.->|Cancelar| list
  ok --> list
```

## CU-10 — Gestionar peluqueros y horario semanal

```mermaid
flowchart TD
  l{¿Hay peluqueros?} -->|No| e[admin-peluqueros-vacio]
  l -->|Sí| list[admin-peluqueros<br/>badge 'Sin servicios' si corresponde]
  e & list -->|Agregar / Editar| f[admin-peluquero-editar<br/>nombre, servicios, horario semanal<br/>0..n rangos por día, activo]
  f -->|+ Agregar rango / Quitar| f
  f -->|Guardar| v{¿Rangos válidos?}
  v -->|Fin ≤ inicio o superpuestos| fe[admin-peluquero-error<br/>error en el rango + resumen, no se guarda]
  fe --> v
  v -->|Sí| ok[admin-peluqueros-guardado<br/>'Los turnos ya confirmados no se modifican']
  ok -.-> h2[[H2: lista de turnos afectados<br/>por cambio de horario o desactivación]]
  f -.->|Cancelar| list
```

Un peluquero guardado sin servicios se guarda igual, con el aviso en la lista (CU-10, criterio 2).

## CU-12 — Ver la agenda

```mermaid
flowchart TD
  in([Ingresa al panel]) --> load[admin-agenda-cargando] --> r{¿Respuesta?}
  r -->|Error| err[admin-agenda-error + Reintentar]
  err --> load
  r -->|OK| d{¿Hay turnos en el período?}
  d -->|No| empty[admin-agenda-vacia<br/>'No hay turnos este día']
  d -->|Sí| day[admin-agenda-dia<br/>columna por peluquero, tarjetas con hora, duración,<br/>servicio, cliente, contacto, estado]
  day -->|Filtrar por peluquero| f[admin-agenda-dia-filtrada]
  f -->|Ver todos| day
  day <-->|Día / Semana| wk[admin-agenda-semana<br/>7 días, navegación de semanas]
  day -->|Día anterior / siguiente| load
  wk -->|Semana anterior / siguiente| load
  day -.-> h2[[H2: mover, cancelar, asistencia<br/>sin creación de turnos, D-23]]
```

## CU-16 — Configurar datos del local

Validación del WhatsApp provisional (DD-38, pendiente de producto): `+` y código de país, 10 a 15 dígitos.

```mermaid
flowchart TD
  f[admin-local<br/>nombre, dirección, teléfono: obligatorios<br/>WhatsApp para cambios: opcional] -->|Guardar| v{¿Los 3 completos y<br/>WhatsApp vacío o válido?}
  v -->|No| fe[admin-local-error<br/>error junto a cada campo vacío o al WhatsApp inválido + resumen]
  fe --> v
  v -->|Sí, con WhatsApp| ok[admin-local-guardado<br/>'Ya se muestran en la web y en las confirmaciones']
  v -->|Sí, sin WhatsApp| ok2[admin-local-guardado-sin-whatsapp<br/>'los clientes van a ver el teléfono', D-36]
  ok & ok2 -.-> use([Se usan en: footer del cliente, confirmación,<br/>aviso de cambios y cancelaciones, mensajes 'llamá al local'])
```

<a id="hito-2"></a>
## Hito 2

### CU-05 (H2), CU-06 y CU-07 — Eliminados (v0.7)

Los estados del link privado, cambiar y cancelar desde el link se eliminaron por D-33 (RN-07, RN-08, RN-09 y
RN-18 eliminadas). El camino que los reemplaza es [Cliente quiere cambiar o cancelar su turno](#cliente-quiere-cambiar-o-cancelar-su-turno-d-33-rn-25).

### CU-11 — Bloqueos

```mermaid
flowchart TD
  nav([Panel → Bloqueos]) --> any{¿Hay bloqueos?}
  any -->|No| empty[admin-bloqueos-vacio]
  any -->|Sí| list[admin-bloqueos<br/>alcance · días · horario · motivo si hay]
  empty & list -->|Nuevo bloqueo| form[admin-bloqueo-nuevo<br/>¿A quién? · ¿Qué días? · ¿Qué horario? step 15<br/>Motivo opcional, solo panel]
  form -->|Guardar| val{¿Válido?}
  val -->|No| ferr[admin-bloqueo-error<br/>resumen + error en campo]
  ferr --> form
  val -->|Sí| turns{¿Turnos confirmados dentro?}
  turns -->|No| saved[admin-bloqueo-guardado]
  turns -->|Sí| aff[admin-bloqueo-afectados<br/>lista: no se cancelaron]
  aff -->|Mover / Cancelar| cu13([CU-13])
  list -->|Eliminar| del[admin-bloqueo-eliminar<br/>confirmación]
  del -->|No, volver| list
  del -->|Sí, eliminar| gone[admin-bloqueos-eliminado<br/>horarios vuelven a la web]
  saved -.->|En la web| web[horario-bloqueado<br/>día 'Cerrado', sin motivo]
```

El motivo (D-30, RN-22) es opcional: vacío no da error y no se muestra nada. Se ve en la lista de bloqueos y en la agenda (DD-36); el cliente nunca lo ve. En la agenda, un bloqueo de todo el día va al inicio de la columna del peluquero (o de todas, si es del local) o en el día de la semana; uno de rango horario va entre los turnos según su hora de inicio, con el rango visible, sin ocultar los turnos confirmados que caigan dentro (`admin-agenda-dia-bloqueo`).

### CU-12 (H2) y CU-14 — Agenda operable y asistencia

```mermaid
flowchart TD
  ag[admin-agenda-hoy] --> sum{¿Hay pasados sin marcar?}
  sum -->|Sí| s1[Resumen 'N turnos pasados sin marcar'<br/>links a cada tarjeta]
  ag --> card{Tipo de turno}
  card -->|Vigente, inicio pasado| past[? Sin marcar + Asistió / No asistió<br/>+ Mover / Cancelar]
  past -->|Marca| save{¿Se guardó?}
  save -->|Sí| marked[✓ Asistió / ✕ No asistió<br/>role=status 'Marcaste…'<br/>corregible: queda la última]
  save -->|Error| aerr[admin-agenda-asistencia-error<br/>vuelve al valor previo · aria-pressed restaurado<br/>role=alert en la tarjeta · foco en el botón tocado]
  aerr -->|Probá de nuevo / tocar otra vez| save
  card -->|Vigente futuro| fut[Mover / Cancelar<br/>sin control de asistencia]
  card -->|Cancelado| canc[✕ Cancelado<br/>tachado + 'Horario libre', sin acciones]
  fut & past -->|Mover| cu13m([CU-13 Mover])
  fut & past -->|Cancelar| cu13c([CU-13 Cancelar])
  ag -.->|Día siguiente| vie[admin-agenda-viernes<br/>con un cancelado]
  ag -.->|Semana| sem[admin-agenda-semana-h2<br/>bloqueos: '⊘ Bloqueado' + motivo si hay]
  ag -.->|Día con bloqueos| blq[admin-agenda-dia-bloqueo<br/>todo el día: inicio de la columna<br/>rango: entre los turnos por hora de inicio]
```

CU-14, error al guardar: la marca no se da por guardada hasta que responde el servidor. Si falla, el estado
vuelve al anterior (botones, `aria-pressed`, badge), se avisa con `role=alert` dentro de la misma tarjeta y el
foco no se mueve del botón tocado; el resumen “N sin marcar” no cambia. El Architect confirmó que es implementable tal cual (P-D13).

### CU-13 — Mover y cancelar desde el panel

```mermaid
flowchart TD
  wa([Pedido del cliente por WhatsApp o teléfono, D-33]) -.-> card
  card[Tarjeta vigente] -->|Mover| form[admin-mover<br/>peluquero · fecha · hora step 15 · duración<br/>sin límite de 30 días]
  form -.->|Volver sin mover| ag[agenda]
  form -->|Guardar cambio| send[admin-mover-guardando]
  send --> chk{Validación}
  chk -->|Superpone con otro turno| sup[admin-mover-superpuesto<br/>error en campo + resumen<br/>no se puede forzar]
  sup --> form
  chk -->|Fuera del horario semanal| w1[admin-mover-advertencia<br/>motivo + 'Mover igual' / 'Elegir otro horario']
  chk -->|Dentro de un bloqueo| w2[admin-mover-bloqueo]
  w1 & w2 -->|Elegir otro horario| form
  w1 & w2 -->|Mover igual| rev{Revalida}
  rev -->|Se ocupó mientras tanto| sup
  rev -->|OK| ok
  chk -->|Error de red| err[admin-mover-error<br/>turno sin cambios]
  err --> form
  chk -->|OK| ok[admin-agenda-movido<br/>'Avisale al cliente: tel:'<br/>el cliente solo se entera si el local lo contacta]
  card -->|Cancelar| ask[admin-cancelar<br/>segundo paso]
  ask -->|No, volver| ag
  ask -->|Sí, cancelar turno| r{Respuesta}
  r -->|Error| cerr[admin-cancelar-error]
  r -->|OK con teléfono| c1[admin-agenda-cancelado<br/>'Avisale al cliente: tel:']
  r -->|OK sin contacto| c2[admin-agenda-cancelado-sin-contacto<br/>'El cliente no dejó contacto']
```

El servidor valida todo de una vez (P-D12, Architect): la superposición gana y no trae advertencias; fuera de horario y bloqueo llegan juntos en una sola advertencia; “Mover igual” revalida antes de guardar.

El panel no crea turnos (D-23, D-35); nada se envía al cliente (D-1). Si el pedido llegó por WhatsApp, el local le responde por ahí.

### CU-10 (H2) — Turnos afectados por horario o desactivación

```mermaid
flowchart TD
  edit[admin-peluquero-editar] -->|Guardar horario| a{¿Turnos futuros fuera del horario nuevo?}
  a -->|No| g[admin-peluqueros-guardado]
  a -->|Sí| af[admin-peluqueros-afectados<br/>no se borraron: lista + Mover / Cancelar]
  edit -->|Desactivar y guardar| d{¿Tiene turnos futuros?}
  d -->|No| g
  d -->|Sí| de[admin-peluqueros-desactivado<br/>lista + Mover / Cancelar]
  af & de --> cu13([CU-13])
```
