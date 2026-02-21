const clampAlpha = (alpha: number): number => Math.max(0, Math.min(1, alpha));

const BASE_LIGHT_SHADOW_ALPHA = 0.42;

export const LIGHT_SHADOW_INTENSITY = 1.15;
export const LIGHT_SHADOW_ALPHA = clampAlpha(BASE_LIGHT_SHADOW_ALPHA * LIGHT_SHADOW_INTENSITY);
export const DARK_SHADOW_ALPHA = 0.16;
export const DARK_SPECIAL_SHADOW_ALPHA = 0.22;

export const scaleShadowAlpha = (alpha: number, intensity = LIGHT_SHADOW_INTENSITY): number =>
  clampAlpha(alpha * intensity);
