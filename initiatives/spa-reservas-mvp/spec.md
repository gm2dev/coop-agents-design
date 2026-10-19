# Spec de UI (breve) · spa-reservas-mvp

Baja-media fidelidad. Solo tokens semánticos de `design-system/tokens.json` (espejo en
`prototypes/shared/tokens.css`). Capa tenant: `prototypes/spa-reservas-mvp/tenant-spa-lua.css`.

## Reglas generales

- **Layout.** Clienta y profesional: una columna, `size.content.max` (40rem), padding `space.400`.
  Recepción y administradora: hasta 80rem; desde `breakpoint.lg` la administradora tiene navegación
  lateral (15rem) y grillas de 2/3 columnas; debajo, navegación en fila que envuelve.
- **Encabezado.** Logo del spa (36 px, decorativo: `alt=""` porque el nombre va al lado) + nombre +
  navegación principal (`nav aria-label="Principal"`, `aria-current="page"`). Franja superior de
  `space.100` en `color.action.primary` (color del spa).
- **Acción principal** por pantalla: `.btn` primario, ancho completo en mobile, mínimo
  `size.target.comfortable` (44 px). Destructivas: `color.action.danger` (relleno en la confirmación,
  contorno en la lista).
- **Selección** (servicios, profesional, día, horario, pack): tarjeta seleccionable sobre
  `input` nativo (checkbox/radio) con `label`; seleccionado = `border.selected` 2 px +
  `surface.selected` + marca (círculo/cuadro relleno o ✓); no disponible = `surface.disabled` + tachado +
  texto («completo»). Nunca solo color.
- **Mensajes.** `alert--success` (`role=status`) tras cada acción; `alert--danger` (`role=alert`) para
  errores con salida; `alert--warning` para estados sin horarios / fuera de plazo; `alert--info` para
  explicaciones (política, permiso). Íconos ✓ ✕ ⚠ decorativos + título en texto.
- **Formularios.** `label` visible siempre, hint asociado con `aria-describedby`, error por campo
  (`aria-invalid`, borde `feedback.danger.border` 2 px, texto con ✕) + resumen de errores enfocado con
  links a cada campo. Inputs a `font.size.200` (16 px, sin zoom en iOS).
- **Moneda.** `$ 24.000` (ARS, separador de miles con punto). Fechas `Sábado 28/11` y horas `10:30`.
- **Navegación del prototipo**: `<aside class="proto">` al pie de cada página, fuera del producto.

## Marca (capa tenant)

| Dato del spa | Dónde se usa | Regla |
|---|---|---|
| Nombre | Encabezado, títulos, mensajes de WhatsApp | Texto; hasta ~30 caracteres, envuelve |
| Logo | Encabezado (36 px), vista previa | PNG/SVG cuadrado ≤ 1 MB; decorativo junto al nombre |
| Color primario | `action.primary`, `text.link`, `border.selected`, franja | Si contraste con blanco y con `surface.default` ≥ 4,5:1 → todos los usos. Si no → solo franja; el resto queda con el valor del sistema. Hover derivado más oscuro por la plataforma |

El foco (`color.focus.ring`, 3 px + offset 2 px) no cambia con la marca. Con el color de ejemplo
`#8a2b6a`, el anillo azul sobre la superficie da 6,70:1 (el offset evita medirlo contra el botón).

## Pantallas

### Clienta (mobile-first, 360 px)

