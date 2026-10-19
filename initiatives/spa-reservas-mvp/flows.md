# Flujos · spa-reservas-mvp (Roadmap B)

Casos de uso provisorios (CU-xx) definidos en [README.md](README.md). Los nombres entre corchetes son
pantallas del prototipo (`prototypes/spa-reservas-mvp/<pantalla>.html`).

## CU-01 · Clienta ingresa con WhatsApp

```mermaid
flowchart TD
  A([Link del spa por WhatsApp o PWA instalada]) --> B[c-ingresar: número de WhatsApp]
  B -->|número inválido| B1[Error en el campo + resumen] --> B
  B -->|Enviarme el código| C[c-codigo: código de 6 números]
  C -->|código incorrecto| C1[c-codigo-error: quedan N intentos] --> C
  C -->|no llegó| C2[Reenviar: deshabilitado hasta 45 s] --> C
  C1 -->|sin intentos| C3[c-codigo-bloqueado: espera 15 min, pedir código nuevo] --> B
  C -->|correcto| D[c-inicio]
  B -.->|Cambiar número| B
```

## CU-02 · Clienta reserva

```mermaid
flowchart TD
  A[c-inicio] --> S[c-reservar-servicios: uno o varios, total en vivo]
  S -->|ninguno elegido| S1[Error: elegí al menos uno] --> S
  S --> Q{¿Tiene pack y el spa activó «elegir profesional»?}
  Q -->|sí| P[c-reservar-profesional: una o la primera disponible]
  Q -->|no: primera profesional disponible| H
  P --> H[c-reservar-horario: día + horarios donde entra el bloque entero]
  H -->|sin horarios| H1[c-reservar-sin-horarios: próximo libre / servicios más cortos] --> H
  H --> C[c-reservar-confirmar: resumen + política + opt-in opcional]
  C -->|otra lo tomó mientras confirmaba: no se reserva antes| C1[c-reservar-error: elegir otro horario] --> H
  C -->|Confirmar turno| OK[c-reservado: resumen y avisos]
  OK --> M[c-mis-turnos]
  C -.->|Cambiar algo| S
```

## CU-03 · Clienta cancela (sin reprogramar)

```mermaid
flowchart TD
  A[c-mis-turnos] -->|sin turnos| V[c-mis-turnos-vacio: Reservar mi primer turno]
  A -->|Cancelar turno| Q{¿Dentro del plazo de la política?}
  Q -->|sí| C[c-cancelar: política a la vista]
  Q -->|no| F[c-cancelar-fuera-plazo: escribirle al spa]
  C -->|No, mantener| A
  C -->|Sí, cancelar| OK[c-cancelado: confirmación]
  OK -->|Elegir otro día y horario| H[c-reservar-horario con los mismos servicios]
  OK --> A
```

## CU-04 y CU-05 · Te toca volver y recordatorios

```mermaid
flowchart TD
  T([N días después del servicio, configurado por servicio]) --> W[WhatsApp: aviso «te toca volver»]
  T --> I[c-inicio: aviso en la app]
  W --> R[c-te-toca-volver: repetir lo último + 3 horarios]
  I --> R
  R -->|elige horario| C[c-reservar-confirmar] --> OK[c-reservado]
  R -->|Ver más días| H[c-reservar-horario]
  R -->|Otros servicios| S[c-reservar-servicios]
  X([Turno reservado]) --> R1[WhatsApp 24 h antes: todavía puede cancelar, plazo 12 h] --> R2[WhatsApp 2 h antes]
  O([Primera oferta, solo con permiso]) --> OB[c-whatsapp-baja-ofertas: baja en un toque]
  R1 -->|link| M[c-mis-turnos]
```

## CU-06 · Pack prepago (Fase 2)

