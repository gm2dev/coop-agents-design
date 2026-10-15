# Flujos — Turnos para peluquería (v0.2)

Casos de uso **tentativos** (ver [README](README.md)). IDs de pantalla: `P*` cliente, `S*` staff;
se usan igual en [spec.md](spec.md) y en el prototipo. Los nodos con clase `demo` (borde grueso) son
los del [recorrido de demo del MVP](README.md#alcance-de-la-demo-mvp); ver la tabla de abajo. Donde dice `AC?` hay que mapear cuando el PO
publique los criterios de aceptación.

## CU1 — Cliente reserva un turno

Entrada: link público de la peluquería · Actor: cliente sin cuenta · Fin: turno confirmado y email con el link de gestión.

```mermaid
flowchart TD
  A[Inicio: Reservá tu turno] --> P1[P1 Elige servicio · combos = un servicio más]
  P1 -->|Continuar sin elegir| P1e[P1 Error: elegí un servicio]
  P1e --> P1
  P1 -->|Elige| P2[P2 Elige profesional · por defecto Cualquiera]
  P2 --> P3L[P3 Cargando horarios]
  P3L -->|Hay horarios| P3[P3 Elige día y horario]
  P3L -->|Sin horarios ese día| P3v[P3 Vacío: sugiere próximo día con horarios]
  P3L -->|Error de red| P3x[P3 Error: Reintentar]
  P3x -->|Reintentar| P3L
  P3v -->|Ver próximo día / otro día| P3L
  P3v -->|Cambiar profesional| P2
  P3 --> P4[P4 Completa nombre, email y celular · todos obligatorios]
  P4 -->|Datos inválidos| P4e[P4 Errores en campo + resumen]
  P4e --> P4
  P4 -->|Datos válidos| P5[P5 Revisa resumen · Cualquier profesional disponible]
  P5 -->|Cambiar algo| P1 & P2 & P3 & P4
  P5 -->|Confirmar| P5c[P5 Confirmando… · sin links de volver ni cambiar]
  P5c -->|OK| P6[P6 Confirmado: profesional asignado, referencia, email con link y recordatorio · AC?]
  P5c -->|Horario tomado, se valida al confirmar| P5t[P5 Error: horario marcado No disponible + alternativas]
  P5t -->|Elige alternativa| P5a[P5 con el horario alternativo · Confirmar turno]
  P5a -->|Confirmar| P5c
  P5t -->|Ver todos| P3L
  P5c -->|Error de red| P5x[P5 Error: no está reservado, Reintentar]
  P5x -->|Reintentar, idempotente| P5c
  P6 -->|Abre el link del email| P8[P8 Mi turno · CU2]
  classDef demo stroke-width:4px
  class A,P1,P2,P3,P3v,P4,P4e,P5,P5t,P5a,P6,P8 demo
```

| Nodo | Notas |
|---|---|
| P1e | Error sobre el grupo de radios + alerta con link al grupo. |
| P2 | Opcional: «Cualquiera disponible» preseleccionado, se puede continuar directo. |
| P3v | Nunca un callejón sin salida: próximo día con horarios, otro día o cambiar profesional. |
| P4 | Email y celular obligatorios (CPO). Bajo celular: «La peluquería lo usa solo para llamarte si tiene que cancelar o mover tu turno.» |
| P5 | Con «cualquiera» no se muestra un asignado (se asigna al confirmar, S8); P6 muestra quién quedó. |
| P5t | No se retiene el horario (Architect, Q10): se valida al confirmar. Conserva datos; el horario elegido se marca «No disponible» y se ofrecen los más cercanos. Sin aviso de tiempo restante. |
| P5a | `revisar-alternativa.html` (16:15) / `revisar-alternativa-1700.html`: mismo resumen con el horario nuevo y un aviso; no confirma sola. |
| P5x | Aclara que el turno **no** quedó reservado; reintentar no duplica. |

## CU2 — Cliente consulta, cancela o reprograma

Entrada: **solo** el link del email de confirmación (token largo que vence cuando pasa el turno) · Fin:
turno consultado, cancelado o reprogramado. No hay entrada por código + celular.

```mermaid
flowchart TD
  L[Link del email] -->|Token válido| P8[P8 Mi turno: estado y resumen]
  L -->|Token inválido, vencido o turno cancelado| P7[P7 Link inválido o vencido: llamar a la peluquería / reservar otro]
  P8 -->|Faltan menos de 2 h| P8p[P8 Fuera de plazo: llamar a la peluquería]
  P8 -->|Cancelar| P9[P9 ¿Cancelar? motivo opcional]
  P9 -->|No, mantener| P8
  P9 -->|Sí, cancelar| P9c{¿Se guardó?}
  P9c -->|Sí| P10[P10 Turno cancelado · Reservar otro]
  P9c -->|Error de red| P9x[P9 Error: tu turno sigue reservado · Reintentar]
  P9x --> P9c
  P9 -->|Prefiere otro día| P11L
  P8 -->|Reprogramar| P11L[P11 Cargando horarios · mismo profesional]
  P11L -->|Hay horarios| P11[P11 Elige nuevo día y horario · turno actual como referencia, sin preselección]
  P11L -->|Sin horarios ese día| P11v[P11 Vacío: próximo día con horarios]
  P11L -->|Error de red| P11e[P11 Error al cargar: Reintentar]
  P11v --> P11L
  P11e --> P11L
  P11 -->|Otro día| P11L
  P11 -->|Confirmar nuevo horario| C{¿Sigue libre y se guardó?}
  C -->|Sí| P12[P12 Reprogramado: horario anterior liberado]
  C -->|Tomado| P11t[P11 Horario tomado: tu turno sigue igual + alternativas]
  C -->|Error de red| P11x[P11 Error al confirmar: tu turno sigue igual · Reintentar]
  P11t -->|Elige alternativa| P11a[P11 con la alternativa preseleccionada · Confirmar nuevo horario]
  P11a -->|Confirmar nuevo horario| C
  P11t -->|Elige otro| P11
  P11x --> C
  P11 -->|No cambiar mi turno| P8
  P10 -->|Reservar otro turno| P1[P1 · CU1]
  P7 -->|Reservar un turno nuevo| P1
  classDef demo stroke-width:4px
  class L,P8,P7,P9,P10 demo
```

| Nodo | Notas |
|---|---|
| P7 | Antes era el formulario código + celular; ahora es la salida del link inválido (CPO + Architect, S2/Q11). Pregunta abierta Q14: «Reenviarme el link por email». |
| P11a | `reprogramar-alternativa.html` (17:00) / `reprogramar-alternativa-1830.html`: la alternativa del Alert preselecciona el horario; reprograma recién con «Confirmar nuevo horario». |
| P11 | Pantallas propias de CU2 (`reprogramar*.html`), con «← Tu turno» y «No cambiar mi turno»: nunca saca al usuario a CU1. Solo cambia día/horario (Q7, decisión CDO v0). |
| Todas | Pie «¿Necesitás ayuda?» con el teléfono de la peluquería (3.2.6). |

## CU3 — Staff ve la agenda

Entrada: S0 ingreso con link mágico (CU5) · Fin: el staff conoce los turnos del día/semana.

```mermaid
flowchart TD
  E[S0 Ingreso staff · CU5] --> S1L[S1 Cargando agenda del día]
  S1L -->|Hay turnos| S1[S1 Agenda del día por profesional]
  S1L -->|Sin turnos| S1v[S1 Vacío: sin turnos · Bloquear horario]
  S1L -->|Error| S1x[S1 Error: Reintentar]
  S1x --> S1L
  S1 -->|Cambiar día / filtrar profesional| S1L
  S1 -->|Semana| S2[S2 Semana: turnos por profesional y día]
  S2 -->|Elige celda| S1L
  S1 -->|Elige turno| S3[S3 Detalle del turno]
  S1 -->|Elige bloqueo| S7[S7 Detalle del bloqueo · CU4]
  S1 -->|Cargar turno| S8[S8 Cargar turno · CU6]
  S3 -->|Cancelar turno| S6[S6 · CU4]
  S3 -->|Volver| S1
```

## CU4 — Staff bloquea horarios y cancela turnos

```mermaid
flowchart TD
  S1[S1 Agenda] -->|Bloquear horario| S4[S4 Profesional o Toda la peluquería, día, desde/hasta o todo el día, motivo]
  S4 -->|Datos inválidos| S4e[S4 Error: hasta debe ser después de desde]
  S4e --> S4
  S4 -->|Válido, sin turnos en el rango| G{¿Se guardó?}
  G -->|Sí| S5[S5 Horario bloqueado]
  G -->|Error de red| S4x[S4 Error al guardar: no se bloqueó nada · Reintentar]
  S4x --> G
  S4 -->|Hay turnos en el rango| S4c[S4 Advertencia: N turnos afectados]
  S4c -->|Bloquear sin cancelar| G
  S4c -->|Bloquear y cancelar los N turnos…| S4k[S4 Confirmar: qué turnos, aviso por email, no se puede deshacer]
  S4k -->|Sí, bloquear y cancelar| G2{¿Se guardó?}
  G2 -->|Sí| S5c[S5 Bloqueado: se cancelaron N turnos y se avisó por email]
  G2 -->|Error de red| S4x
  S4k -->|No, volver| S4c
  S4 -->|Cancelar| S1
  S5 --> S1
  S5c --> S1
  S1 -->|Elige bloqueo| S7[S7 Detalle del bloqueo]
  S7 -->|Editar bloqueo| S7e[S7 Editar: mismo formulario que S4]
  S7e -->|Guardar| S7
  S7e -->|Error de red| S7ex[S7 Error al guardar cambios · el bloqueo sigue como estaba]
  S7ex --> S7e
  S7e -->|Se superpone con turnos| S4c
  S7 -->|Quitar bloqueo| S7q[S7 ¿Quitar el bloqueo? confirmación]
  S7q -->|Sí, quitar| S7ok[S7 Bloqueo quitado · horario disponible]
  S7q -->|Error de red| S7qx[S7 Error al quitar · sigue bloqueado]
  S7qx --> S7q
  S7q -->|No, volver| S7
  S3[S3 Detalle del turno] -->|Cancelar turno| S6[S6 ¿Cancelar? motivo + avisar por email]
  S6 -->|No, volver| S3
  S6 -->|Sí| G3{¿Se guardó?}
  G3 -->|Sí| S1ok[S1 con confirmación: turno cancelado, horario libre]
  G3 -->|Error de red| S6x[S6 Error: el turno sigue reservado · Reintentar]
  S6x --> G3
```

| Nodo | Notas |
|---|---|
| S4 | Feriado = «Toda la peluquería» + «Todo el día» + motivo «Feriado» (Q12). Zona horaria fija del local. |
| S4c | Ya no existe un nodo «Editar» desde la advertencia: el formulario sigue en la misma pantalla y se corrige ahí. Editar existe en S7 (bloqueo ya creado). |
| S4k | Paso destructivo explícito: lista de turnos con email de cada clienta, motivo para el aviso, botón danger. |
| S7e | Si al editar el nuevo período se superpone con turnos, vuelve a la advertencia S4c (en el prototipo se documenta, no se dibuja otra pantalla). |

## CU5 — Staff ingresa con link mágico

Decisión Architect + CPO (Q13): email + link mágico, un solo rol, todos ven todas las agendas.

```mermaid
flowchart TD
  I[S0 Ingresar al staff: email] -->|Email inválido| Ie[S0 Error: falta el @ o el dominio]
  Ie --> I
  I -->|Mandarme el link| En[S0 Revisá tu email · no revela si el email existe]
  En -->|Abre el link válido| S1[S1 Agenda del día]
  En -->|Usar otro email o pedir otro link| I
  V[Abre un link vencido o ya usado] --> Vx[S0 Este link ya no sirve]
  Vx -->|Pedir un link nuevo| I
```

## CU6 — Staff carga un turno a mano

Decisión CPO (Q8): incluido en el MVP. Reutiliza DayPicker, SlotPicker, campos y validaciones de CU1.

```mermaid
flowchart TD
  S1[S1 Agenda] -->|Cargar turno| S8[S8 Servicio, profesional, día/horario y datos de la clienta]
  S8 -->|Otro día / sin horarios| S8v[S8 Vacío: próximo día con horarios]
  S8v --> S8
  S8 -->|Datos inválidos| S8e[S8 Errores en campo + resumen]
  S8e --> S8
  S8 -->|Cargar turno| G{¿Sigue libre y se guardó?}
  G -->|Sí| S9[S9 Turno cargado: confirmación por email a la clienta]
  G -->|Tomado| S8t[S8 Horario tomado: datos conservados, elegí otro]
  G -->|Error de red| S8x[S8 Error al guardar: no se cargó · Reintentar]
  S8t --> S8
  S8x --> G
  S9 -->|Ver el turno| S3[S3 Detalle · origen: cargado por el staff]
  S9 -->|Cargar otro| S8
  S9 -->|Ver agenda| S1
  S8 -->|Cancelar| S1
```

## Nodos del recorrido de demo (MVP)

| Flujo | En la demo | Después del MVP |
|---|---|---|
| CU1 | A, P1, P2, P3, P3v, P4, P4e, P5, P5t, P5a, P6 | — (P3L/P3x, P5c, P5x quedan como estados de soporte) |
| CU2 | L, P8, P7, P9, P10 | P11*, P12 (reprogramar) |
| CU5 | S0, enviado | — |
| CU3 | S1 (día), S3 | S2 (semana), S3 de turno cargado a mano |
| CU4 | S4 (incl. feriado), S5 | conflicto con turnos y confirmar cancelación, S5 con cancelados, S6, S7 |
| CU6 | — | todo (S8, S9) |

## Cobertura de estados

| Estado | Dónde |
|---|---|
| Carga | P3, P11 (cargando horarios), P5 (confirmando), S1 (cargando agenda) |
| Vacío | P3, P11, S8 (sin horarios ese día), S1 (sin turnos) |
| Error: horario tomado | P5, P11, S8 |
| Error de red al cargar | P3, P11, S1 |
| Error de red al guardar una acción | P5 (confirmar), P9 (cancelar), P11 (reprogramar), S4 (bloquear), S6 (cancelar desde staff), S7 (editar y quitar bloqueo), S8 (cargar turno) |
| Validación de formulario | P1, P4, S0, S4, S8 |
| Confirmación de acción destructiva | P9, S4 (cancelar turnos al bloquear), S6, S7 (quitar bloqueo) |
| Éxito | P6, P10, P12, S0 (link enviado), S5 (con y sin turnos cancelados), S7 (quitado), S9, S1 tras cancelar |
| Fuera de plazo | P8 |
| Link inválido o vencido | P7 (cliente), S0 (staff) |
