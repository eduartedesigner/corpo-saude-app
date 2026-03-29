/**
 * MQV Store — Zustand
 * Gerencia o estado do questionário MQV durante o onboarding
 */

import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { MqvAssessment } from '../types';

// Total de steps no questionário MQV
export const MQV_TOTAL_STEPS = 7;

interface MqvState {
  // State
  currentStep: number;
  totalSteps: number;
  answers: Partial<MqvAssessment>;
  isSubmitting: boolean;
  assessmentId: string | null;

  // Actions
  setAnswer: <K extends keyof MqvAssessment>(key: K, value: MqvAssessment[K]) => void;
  setAnswers: (data: Partial<MqvAssessment>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitAssessment: (userId: string, unitId: string) => Promise<{ error?: string }>;
  reset: () => void;
}

export const useMqvStore = create<MqvState>((set, get) => ({
  currentStep: 0,
  totalSteps: MQV_TOTAL_STEPS,
  answers: {},
  isSubmitting: false,
  assessmentId: null,

  setAnswer: (key, value) => {
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    }));
  },

  setAnswers: (data) => {
    set((state) => ({
      answers: { ...state.answers, ...data },
    }));
  },

  nextStep: () => {
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
    }));
  },

  prevStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    }));
  },

  goToStep: (step) => {
    set({ currentStep: Math.max(0, Math.min(step, MQV_TOTAL_STEPS - 1)) });
  },

  submitAssessment: async (userId, unitId) => {
    set({ isSubmitting: true });
    try {
      const { answers } = get();
      const { data, error } = await supabase
        .from('mqv_assessments')
        .insert({
          user_id: userId,
          unit_id: unitId,
          status: 'completed',
          completed_at: new Date().toISOString(),
          ...answers,
        })
        .select()
        .single();

      if (error) {
        set({ isSubmitting: false });
        return { error: error.message };
      }

      set({ assessmentId: data?.id, isSubmitting: false });
      return {};
    } catch (e) {
      set({ isSubmitting: false });
      return { error: 'Erro ao salvar avaliação. Tente novamente.' };
    }
  },

  reset: () => {
    set({
      currentStep: 0,
      answers: {},
      isSubmitting: false,
      assessmentId: null,
    });
  },
}));
