# Reservas con recompra para spas · MVP (Roadmap B)

Estado: borrador v0.1 (primeros prototipos básicos) · Pedido por: Ezequiel Avila · Diseño: Designer · Revisión: Designer Reviewer / CDO

## Objetivo

Primeros prototipos navegables, de baja-media fidelidad, de los recorridos clave del MVP de reservas
con foco en **recompra** decidido como **Roadmap B** (19/10/2026, Fidel Cossio): Fase 1 «Navidad» más
una pantalla del pack prepago de la Fase 2 «Año Nuevo». Sirven para validar recorridos y alcance con
producto y tecnología antes del PRD; no son diseño final ni código de producto.

## Fuente

- Presentación ejecutiva: `gm2dev/coop-agents-product` →
  `roadmap-mvp-reservas/presentacion-ejecutiva.html` (solo lectura).
- **Todavía no hay PRD ni casos de uso formales.** Los «casos de uso» de este documento (CU-xx) son
  provisorios, derivados de la presentación; cuando exista el PRD se reemplazan por los enlaces oficiales.

## Artefactos

| Artefacto | Ruta |
|---|---|
| Flujos (Mermaid) | [flows.md](flows.md) |
| Spec de UI | [spec.md](spec.md) |
| Accesibilidad | [accessibility.md](accessibility.md) |
| Prototipo (entrada, índice por perfil) | [`prototypes/spa-reservas-mvp/index.html`](../../prototypes/spa-reservas-mvp/index.html) |

## Casos de uso provisorios cubiertos

| CU | Perfil | Recorrido | Pantallas |
|---|---|---|---|
| CU-01 | Clienta | Ingresar con número de WhatsApp + código | `c-ingresar`, `c-codigo`, `c-codigo-error` |
| CU-02 | Clienta | Reservar uno o varios servicios seguidos (profesional opcional, día/horario, opt-in, política) | `c-reservar-*`, `c-reservado` |
| CU-03 | Clienta | Ver y cancelar turnos (sin reprogramar) | `c-mis-turnos*`, `c-cancelar*`, `c-cancelado` |
| CU-04 | Clienta | Volver a reservar desde «te toca volver» (app y WhatsApp) | `c-inicio`, `c-te-toca-volver`, `c-whatsapp` |
| CU-05 | Clienta | Recordatorios por WhatsApp (mock de contenido) | `c-whatsapp` |
| CU-06 | Clienta (Fase 2) | Comprar pack prepago 3/12 meses y darse de baja | `c-pack*` |
| CU-07 | Profesional | Ver agenda del día y de la semana | `p-agenda*` |
| CU-08 | Profesional | Bloquear horario | `p-bloquear*`, `p-bloqueado` |
| CU-09 | Recepción | Cargar turno en nombre de la clienta | `r-agenda`, `r-cargar-*`, `r-turno-cargado` |
| CU-10 | Administradora | Ver métricas básicas (turnos, % asistencia, recompra) | `a-panel*` |
| CU-11 | Administradora | Servicios, profesionales y horarios, ajustes de reserva | `a-servicios`, `a-profesionales*`, `a-ajustes` |
| CU-12 | Administradora | Marca básica (nombre, logo, color) | `a-marca` |
| CU-13 | Administradora | Campaña de Navidad (1 plantilla, 1 segmento, solo con permiso) | `a-campana*` |
| CU-14 | Administradora | Importar clientas por CSV con «dio permiso» | `a-importar*` |

No cubiertos en esta iteración: recordatorios push, instalación de la PWA, alta y edición completa de
profesionales, recepción cancelando turnos, gestión de suscriptoras por la administradora, carga de
asistencia/ausencias (de dónde sale el % de asistencia; ver P-06).

## Supuestos (a validar; ninguno está en un PRD)

- **S-01** El acceso de la clienta es por spa (URL/PWA con la marca del spa, link desde WhatsApp). Una
  clienta que va a dos spas tiene una sesión por spa.
