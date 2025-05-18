import assert from 'assert';

const to16 = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
const isColor = (n: number) => n >= 0 && n <= 255 && Number.isInteger(n);

/**
 * 转化为小狼毫默认的abgr颜色
 * @param r
 * @param g
 * @param b
 * @param a
 * @returns abgr颜色
 */
export const rgba = (r: number, g: number, b: number, a: number): string => {
  assert.equal(isColor(r), true, `r must be an integer. r = ${r}`);
  assert.equal(isColor(g), true, `g must be an integer. g = ${g}`);
  assert.equal(isColor(b), true, `b must be an integer. b = ${b}`);
  assert.equal(0 <= a && a <= 1, true, `a must be in 0~1. a = ${a}`);
  const alpha = to16(Math.round(a * 255));
  return `0x${to16(r)}${to16(g)}${to16(b)}${alpha}`;
};

export const rgb = (r: number, g: number, b: number): string => rgba(r, g, b, 1);

export const setAlpha = (color: string, alpha: number): string => {
  assert.equal(0 <= alpha && alpha <= 1, true, `alpha must be in 0~1. alpha = ${alpha}`);
  const [r, g, b] =
    color
      .match(/0x([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/)
      ?.slice(1)
      .map((v) => parseInt(v, 16)) || [];
  assert.equal(isColor(r), true, `r must be an integer. r = ${r}`);
  assert.equal(isColor(g), true, `g must be an integer. g = ${g}`);
  assert.equal(isColor(b), true, `b must be an integer. b = ${b}`);
  return rgba(r, g, b, alpha);
};

// 来自bootstrap的颜色
export const BS = {
  PRIMARY: rgb(13, 110, 253),
  SECONDARY: rgb(108, 117, 125),
  SUCCESS: rgb(25, 135, 84),
  INFO: rgb(23, 162, 184),
  WARNING: rgb(255, 193, 7),
  DANGER: rgb(220, 53, 69),
  LIGHT: rgb(248, 249, 250),
  DARK: rgb(21, 25, 29),
  WHITE: rgb(255, 255, 255),
  BLACK: rgb(0, 0, 0),
  GRAY: rgb(108, 117, 125),
  GRAY_DARK: rgb(52, 58, 64),
  LIGHT_SEMI_TRANS: rgba(248, 249, 250, 0.5),
  GRAY_SEMI_TRANS: rgba(108, 117, 125, 0.5),
  GRAY_LIGHT: rgb(248, 249, 250),
  GRAY_100: rgb(255, 255, 255),
  GRAY_200: rgb(233, 236, 239),
  GRAY_300: rgb(220, 225, 229),
  GRAY_400: rgb(207, 212, 218),
  GRAY_500: rgb(188, 189, 192),
  GRAY_600: rgb(163, 168, 173),
  GRAY_700: rgb(108, 117, 125),
  GRAY_800: rgb(73, 80, 87),
  GRAY_900: rgb(52, 58, 64),
};
