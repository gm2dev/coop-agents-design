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
  C -->|no llegó| C2[Reenviar a los 45 s] --> C
  C1 -->|sin intentos| C3[Bloqueo temporal: pedir código nuevo] --> B
  C -->|correcto| D[c-inicio]
  B -.->|Cambiar número| B
```

## CU-02 · Clienta reserva

```mermaid
flowchart TD
  A[c-inicio] --> S[c-reservar-servicios: uno o varios, total en vivo]
  S -->|ninguno elegido| S1[Error: elegí al menos uno] --> S
  S --> Q{¿El spa activa elegir profesional?}
  Q -->|sí| P[c-reservar-profesional: cualquiera o una]
  Q -->|no| H
  P --> H[c-reservar-horario: día + horario]
  H -->|sin horarios| H1[c-reservar-sin-horarios: próximo libre / cualquier profesional] --> H
  H --> C[c-reservar-confirmar: resumen + política + opt-in opcional]
  C -->|horario ocupado al confirmar| C1[c-reservar-error: elegir otro horario] --> H
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
  X([Turno reservado]) --> R1[WhatsApp 24 h antes] --> R2[WhatsApp 2 h antes]
  R1 -->|link| M[c-mis-turnos]
```

## CU-06 · Pack prepago (Fase 2)

```mermaid
flowchart TD
  A[c-inicio: Ver packs] --> P[c-pack: 3 o 12 meses, condiciones]
  P -->|Pagar con Mercado Pago| MP([Mercado Pago del spa])
  MP -->|aprobado| OK[c-pack-activo: Mi pack + Darme de baja]
  MP -->|rechazado| E[c-pack-pago-error: no se cobró] --> P
  OK -->|Reservar el turno del mes| S[c-reservar-servicios]
  OK -->|Darme de baja| B[c-pack-baja: confirmar]
  B -->|No, seguir| OK
  B -->|Sí| BO[c-pack-baja-ok: comprobante con número de trámite]
```

## CU-07 y CU-08 · Profesional: agenda y bloqueo

```mermaid
flowchart TD
  A[p-agenda: hoy] <--> W[p-agenda-semana]
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
  Q -->|no| N[Nombre + WhatsApp; el permiso lo da ella por WhatsApp]
  T --> S[Servicios, profesional, día, horario]
  N --> S
  S -->|sin horarios| S1[Próximo libre / cualquier profesional] --> S
  S -->|faltan datos| E[r-cargar-error: resumen de errores] --> F
  S -->|Cargar turno| OK[r-turno-cargado: confirmación enviada a la clienta]
  OK --> F
```

## CU-10 a CU-14 · Administradora

```mermaid
flowchart TD
  P[a-panel: turnos, % asistencia, recompra] -->|sin datos| V[a-panel-vacio: checklist de puesta en marcha]
  P --> SV[a-servicios: lista + agregar con duración, precio, te toca volver]
  P --> PR[a-profesionales: equipo + horario semanal] --> PRO[a-profesionales-ok]
  P --> AJ[a-ajustes: elegir profesional, política, recordatorios]
  P --> MA[a-marca: nombre, logo, color]
  MA -->|color < 4,5:1| MA1[Aviso: solo en franja; botones con color base]
  P --> CA[a-campana: segmento con permiso + plantilla + fecha]
  CA -->|oferta vacía| CA1[Error en el campo] --> CA
  CA -->|Programar| CAO[a-campana-enviada: cancelar hasta la hora]
  P --> IM[a-importar: formato + subir CSV] --> IR[a-importar-resultado: válidas, con permiso, errores]
  IR -->|Importar válidas| IO[a-importar-ok: no se envían mensajes]
  IR -->|corregir| IM
  IO --> CA
```
