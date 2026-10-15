# Principios de diseño

Estado: borrador v0 · Dueño: CDO

1. **Claridad antes que ingenio.** Cada pantalla tiene un objetivo y una acción principal. Textos
   concretos, en español rioplatense, sin jerga. Si hay que explicarlo, todavía no está claro.
2. **Mobile-first.** Diseñamos primero para una pantalla chica y una mano; después ampliamos a
   desktop. El contenido reflujea a 320 px sin scroll horizontal.
3. **Accesible por defecto.** WCAG 2.2 AA es el piso, no un extra: HTML semántico, operable con
   teclado y lector de pantalla, foco visible, contraste suficiente, objetivos táctiles ≥ 24 px
   (idealmente 44 px) y nunca el color como única señal.
4. **Mínimo de pasos.** Pedimos solo los datos necesarios, en el momento en que hacen falta, con
   valores por defecto razonables y sin reingresar información que ya tenemos.
5. **Feedback explícito.** Toda acción tiene respuesta visible y anunciada: qué está pasando
   (cargando), qué salió bien (éxito con resumen) y qué salió mal con cómo resolverlo (error con salida).
