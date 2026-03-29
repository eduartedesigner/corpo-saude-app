/**
 * Design System — Tipografia
 * Academia Corpo e Saúde
 * 
 * Poppins como fonte principal (PRD Seção 13)
 * Niveau Grotesk substituído por Poppins ExtraBold no mobile
 */

import { TextStyle } from 'react-native';

export const fontFamily = {
  light: 'Poppins_300Light',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extrabold: 'Poppins_800ExtraBold',
  black: 'Poppins_900Black',
} as const;

// Font sizes escala mobile (rem-like)
export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 40,
  '7xl': 44,
} as const;

export const lineHeight = {
  tight: 1.1,
  snug: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

// Pre-composed text styles
export const typography: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['5xl'],
    lineHeight: fontSize['5xl'] * lineHeight.tight,
  },
  h2: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize['4xl'],
    lineHeight: fontSize['4xl'] * lineHeight.snug,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    lineHeight: fontSize['3xl'] * lineHeight.snug,
  },
  h4: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['2xl'],
    lineHeight: fontSize['2xl'] * lineHeight.snug,
  },

  // Body
  bodyLg: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.relaxed,
  },
  bodyMd: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.relaxed,
  },
  bodySm: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  },

  // Labels / UI
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  labelSm: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
  },
  captionBold: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Buttons
  buttonLg: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonMd: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  buttonSm: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
  },

  // Numbers / Stats
  statLg: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['7xl'],
    lineHeight: fontSize['7xl'] * lineHeight.tight,
  },
  statMd: {
    fontFamily: fontFamily.extrabold,
    fontSize: fontSize['3xl'],
    lineHeight: fontSize['3xl'] * lineHeight.tight,
  },
  statSm: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.tight,
  },
} as const;

export type TypographyToken = keyof typeof typography;
