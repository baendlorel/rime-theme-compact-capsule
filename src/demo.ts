import { readFileSync, writeFileSync } from 'node:fs';
import { COMPACT_CAPSULE_SCHEMAS } from './schemas';
import path from 'node:path';

const template = readFileSync(path.join(import.meta.dirname, 'demo.template.html'), 'utf-8');

export const demo = () => {
  const toHash = (c: string) => c.replace('0x', '#');

  const cards = COMPACT_CAPSULE_SCHEMAS.map((s) => ({
    bg: toHash(s.hilitedCandidateBackColor),
    color: toHash(s.hilitedCandidateTextColor),
    name: s.name,
    hsl: hexToHsl(toHash(s.hilitedCandidateBackColor)),
  }))
    .sort((a, b) => compareHexColor(a.bg, b.bg))
    .map((s) => `<div class="card" style="background: ${toHash(s.bg)}; color:${toHash(s.color)}">${s.name}</div>`)
    .join('\n');
  const html = template.replace('{{cards}}', cards);
  writeFileSync(path.join(import.meta.dirname, '..', 'assets', 'demo.html'), html);
};

function compareHexColor(a: string, b: string) {
  const c1 = hexToHsl(a);
  const c2 = hexToHsl(b);

  if (c1.h !== c2.h) return c1.h - c2.h;
  if (c1.l !== c2.l) return c1.l - c2.l;
  return c1.s - c2.s;
}

function hexToHsl(hex: string) {
  hex = hex.replace('#', '');

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  return { h, s, l };
}
