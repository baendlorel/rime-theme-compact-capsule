import { writeFileSync } from 'node:fs';
import { COMPACT_CAPSULE_SCHEMAS } from './schemas';
import path from 'node:path';

const template = `<!DOCTYPE html>
<html lang="zh">

<head>
  <meta charset="UTF-8" />
  <title>Theme Preview</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #f4f4f4;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(5, 160px);
      gap: 16px;
    }

    .card {
      height: 100px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
    }

    .light-text {
      color: #ffffff;
    }

    .dark-text {
      color: #222222;
    }
  </style>
</head>

<body>

  <div class="grid">
    {{cards}}
  </div>

</body>

</html>`;

export const demo = () => {
  const toHash = (c: string) => c.replace('0x', '#');

  const cards = COMPACT_CAPSULE_SCHEMAS.map(
    (s) =>
      `<div class="card" style="background: ${toHash(s.hilitedCandidateBackColor)}; color:${toHash(s.hilitedCandidateTextColor)}">${s.name}</div>`,
  ).join('\n');
  const html = template.replace('{{cards}}', cards);
  writeFileSync(path.join(import.meta.dirname, '..', 'assets', 'demo.html'), html);
};
