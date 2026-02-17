import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

import pkgInfo from '../../package.json';

type PatchMap = Record<string, unknown>;

type ThemeConfig = {
  id: string;
  name: string;
  textColor: string;
  candidateTextColor: string;
  commentTextColor: string;
  labelColor: string;
  backColor: string;
  borderColor: string;
  shadowColor: string;
  hilitedTextColor: string;
  hilitedBackColor: string;
  hilitedCommentTextColor: string;
  hilitedLabelColor: string;
  hilitedCandidateTextColor: string;
  hilitedCandidateBackColor: string;
  hilitedCandidateLabelColor: string;
  nextpageColor: string;
  prevpageColor: string;
};

type LayoutConfig = {
  candidateRadius: number;
  cornerRadius: number;
  hilitePaddingX: number;
  hilitePaddingY: number;
};

type RenderFlags = {
  inlinePreedit: boolean;
};

type ThemePair = {
  id: string;
  light: ThemeConfig;
  dark: ThemeConfig;
};

const template = readFileSync(path.join(import.meta.dirname, '..', 'template', '_demo.html'), 'utf-8');

const DEFAULT_LAYOUT: LayoutConfig = {
  candidateRadius: 8,
  cornerRadius: 8,
  hilitePaddingX: 10,
  hilitePaddingY: 6,
};

const FALLBACK_REPOSITORY = 'baendlorel/rime-theme-compact-capsule';
const SCHEMA_PREFIX = 'preset_color_schemes/';

const COLOR_KEYS: Array<[string, keyof ThemeConfig]> = [
  ['panel-text', 'textColor'],
  ['candidate-text', 'candidateTextColor'],
  ['comment-text', 'commentTextColor'],
  ['label-text', 'labelColor'],
  ['panel-bg', 'backColor'],
  ['panel-border', 'borderColor'],
  ['panel-shadow', 'shadowColor'],
  ['hilited-text', 'hilitedTextColor'],
  ['hilited-bg', 'hilitedBackColor'],
  ['hilited-comment', 'hilitedCommentTextColor'],
  ['hilited-label', 'hilitedLabelColor'],
  ['active-text', 'hilitedCandidateTextColor'],
  ['active-bg', 'hilitedCandidateBackColor'],
  ['active-label', 'hilitedCandidateLabelColor'],
  ['nextpage', 'nextpageColor'],
  ['prevpage', 'prevpageColor'],
];

export const demo = () => {
  const patchPath = path.join(import.meta.dirname, '..', 'dist', `patch_weasel.custom-${pkgInfo.version}.yaml`);
  const content = readFileSync(patchPath, 'utf-8');
  const parsed = parse(content) as { patch?: PatchMap } | null;
  const patch = toRecord(parsed?.patch);

  const layout = resolveLayout(toRecord(patch['style/layout']));
  const flags: RenderFlags = {
    inlinePreedit: asBoolean(patch['style/inline_preedit'], true),
  };

  const allThemes = Object.entries(patch)
    .filter(([key]) => key.startsWith(SCHEMA_PREFIX))
    .map(([key, value]) => toThemeConfig(key, toRecord(value)));

  const customSourceIds = loadCustomSchemaIds();
  const tsThemes: ThemeConfig[] = [];
  const customThemes: ThemeConfig[] = [];

  for (const theme of allThemes) {
    const baseId = getThemeBaseId(theme);
    const isCustom = customSourceIds.has(theme.id) || customSourceIds.has(baseId);
    if (isCustom) {
      customThemes.push(theme);
    } else {
      tsThemes.push(theme);
    }
  }

  const { switchablePairs, singleThemes } = groupSwitchableThemes(tsThemes);

  const switchableCards = switchablePairs.length
    ? switchablePairs
        .sort(byPairName)
        .map((pair) => renderSwitchableCard(pair, layout, flags))
        .join('\n')
    : `<p class="empty">没有检测到可切换明暗的主题。</p>`;

  const singleTsBlock = singleThemes.length
    ? `<div class="sub-block">
    <h3>TS 单版本主题</h3>
    <div class="grid">${singleThemes
      .sort(byThemeName)
      .map((theme) => renderStaticCard(theme, layout, flags))
      .join('\n')}</div>
  </div>`
    : '';

  const customCards = customThemes.length
    ? customThemes
        .filter((theme) => !isDarkTheme(theme))
        .sort(byThemeName)
        .map((theme) => renderStaticCard(theme, layout, flags))
        .join('\n')
    : `<p class="empty">没有检测到手写 YAML 主题。</p>`;

  const repository = resolveRepository();
  const now = new Date().toLocaleString('zh-CN', { hour12: false });

  const html = fillTemplate(template, {
    switchable_cards: switchableCards,
    custom_cards: customCards,
    ts_single_block: singleTsBlock,
    schema_count: String(allThemes.length),
    version: String(pkgInfo.version),
    latest_release_url: `https://github.com/${repository}/releases`,
    release_url: `https://github.com/${repository}/releases`,
    switchable_count: String(switchablePairs.length),
    ts_generated_count: String(tsThemes.length),
    custom_yaml_count: String(customThemes.filter((theme) => !isDarkTheme(theme)).length),
    inline_preedit: flags.inlinePreedit ? '开启' : '关闭',
    generated_at: escapeHtml(now),
  });

  writeFileSync(path.join(import.meta.dirname, '..', 'assets', 'demo.html'), html);
};

