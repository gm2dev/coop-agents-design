# Reservas con recompra para spas · MVP (Roadmap B)

Estado: borrador v0.3.1 (look «Sereno», decisiones de producto y revisión ronda 3) · Pedido por: Ezequiel Avila · Diseño: Designer · Revisión: Designer Reviewer / CDO

## Objetivo

Prototipos navegables, de media fidelidad, de los recorridos clave del MVP de reservas
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
| Prototipo (59 páginas HTML; entrada, índice por perfil) | [`prototypes/spa-reservas-mvp/index.html`](../../prototypes/spa-reservas-mvp/index.html) |
| Tokens del prototipo (generados) | [`prototypes/shared/tokens.css`](../../prototypes/shared/tokens.css) |

### Look y tokens: design system v1 «Sereno»

- Desde v0.3 el prototipo usa el look **«Sereno»** del design system v1 (PR #6, rama `design/ds-sereno`,
  elegido por escrito por Fidel Cossio): serif del sistema en títulos, controles de 44 px (táctil),
  radios y sombras suaves, superficies cálidas, navegación lateral del sistema y tokens de componente.
  `styles.css` usa solo tokens semánticos.
- **`prototypes/shared/tokens.css` es un archivo generado, no se edita a mano.** Se generó con
  `python3 design-system/tools/tokens.py css` a partir de `design-system/tokens.json` de
  `origin/design/ds-sereno` (PR #6), copiado a un directorio temporal: esta rama **no toca
  `design-system/`**. Tiene **182 variables** CSS (`--…`); conserva las 59 de v0.2 (los alias `$deprecated` siguen
  saliendo como variables).
- **Cuando PR #6 se mergee en `main`, hay que regenerar `prototypes/shared/tokens.css` desde `main`**
  (`python3 design-system/tools/tokens.py css` y copiar `design-system/tokens.css`), para que el
  prototipo no quede con una copia vieja.
- **Marca del tenant (igual que PR #6):** el spa define solo `brand.primary`, el logo y el nombre. El
  resto (`solid`, `on-primary`, `primary-hover`, `text`, `text-hover`, `subtle`, `border`) se deriva
  con la regla de `design-system/README.md` §Marca del tenant: el texto de marca y los links tienen que
  dar ≥ 4,5:1 contra `surface.default`, `surface.canvas`/`subtle` y `brand.subtle`. Si no da, se
  oscurece el color en pasos de 2 % y la pantalla Marca **avisa** (no bloquea el guardado).
  `brand.text` nunca se usa sobre `surface.sunken`/`disabled` (el chat del mock de WhatsApp usa
  `sunken`, por eso sus links van siempre dentro de la burbuja). El seleccionado del tenant usa
  `brand.subtle` + `brand.border` + doble trazo + «✓ elegido»; en los paneles se usa el seleccionado
  del sistema. `tenant-spa-lua.css` tiene todos los valores derivados y `app.js` replica
  `derive_brand` de `tools/tokens.py` en la vista previa de `a-marca`.
- La marca del spa manda en la **web de la clienta** (`body.tenant`); los paneles de profesional,
  recepción y administración usan el chrome de la plataforma con el spa como chip (logo + nombre).

## Casos de uso provisorios cubiertos

| CU | Perfil | Recorrido | Pantallas |
|---|---|---|---|
| CU-01 | Clienta | Ingresar con número de WhatsApp + código | `c-ingresar`, `c-codigo`, `c-codigo-error`, `c-codigo-bloqueado` |
| CU-02 | Clienta | Reservar uno o varios servicios seguidos. Sin pack: 3 pasos con la primera profesional disponible. Con pack: 4 pasos, elige profesional y el servicio del mes va «incluido en tu pack» (extras a precio de lista, pago en el local) | `c-reservar-*`, `c-reservado`, `c-reservar-*-pack`, `c-reservar-profesional`, `c-reservado-pack` |
| CU-03 | Clienta | Ver y cancelar turnos (sin reprogramar) | `c-mis-turnos*`, `c-cancelar*`, `c-cancelado` |
| CU-04 | Clienta | Volver a reservar desde «te toca volver» (app y WhatsApp) | `c-inicio`, `c-te-toca-volver`, `c-whatsapp` |
| CU-05 | Clienta | Recordatorios por WhatsApp 24 h y 2 h, primera oferta con baja en un toque (mock de contenido) | `c-whatsapp`, `c-whatsapp-baja-ofertas` |
| CU-06 | Clienta (Fase 2) | Comprar pack prepago 3/12 meses (pago aprobado, pendiente o rechazado, sin sesión) y darse de baja con devolución | `c-pack*`, `c-inicio-con-pack` |
| CU-07 | Profesional | Ver agenda del día (anterior/siguiente) y de la semana; marcar «Asistió»/«No vino» | `p-agenda*` |
| CU-08 | Profesional | Bloquear horario | `p-bloquear*`, `p-bloqueado` |
| CU-09 | Recepción | Cargar turno en nombre de la clienta (registra permiso de ofertas dado en persona); marcar o corregir asistencia | `r-agenda`, `r-cargar-*` (con y sin pack), `r-turno-cargado` |
| CU-10 | Administradora | Ver métricas básicas (turnos, % asistencia sin contar «Sin marcar», recompra) y turnos sin marcar | `a-panel*` |
| CU-11 | Administradora | Servicios, profesionales y horarios, ajustes de reserva; configuración del pack (Fase 2) | `a-servicios`, `a-profesionales*`, `a-ajustes`, `a-pack` |
| CU-12 | Administradora | Marca básica (nombre, logo, color) | `a-marca` |
| CU-13 | Administradora | Campaña de Navidad (1 plantilla, 1 segmento, solo con permiso; cancelar con confirmación) | `a-campana*` |
| CU-14 | Administradora | Importar clientas por CSV con «dio permiso» | `a-importar*` |

No cubiertos en esta iteración: recordatorios push, instalación de la PWA, alta y edición completa de
profesionales, recepción cancelando turnos, gestión de suscriptoras por la administradora y **conexión
del spa con Mercado Pago** (en el piloto la plataforma carga las credenciales de cada spa a mano; ver
S-18).

## Decisiones de producto (v0.3)

Las tomó el CPO sobre las preguntas de v0.2. Estado: **Confirmado por Fidel** = decidido; **CPO,
pendiente de Fidel** = se aplica en el prototipo pero Fidel puede cambiarlo.

| # | Decisión | Quién decidió | Estado | Dónde se ve |
|---|---|---|---|---|
| DP-01 | Recordatorios **24 h y 2 h** antes, configurables por spa. Se revierte el cambio a 48 h de v0.2. Cierra P-09. | Fidel Cossio | **Confirmado por Fidel** | `c-whatsapp`, `a-ajustes`, `c-reservado` |
| DP-02 | Plazo para cancelar desde la app: por defecto **12 h antes** del turno, configurable por spa. Con el recordatorio de 24 h, la clienta todavía puede cancelar. | CPO | **Pendiente de Fidel** | `c-reservar-confirmar`, `c-reservar-error`, `c-reservado`, `c-mis-turnos`, `c-cancelar`, `c-cancelar-fuera-plazo`, `a-ajustes` |
| DP-03 | **Elegir profesional es un beneficio del pack** que cada spa activa o no. Solo las clientas con pack ven ese paso; las demás reservan con «la primera profesional disponible». Sale de los ajustes generales y pasa a la configuración del pack. Vuelve «elegís profesional» como beneficio del pack. Cierra P-01. | Fidel Cossio | **Confirmado por Fidel** | con pack: `c-reservar-servicios-pack` → `c-reservar-profesional` → `c-reservar-horario-pack` → `c-reservar-confirmar-pack` → `c-reservado-pack`; sin pack: `c-reservar-horario`, `c-te-toca-volver`, `c-pack`, `a-pack`, `a-ajustes` |
| DP-03c | **Recepción aplica la misma regla:** elige profesional solo si la clienta tiene pack activo («Tiene pack» en el resumen de la clienta encontrada); sin pack o clienta nueva, «La primera profesional disponible». | CDO (provisoria) | **Pregunta al CPO** (P-15) | `r-cargar-turno` (con pack), `r-cargar-turno-sin-pack`, `r-cargar-error` |
| DP-03b | Pregunta abierta: ¿en Fase 1 (sin packs) el spa puede abrir «elegir profesional» para todas? **Hasta que se decida, solo con pack.** | — | **Pendiente de Fidel** (P-13) | nota en `a-pack` |
| DP-04 | **Asistencia:** la profesional marca «Asistió»/«No vino» desde su agenda; recepción y administración pueden marcarla o corregirla. Los turnos sin marcar quedan «Sin marcar», **no cuentan** en el % de asistencia y el panel muestra cuántos hay. Cierra P-06. | CPO | **Pendiente de Fidel** | `p-agenda`, `p-agenda-dia-anterior`, `r-agenda`, `a-panel` |
| DP-05 | **Permiso de ofertas en persona:** recepción puede registrarlo al cargar un turno; queda guardado quién, cuándo y «en persona». La primera oferta (mock de WhatsApp) trae la baja en un toque. Reemplaza S-09 y cierra P-04. | CPO | **Pendiente de Fidel** | `r-cargar-turno`, `r-cargar-error`, `r-turno-cargado`, `c-whatsapp`, `c-whatsapp-baja-ofertas` |
| DP-06 | **Marca:** logo + un color principal; el resto se deriva (regla de PR #6). Cierra DD-11 como **decidido-provisorio** y P-10. | CPO | **Pendiente de Fidel** | `a-marca`, `tenant-spa-lua.css` |
| DP-07 | **Pack (propuesta provisoria):** 1 servicio por mes de una lista que arma el spa, a precio con descuento que fija el spa (**menor que el precio de lista de todos los servicios incluidos**; `a-pack` avisa si no), más elegir profesional. Los servicios extra del mismo turno van a precio de lista y se pagan en el local. Baja dentro de los 10 días de la compra sin uso: devolución total. Después: se devuelven los servicios no usados al precio del pack («Te devolvemos $X por N servicios sin usar»). Precios del ejemplo ficticios. | CPO (propone) · decide Fidel | **Pendiente de Fidel · ⚠ SIN REVISIÓN LEGAL** | `c-pack`, `c-pack-activo`, `c-pack-baja`, `c-pack-baja-ok`, `a-pack` |
| DP-08 | **Mercado Pago:** estado «pago pendiente» (`c-pack-pago-pendiente`); la pantalla de resultado funciona **sin sesión**; la confirmación final llega por WhatsApp (mock). No se prototipa la conexión del spa con MP. | CPO | **Pendiente de Fidel** | `c-pack-pago-pendiente`, `c-pack-pago-error`, `c-pack-activo`, `c-whatsapp` |

> **⚠ Pack sin revisión legal.** Las condiciones de DP-07 (devolución, plazos, textos) son una propuesta
> provisoria del CPO para poder prototipar. **No tienen revisión legal** (Res. 316/2018, Ley 24.240,
> facturación ante ARCA: P-08). Las pantallas lo dicen con un aviso visible.

## Notas de factibilidad (Architect)

Propuesta del Architect, **pendiente de aprobación de Ezequiel Avila**. Responden A-01, A-03 y A-05.

- **No se reserva el horario mientras la clienta confirma** (sin bloqueo temporal): si otra lo toma
  antes, se muestra `c-reservar-error` («Ese horario se acaba de ocupar»).
- **Marca por spa en runtime** por ruta `/<spa>/` (un solo dominio); el contraste se valida al guardar
  en `a-marca` (la misma derivación del prototipo).
- **Varios servicios = un bloque** con la duración sumada; solo se ofrecen horarios donde entra el bloque
  entero. «La primera profesional disponible» asigna a una que tenga el bloque libre.
- **Estimación: 7 a 11 días, confianza media.**

## Supuestos (a validar; ninguno está en un PRD)

- **S-01** El acceso de la clienta es por spa (URL/PWA con la marca del spa en la ruta `/<spa>/`, link
  desde WhatsApp). Una clienta que va a dos spas tiene una sesión por spa.
- **S-02** Código de verificación de 6 dígitos por WhatsApp, reenvío habilitado recién a los 45 s
  (botón deshabilitado con cuenta regresiva), 3 intentos por código; sin intentos, espera de 15 min y
  código nuevo (`c-codigo-bloqueado`). Plan B por SMS si Meta no aprueba antes del 10/11 (mismo diseño,
  cambia el canal en el texto).
- **S-03** Teléfono argentino: prefijo fijo +54 9 y 10 dígitos con código de área (sin 0 ni 15).
- **S-04** Varios servicios = **un bloque** con la misma profesional, en el orden de la lista; duración =
  suma; solo horarios donde entra el bloque entero (nota del Architect).
- **S-05** ~~«Elegir profesional» es un ajuste del spa para todas~~ → reemplazado por **DP-03**.
- **S-06** Sin pack, se reserva con «la primera profesional disponible»; se muestra con quién en la
  confirmación. Con pack (y el beneficio activo), la clienta elige o deja «la primera disponible».
- **S-07** Política de cancelación = texto libre del spa + plazo en horas (**por defecto 12 h**, DP-02).
  Dentro del plazo, la clienta cancela desde la app; fuera, se la deriva a escribirle al spa. Sin señas
  ni penalidades (fuera de alcance). El primer recordatorio (24 h) sale antes de que venza el plazo.
- **S-08** Opt-in de ofertas: checkbox **destildado por defecto**, opcional, en la confirmación. Se pide
  una sola vez. Los recordatorios no dependen del opt-in. Baja respondiendo «BAJA» o, en la primera
  oferta, con un link de baja en un toque (DP-05).
- **S-09** ~~Recepción no puede marcar el permiso~~ → reemplazado por **DP-05** (registro en persona con
  quién y cuándo).
- **S-10** «Te toca volver» = días configurados por servicio por la administradora (ej. 21 días para
  semipermanente); propone repetir el último combo y 3 horarios con la primera profesional disponible.
- **S-11** Recordatorios configurables por spa, por defecto **24 h y 2 h** (DP-01, confirmado).
- **S-12** Métricas: Asistencia = «Asistió» / (turnos marcados «Asistió» + «No vino»); los «Sin marcar»
  y los cancelados no cuentan (DP-04). Recompra = % de clientas que vuelven a reservar dentro de los 60
  días (métrica principal propuesta en la presentación).
- **S-13** Campaña de Navidad: un único segmento «vinieron en los últimos 90 días» filtrado siempre por
  permiso; una plantilla «oferta de temporada» con campos editables (oferta y vigencia).
- **S-14** CSV con columnas `nombre`, `whatsapp`, `dio_permiso` (`si`/`no`); importar no envía mensajes.
- **S-15** Pack prepago: ver DP-07 (propuesta provisoria, sin revisión legal). Pago único por Mercado
  Pago del spa, no se renueva. Precios del prototipo ficticios: $ 10.000 por servicio en el de 3 meses
  ($ 30.000) y $ 9.500 en el de 12 ($ 114.000); el servicio incluido más barato cuesta $ 12.000 de lista.
  Devolución después de 10 días: $ 10.000 por servicio sin usar (ej.: 2 sin usar → $ 20.000). Devolución
  total hasta el 25/12/2026 inclusive para una compra del 15/12/2026.
- **S-16** Marca del spa: nombre, logo y un color principal; el resto se deriva (DP-06, regla de PR #6).
- **S-17** Clienta con pack activo: «Mi pack» aparece en la navegación principal y en el inicio, con
  «Darme de baja del pack» siempre a la vista (Res. 316/2018, botón de baja). Sin pack, la navegación no
  cambia.
- **S-18** **Mercado Pago en el piloto:** cada spa no conecta su cuenta desde la app; la plataforma carga
  sus credenciales a mano. Por eso no hay pantalla de conexión (`a-pack` solo muestra «Configurado»).
- **S-19** El resultado del pago (aprobado, pendiente, rechazado) se ve sin sesión y sin datos
  personales: solo pack y monto. La confirmación final llega por WhatsApp.

## Decisiones de diseño

- **DD-01 Base genérica multi-negocio.** Componentes y textos de sistema no mencionan «uñas»: los nombres
  de servicios y los textos de «te toca volver» vienen de datos del spa. El ejemplo usa un spa de uñas
  ficticio («Spa Lúa»).
- **DD-02 Reserva en 3 pasos** (servicios → día/horario → confirmar), con total en vivo y CTA fijo abajo
  en mobile. Con pack y el beneficio activo se suma el paso de profesional (4 pasos).
- **DD-03 Opt-in y política en la confirmación**, juntos y antes del botón, para no sumar pasos.
- **DD-04 Sin reprogramar (Roadmap B).** «Cancelar y volver a reservar»: después de cancelar se ofrece
  «Elegir otro día y horario» conservando los servicios.
- **DD-05 Marca del tenant derivada (v0.3, reemplaza la regla de v0.2).** Se adopta la derivación de
  PR #6 (ver «Look y tokens»). Casos de prueba (contraste de `brand.text` contra `surface.default` ·
  `canvas` · `brand.subtle`, truncado):
  `#8a2b6a` → sin ajuste, 7,84 · 7,14 · 6,45; `#e88fb4` → text `#945c73`, 5,11 · 4,66 · 4,67 (botón con
  texto casi negro 8,11:1); `#767676` → text `#6a6a6a`, 5,32 · 4,84 · 4,62 (botón 4,54:1);
  `#d81b60` → text `#c71958`, 5,57 · 5,07 · 4,61 (botón 4,94:1). Detalle en
  [accessibility.md](accessibility.md). Cierra P-11 y P-12 (el seleccionado del tenant usa `brand.subtle`).
- **DD-06 Anillo de foco del sistema** (`color.focus.ring`) con offset sobre la superficie: no depende del
  color del spa.
- **DD-07 Campaña «solo con permiso» visible**: se muestra cuántas del segmento quedan afuera y por qué.
- **DD-08 Botón de baja del pack** visible en «Mi pack», al mismo nivel que el resto del contenido
  (Res. 316/2018), con confirmación, monto a devolver y comprobante con número de trámite.
- **DD-09 Mock de WhatsApp sin marca de terceros**: burbujas neutras; el remitente es el número de la
  plataforma con el nombre del spa en el texto. Solo emojis genéricos.
- **DD-10** ~~`surface.selected`/`text.selected` no se derivan~~ → con PR #6, el tenant usa
  `brand.subtle` + `brand.border` para su seleccionado y los paneles el seleccionado del sistema.
- **DD-11 Un solo color principal: decidido-provisorio** (DP-06, CPO, pendiente de Fidel).
- **DD-12 Acceso permanente a «Mi pack» y a la baja (Res. 316/2018).** Con pack activo, la navegación
  principal suma «Mi pack» y el inicio muestra la tarjeta «Mi pack» con «Darme de baja del pack».
- **DD-13 Acciones destructivas de administración con confirmación en el lugar** (`a-campana-cancelada`).
- **DD-14 Asistencia con botones de alternar.** «Asistió» y «No vino» son botones con `aria-pressed`; el
  estado se dice en texto («Asistencia: Sin marcar»), no solo con color. Volver a tocar el botón activo lo
  deja «Sin marcar».
- **DD-15 Permiso en persona explícito.** El checkbox de recepción dice «Me dijo en persona que acepta…»
  y explica que queda registrado quién y cuándo; destildado por defecto.

## Propuestas al design system (las decide el CDO)

- **PDS-01** ~~Capa tenant~~ → resuelta por PR #6 (regla de marca del tenant).
- **PDS-02 Componentes usados en el prototipo** (estados en
  [spec.md §Componentes nuevos](spec.md#componentes-nuevos-pds-02)): tarjeta seleccionable (`.choice`),
  grilla de días y horarios, resumen de errores, barra de resumen fija, tabla apilada en mobile, burbuja
  de mensaje, confirmación en el lugar, botón-link con cuenta regresiva y **marcado de asistencia**
  (nuevo en v0.3).
- **PDS-03 Medidas sin token**: con Sereno quedan cubiertas por tokens (`size.sidebar-width`,
  `component.*`); las que siguen sin token están en
  [spec.md §Excepciones de layout](spec.md#excepciones-de-layout-medidas-sin-token).

## Preguntas abiertas

Cerradas en v0.3: P-01 (DP-03), P-04 (DP-05), P-06 (DP-04), P-09 (DP-01), P-10 (DP-06), P-11 y P-12
(DD-05, PR #6). P-02 queda respondida en forma provisoria por DP-07.

Para **Fidel / CPO**:

- **P-02** Pack: confirmar DP-07 y pasarlo por legales.
- **P-03** Fuera del plazo de cancelación: ¿solo derivar al spa (prototipo) o permitir cancelar igual
  dejando registro?
- **P-05** Segmento de la campaña: ¿«vinieron en los últimos 90 días» es el correcto? ¿Hay tope de envíos
  diario (límites de Meta) que tengamos que mostrar?
- **P-07** ¿La clienta puede reservar sin registrarse (solo nombre + WhatsApp en el último paso)?
- **P-08** Textos legales y facturación ante ARCA del pack.
- **P-13** ¿En Fase 1 (sin packs) el spa puede abrir «elegir profesional» para todas? (DP-03b)
- **P-15** (CDO → CPO) ¿Recepción sigue la regla de DP-03 (elige profesional solo si la clienta tiene
  pack)? Aplicado en forma provisoria como DP-03c.
- **P-14** Confirmar las decisiones del CPO pendientes: DP-02, DP-04, DP-05, DP-06, DP-07 y DP-08.

Para el **Architect** (además de las notas de factibilidad, pendientes de Ezequiel):

- **A-02** Plantillas de WhatsApp: los textos del mock ¿entran en las categorías de Meta (utilidad vs
  marketing) y con botón de link? ¿El link de baja en un toque es posible en una plantilla de marketing?
- **A-04** Retorno de Mercado Pago sin sesión (aprobado/rechazado/pendiente) y aviso por WhatsApp cuando
  se acredita un pago pendiente.

## Historial

- v0.1 (19/10/2026): primeros prototipos básicos por perfil, flujos, spec breve y verificación con
  Playwright + axe.
- v0.2 (19/10/2026): correcciones de la revisión (ronda 1). Barra de resumen sin tapar el foco
  (2.4.11); vista previa de marca con los valores del sistema; regla de contraste DD-05 contra blanco y
  `surface.subtle`; acceso permanente a «Mi pack» y baja (`c-inicio-con-pack`); recordatorio 48 h + P-09;
  un solo resumen de errores en recepción; clienta existente/nueva coherente; datos de la reserva
  coherentes (Carla, sáb 28/11 10:30) y `p-agenda-dia-anterior`; pack sin «elegís profesional»; reenvío
  de código con cuenta regresiva y `c-codigo-bloqueado`; sin 💅; cancelar campaña con confirmación y
  `a-campana-cancelada`; hover verificable (PDS-01), estados de componentes (PDS-02), excepciones de
  layout y sin estilos inline. Decisiones del CDO DD-10 y DD-11.
- v0.3 (19/10/2026): integración de `main` (índice con look-and-feel y este prototipo). Look «Sereno»
  del design system v1 (PR #6): `prototypes/shared/tokens.css` generado desde su `tokens.json`, títulos
  en serif del sistema, controles de 44 px, radios, sombras, navegación lateral y marca del tenant
  derivada como en PR #6 (`app.js`, `a-marca`, `tenant-spa-lua.css`). Decisiones de producto DP-01 a
  DP-08 y notas de factibilidad del Architect. Pantallas nuevas: `c-pack-pago-pendiente`,
  `c-whatsapp-baja-ofertas`, `a-pack`. Asistencia en agendas y panel; permiso en persona en recepción;
  pack con devolución (provisorio, sin revisión legal). Menores de la revisión ronda 2: servicio de
  Julia T. unificado (Esmaltado semipermanente) y resumen de errores de `r-cargar-error` que se
  actualiza al alternar «Ya es clienta».
- v0.3.1 (19/10/2026): correcciones de la revisión ronda 3.
  1. Recorrido **con pack** de 4 pasos (DP-03): `c-reservar-servicios-pack`, `c-reservar-profesional`,
     `c-reservar-horario-pack`, `c-reservar-confirmar-pack`, `c-reservado-pack`, con la profesional
     elegida y el servicio del mes «incluido en tu pack» (extras a precio de lista, pago en el local).
     Se entra desde `c-inicio-con-pack`, `c-pack-activo` y «Reservar» de la navegación con pack. El
     recorrido sin pack sigue de 3 pasos.
  2. Precio del pack menor que el de lista: $ 10.000 (3 meses, $ 30.000) y $ 9.500 (12 meses,
     $ 114.000); devolución recalculada ($ 20.000 por 2 servicios sin usar). `a-pack` avisa si el precio
     del pack supera el de lista de algún servicio incluido.
  3. «Pack» en la navegación lateral de `a-ajustes`.
  4. `r-agenda`: «8 turnos» = los listados; Nora C. (12:00, ya empezó) con control de asistencia;
     servicios con nombre completo y hora de fin; Marta R. 17:00 como en `p-agenda`.
  5. Lucía G. unificada: sábado 28/11, 12:30–14:00, Kapping en gel, con Carla (`r-cargar-turno`,
     `r-turno-cargado`, `r-agenda`, `p-agenda`). `r-cargar-error` ya no usa a Jimena: jueves 26/11
     completo para todas, coherente con `p-agenda-semana`.
  6. Devolución total hasta el 25/12/2026 inclusive en `c-whatsapp` y `c-pack-activo`.
  7. DP-03c (provisoria del CDO, P-15): recepción elige profesional solo con pack («Tiene pack»);
     nueva `r-cargar-turno-sin-pack`.
  8. `app.js`: `mix` redondea como `round()` de Python (mitad al par): `#f5c400` → hover `#f8d64c`,
     igual que `tools/tokens.py` de `origin/design/ds-sereno`.
  9. Cifras del README: 182 variables en `tokens.css`; 59 páginas HTML en el prototipo (54 + 5 nuevas).
