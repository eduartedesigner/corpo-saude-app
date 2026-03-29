/**
 * Constantes do App
 */

export const APP_CONFIG = {
  name: 'Corpo e Saúde',
  version: '1.0.0',
  description: 'App exclusivo da rede Academia Corpo e Saúde',
  
  // Business
  totalUnits: 35,
  totalStudents: 24500,
  
  // Subscription
  pricing: {
    monthly: 15.00,
    annual: 150.00,
    currency: 'BRL',
  },
  
  // MQV
  mqvTotalSteps: 7,
  mqvEstimatedMinutes: 5,
  
  // Exercise Library
  totalExercises: 200,
  
  // API
  aiModel: 'claude',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  SELECTED_UNIT: 'selected_unit',
  WORKOUT_CACHE: 'workout_cache',
  THEME_PREFERENCE: 'theme_preference',
} as const;

export const REGEX = {
  PHONE_BR: /^\(\d{2}\) \d{4,5}-\d{4}$/,
  PHONE_RAW: /^\+55\d{10,11}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
