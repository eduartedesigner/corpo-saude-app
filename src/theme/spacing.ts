/**
 * Design System — Espaçamento & Layout
 * Academia Corpo e Saúde
 */

// Spacing scale (4px base)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,     // Pill shape — botões conforme PRD
} as const;

// Shadows (for elevation on dark theme)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  red: {
    shadowColor: '#E20000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// Icon sizes
export const iconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

// Hit slop for touchable areas
export const hitSlop = {
  sm: { top: 4, right: 4, bottom: 4, left: 4 },
  md: { top: 8, right: 8, bottom: 8, left: 8 },
  lg: { top: 12, right: 12, bottom: 12, left: 12 },
} as const;

// Animation durations (in ms)
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
} as const;

// Screen padding
export const layout = {
  screenPaddingH: spacing[5],  // 20px horizontal
  screenPaddingV: spacing[4],  // 16px vertical
  cardPadding: spacing[5],     // 20px
  sectionGap: spacing[8],      // 32px between sections
  itemGap: spacing[3],         // 12px between items
} as const;
