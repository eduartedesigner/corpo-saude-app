/**
 * Design System — Paleta de Cores
 * Academia Corpo e Saúde
 * 
 * Baseado no PRD v1.0 — Seção 13: Design System Tokens Visuais
 */

export const colors = {
  // Brand Reds
  brand: {
    red: '#E20000',        // CTAs, botões, header, ícones circulares
    darkRed: '#530000',    // Headings H1–H3, textos de marca
    accentRed: '#C10000',  // Spans de destaque inline
    inlineRed: '#C90020',  // Destaques em títulos ("Corpo e Saúde")
  },

  // App Dark Theme
  dark: {
    background: '#0A0A0A',   // Background principal do app (dark theme)
    surface: '#1A1A1A',      // Cards, modais, superfícies elevadas
    surfaceLight: '#242424', // Inputs, campos de formulário
    surfaceHover: '#2A2A2A', // Hover states
    border: '#333333',       // Bordas sutis
    borderLight: '#444444',  // Bordas mais visíveis
  },

  // Grayscale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EBEBEB',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',           // Texto principal no dark theme
    secondary: 'rgba(255,255,255,0.7)',  // Texto secundário
    tertiary: 'rgba(255,255,255,0.45)',  // Texto terciário/placeholder
    muted: 'rgba(255,255,255,0.35)',     // Texto mais sutil
    inverse: '#0A0A0A',          // Texto sobre fundos claros
    onRed: '#FFFFFF',            // Texto sobre fundo vermelho
  },

  // Semantic Colors
  semantic: {
    success: '#27AE60',
    successLight: '#D4EDDA',
    warning: '#E67E22',
    warningLight: '#FFEAA7',
    error: '#E74C3C',
    errorLight: '#FDD',
    info: '#0055CC',
    infoLight: '#F0F4FF',
  },

  // Status Colors (para tags, badges)
  status: {
    active: '#27AE60',
    inactive: '#E74C3C',
    pending: '#E67E22',
    premium: '#7B00C2',
  },

  // Gradient
  gradient: {
    redToAccent: ['#E20000', '#C200A6'],
    darkToRed: ['#0A0A0A', '#530000'],
    redVertical: ['#E20000', '#C10000'],
  },

  // Overlay
  overlay: {
    dark: 'rgba(0,0,0,0.36)',
    darker: 'rgba(0,0,0,0.6)',
    light: 'rgba(255,255,255,0.05)',
    red: 'rgba(226,0,0,0.15)',
  },

  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorToken = typeof colors;
