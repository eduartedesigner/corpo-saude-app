/**
 * Index — Entry point / Router
 * Redireciona baseado no estado de autenticação
 */

import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../src/stores/authStore';
import { colors } from '../src/theme/colors';

export default function Index() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useAuthStore((s) => s.hasCompletedOnboarding);

  // MODO TESTE — inicia no onboarding sem login
  return <Redirect href="/(onboarding)/intro" />;

  // Não autenticado → Tela de login
  // if (!isAuthenticated) {
  //   return <Redirect href="/(auth)/welcome" />;
  // }

  // Autenticado mas não completou onboarding MQV → Onboarding
  // if (!hasCompletedOnboarding) {
  //   return <Redirect href="/(onboarding)/intro" />;
  // }

  // Tudo ok → Home (Tabs)
  // return <Redirect href="/(tabs)/home" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark.background,
  },
});