- **S-02** Código de verificación de 6 dígitos por WhatsApp, reenvío a los 45 s, 3 intentos. Plan B por
  SMS si Meta no aprueba antes del 10/11 (mismo diseño, cambia el canal en el texto).
- **S-03** Teléfono argentino: prefijo fijo +54 9 y 10 dígitos con código de área (sin 0 ni 15).
- **S-04** Varios servicios = se hacen **seguidos con la misma profesional**, en el orden de la lista;
  duración = suma. Solo se ofrecen profesionales que hacen todos los servicios elegidos.
- **S-05** «Elegir profesional» es un ajuste del spa (on/off). La presentación dice además que es
  «beneficio por tier de suscripción»: en el prototipo el pack de 12 meses lo menciona como beneficio,
  pero el paso de reserva no se condiciona por tier (ver P-01).
- **S-06** «Cualquier profesional» es la opción por defecto; el spa asigna y se muestra en el resumen.
- **S-07** Política de cancelación = texto libre del spa + plazo en horas (por defecto 24 h). Dentro del
  plazo, la clienta cancela desde la app; fuera, se la deriva a escribirle al spa. Sin señas ni
  penalidades (fuera de alcance).
- **S-08** Opt-in de ofertas: checkbox **destildado por defecto**, opcional, en la confirmación. Se pide
  una sola vez (si ya dio permiso, no se vuelve a mostrar). Los recordatorios no dependen del opt-in.
  Baja de ofertas respondiendo «BAJA».
- **S-09** Recepción **no** puede marcar el permiso de ofertas por la clienta; la clienta lo acepta en
  un mensaje. (Consistente con la decisión 3 de la presentación; ver P-04.)
- **S-10** «Te toca volver» = días configurados por servicio por la administradora (ej. 21 días para
  semipermanente); propone repetir el último combo con la misma profesional y 3 horarios.
- **S-11** Recordatorios: 24 h y 2 h antes por defecto, configurables por el spa (confirmado en la
  presentación).
- **S-12** Métricas: Asistencia = cumplidos / (turnos − cancelados). Recompra = % de clientas que vuelven
  a reservar dentro de los 60 días (métrica principal propuesta en la presentación).
- **S-13** Campaña de Navidad: un único segmento «vinieron en los últimos 90 días» filtrado siempre por
  permiso; una plantilla «oferta de temporada» con campos editables (oferta y vigencia).
- **S-14** CSV con columnas `nombre`, `whatsapp`, `dio_permiso` (`si`/`no`); importar no envía mensajes.
- **S-15** Pack prepago: 1 servicio por mes, pago único por Mercado Pago del spa, no se renueva. Precios y
  descuentos del prototipo son ficticios. Política de reintegro al darse de baja: **a definir**.
- **S-16** Marca del spa en B: solo nombre, logo y un color primario (capa tenant). Todo lo demás es el
  design system.

## Decisiones de diseño

- **DD-01 Base genérica multi-negocio.** Componentes y textos de sistema no mencionan «uñas»: los nombres
  de servicios y los textos de «te toca volver» vienen de datos del spa. El ejemplo usa un spa de uñas
  ficticio («Spa Lúa»).
- **DD-02 Reserva en 4 pasos** (servicios → profesional → día/horario → confirmar), con total en vivo y
  CTA fijo abajo en mobile. El paso de profesional se omite si el spa no lo activa (quedan 3).
- **DD-03 Opt-in y política en la confirmación**, juntos y antes del botón, para no sumar pasos.
- **DD-04 Sin reprogramar (Roadmap B).** «Cancelar y volver a reservar»: después de cancelar se ofrece
  «Elegir otro día y horario» conservando los servicios. Lo decimos en Mis turnos y en la confirmación.
