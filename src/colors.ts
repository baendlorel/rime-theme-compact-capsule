import assert from 'assert';

const to16 = (n: number): string => n.toString(16).padStart(2, '0');
const isColor = (n: number): boolean => n >= 0 && n <= 255 && Number.isInteger(n);

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
  const alpha = a ? to16(Math.round(a * 255)) : '';
  return `0x${alpha}${to16(b)}${to16(g)}${to16(r)}`;
};

export const rgb = (r: number, g: number, b: number): string => rgba(r, g, b, 1);

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
