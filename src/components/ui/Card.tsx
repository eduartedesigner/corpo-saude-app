/**
 * Card Component
 * Design System — superfícies elevadas no dark theme
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, spacing, shadows } from '../../theme/spacing';

type CardVariant = 'default' | 'dark' | 'red' | 'outline';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
}

export function Card({
  children,
  variant = 'default',
  onPress,
  style,
  padding = 5,
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[`variant_${variant}`],
    { padding: spacing[padding] },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={cardStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  variant_default: {
    backgroundColor: colors.dark.surface,
  },
  variant_dark: {
    backgroundColor: colors.dark.background,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  variant_red: {
    backgroundColor: colors.brand.red,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
});
