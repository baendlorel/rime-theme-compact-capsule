import { readFileSync, writeFileSync } from 'node:fs';
import { COMPACT_CAPSULE_SCHEMAS } from './schemas';
import path from 'node:path';

const template = readFileSync(path.join(import.meta.dirname, 'demo.template.html'), 'utf-8');
const HUE_START = 345;
const HUE_GROUP_SIZE = 24;
const MUTED_SATURATION_THRESHOLD = 0.18;

type Hsl = {
  h: number;
  s: number;
  l: number;
};

type PreviewCard = {
  bg: string;
  color: string;
  name: string;
  hsl: Hsl;
  hueOrder: number;
  hueGroup: number;
};

export const demo = () => {
  const cards = COMPACT_CAPSULE_SCHEMAS.map((schema) => {
    const bg = toHex(schema.hilitedCandidateBackColor);
    const color = toHex(schema.hilitedCandidateTextColor);
    const hsl = hexToHsl(bg);
    const hueOrder = shiftHue(hsl.h);
    const hueGroup = hsl.s < MUTED_SATURATION_THRESHOLD ? 999 : Math.floor(hueOrder / HUE_GROUP_SIZE);

    return {
      bg,
      color,
      name: schema.name,
      hsl,
      hueOrder,
      hueGroup,
    };
  })
    .sort(compareColorSmoothly)
    .map((card) => renderCard(card))
    .join('\n');

  const html = template.replace('{{cards}}', cards);
  writeFileSync(path.join(import.meta.dirname, '..', 'assets', 'demo.html'), html);
};

function renderCard(card: PreviewCard) {
  return `<article class="theme-card">
  <div class="candidate-row" style="--hilite-bg:${card.bg}; --hilite-fg:${card.color};">
    <span class="candidate candidate-active">1 ${card.name}</span>
    <span class="candidate candidate-rest candidate-rest-first">2 候选词</span>
    <span class="candidate candidate-rest candidate-rest-last">3 演示</span>
  </div>
  <div class="theme-meta">
    <span class="theme-name"></span>
    <span class="theme-code">${card.bg.toUpperCase().replace(/CC$/g, '')}</span>
  </div>
</article>`;
}

function compareColorSmoothly(a: PreviewCard, b: PreviewCard) {
  if (a.hueGroup !== b.hueGroup) {
    return a.hueGroup - b.hueGroup;
  }

  if (a.hueGroup === 999 && b.hueGroup === 999) {
    if (a.hsl.l !== b.hsl.l) return b.hsl.l - a.hsl.l;
    if (a.hueOrder !== b.hueOrder) return a.hueOrder - b.hueOrder;
    return b.hsl.s - a.hsl.s;
  }

  if (a.hsl.l !== b.hsl.l) return b.hsl.l - a.hsl.l;
  if (a.hueOrder !== b.hueOrder) return a.hueOrder - b.hueOrder;
  return b.hsl.s - a.hsl.s;
}

function shiftHue(hue: number) {
  return (hue - HUE_START + 360) % 360;
}

function toHex(color: string) {
  const normalized = color.replace(/^0x/i, '').replace(/^#/, '');
  return `#${normalized}`;
}

function hexToHsl(hex: string) {
  hex = hex.replace('#', '').slice(0, 6);

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
