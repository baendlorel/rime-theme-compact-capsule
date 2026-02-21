import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

import { COMPACT_CAPSULE_SCHEMAS, SCHEMA_NAMES } from './schemas';
import { schemaToYaml } from './schema-to-yaml';
import pkgInfo from '../package.json';
import { demo } from './demo';

type YamlRecord = Record<string, unknown>;

const DARK_THEME_COLORS = {
  text_color: '0xF8F9FAFF',
  candidate_text_color: '0xF8F9FAFF',
  back_color: '0x4C555DCC',
  hilited_text_color: '0xF8F9FAFF',
  hilited_back_color: '0x4C555DCC',
  hilited_label_color: '0x6C757D80',
};

const DARK_SPECIAL_SHADOW_ALPHA = 0.22;

const loadSpecialSchemas = () => {
  const content = readFileSync(join(import.meta.dirname, 'special-schemas.yaml'), 'utf-8');
  const parsed = toRecord(parse(content));
  const merged: YamlRecord = {};

  for (const [key, rawSchema] of Object.entries(parsed)) {
    const schema = toRecord(rawSchema);
    merged[key] = schema;

    const darkKey = key.endsWith('_dark') ? key : `${key}_dark`;
    if (key.endsWith('_dark') || Object.hasOwn(parsed, darkKey)) {
      continue;
    }
    merged[darkKey] = toDarkSpecialSchema(schema);
  }

  const yaml = renderSpecialSchemas(merged);
  const text = yaml
    .split('\n')
    .map((v) => '  ' + v.trimEnd())
    .join('\n');
  return text + '\n';
};

const toDarkSpecialSchema = (schema: YamlRecord): YamlRecord => {
  const name = String(schema.name || '');
  const darkShadowColor = toShadowColorWithAlpha(schema.shadow_color, DARK_SPECIAL_SHADOW_ALPHA);
  return {
    ...schema,
    name: name.endsWith('「暗」') ? name : `${name}「暗」`,
    ...(darkShadowColor ? { shadow_color: darkShadowColor } : {}),
    ...DARK_THEME_COLORS,
  };
};

const toRecord = (input: unknown): YamlRecord => {
  if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
    return input as YamlRecord;
  }
  return {};
};

const renderSpecialSchemas = (schemas: YamlRecord): string => {
  const lines: string[] = [];
  for (const [key, rawSchema] of Object.entries(schemas)) {
    const schema = toRecord(rawSchema);
    lines.push(`'${escapeSingleQuoted(key)}':`);
    for (const [field, value] of Object.entries(schema)) {
      lines.push(`  ${field}: ${toYamlValue(field, value)}`);
    }
    lines.push('');
  }
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines.join('\n');
};

const toYamlValue = (field: string, value: unknown): string => {
  if (field.endsWith('_color')) {
    const color = normalizeColorValue(value);
    if (color) {
      return color;
    }
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'string') {
    if (/^[A-Za-z0-9._/-]+$/.test(value)) {
      return value;
    }
    return `'${escapeSingleQuoted(value)}'`;
  }
  return `'${escapeSingleQuoted(String(value ?? ''))}'`;
};

const normalizeColorValue = (value: unknown): string => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const hex = Math.trunc(value).toString(16).toUpperCase().padStart(8, '0');
    return `0x${hex.slice(-8)}`;
  }
  if (typeof value === 'string') {
    const token = value.trim().toUpperCase();
    if (/^0X[0-9A-F]{8}$/.test(token)) {
      return token.replace(/^0X/, '0x');
    }
  }
  return '';
};

const toShadowColorWithAlpha = (value: unknown, alpha: number): string => {
  const color = normalizeColorValue(value);
  if (!color) {
    return '';
  }
  const clamped = Math.max(0, Math.min(1, alpha));
  const alphaHex = Math.round(clamped * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0');
  return `${color.slice(0, 8)}${alphaHex}`;
};

const escapeSingleQuoted = (value: string): string => value.replaceAll("'", "''");

const main = () => {
  const WEASEL_CUSTOM = `patch_weasel.custom-${pkgInfo.version}.yaml`;
  const DEFAULT_CUSTOM = `patch_default.custom-${pkgInfo.version}.yaml`;

  const dist = join(process.cwd(), 'dist');
  if (!existsSync(dist)) {
    mkdirSync(dist);
  }
  const list = COMPACT_CAPSULE_SCHEMAS.map((schema) => schemaToYaml(schema));
  console.log(`total schemas: ${list.length}`);
  console.log(`generating following schemas :\n  ${SCHEMA_NAMES.join('\n  ')}`);
  const schemas = 'patch:\n' + list.join('');
  const styles = `  'style/layout':
    candidate_radius: 8
    corner_radius: 8
    hilite_padding_x: 10
    hilite_padding_y: 6
    margin_x: 0
    margin_y: 0
    border_width: 0
    shadow_radius: 6
    shadow_offset_x: 2
    shadow_offset_y: 2
  'style/horizontal': true
  'style/inline_preedit': true
    `;
  const specialSchemas = loadSpecialSchemas();
  const weaselYaml = schemas + specialSchemas + styles;
  console.log(`saving ${WEASEL_CUSTOM}`);
  writeFileSync(join(dist, WEASEL_CUSTOM), weaselYaml);

  const defaultYaml = `patch:
  'ascii_composer/good_old_caps_lock': false
  'ascii_composer/switch_key':
    Caps_Lock: commit_code
    Control_L: noop
    Control_R: noop
    Shift_L: noop
    Shift_R: noop
  'menu/page_size': 6`;
  console.log(`saving ${DEFAULT_CUSTOM}`);
  writeFileSync(join(dist, DEFAULT_CUSTOM), defaultYaml);

  console.log(`generating demo.html`);
  demo();
  console.log(`finished`);
};

main();
