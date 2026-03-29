/**
 * Theme — Barrel export
 * Academia Corpo e Saúde
 */

export { colors } from './colors';
export type { ColorToken } from './colors';

export { fontFamily, fontSize, lineHeight, typography } from './typography';
export type { TypographyToken } from './typography';

export {
  spacing,
  borderRadius,
  shadows,
  iconSize,
  hitSlop,
  animation,
  layout,
} from './spacing';

// Convenient theme object
import { colors } from './colors';
import { fontFamily, fontSize, lineHeight, typography } from './typography';
import { spacing, borderRadius, shadows, iconSize, hitSlop, animation, layout } from './spacing';

export const theme = {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  typography,
  spacing,
  borderRadius,
  shadows,
  iconSize,
  hitSlop,
  animation,
  layout,
} as const;

export type Theme = typeof theme;
