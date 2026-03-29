/**
 * ProgressBar Component
 * Usado no onboarding MQV para indicar progresso
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { borderRadius, animation } from '../../theme/spacing';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  showGlow?: boolean;
}

export function ProgressBar({ progress, height = 4, showGlow = true }: ProgressBarProps) {
  const animatedWidth = useAnimatedStyle(() => ({
    width: `${withTiming(Math.min(Math.max(progress, 0), 1) * 100, {
      duration: animation.normal,
    })}%`,
  }));

  return (
    <View style={[styles.track, { height }]}>
      <Animated.View
        style={[
          styles.fill,
          { height },
          showGlow && styles.glow,
          animatedWidth,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.dark.surfaceLight,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.brand.red,
    borderRadius: borderRadius.full,
  },
  glow: {
    shadowColor: colors.brand.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
});
