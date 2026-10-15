# Flujos — Turnos para peluquería (borrador v0)

Casos de uso **tentativos** (ver [README](README.md)). IDs de pantalla: `P*` cliente, `S*` staff;
se usan igual en [spec.md](spec.md) y en el prototipo. Los criterios de aceptación oficiales todavía
no existen: donde dice `AC?` hay que mapear cuando el PO los publique.

## CU1 — Cliente reserva un turno

Entrada: link público de la peluquería · Actor: cliente sin cuenta · Fin: turno confirmado con código y link de gestión.

```mermaid
flowchart TD
  A[Inicio: Reservá tu turno] --> P1[P1 Elige servicio]
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
  P3 --> P4[P4 Completa nombre, celular, email opcional]
  P4 -->|Datos inválidos| P4e[P4 Errores en campo + resumen]
  P4e --> P4
  P4 -->|Datos válidos| P5[P5 Revisa resumen]
  P5 -->|Cambiar algo| P1 & P2 & P3 & P4
  P5 -->|Confirmar| P5c[P5 Confirmando…]
  P5c -->|OK| P6[P6 Confirmado: resumen + código + link · AC?]
  P5c -->|Horario tomado| P5t[P5 Error: horario tomado, alternativas cercanas]
  P5t -->|Elige alternativa| P5
  P5t -->|Ver todos| P3L
  P5c -->|Error de red| P5x[P5 Error: no está reservado, Reintentar]
  P5x -->|Reintentar, idempotente| P5c
  P6 -->|Gestionar mi turno| P8[P8 Mi turno · CU2]
```

| Nodo | Notas |
|---|---|
| P1e | Error sobre el grupo de radios + alerta con link al grupo. |
| P2 | Opcional: «Cualquiera disponible» preseleccionado, se puede continuar directo. |
| P3v | Nunca un callejón sin salida: próximo día con horarios, otro día o cambiar profesional. |
| P5t | Conserva datos; ofrece horarios más cercanos del mismo día. |
| P5x | Aclara que el turno **no** quedó reservado; reintentar no duplica (supuesto técnico, Q10). |

## CU2 — Cliente consulta, cancela o reprograma

Entrada: link del mensaje de confirmación (directo a P8) o «Ya tengo un turno» (P7) · Fin: turno consultado, cancelado o reprogramado.

```mermaid
flowchart TD
  L[Link de gestión] --> P8
  I[Inicio: Ya tengo un turno] --> P7[P7 Ingresa código + celular]
  P7 -->|No coincide| P7e[P7 Error: no encontramos el turno]
  P7e --> P7
  P7 -->|Encontrado| P8[P8 Mi turno: estado y resumen]
  P8 -->|Menos de 12 h| P8p[P8 Fuera de plazo: llamar a la peluquería]
  P8 -->|Cancelar| P9[P9 ¿Cancelar? motivo opcional]
  P9 -->|No, mantener| P8
  P9 -->|Sí, cancelar| P10[P10 Turno cancelado · Reservar otro]
  P9 -->|Prefiere otro día| P11
  P8 -->|Reprogramar| P11[P11 Elige nuevo día y horario · patrón P3]
  P11 -->|Sin horarios / error de red| P11x[Estados de P3: vacío, error]
  P11x --> P11
  P11 -->|Confirmar nuevo horario| C{¿Sigue libre?}
  C -->|Sí| P12[P12 Reprogramado: horario anterior liberado]
  C -->|No| P11t[Error horario tomado · patrón P5t]
  P11t --> P11
  P10 -->|Reservar otro turno| P1[P1 · CU1]
```

## CU3 — Staff ve la agenda

Entrada: acceso del staff (S10, fuera de alcance) · Fin: el staff conoce los turnos del día/semana.

```mermaid
flowchart TD
  E[Ingreso staff] --> S1L[S1 Cargando agenda del día]
  S1L -->|Hay turnos| S1[S1 Agenda del día por profesional]
  S1L -->|Sin turnos| S1v[S1 Vacío: sin turnos · Bloquear horario]
  S1L -->|Error| S1x[S1 Error: Reintentar]
  S1x --> S1L
  S1 -->|Cambiar día / filtrar profesional| S1L
  S1 -->|Semana| S2[S2 Semana: turnos por profesional y día]
  S2 -->|Elige celda| S1L
  S1 -->|Elige turno| S3[S3 Detalle del turno]
  S1 -->|Elige bloqueo| S4[S4 Bloquear horario · CU4]
  S3 -->|Cancelar turno| S6[S6 · CU4]
  S3 -->|Volver| S1
```

## CU4 — Staff bloquea horarios y cancela turnos

```mermaid
flowchart TD
  S1[S1 Agenda] -->|Bloquear horario| S4[S4 Elige profesional, día, desde/hasta o todo el día, motivo]
  S4 -->|Datos inválidos| S4e[S4 Error: hasta debe ser después de desde]
  S4e --> S4
  S4 -->|Válido, sin turnos en el rango| S5[S5 Horario bloqueado]
  S4 -->|Hay turnos en el rango| S4c[S4 Advertencia: N turnos afectados]
  S4c -->|Bloquear y cancelar turnos, avisa a clientes| S5
  S4c -->|Bloquear sin cancelar| S5
  S4c -->|Editar| S4
  S4 -->|Cancelar| S1
  S5 --> S1
  S3[S3 Detalle del turno] -->|Cancelar turno| S6[S6 ¿Cancelar? motivo + avisar al cliente]
  S6 -->|No, volver| S3
  S6 -->|Sí| S1ok[S1 con confirmación: turno cancelado, horario libre]
```

## Cobertura de estados

| Estado | Dónde |
|---|---|
| Carga | P3 (cargando horarios), P5 (confirmando), S1 (cargando agenda) |
| Vacío | P3 (sin horarios ese día), S1 (sin turnos) |
| Error: horario tomado | P5 (y P11 reutiliza el patrón) |
| Error de red | P3, P5, S1 |
| Validación de formulario | P1, P4, P7, S4 |
| Éxito | P6, P10, P12, S5, S1 tras cancelar |
| Fuera de plazo | P8 |
