type Primitive = string | number | boolean;
type Nullable = null | undefined;
type Child = Primitive | Nullable | H | Child[];
type Attributes = Record<string, unknown> | null | undefined;

class H {
  tag: string;
  attr: Attributes;
  children: Child[];

  constructor(tag: string, attr: Attributes = {}, children: Child[] = []) {
    this.tag = tag;
    this.attr = attr;
    this.children = children;
  }

  toString(): string {
    const attrs = stringifyAttrs(this.attr);
    const children = stringifyChildren(this.children);
    return `<${this.tag}${attrs}>${children}</${this.tag}>`;
  }
}

function stringifyChildren(children: Child[]): string {
  const flat = children.flatMap((item) => (Array.isArray(item) ? item : [item]));
  return flat
    .filter((item) => item !== null && item !== undefined && item !== false)
    .map((item) => {
      if (item instanceof H) {
        return item.toString();
      }
      return String(item);
    })
    .join('');
}

function stringifyAttrs(attr: Attributes): string {
  if (!attr || typeof attr !== 'object') {
    return '';
  }

  const parts: string[] = [];
  for (const [rawKey, rawValue] of Object.entries(attr)) {
    if (rawValue === null || rawValue === undefined || rawValue === false) {
      continue;
    }

    const key = rawKey === 'className' ? 'class' : rawKey;
    const value = key === 'style' ? toStyle(rawValue) : rawValue;

    if (value === '' || value === null || value === undefined || value === false) {
      continue;
    }

    if (value === true) {
      parts.push(key);
      continue;
    }

    parts.push(`${key}="${escapeAttr(String(value))}"`);
  }

  return parts.length ? ` ${parts.join(' ')}` : '';
}

function toStyle(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (!value || typeof value !== 'object') {
    return '';
  }

  const style = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => `${k}:${String(v)}`)
    .join(';');
  return style;
}

function escapeAttr(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export const h = (tag: string, attr: Attributes = {}, children: Child[] = []) => new H(tag, attr, children);
