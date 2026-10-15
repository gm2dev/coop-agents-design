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
  G -->|Copiar link / Agregar al calendario| G
  G -.->|Abre el link más tarde| H[turno<br/>solo lectura]
  E -.->|Cambiar| A & C & D
  B -.->|Volver| A
  C -.->|Volver| B
  D -.->|Volver| C
```

## CU-01 — Ver servicios

```mermaid
flowchart TD
  start([Cliente entra a la web]) --> load[servicios-cargando]
  load --> ok{¿Respuesta?}
  ok -->|Error de red| err[servicios-error<br/>alerta + Reintentar + teléfono del local]
  err -->|Reintentar| load
  ok -->|OK| any{¿Hay servicios activos<br/>con al menos 1 peluquero activo?}
  any -->|No| empty[servicios-vacio<br/>'Por ahora no hay reservas online'<br/>+ teléfono del local]
  empty --> exit1([Salida: llama al local])
  any -->|Sí| list[servicios<br/>nombre · duración · precio<br/>'orientativos, se paga en el local']
  list -->|Elige y Continuar| next([Paso 2: peluquero])
```

Inactivos y sin peluqueros no se listan (RN-15): no hay estado de UI para ellos del lado del cliente.

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

## CU-05 — Confirmación, calendario y link privado

```mermaid
flowchart TD
  conf[confirmacion<br/>1. título + línea de éxito<br/>2. bloque 'Guardá tu link privado'<br/>3. resumen  4. datos del local] --> act{Acción}
  act -->|Copiar link| cp{¿Portapapeles disponible?}
  cp -->|Sí| cpok[Anuncio: 'Link copiado…']
  cp -->|No| cpno[Selecciona el link + anuncio:<br/>'copialo a mano']
  act -->|Agregar al calendario| ics[Descarga turno.ics<br/>fecha, hora, duración, servicio,<br/>dirección vigente y link en la descripción]
  act -->|Reservar otro turno| s1([servicios])
  open([Cliente abre su link más tarde]) --> tl[turno-cargando<br/>a los 3 s: 'Puede tardar unos segundos'] --> found{¿Token válido?}
  found -->|No| nf[turno-no-encontrado<br/>sin datos de ningún turno + teléfono del local]
  found -->|Sí| tv[turno<br/>resumen en solo lectura, estado vigente<br/>+ Agregar al calendario + teléfono del local]
  tv -.-> h2[[H2: Cambiar / Cancelar<br/>CU-06, CU-07]]
```

No hay ninguna rama de envío (email, SMS, WhatsApp): RN-12.

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

```mermaid
flowchart TD
  f[admin-local<br/>nombre, dirección, teléfono: obligatorios] -->|Guardar| v{¿Los 3 completos?}
  v -->|No| fe[admin-local-error<br/>error junto a cada campo vacío + resumen]
  fe --> v
  v -->|Sí| ok[admin-local-guardado<br/>'Ya se muestran en la web y en las confirmaciones']
  ok -.-> use([Se usan en: footer del cliente, confirmación,<br/>link privado, mensajes 'llamá al local', .ics])
```

<a id="hito-2"></a>
## Hito 2

### CU-05 (H2) — Estados del link privado

```mermaid
flowchart TD
  open([Cliente abre su link]) --> load[turno-cargando]
  load --> found{¿Existe el turno?}
  found -->|No| nf[turno-no-encontrado<br/>sin datos + teléfono]
  found -->|Sí| st{Estado}
  st -->|Cancelado por el local| cl[turno-cancelado-local<br/>✕ + teléfono, sin acciones]
  st -->|Cancelado por el cliente| cv[turno-cancelado<br/>✕ Cancelado por vos, sin acciones]
  st -->|Ya empezó / pasó| pa[turno-pasado<br/>◷ sin acciones]
  st -->|Vigente| mv{¿Lo movió el local?}
  mv -->|Sí| mov[turno-movido<br/>↻ 'El local cambió tu turno: ahora es…'<br/>+ borrar evento anterior]
  mv -->|No| conf[turno ✓ Confirmado]
  mov --> two{¿Faltan 2 h o más?<br/>RN-08, exactamente 2 h = sí}
  conf --> two
  two -->|Sí| acc[Bloque 'Cambiar día u horario' / 'Cancelar turno']
  two -->|No| m2[turno-menos-2h<br/>'Faltan menos de 2 horas…' + tel:]
  cl & cv & pa -.-> new([Reservar un turno nuevo])
  acc -->|Cambiar| cu6([CU-06])
  acc -->|Cancelar| cu7([CU-07])
