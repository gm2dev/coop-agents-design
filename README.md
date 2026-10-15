# coop-agents-design

Repositorio de diseño del equipo: principios, design system, flujos, specs y prototipos estáticos.
Los casos de uso y criterios de aceptación viven en el repo de producto (`gm2dev/coop-agents-product`);
acá se enlazan, no se copian.

## Estructura

```text
README.md                         este índice y convenciones
principles.md                     principios de diseño (los decide el CDO)
design-system/README.md           cómo usar y proponer cambios al design system
design-system/tokens.json         tokens base (W3C Design Tokens): color, tipografía, espaciado, radios, foco
initiatives/<tema>/               una carpeta por iniciativa
  README.md                       objetivo, supuestos, decisiones y preguntas abiertas (punto de entrada)
  flows.md                        flujos de usuario en Mermaid, uno por caso de uso
  spec.md (o specs/<P>.md)        specs de UI: pantallas, componentes, estados, responsive
  accessibility.md                checklist WCAG 2.2 AA y verificaciones
prototypes/                       sitio estático que publica Vercel (un preview por PR)
  index.html                      índice de prototipos
  <tema>/index.html               punto de entrada del prototipo de cada iniciativa
```

## Principios

Resumen (detalle en [principles.md](principles.md)): claridad, mobile-first, accesible por defecto
(WCAG 2.2 AA mínimo), mínimo de pasos y feedback explícito.

## Design system

Los tokens de [design-system/tokens.json](design-system/tokens.json) son la única fuente de valores
visuales. Specs y prototipos usan tokens semánticos (`color.text.default`, `space.300`…), nunca valores
sueltos. Un valor nuevo se propone como token y lo decide el CDO. Ver
[design-system/README.md](design-system/README.md).

## Prototipos

- HTML/CSS estático, sin build, sin dependencias ni recursos remotos (CDN, fuentes, analytics) y sin
  datos reales. JavaScript mínimo solo para estados de interacción.
- Links relativos, para que funcionen en cualquier URL de preview y desde el sistema de archivos.
- Cada iniciativa en `prototypes/<tema>/`, enlazada desde [prototypes/index.html](prototypes/index.html).
- Vercel publica el contenido de `prototypes/` como sitio estático: cada PR obtiene su URL de preview.

## Cómo se trabaja

- Ramas `design/<tema>` desde `main`; Pull Request revisado por el Designer Reviewer y aprobado por el CDO.
- Commits en Conventional Commits (`feat(<tema>): …`, `docs(…)`, `fix(…)`).
- Idioma: español rioplatense.
