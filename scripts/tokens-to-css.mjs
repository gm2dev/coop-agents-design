#!/usr/bin/env node
// Genera prototypes/shared/tokens.css a partir de design-system/tokens.json.
// Cada token se exporta como variable CSS con su ruta completa unida por guiones
// (color.feedback.danger.text → --color-feedback-danger-text) y las referencias
// ({color.red.700}) se resuelven al valor final.
//
// Uso (desde la raíz del repo, sin dependencias):
//   node scripts/tokens-to-css.mjs          # escribe prototypes/shared/tokens.css
//   node scripts/tokens-to-css.mjs --check  # sale con código 1 si el archivo no coincide
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'design-system/tokens.json');
const out = join(root, 'prototypes/shared/tokens.css');
const tokens = JSON.parse(readFileSync(src, 'utf8'));

const flat = new Map();
(function walk(node, path) {
  if (node && typeof node === 'object' && '$value' in node) {
    flat.set(path.join('.'), node);
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...path, k]);
  }
})(tokens, []);

function resolve(value, seen = []) {
  if (typeof value === 'string') {
    const m = value.match(/^\{(.+)\}$/);
    if (m) {
      if (seen.includes(m[1])) throw new Error(`Referencia circular: ${m[1]}`);
      const ref = flat.get(m[1]);
      if (!ref) throw new Error(`Referencia inexistente: ${m[1]}`);
      return resolve(ref.$value, [...seen, m[1]]);
    }
    return value;
  }
  // fontFamily: se citan solo los nombres con espacios; system-ui y sans-serif son palabras clave.
  if (Array.isArray(value)) return value.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
  return String(value);
}

const lines = [
  '/*',
  ' * ARCHIVO GENERADO — no editar a mano.',
  ' * Espejo de design-system/tokens.json: cada variable sigue la ruta exacta del token',
  ' * (color.feedback.danger.text → --color-feedback-danger-text).',
  ' * Regenerar desde la raíz del repo: node scripts/tokens-to-css.mjs',
  ' * Verificar que coincide:           node scripts/tokens-to-css.mjs --check',
  ' * breakpoint.* se exporta como referencia: las media queries no aceptan variables.',
  ' */',
  ':root {',
];
let group = '';
for (const [path, node] of flat) {
  const g = path.split('.').slice(0, 2).join('.');
  if (g !== group && group) lines.push('');
  group = g;
  const value = resolve(node.$value);
  const ref = typeof node.$value === 'string' && node.$value.startsWith('{') ? ` /* ${node.$value.slice(1, -1)} */` : '';
  lines.push(`  --${path.replaceAll('.', '-')}: ${value};${ref}`);
}
lines.push('}', '');
const css = lines.join('\n');

if (process.argv.includes('--check')) {
  const current = readFileSync(out, 'utf8');
  if (current !== css) {
    console.error('prototypes/shared/tokens.css no coincide con design-system/tokens.json. Corré: node scripts/tokens-to-css.mjs');
    process.exit(1);
  }
  console.log(`OK: tokens.css coincide con tokens.json (${flat.size} tokens).`);
} else {
  writeFileSync(out, css);
  console.log(`Escrito prototypes/shared/tokens.css (${flat.size} tokens).`);
}
