class H {
  tag: string;
  attr: any;
  children: any[];
  constructor(tag: string, attr: any, children: any[] = []) {
    this.tag = tag;
    this.attr = attr;
    this.children = children;
  }

  toString(): string {
    const className = this.attr.className || '';
    const style = this.attr.style || '';
    const children = this.children
      .filter(Boolean)
      .map((c) => c?.toString() ?? String(c))
      .join('');
    return `<${this.tag} class="${className}" style="${style}">${children}</${this.tag}>`;
  }
}

export const h = (tag: string, attr: any, children: any[]) => new H(tag, attr, children);