```mermaid
flowchart TD
  A[c-inicio: Ver packs] --> P[c-pack: 3 o 12 meses, condiciones]
  I2[c-inicio-con-pack: tarjeta Mi pack] -->|Ver mi pack| OK
  I2 -->|Darme de baja del pack| B
  N([Navegación: Mi pack, siempre con pack activo]) --> OK
  P -->|Pagar con Mercado Pago| MP([Mercado Pago del spa])
  MP -->|aprobado| OK[c-pack-activo: Mi pack + Darme de baja]
  MP -->|pendiente| PE[c-pack-pago-pendiente: sin sesión, aviso por WhatsApp]
  PE -.->|se acredita| WA([WhatsApp: pack activo]) --> OK
  MP -->|rechazado| E[c-pack-pago-error: no se cobró, sin sesión] --> P
  MP -.->|aprobado| WA
  OK -->|Reservar el turno del mes| S[c-reservar-servicios]
  OK -->|Darme de baja| B[c-pack-baja: confirmar]
  B -->|No, seguir| OK
  B -->|Sí| BO[c-pack-baja-ok: comprobante con trámite y devolución]
  B -.- R{¿Dentro de 10 días y sin uso?}
  R -->|sí| R1[Devolución total]
  R -->|no| R2[Te devolvemos $X por N servicios sin usar]
```

## CU-07 y CU-08 · Profesional: agenda y bloqueo

```mermaid
flowchart TD
  A[p-agenda: hoy] <--> W[p-agenda-semana]
  A -->|terminó el turno| AS[Marcar Asistió / No vino; sin marcar = Sin marcar]
  A <-->|día anterior / siguiente| Y[p-agenda-dia-anterior]
  W -->|un día| A
  A -->|día sin turnos| V[p-agenda-vacia]
  A -->|Bloquear un horario| B[p-bloquear: día, desde, hasta, motivo]
  B -->|falta el día| B1[Error en el campo] --> B
  B -->|hay turnos en el rango| C[p-bloquear-conflicto: el turno se mantiene]
  B -->|rango libre| OK[p-bloqueado]
  C -->|Bloquear igual| OK
  C -->|achicar rango| B
  OK -->|Deshacer| A
```

## CU-09 · Recepción carga un turno

```mermaid
flowchart TD
  A[r-agenda: día por profesional] --> F[r-cargar-turno]
  F --> Q{¿Ya es clienta?}
  Q -->|sí| T[Buscar por WhatsApp → muestra nombre y permiso]
  Q -->|no| N[Nombre + WhatsApp]
  T --> OP[Opcional: «me dijo en persona que acepta ofertas» → queda quién, cuándo y en persona]
  N --> OP
  T --> S[Servicios, profesional, día, horario]
  N --> S
  S -->|sin horarios| S1[Próximo libre / cualquier profesional] --> S
  A -->|marcar o corregir asistencia| AA[Asistió / No vino]
  S -->|faltan datos| E[r-cargar-error: resumen de errores] --> F
  S -->|Cargar turno| OK[r-turno-cargado: confirmación enviada a la clienta]
  OK --> F
```

## CU-10 a CU-14 · Administradora

```mermaid
flowchart TD
  P[a-panel: turnos, % asistencia sin contar Sin marcar, recompra] -->|sin datos| V[a-panel-vacio: checklist de puesta en marcha]
  P --> SM[Turnos sin marcar: marcar o corregir]
  P --> SV[a-servicios: lista + agregar con duración, precio, te toca volver]
  P --> PR[a-profesionales: equipo + horario semanal] --> PRO[a-profesionales-ok]
  P --> AJ[a-ajustes: política con plazo 12 h, recordatorios 24 h y 2 h]
  P --> PK[a-pack: servicios, precio por servicio, beneficio elegir profesional]
  P --> MA[a-marca: nombre, logo, un color]
  MA -->|text < 4,5:1 contra surface.default, canvas o brand.subtle| MA1[Ajuste automático a un tono más oscuro + aviso; se puede guardar]
  P --> CA[a-campana: segmento con permiso + plantilla + fecha]
  CA -->|oferta vacía| CA1[Error en el campo] --> CA
  CA -->|Programar| CAO[a-campana-enviada: cancelar hasta la hora]
  CAO -->|Cancelar envío| CC{Confirmación en el lugar}
  CC -->|No, mantener| CAO
  CC -->|Sí, cancelar| CAX[a-campana-cancelada: borrador] -->|Volver a programar| CA
  P --> IM[a-importar: formato + subir CSV] --> IR[a-importar-resultado: válidas, con permiso, errores]
  IR -->|Importar válidas| IO[a-importar-ok: no se envían mensajes]
  IR -->|corregir| IM
  IO --> CA
```