```

### CU-06 — Cambiar el turno desde el link

```mermaid
flowchart TD
  t[turno] -->|Cambiar día u horario| load[cambiar-cargando]
  load -->|Error| err[cambiar-error<br/>Reintentar + teléfono]
  err -->|Reintentar| load
  load --> pick[cambiar · Paso 1 de 2<br/>mismo servicio y peluquero o 'cualquiera'<br/>30 días, inicios cada 15 min]
  pick -.->|'¿Otro servicio?' Cancelá y reservá| cu7([CU-07])
  pick -->|Continuar| rev[cambiar-revisar · Paso 2<br/>Antes → Después]
  rev -.->|No cambiar| t
  rev -->|Confirmar cambio| send[cambiar-enviando]
  send --> res{Respuesta}
  res -->|Horario ocupado| occ[cambiar-ocupado<br/>role=alert + foco<br/>turno original intacto]
  occ --> pick
  res -->|Faltan menos de 2 h| late[turno-plazo-vencido<br/>alert + tel:, turno intacto]
  res -->|Error de red| neterr[cambiar-error-envio<br/>turno intacto, Reintentar]
  neterr --> send
  res -->|OK| ok[cambiar-confirmado<br/>mismo link · Agregar al calendario .ics nuevo<br/>· borrar el evento anterior]
  ok --> t
```

### CU-07 — Cancelar el turno desde el link

```mermaid
flowchart TD
  t[turno] -->|Cancelar turno| ask[cancelar<br/>'¿Cancelar tu turno?' + resumen]
  ask -->|No, mantener turno| t
  ask -->|Sí, cancelar turno| send[cancelar-enviando]
  send --> res{Respuesta}
  res -->|Error de red| err[cancelar-error<br/>turno sigue vigente, Reintentar]
  err --> send
  res -->|Faltan menos de 2 h| late[turno-plazo-vencido]
  res -->|OK| done[cancelar-listo<br/>cancelado + borrar del calendario]
  done -.-> new([Reservar un turno nuevo])
  done -.->|Abre el link después| cv[turno-cancelado]
```

### CU-11 — Bloqueos

```mermaid
flowchart TD
  nav([Panel → Bloqueos]) --> any{¿Hay bloqueos?}
  any -->|No| empty[admin-bloqueos-vacio]
  any -->|Sí| list[admin-bloqueos<br/>alcance · días · horario]
  empty & list -->|Nuevo bloqueo| form[admin-bloqueo-nuevo<br/>¿A quién? · ¿Qué días? · ¿Qué horario? step 15]
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
  saved -.->|En la web| web[horario-bloqueado<br/>día 'Cerrado']
```

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
  card -->|Cancelado| canc[✕ Cancelado por el cliente / local<br/>tachado + 'Horario libre', sin acciones]
  fut & past -->|Mover| cu13m([CU-13 Mover])
  fut & past -->|Cancelar| cu13c([CU-13 Cancelar])
  ag -.->|Día siguiente| vie[admin-agenda-viernes<br/>cambios y cancelaciones del cliente]
  ag -.->|Semana| sem[admin-agenda-semana-h2]
```

CU-14, error al guardar: la marca no se da por guardada hasta que responde el servidor. Si falla, el estado
vuelve al anterior (botones, `aria-pressed`, badge), se avisa con `role=alert` dentro de la misma tarjeta y el
foco no se mueve del botón tocado; el resumen “N sin marcar” no cambia. El contrato de la API lo define el Architect.

### CU-13 — Mover y cancelar desde el panel

```mermaid
flowchart TD
  card[Tarjeta vigente] -->|Mover| form[admin-mover<br/>peluquero · fecha · hora step 15 · duración<br/>sin límite de 30 días ni de 2 h]
  form -.->|Volver sin mover| ag[agenda]
  form -->|Guardar cambio| send[admin-mover-guardando]
  send --> chk{Validación}
  chk -->|Superpone con otro turno| sup[admin-mover-superpuesto<br/>error en campo + resumen<br/>no se puede forzar]
  sup --> form
  chk -->|Fuera del horario semanal| w1[admin-mover-advertencia<br/>motivo + 'Mover igual' / 'Elegir otro horario']
  chk -->|Dentro de un bloqueo| w2[admin-mover-bloqueo]
  w1 & w2 -->|Elegir otro horario| form
  w1 & w2 -->|Mover igual| ok
  chk -->|Error de red| err[admin-mover-error<br/>turno sin cambios]
  err --> form
  chk -->|OK| ok[admin-agenda-movido<br/>'Avisale al cliente: tel:'<br/>link del cliente muestra 'El local cambió tu turno']
  card -->|Cancelar| ask[admin-cancelar<br/>segundo paso]
  ask -->|No, volver| ag
  ask -->|Sí, cancelar turno| r{Respuesta}
  r -->|Error| cerr[admin-cancelar-error]
  r -->|OK con teléfono| c1[admin-agenda-cancelado<br/>'Avisale al cliente: tel:']
  r -->|OK sin contacto| c2[admin-agenda-cancelado-sin-contacto<br/>'El cliente no dejó contacto']
```

El panel no crea turnos (D-23) ni acceso al link privado (D-29); nada se envía al cliente (D-1).

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