function fillTemplate(input: string, values: Record<string, string>): string {
  let output = input;
  for (const [key, value] of Object.entries(values)) {
    output = output.replaceAll(`{{${key}}}`, value);
  }
  return output;
}

function loadCustomSchemaIds(): Set<string> {
  const ids = new Set<string>();
  try {
    const content = readFileSync(path.join(import.meta.dirname, 'special-schemas.yaml'), 'utf-8');
    const parsed = toRecord(parse(content));
    for (const key of Object.keys(parsed)) {
      if (key.startsWith(SCHEMA_PREFIX)) {
        ids.add(key.slice(SCHEMA_PREFIX.length));
      } else {
        ids.add(key);
      }
    }
  } catch {}
  return ids;
}

function groupSwitchableThemes(themes: ThemeConfig[]): { switchablePairs: ThemePair[]; singleThemes: ThemeConfig[] } {
  const map = new Map<string, { light?: ThemeConfig; dark?: ThemeConfig }>();
  for (const theme of themes) {
    const baseId = getThemeBaseId(theme);
    const current = map.get(baseId) || {};
    if (isDarkTheme(theme)) {
      current.dark = theme;
    } else {
      current.light = theme;
    }
    map.set(baseId, current);
  }

  const switchablePairs: ThemePair[] = [];
  const singleThemes: ThemeConfig[] = [];

  for (const [id, item] of map.entries()) {
    if (item.light && item.dark) {
      switchablePairs.push({ id, light: item.light, dark: item.dark });
      continue;
    }
    if (item.light) {
      singleThemes.push(item.light);
    } else if (item.dark) {
      singleThemes.push(item.dark);
    }
  }

  return { switchablePairs, singleThemes };
}

