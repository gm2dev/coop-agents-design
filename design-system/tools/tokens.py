#!/usr/bin/env python3
"""Herramienta del design system (sin dependencias, Python 3.8+).

  python3 design-system/tools/tokens.py check       # valida JSON, referencias y contrastes (exit 1 si algo falla)
  python3 design-system/tools/tokens.py table       # imprime la tabla de contrastes en Markdown
  python3 design-system/tools/tokens.py css         # regenera design-system/tokens.css desde tokens.json

Contraste: fórmula de luminancia relativa de WCAG 2.x. Los ratios se TRUNCAN a 2 decimales (nunca se redondea
hacia arriba un par que no llega). Mínimos: 4.5 texto, 3 controles/foco/bordes (1.4.11).
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DS = os.path.dirname(HERE)
TOKENS = os.path.join(DS, "tokens.json")
CSS_OUT = os.path.join(DS, "tokens.css")

WHITE, NEAR_BLACK, BLACK = "#ffffff", "#111111", "#000000"


# ---------------------------------------------------------------- resolución
def load():
    with open(TOKENS, encoding="utf-8") as fh:
        return json.load(fh)


def flatten(node, prefix=""):
    out = {}
    for k, v in node.items():
        if k.startswith("$"):
            continue
        if isinstance(v, dict) and "$value" in v:
            out[prefix + k] = v
        elif isinstance(v, dict):
            out.update(flatten(v, prefix + k + "."))
    return out


REF = re.compile(r"^\{([^}]+)\}$")


def resolver(flat):
    cache = {}

    def res(path, stack=()):
        if path in cache:
            return cache[path]
        if path not in flat:
            raise KeyError("referencia inexistente: {%s}" % path)
        if path in stack:
            raise ValueError("referencia circular: " + " -> ".join(stack + (path,)))
        v = flat[path]["$value"]
        if isinstance(v, str):
            m = REF.match(v)
            if m:
                v = res(m.group(1), stack + (path,))
        cache[path] = v
        return v

    return res


# ---------------------------------------------------------------- color
def rgb(h):
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]


def lum(h):
    c = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in rgb(h)]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def contrast(a, b):
    x, y = sorted((lum(a), lum(b)), reverse=True)
    return (x + 0.05) / (y + 0.05)


def trunc(r):
    return int(r * 100) / 100


def mix(a, b, t):
    A, B = rgb(a), rgb(b)
    return "#" + "".join("%02x" % round((A[i] * (1 - t) + B[i] * t) * 255) for i in range(3))


def darken_until(c, ok):
    k, out = 0, c
    while not ok(out) and k < 1:
        k = round(k + 0.02, 2)
        out = mix(c, BLACK, k)
    return out


def derive_brand(primary, surfaces, surf_default):
    """Reglas de design-system/README.md §Marca del tenant. surfaces = todas las superficies donde aparece brand.text."""
    on = WHITE if contrast(WHITE, primary) >= contrast(NEAR_BLACK, primary) else NEAR_BLACK
    solid = primary
    if contrast(on, primary) < 4.5:
        solid = darken_until(primary, lambda c: contrast(c, WHITE) >= 4.5)
        on = WHITE
    hover = mix(solid, BLACK, 0.15) if on == WHITE else mix(solid, WHITE, 0.30)
    subtle = mix(primary, surf_default, 0.88)
    targets = list(surfaces) + [subtle]
    text = darken_until(primary, lambda c: min(contrast(c, s) for s in targets) >= 4.5)
    text_hover = mix(text, BLACK, 0.15)
    return {
        "primary": primary, "solid": solid, "on": on, "hover": hover, "subtle": subtle,
        "text": text, "text_hover": text_hover, "border": text,
        "adjusted": [n for n, a, b in (("solid", solid, primary), ("text", text, primary)) if a != b],
    }


# ---------------------------------------------------------------- pares
# (frente, fondo, uso, mínimo)
PAIRS = [
    ("color.text.default", "color.surface.default", "texto", 4.5),
    ("color.text.default", "color.surface.subtle", "texto sobre fondo de página (= canvas)", 4.5),
    ("color.text.default", "color.surface.sunken", "texto en zona hundida / chip neutro", 4.5),
    ("color.text.default", "color.surface.selected", "texto en opción seleccionada", 4.5),
    ("color.text.muted", "color.surface.default", "texto secundario", 4.5),
    ("color.text.muted", "color.surface.subtle", "texto secundario", 4.5),
    ("color.text.muted", "color.surface.sunken", "texto secundario en zona hundida", 4.5),
    ("color.text.muted", "color.surface.disabled", "control deshabilitado (exento 1.4.3, se mantiene ≥ 4.5)", 4.5),
    ("color.text.on-action", "color.action.primary", "texto de botón primario", 4.5),
    ("color.text.on-action", "color.action.primary-hover", "botón primario en hover", 4.5),
    ("color.text.on-action", "color.action.danger", "botón destructivo", 4.5),
    ("color.text.on-action", "color.action.danger-hover", "botón destructivo en hover", 4.5),
    ("color.text.link", "color.surface.default", "links", 4.5),
    ("color.text.link", "color.surface.subtle", "links sobre fondo de página", 4.5),
    ("color.text.link", "color.platform.accent-subtle", "acento sobre su tinte (nav activa, hero)", 4.5),
    ("color.text.link-hover", "color.surface.default", "link en hover", 4.5),
    ("color.text.link-hover", "color.surface.subtle", "link en hover", 4.5),
    ("color.text.selected", "color.surface.selected", "opción seleccionada", 4.5),
    ("color.action.primary", "color.surface.default", "borde/texto de botón secundario", 4.5),
    ("color.action.primary", "color.surface.subtle", "borde/texto de botón secundario", 4.5),
    ("color.border.strong", "color.surface.default", "borde de inputs y controles", 3),
    ("color.border.strong", "color.surface.subtle", "borde de inputs y controles", 3),
    ("color.border.strong", "color.surface.sunken", "borde de controles en zona hundida", 3),
    ("color.border.selected", "color.surface.default", "borde de seleccionado", 3),
    ("color.border.selected", "color.surface.selected", "borde de seleccionado sobre su fondo", 3),
    ("color.focus.ring", "color.surface.default", "indicador de foco", 3),
    ("color.focus.ring", "color.surface.subtle", "indicador de foco", 3),
    ("color.focus.ring", "color.surface.sunken", "indicador de foco", 3),
    ("color.focus.ring", "color.surface.selected", "indicador de foco", 3),
    ("color.focus.ring", "color.platform.accent-subtle", "foco sobre hero / nav activa", 3),
    ("color.feedback.danger.text", "color.feedback.danger.bg", "error", 4.5),
    ("color.feedback.danger.border", "color.surface.default", "borde de campo con error", 3),
    ("color.feedback.danger.border", "color.feedback.danger.bg", "borde de aviso de error", 3),
    ("color.feedback.success.text", "color.feedback.success.bg", "éxito", 4.5),
    ("color.feedback.success.border", "color.feedback.success.bg", "borde de aviso de éxito", 3),
    ("color.feedback.warning.text", "color.feedback.warning.bg", "advertencia", 4.5),
    ("color.feedback.warning.border", "color.feedback.warning.bg", "borde de aviso de advertencia", 3),
    ("color.feedback.info.text", "color.feedback.info.bg", "información", 4.5),
    ("color.feedback.info.border", "color.feedback.info.bg", "borde de aviso de información", 3),
    ("color.text.default", "color.feedback.warning.bg", "texto en badge de aviso", 4.5),
    ("color.sidebar.text", "color.sidebar.bg", "ítems de la barra lateral", 4.5),
    ("color.sidebar.muted", "color.sidebar.bg", "texto secundario de la barra lateral", 4.5),
    ("color.sidebar.text", "color.sidebar.item-hover", "ítem en hover", 4.5),
    ("color.sidebar.item-active-text", "color.sidebar.item-active-bg", "ítem activo", 4.5),
    ("color.sidebar.indicator", "color.sidebar.item-active-bg", "marca del ítem activo", 3),
    ("color.sidebar.chip-text", "color.sidebar.chip-bg", "chip del negocio", 4.5),
    ("color.sidebar.tag-border", "color.sidebar.bg", "borde de etiqueta «provisorio»", 3),
    ("color.sidebar.focus-ring", "color.sidebar.bg", "foco en la barra lateral", 3),
    ("color.sidebar.focus-ring", "color.sidebar.item-active-bg", "foco en ítem activo", 3),
    ("brand.on-primary", "brand.solid", "texto sobre marca (default)", 4.5),
    ("brand.on-primary", "brand.primary-hover", "botón de marca en hover (default)", 4.5),
    ("brand.text", "color.surface.default", "link de marca (default)", 4.5),
    ("brand.text", "color.surface.subtle", "link de marca (default)", 4.5),
    ("brand.text", "brand.subtle", "check «elegido» (default)", 4.5),
    ("brand.text-hover", "color.surface.default", "link de marca en hover (default)", 4.5),
    ("brand.text-hover", "color.surface.subtle", "link de marca en hover (default)", 4.5),
    ("brand.border", "color.surface.default", "borde de seleccionado de marca (default)", 3),
]

# Negocios de ejemplo (ficticios) y casos extremos para probar la derivación.
TENANTS = [
    ("Esmalte Studio", "#f7a8c8"), ("Barbería Don Faro", "#f5c400"), ("Pelos & Patas", "#3fb6e0"),
    ("Peluquería Nativa", "#6d2e8c"), ("Preset fucsia", "#d6337a"), ("Preset negro", "#121212"),
    ("Preset verde", "#2fa36b"), ("Preset coral", "#e07a5f"), ("Gris medio", "#8a8a8a"),
    ("Amarillo puro", "#ffff00"), ("Blanco (extremo)", "#ffffff"), ("Crema = canvas (extremo)", "#f6f2eb"),
]


def check_system(flat, res):
    rows, fails = [], []
    for fg, bg, use, minimum in PAIRS:
        a, b = res(fg), res(bg)
        r = trunc(contrast(a, b))
        ok = r >= minimum
        rows.append((fg, bg, a, b, r, use, minimum, ok))
        if not ok:
            fails.append("%s / %s = %.2f < %s" % (fg, bg, r, minimum))
    return rows, fails


def check_tenants(res):
    sd, ss = res("color.surface.default"), res("color.surface.subtle")
    rows, fails = [], []
    for name, p in TENANTS:
        d = derive_brand(p, [sd, ss], sd)
        m = {
            "on/solid": contrast(d["on"], d["solid"]),
            "on/hover": contrast(d["on"], d["hover"]),
            "text/default": contrast(d["text"], sd),
            "text/subtle": contrast(d["text"], ss),
            "text/brand.subtle": contrast(d["text"], d["subtle"]),
            "text-hover/default": contrast(d["text_hover"], sd),
            "text-hover/subtle": contrast(d["text_hover"], ss),
        }
        m = {k: trunc(v) for k, v in m.items()}
        for k, v in m.items():
            if v < 4.5:
                fails.append("tenant %s (%s): %s = %.2f < 4.5" % (name, p, k, v))
        if m["on/hover"] < m["on/solid"]:
            fails.append("tenant %s: el hover reduce el contraste" % name)
        rows.append((name, d, m))
    return rows, fails


def check_structure(T, flat, res):
    fails = []
    for p in flat:
        try:
            res(p)
        except Exception as e:  # noqa
            fails.append("%s: %s" % (p, e))
    for p, t in flat.items():
        if "$type" not in t:
            fails.append("%s sin $type" % p)
        ext = t.get("$extensions", {}).get("com.coop-agents.tenant", {})
        if ext.get("overridable") and p not in ("brand.primary", "brand.logo", "brand.name"):
            fails.append("%s marcado como sobreescribible por el tenant (solo brand.primary/logo/name)" % p)
    for p in ("brand.primary", "brand.logo", "brand.name"):
        if not flat.get(p, {}).get("$extensions", {}).get("com.coop-agents.tenant", {}).get("overridable"):
            fails.append("%s debería ser overridable" % p)
    for p, t in flat.items():
        media = t.get("$extensions", {}).get("com.coop-agents.media", {})
        if media.get("replaces") and isinstance(t["$value"], str) and REF.match(t["$value"]):
            fails.append("%s: con media.replaces su valor debe ser literal (evita ciclo de var() en tokens.css)" % p)
    for p in ("density.control-height-touch", "density.row-height-touch", "density.target-touch"):
        v = res(p)
        if int(str(v).replace("px", "")) < 44:
            fails.append("%s = %s < 44px" % (p, v))
    return fails


# ---------------------------------------------------------------- CSS
CSS_SKIP = {"icon.style"}  # descriptivos, no son valores CSS


def css_value(path, v, typ):
    if path in CSS_SKIP:
        return None
    if isinstance(v, list):
        return ", ".join('"%s"' % x if " " in x else x for x in v)
    if typ == "string" and v == "":
        return None  # brand.logo / brand.name: los pone el tenant
    return str(v)


def css_name(path):
    return "--" + path.replace(".", "-")


def build_css(T):
    flat = flatten(T)
    lines = [
        "/* GENERADO desde design-system/tokens.json con design-system/tools/tokens.py css — NO editar a mano.",
        "   Design system v1 «Sereno». Nombre de variable = ruta del token con «-» (color.text.default -> --color-text-default).",
        "   Las referencias se emiten como var(): sobreescribir --brand-primary (u otro brand.* derivado) en un contenedor",
        "   aplica la marca del tenant solo ahí. Los tokens $deprecated (alias v0) también se emiten. */",
        ":root {",
    ]
    touch = []
    for p, t in flat.items():
        v = t["$value"]
        m = REF.match(v) if isinstance(v, str) else None
        if m:
            val = "var(%s)" % css_name(m.group(1))
        else:
            val = css_value(p, v, t.get("$type"))
        if val is None:
            continue
        lines.append("  %s: %s;" % (css_name(p), val))
        media = t.get("$extensions", {}).get("com.coop-agents.media", {})
        if media.get("replaces"):
            touch.append((media["query"], css_name(media["replaces"]), css_name(p)))
    lines.append("}")
    if touch:
        q = touch[0][0]
        lines.append("/* density.*-touch: en mobile/táctil (< breakpoint.lg o puntero grueso) los altos usan los valores -touch (≥ 44 px). */")
        lines.append("@media %s {" % q)
        lines.append("  :root { " + " ".join("%s: var(%s);" % (dst, src) for _, dst, src in touch) + " }")
        lines.append("}")
    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------- main
def main(argv):
    cmd = argv[1] if len(argv) > 1 else "check"
    T = load()
    flat = flatten(T)
    res = resolver(flat)
    if cmd == "css":
        with open(CSS_OUT, "w", encoding="utf-8") as fh:
            fh.write(build_css(T))
        print("escrito", os.path.relpath(CSS_OUT, os.path.dirname(DS)))
        return 0
    srows, sf = check_system(flat, res)
    trows, tf = check_tenants(res)
    stf = check_structure(T, flat, res)
    if cmd == "table":
        print("| Par | Colores | Ratio | Uso | Mín. |")
        print("|---|---|---|---|---|")
        for fg, bg, a, b, r, use, mn, ok in srows:
            print("| `%s` / `%s` | %s / %s | %.2f:1%s | %s | %s |" % (
                fg.replace("color.", ""), bg.replace("color.", ""), a, b, r, "" if ok else " ❌", use, mn))
        print()
        print("| Negocio | primary | solid | on | hover | text | text-hover | subtle | on/solid | on/hover | text peor (default·subtle·brand.subtle) | text-hover peor | Ajuste |")
        print("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
        for name, d, m in trows:
            worst = min(m["text/default"], m["text/subtle"], m["text/brand.subtle"])
            worst_h = min(m["text-hover/default"], m["text-hover/subtle"])
            print("| %s | `%s` | `%s` | %s | `%s` | `%s` | `%s` | `%s` | %.2f | %.2f | %.2f | %.2f | %s |" % (
                name, d["primary"], d["solid"], "blanco" if d["on"] == WHITE else "casi negro", d["hover"],
                d["text"], d["text_hover"], d["subtle"], m["on/solid"], m["on/hover"], worst, worst_h,
                ", ".join(d["adjusted"]) + " + aviso" if d["adjusted"] else "no"))
        return 0
    fails = stf + sf + tf
    print("tokens: %d · pares de sistema: %d · tenants de prueba: %d (× %d medidas)" % (
        len(flat), len(srows), len(trows), len(trows[0][2])))
    print("peor par de texto (4.5): %.2f · peor par no textual (3): %.2f" % (
        min(x[4] for x in srows if x[6] == 4.5),
        min(x[4] for x in srows if x[6] == 3)))
    if fails:
        print("FALLAS:")
        for f in fails:
            print("  -", f)
        return 1
    print("OK: todos los pares cumplen WCAG 2.2 AA")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
