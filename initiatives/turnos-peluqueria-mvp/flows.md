# Flujos — Turnos para peluquería, MVP Hito 1

Un diagrama por caso de uso del Hito 1, con camino principal, errores, vacíos y salidas. Los nodos entre
corchetes llevan el nombre del archivo del prototipo (`prototypes/turnos-peluqueria-mvp/<archivo>.html`).
Criterios y reglas: [casos-de-uso.md](https://github.com/gm2dev/coop-agents-product/blob/po/turnos-peluqueria-mvp/initiatives/turnos-peluqueria-mvp/casos-de-uso.md).

Convención: rectángulo = pantalla o estado; rombo = decisión del sistema o del usuario; `-.->` = salida
alternativa. Los nodos `H2` marcan dónde se engancha algo que se diseña después.

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
  open([Cliente abre su link más tarde]) --> tl[turno-cargando] --> found{¿Token válido?}
  found -->|No| nf[turno-no-encontrado<br/>sin datos de ningún turno + teléfono del local]
  found -->|Sí| tv[turno<br/>resumen en solo lectura, estado vigente<br/>+ Agregar al calendario + teléfono del local]
  tv -.-> h2[[H2: Cambiar / Cancelar<br/>CU-06, CU-07]]
```

No hay ninguna rama de envío (email, SMS, WhatsApp): RN-12.

## CU-08 — Ingresar al panel

```mermaid
flowchart TD
  any([Abre cualquier URL del panel]) --> auth{¿Sesión válida?}
  auth -->|Sí| agenda([admin-agenda-dia])
  auth -->|No| ses[admin-sesion<br/>'Para ver el panel, primero iniciá sesión'<br/>sin datos de agenda ni clientes]
  login[admin-ingresar] & ses -->|Ingresar| val{¿Campos completos?}
  val -->|No| fe[Error junto al campo + resumen con foco]
  fe --> val
  val -->|Sí| send[admin-ingresar-cargando] --> chk{Resultado}
  chk -->|Credenciales válidas| agenda
  chk -->|Inválidas| err[admin-ingresar-error<br/>'Usuario o contraseña incorrectos'<br/>conserva el usuario, vacía la contraseña]
  err --> val
  chk -->|Superó el límite de intentos| blk[admin-ingresar-bloqueado<br/>'Demasiados intentos', mensaje genérico]
  blk -.->|Más tarde| login
  login -.->|Olvidó la contraseña| manual([Texto: 'pedile a quien administra<br/>el panel que te la resetee'<br/>reseteo manual, sin email])
```

## CU-09 — Gestionar servicios

```mermaid
flowchart TD
  l{¿Hay servicios?} -->|No| e[admin-servicios-vacio<br/>explica el efecto en la web + 'Agregar el primer servicio']
  l -->|Sí| list[admin-servicios<br/>nombre, duración, precio, activo,<br/>peluqueros, badge 'Sin peluqueros asignados']
  e & list -->|Agregar / Editar| f[admin-servicio-editar<br/>nombre, duración min, precio ref. opcional,<br/>peluqueros, activo]
  f -->|Guardar| v{¿Nombre y duración ≥ 5?}
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
  d -->|Sí| day[admin-agenda-dia<br/>columna por peluquero, tarjetas con hora, duración,<br/>servicio, cliente, contacto, origen, estado]
  day -->|Filtrar por peluquero| f[admin-agenda-dia-filtrada]
  f -->|Ver todos| day
  day <-->|Día / Semana| wk[admin-agenda-semana<br/>7 días, navegación de semanas]
  day -->|Día anterior / siguiente| load
  wk -->|Semana anterior / siguiente| load
  day -.-> h2[[H2: Cargar turno, mover, cancelar, asistencia]]
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
