class H {
  tag: string;
  attr: any;
  children: (string | H)[] = [];
  constructor(tag: string, attr: any) {
    this.tag = tag;
    this.attr = attr;
  }

  toString(): string {
    const className = this.attr.className || '';
    const style = this.attr.style || '';
    const children = this.children.map((c) => c.toString()).join('');
    return `<${this.tag} class="${className}" style="${style}">${children}</${this.tag}>`;
  }
}

export const h = (tag: string, attr: any, children: (string | H)[]): H => {
  const element = new H(tag, attr);
  element.children = children;
  return element;
};
