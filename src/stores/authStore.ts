/**
 * Auth Store — Zustand
 * Gerencia estado de autenticação e perfil do usuário
 */

import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Profile, UserRole } from '../types';

interface AuthState {
  // State
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  profile: Profile | null;
  hasCompletedOnboarding: boolean;
  hasActiveSubscription: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signInWithOtp: (phone: string) => Promise<{ error?: string }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  setOnboardingComplete: () => void;
  setSubscriptionActive: (active: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  isLoading: true,
  isAuthenticated: false,
  userId: null,
  profile: null,
  hasCompletedOnboarding: false,
  hasActiveSubscription: false,

  // Initialize — check session on app start
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        // Check if onboarding (MQV) is completed
        const { data: mqv } = await supabase
          .from('mqv_assessments')
          .select('status')
          .eq('user_id', session.user.id)
          .eq('status', 'completed')
          .maybeSingle();

        // Check subscription
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle();

        set({
          isAuthenticated: true,
          userId: session.user.id,
          profile: profile || null,
          hasCompletedOnboarding: !!mqv,
          hasActiveSubscription: !!subscription,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialize error:', error);
      set({ isLoading: false });
    }
  },

  // Sign in with email + password
  signInWithEmail: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: 'Email ou senha incorretos.' };
      if (data.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.session.user.id)
          .maybeSingle();
        const { data: mqv } = await supabase
          .from('mqv_assessments')
          .select('status')
          .eq('user_id', data.session.user.id)
          .eq('status', 'completed')
          .maybeSingle();
        set({
          isAuthenticated: true,
          isLoading: false,
          userId: data.session.user.id,
          profile: profile || null,
          hasCompletedOnboarding: !!mqv,
        });
      } else {
        set({ isLoading: false });
      }
      return {};
    } catch (e) {
      set({ isLoading: false });
      return { error: 'Erro ao entrar. Tente novamente.' };
    }
  },

  // Sign up with email + password
  signUpWithEmail: async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) return { error: error.message };
      if (data.session?.user) {
        set({
          isAuthenticated: true,
          userId: data.session.user.id,
          profile: null,
          hasCompletedOnboarding: false,
          isLoading: false,
        });
      } else {
        return { error: 'Verifique seu email para confirmar o cadastro.' };
      }
      return {};
    } catch (e) {
      return { error: 'Erro ao criar conta. Tente novamente.' };
    }
  },

  // Send OTP via phone
  signInWithOtp: async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      if (error) return { error: error.message };
      return {};
    } catch (e) {
      return { error: 'Erro ao enviar código. Tente novamente.' };
    }
  },

  // Verify OTP token
  verifyOtp: async (phone: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) return { error: error.message };

      if (data.session?.user) {
        // Check/create profile
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();

        set({
          isAuthenticated: true,
          userId: data.session.user.id,
          profile: existingProfile || null,
        });
      }

      return {};
    } catch (e) {
      return { error: 'Código inválido. Tente novamente.' };
    }
  },

  // Sign out
  signOut: async () => {
    await supabase.auth.signOut();
    set({
      isAuthenticated: false,
      userId: null,
      profile: null,
      hasCompletedOnboarding: false,
      hasActiveSubscription: false,
    });
  },

  // Update profile
  updateProfile: async (data: Partial<Profile>) => {
    const { userId } = get();
    if (!userId) return;

    const { data: updated, error } = await supabase
      .from('profiles')
      .upsert({ ...data, user_id: userId, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (!error && updated) {
      set({ profile: updated });
    }
  },

  setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
  setSubscriptionActive: (active) => set({ hasActiveSubscription: active }),
}));