| Pantalla | Contenido y acción principal | Estados |
|---|---|---|
| `c-ingresar` | Prefijo +54 9 fijo + número; «Enviarme el código» | Error de formato (10 dígitos) |
| `c-codigo` | Código 6 dígitos (`autocomplete=one-time-code`); «Ingresar»; reenviar con espera | `c-codigo-error`: intentos restantes |
| `c-inicio` | Aviso «te toca volver» (info), próximo turno, datos del spa, pack (Fase 2) | Sin turno (CTA reservar) / `c-inicio-con-turno` |
| `c-reservar-servicios` | Paso 1/4. Checkboxes con duración y precio; barra fija con total en vivo (`aria-live=polite`) y «Continuar» | Ninguno elegido → error |
| `c-reservar-profesional` | Paso 2/4. «Cualquier profesional» por defecto + quienes hacen todos los servicios | Paso omitido si el spa lo desactiva |
| `c-reservar-horario` | Paso 3/4. Días (con «completo» deshabilitado) y horarios de inicio; semana siguiente | `c-reservar-sin-horarios`: próximo libre + alternativa |
| `c-reservar-confirmar` | Paso 4/4. Resumen, política de cancelación, opt-in de ofertas (destildado, opcional); «Confirmar turno» | `c-reservar-error`: horario recién ocupado |
| `c-reservado` | Éxito + resumen + qué avisos va a recibir + cómo cancelar | — |
| `c-mis-turnos` | Próximos con plazo de cancelación y «Cancelar turno»; anteriores con estado (badge con texto) | `c-mis-turnos-vacio` |
| `c-cancelar` | Turno + política + «Sí, cancelar» / «No, mantener» | `c-cancelar-fuera-plazo` |
| `c-cancelado` | Éxito + «Elegir otro día y horario» (cancelar y volver a reservar) | — |
| `c-te-toca-volver` | Repetir lo último con la misma profesional; 3 horarios; más días / otros servicios | — |
| `c-whatsapp` | Mock: recordatorio, «te toca volver», oferta con BAJA | — |
| `c-pack` (Fase 2) | Pack 3 y 12 meses, condiciones (pago único, no se renueva, baja); «Pagar con Mercado Pago» | `c-pack-pago-error` |
| `c-pack-activo` | Vigencia, uso del mes, pago; sección «Baja del pack» con «Darme de baja» | — |
| `c-pack-baja`, `c-pack-baja-ok` | Confirmación de baja; comprobante con número de trámite | Reintegro: placeholder a definir |

### Profesional (mobile)

| Pantalla | Contenido | Estados |
|---|---|---|
| `p-agenda` | Día: lista ordenada de turnos y bloqueos (bloqueo con fondo `surface.disabled` + texto «Bloqueado»); día anterior/siguiente; «Bloquear un horario» | `p-agenda-vacia` |
| `p-agenda-semana` | Resumen por día (cantidad, completo, bloqueos) con link al día | — |
| `p-bloquear` | Día, desde, hasta (pasos de 15 min), motivo opcional | Falta día; `p-bloquear-conflicto` (el bloqueo no cancela turnos) |
| `p-bloqueado` | Éxito + «Deshacer bloqueo» | — |

### Recepción (tablet/desktop)

| Pantalla | Contenido | Estados |
|---|---|---|
| `r-agenda` | Día por profesional en 3 columnas (1 en mobile); «Cargar turno» | — |
| `r-cargar-turno` | Dos bloques: 1. Clienta (existente/nueva, WhatsApp, nombre si es nueva; muestra si dio permiso) · 2. Turno (servicios, profesional, día, horario) | `r-cargar-error`: resumen, campo inválido, sin horarios |
| `r-turno-cargado` | Éxito + «Cargar otro turno» | — |

### Administradora (desktop, responsive)

| Pantalla | Contenido | Estados |
|---|---|---|
| `a-panel` | Período; 3 métricas (turnos, % asistencia, recompra 60 d) con definición en texto; próximos pasos; tabla por profesional | `a-panel-vacio`: checklist de puesta en marcha |
| `a-servicios` | Tabla (apilada < 40rem) + alta: nombre, duración, precio, días para «te toca volver» | Errores por campo |
| `a-profesionales` | Equipo + horario semanal editable por profesional | `a-profesionales-ok` |
| `a-ajustes` | Elegir profesional on/off, política (texto + horas), recordatorios 1 y 2 | — |
| `a-marca` | Nombre, logo, color + chequeo de contraste en vivo + vista previa | Color con contraste insuficiente |
| `a-campana` | 1. Segmento (único) con conteo con/sin permiso · 2. Plantilla con campos y vista previa · 3. Fecha | Oferta vacía; `a-campana-enviada` (cancelable) |
| `a-importar` | Formato de columnas, planilla de ejemplo, subir archivo | — |
| `a-importar-resultado` | Válidas / con permiso / con error + tabla de errores | `a-importar-ok` |

## Responsive

- < 40rem: una columna, tablas apiladas (etiqueta + valor), botones a ancho completo.
- ≥ 40rem: grilla de 3 métricas/columnas de agenda; acciones en fila.
- ≥ 64rem: navegación lateral de administración; formularios de recepción y campaña en 2 columnas.

## Fuera de esta spec

Push, instalación de la PWA, reprogramación en un paso, varias campañas, métricas completas, cobro
recurrente, gift cards, reseñas, historial de clienta, señas, app nativa, login con Google/Apple.