function toThemeConfig(key: string, config: PatchMap): ThemeConfig {
  const id = key.slice(SCHEMA_PREFIX.length);
  return {
    id,
    name: asString(config.name, id),
    textColor: asColor(config.text_color, '#15191DFF'),
    candidateTextColor: asColor(config.candidate_text_color, asColor(config.text_color, '#15191DFF')),
    commentTextColor: asColor(config.comment_text_color, '#6B7280CC'),
    labelColor: asColor(config.label_color, '#64748BCC'),
    backColor: asColor(config.back_color, '#FFFFFFCC'),
    borderColor: asColor(config.border_color, '#00000000'),
    shadowColor: asColor(config.shadow_color, '#1E293B24'),
    hilitedTextColor: asColor(config.hilited_text_color, asColor(config.text_color, '#15191DFF')),
    hilitedBackColor: asColor(config.hilited_back_color, '#EEF2F7CC'),
    hilitedCommentTextColor: asColor(
      config.hilited_comment_text_color,
      asColor(config.comment_text_color, '#6B7280CC'),
    ),
    hilitedLabelColor: asColor(config.hilited_label_color, asColor(config.label_color, '#94A3B8CC')),
    hilitedCandidateTextColor: asColor(
      config.hilited_candidate_text_color,
      asColor(config.candidate_text_color, '#F8F9FAFF'),
    ),
    hilitedCandidateBackColor: asColor(config.hilited_candidate_back_color, '#3B82F6CC'),
    hilitedCandidateLabelColor: asColor(
      config.hilited_candidate_label_color,
      asColor(config.hilited_label_color, '#CBD5E1CC'),
    ),
    nextpageColor: asColor(config.nextpage_color, asColor(config.hilited_candidate_back_color, '#64748BCC')),
    prevpageColor: asColor(config.prevpage_color, asColor(config.hilited_label_color, '#94A3B8CC')),
  };
}

function resolveLayout(config: PatchMap): LayoutConfig {
  return {
    candidateRadius: asNumber(config.candidate_radius, DEFAULT_LAYOUT.candidateRadius),
    cornerRadius: asNumber(config.corner_radius, DEFAULT_LAYOUT.cornerRadius),
    hilitePaddingX: asNumber(config.hilite_padding_x, DEFAULT_LAYOUT.hilitePaddingX),
    hilitePaddingY: asNumber(config.hilite_padding_y, DEFAULT_LAYOUT.hilitePaddingY),
  };
}

function renderSwitchableCard(pair: ThemePair, layout: LayoutConfig, flags: RenderFlags): string {
  const style = [...buildModeStyleVariables(pair.light, pair.dark), ...buildLayoutVariables(layout)].join(';');

  const name = escapeHtml(pair.light.name);
  const id = escapeHtml(pair.id);
  const lightColor = pair.light.hilitedCandidateBackColor.toUpperCase();
  const darkColor = pair.dark.hilitedCandidateBackColor.toUpperCase();

  return `<article class="theme-card switch-card" style="${style}">
  <header class="theme-head">
    <h3 class="theme-name">${name}</h3>
    <code class="theme-id">${id}</code>
  </header>
  ${renderPanel(flags)}
  <div class="theme-meta">
    <span class="meta-chip">亮 ${lightColor}</span>
    <span class="meta-chip">暗 ${darkColor}</span>
  </div>
</article>`;
}

function renderStaticCard(theme: ThemeConfig, layout: LayoutConfig, flags: RenderFlags): string {
  const style = [...buildSingleStyleVariables(theme), ...buildLayoutVariables(layout)].join(';');

  const name = escapeHtml(theme.name);
  const id = escapeHtml(theme.id);
  const hlColor = theme.hilitedCandidateBackColor.toUpperCase().replace(/CC$/g, '');
  const backColor = theme.backColor.toUpperCase().replace(/CC$/g, '');

  return `<article class="theme-card static-card" style="${style}">
  <header class="theme-head">
    <h3 class="theme-name">${name}</h3>
    <code class="theme-id">${id}</code>
  </header>
  ${renderPanel(flags)}
  <div class="theme-meta">
    <span class="meta-chip">面板 ${backColor}</span>
    <span class="meta-chip">高亮 ${hlColor}</span>
  </div>
</article>`;
}

