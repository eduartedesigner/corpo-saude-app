/**
 * Types — Barrel export
 */

export * from './database';

// Navigation types
export type RootStackParamList = {
  '(auth)': undefined;
  '(onboarding)': undefined;
  '(tabs)': undefined;
};

export type AuthStackParamList = {
  welcome: undefined;
  login: undefined;
  'verify-otp': { phone: string };
};

export type OnboardingStackParamList = {
  intro: undefined;
  'mqv-step': { step: number };
  'mqv-result': undefined;
  'subscription-wall': undefined;
};

export type TabsParamList = {
  home: undefined;
  workouts: undefined;
  progress: undefined;
  profile: undefined;
};
