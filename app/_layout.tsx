/**
 * Root Layout — App Corpo e Saúde
 * 
 * Carrega fontes Poppins, inicializa auth e configura navegação
 */

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme/colors';
import { useAuthStore } from '../src/stores/authStore';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  const initialize = useAuthStore((s) => s.initialize);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    initialize();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.root} onLayout={onLayoutRootView}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.dark.background },
              animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="workout-session" options={{ animation: Platform.OS === 'web' ? 'none' : 'slide_from_bottom' }} />
            <Stack.Screen name="exercise-detail" options={{ animation: Platform.OS === 'web' ? 'none' : 'slide_from_right' }} />
            <Stack.Screen name="muscle-exercises" options={{ animation: Platform.OS === 'web' ? 'none' : 'slide_from_right' }} />
            <Stack.Screen name="medidas-corporais" options={{ animation: Platform.OS === 'web' ? 'none' : 'slide_from_right' }} />
            <Stack.Screen name="fotos-evolucao" options={{ animation: Platform.OS === 'web' ? 'none' : 'slide_from_right' }} />
            <Stack.Screen name="minha-unidade" options={{ animation: Platform.OS === 'web' ? 'none' : 'slide_from_right' }} />
            <Stack.Screen name="privacidade" options={{ animation: Platform.OS === 'web' ? 'none' : 'slide_from_right' }} />
            <Stack.Screen name="ajuda-suporte" options={{ animation: Platform.OS === 'web' ? 'none' : 'slide_from_right' }} />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
});
