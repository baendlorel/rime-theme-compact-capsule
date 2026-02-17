import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import pkgInfo from '../package.json';
import { parse } from 'yaml';

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
  horizontal: boolean;
  inlinePreedit: boolean;
};

const template = readFileSync(path.join(import.meta.dirname, 'demo.template.html'), 'utf-8');

const DEFAULT_LAYOUT: LayoutConfig = {
  candidateRadius: 8,
  cornerRadius: 8,
  hilitePaddingX: 10,
  hilitePaddingY: 6,
};

const FALLBACK_REPOSITORY = 'baendlorel/rime-theme-compact-capsule';

export const demo = () => {
  const patchPath = path.join(import.meta.dirname, '..', 'dist', `patch_weasel.custom-${pkgInfo.version}.yaml`);
  const content = readFileSync(patchPath, 'utf-8');
  const parsed = parse(content) as { patch?: PatchMap } | null;
  const patch = toRecord(parsed?.patch);

  const layout = resolveLayout(toRecord(patch['style/layout']));
  const flags: RenderFlags = {
    horizontal: asBoolean(patch['style/horizontal'], true),
    inlinePreedit: asBoolean(patch['style/inline_preedit'], true),
  };
  const list = Object.entries(patch)
    .filter(([key]) => key.startsWith('preset_color_schemes/'))
    .map(([key, value]) => toThemeConfig(key, toRecord(value)));

  const cards = list.map((item) => renderCard(item, layout, flags)).join('\n');
  const repository = resolveRepository();
  const now = new Date().toLocaleString('zh-CN', {
    hour12: false,
  });

  const html = template
    .replace('{{cards}}', cards)
    .replace('{{schema_count}}', String(list.length))
    .replace('{{version}}', String(pkgInfo.version))
    .replace('{{latest_release_url}}', `https://github.com/${repository}/releases/latest`)
    .replace('{{release_url}}', `https://github.com/${repository}/releases`)
    .replace('{{candidate_layout}}', flags.horizontal ? '水平' : '垂直')
    .replace('{{inline_preedit}}', flags.inlinePreedit ? '开启' : '关闭')
    .replace('{{generated_at}}', escapeHtml(now));

  writeFileSync(path.join(import.meta.dirname, '..', 'assets', 'demo.html'), html);
};

function toThemeConfig(key: string, config: PatchMap): ThemeConfig {
  const id = key.slice('preset_color_schemes/'.length);
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

function renderCard(theme: ThemeConfig, layout: LayoutConfig, flags: RenderFlags): string {
  const style = [
    `--panel-text:${theme.textColor}`,
    `--candidate-text:${theme.candidateTextColor}`,
    `--comment-text:${theme.commentTextColor}`,
    `--label-text:${theme.labelColor}`,
    `--panel-bg:${theme.backColor}`,
    `--panel-border:${theme.borderColor}`,
    `--panel-shadow:${theme.shadowColor}`,
    `--hilited-text:${theme.hilitedTextColor}`,
    `--hilited-bg:${theme.hilitedBackColor}`,
    `--hilited-comment:${theme.hilitedCommentTextColor}`,
    `--hilited-label:${theme.hilitedLabelColor}`,
    `--active-text:${theme.hilitedCandidateTextColor}`,
    `--active-bg:${theme.hilitedCandidateBackColor}`,
    `--active-label:${theme.hilitedCandidateLabelColor}`,
    `--nextpage:${theme.nextpageColor}`,
    `--prevpage:${theme.prevpageColor}`,
    `--candidate-radius:${layout.candidateRadius}px`,
    `--corner-radius:${layout.cornerRadius}px`,
    `--hilite-padding-x:${layout.hilitePaddingX}px`,
    `--hilite-padding-y:${layout.hilitePaddingY}px`,
  ].join(';');

  const name = escapeHtml(theme.name);
  const id = escapeHtml(theme.id);
  const hlColor = theme.hilitedCandidateBackColor.toUpperCase();
  const backColor = theme.backColor.toUpperCase();
  const preedit = flags.inlinePreedit
    ? `<div class="preedit-row">
      <span class="preedit-label">拼</span>
      <span class="preedit-text">jin cou jiao nang</span>
      <span class="preedit-comment">紧凑胶囊</span>
    </div>`
    : '';
  const rowClass = flags.horizontal ? 'candidate-row' : 'candidate-row candidate-row-vertical';

  return `<article class="theme-card" style="${style}">
  <header class="theme-head">
    <h2 class="theme-name">${name}</h2>
    <code class="theme-id">${id}</code>
  </header>
  <div class="weasel-panel">
    ${preedit}
    <div class="${rowClass}">
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
  </div>
  <div class="theme-meta">
    <span class="meta-chip">面板 ${backColor}</span>
    <span class="meta-chip">高亮 ${hlColor}</span>
  </div>
</article>`;
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