function renderPanel(flags: RenderFlags): string {
  const preedit = flags.inlinePreedit
    ? `<div class="preedit-row">
      <span class="preedit-label">拼</span>
      <span class="preedit-text">jin cou jiao nang</span>
      <span class="preedit-comment">紧凑胶囊</span>
    </div>`
    : '';

  return `<div class="weasel-panel">
    ${preedit}
    <div class="candidate-row candidate-row-group">
      <span class="candidate candidate-active"><em>1</em><span>紧凑</span></span>
      <span class="candidate"><em>2</em><span>胶囊</span></span>
      <span class="candidate"><em>3</em><span>样式</span></span>
      <span class="candidate"><em>4</em><span>预览</span></span>
    </div>
    <div class="panel-footer">
      <span class="pager prev">◀</span>
      <span class="hint">CapsLock 切换中英</span>
      <span class="pager next">▶</span>
    </div>
  </div>`;
}

function buildModeStyleVariables(light: ThemeConfig, dark: ThemeConfig): string[] {
  const list: string[] = [];
  for (const [name, key] of COLOR_KEYS) {
    list.push(`--${name}-light:${light[key]}`);
    list.push(`--${name}-dark:${dark[key]}`);
  }
  return list;
}

function buildSingleStyleVariables(theme: ThemeConfig): string[] {
  const list: string[] = [];
  for (const [name, key] of COLOR_KEYS) {
    list.push(`--${name}:${theme[key]}`);
  }
  return list;
}

function buildLayoutVariables(layout: LayoutConfig): string[] {
  return [
    `--candidate-radius:${layout.candidateRadius}px`,
    `--corner-radius:${layout.cornerRadius}px`,
    `--hilite-padding-x:${layout.hilitePaddingX}px`,
    `--hilite-padding-y:${layout.hilitePaddingY}px`,
  ];
}

function getThemeBaseId(theme: ThemeConfig): string {
  if (isDarkTheme(theme) && theme.id.endsWith('_dark')) {
    return theme.id.slice(0, -5);
  }
  return theme.id;
}

function isDarkTheme(theme: ThemeConfig): boolean {
  return theme.name.endsWith('「暗」');
}

function byThemeName(a: ThemeConfig, b: ThemeConfig): number {
  return a.name.localeCompare(b.name, 'zh-CN');
}

function byPairName(a: ThemePair, b: ThemePair): number {
  return a.light.name.localeCompare(b.light.name, 'zh-CN');
}

function asString(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return fallback;
}

function asNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  return fallback;
}

function asColor(value: unknown, fallback: string): string {
  const normalized = normalizeColor(value);
  return normalized || fallback;
}

function normalizeColor(value: unknown): string {
  if (typeof value === 'string') {
    const input = value.trim();
    if (/^0x[0-9a-f]{6}([0-9a-f]{2})?$/i.test(input)) {
      const body = input.slice(2).toUpperCase();
      return `#${body.length === 6 ? `${body}FF` : body}`;
    }
    if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(input)) {
      const body = input.slice(1).toUpperCase();
      return `#${body.length === 6 ? `${body}FF` : body}`;
    }
    return '';
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const body = Math.trunc(value).toString(16).toUpperCase().padStart(8, '0');
    return `#${body.slice(-8)}`;
  }
  return '';
}

function toRecord(value: unknown): PatchMap {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as PatchMap;
  }
  return {};
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function resolveRepository(): string {
  const fromEnv = process.env.GITHUB_REPOSITORY;
  if (fromEnv && /^[^/]+\/[^/]+$/.test(fromEnv)) {
    return fromEnv;
  }
  try {
    const remote = execSync('git config --get remote.origin.url', {
      cwd: path.join(import.meta.dirname, '..'),
      encoding: 'utf-8',
    }).trim();
    const normalized = normalizeGitRemote(remote);
    if (normalized) {
      return normalized;
    }
  } catch {}
  return FALLBACK_REPOSITORY;
}

function normalizeGitRemote(remote: string): string {
  const ssh = remote.match(/^git@github\.com:(.+?)(?:\.git)?$/i);
  if (ssh?.[1]) {
    return ssh[1];
  }
  const https = remote.match(/^https?:\/\/github\.com\/(.+?)(?:\.git)?$/i);
  if (https?.[1]) {
    return https[1];
  }
  return '';
}