- **DD-05 Capa tenant de marca.** `tenant-<spa>.css` solo sobreescribe `color.action.primary` (+ hover,
  link y borde seleccionado derivados del mismo color). Regla de contraste: el color del spa se usa en
  botones/links **solo si da ≥ 4,5:1** contra `text.on-action` (blanco) y contra `surface.default`; si no,
  se mantiene `action.primary` del sistema y el color del spa queda en la franja superior y el logo
  (decorativo). La pantalla de Marca lo calcula y lo explica en vivo. El hover lo deriva la plataforma
  (más oscuro); en el ejemplo `#8a2b6a` → 7,97:1, hover `#6e2255` → 10,38:1.
- **DD-06 Anillo de foco del sistema** (`color.focus.ring`) con offset sobre la superficie: no depende del
  color del spa.
- **DD-07 Campaña «solo con permiso» visible**: se muestra cuántas del segmento quedan afuera y por qué.
- **DD-08 Botón de baja del pack** visible en «Mi pack», al mismo nivel que el resto del contenido
  (Res. 316/2018), con confirmación y comprobante con número de trámite.
- **DD-09 Mock de WhatsApp sin marca de terceros**: burbujas neutras; el remitente es el número de la
  plataforma con el nombre del spa en el texto (un solo número para el piloto).

## Propuestas al design system (las decide el CDO)

- **PDS-01 Capa tenant**: formalizar `tenant.color.primary` como dato del negocio (no token) y la regla
  de contraste de DD-05; definir cómo se deriva el hover (hoy no hay token para eso).
- **PDS-02 Componentes nuevos usados en el prototipo**: tarjeta seleccionable (`.choice`), grilla de
  días y horarios, resumen de errores, barra de resumen fija, tabla apilada en mobile, burbuja de
  mensaje. Todos con tokens existentes.

## Preguntas abiertas

Para el **CPO**:

- **P-01** Elegir profesional: ¿ajuste del spa para todas, o beneficio solo para suscriptoras (tier)? La
  presentación dice ambas cosas.
- **P-02** Pack prepago: qué incluye cada pack (¿un servicio fijo por mes o crédito?), precios/ahorro,
  ¿se acumulan meses no usados?, y **política de reintegro al darse de baja** (con legales).
- **P-03** Fuera del plazo de cancelación: ¿solo derivar al spa (prototipo) o permitir cancelar igual
  dejando registro?
- **P-04** ¿Recepción puede registrar un permiso dado en persona, o siempre lo confirma la clienta por
  WhatsApp?
- **P-05** Segmento de la campaña: ¿«vinieron en los últimos 90 días» es el correcto? ¿Hay tope de envíos
  diario (límites de Meta) que tengamos que mostrar?
- **P-06** ¿Quién marca asistencia/ausencia (profesional, recepción o automático)? Sin eso no hay
  % de asistencia.
- **P-07** ¿La clienta puede reservar sin registrarse (solo nombre + WhatsApp en el último paso) o
  el registro va primero como en el prototipo? Mover el registro al final reduce pasos.
- **P-08** Textos legales y facturación ante ARCA del pack (por definir en la presentación).

Para el **Architect**:

- **A-01** Bloqueo optimista del horario entre «elegir» y «confirmar» (el prototipo muestra el error
  «se acaba de ocupar»): ¿reserva temporal de N minutos o validación al confirmar?
- **A-02** Plantillas de WhatsApp: los textos del mock ¿entran en las categorías de Meta (utilidad vs
  marketing) y con botón de link? Costo por mensaje para mostrar en la campaña.
- **A-03** Theming por tenant en la PWA (manifest, ícono y `theme-color` por spa) con un solo dominio o
  subdominios.
- **A-04** Retorno de Mercado Pago a la PWA (aprobado/rechazado/pendiente) y estado «pendiente».
- **A-05** Cálculo de disponibilidad para combos de servicios seguidos por profesional.

## Historial

- v0.1 (19/10/2026): primeros prototipos básicos por perfil, flujos, spec breve y verificación con
  Playwright + axe.
