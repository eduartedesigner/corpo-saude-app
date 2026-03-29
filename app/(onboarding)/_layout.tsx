/**
 * Onboarding Layout
 */

import { Stack } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.dark.background },
        animation: 'slide_from_right',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="intro" />
      <Stack.Screen name="mqv-step" />
      <Stack.Screen name="mqv-result" />
      <Stack.Screen name="subscription-wall" />
    </Stack>
  );
}
