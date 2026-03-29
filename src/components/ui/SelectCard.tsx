/**
 * SelectCard Component
 * Usado no onboarding MQV — seleção de opções (auto-avança)
 * Inspirado no padrão BeFit de cards selecionáveis
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { borderRadius, spacing, animation } from '../../theme/spacing';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface SelectCardProps {
  label: string;
  sublabel?: string;
  icon?: string; // Emoji
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function SelectCard({
  label,
  sublabel,
  icon,
  selected = false,
  onPress,
  style,
}: SelectCardProps) {
  const scale = useSharedValue(1);
  const selectedAnim = useSharedValue(selected ? 1 : 0);

  React.useEffect(() => {
    selectedAnim.value = withTiming(selected ? 1 : 0, { duration: 200 });
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: interpolateColor(
      selectedAnim.value,
      [0, 1],
      [colors.dark.border, colors.brand.red]
    ),
    backgroundColor: interpolateColor(
      selectedAnim.value,
      [0, 1],
      [colors.dark.surface, 'rgba(226, 0, 0, 0.1)']
    ),
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, animation.spring);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, animation.spring);
      }}
      activeOpacity={0.8}
      style={[styles.card, animatedStyle, style]}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text
        variant="label"
        color={selected ? colors.brand.red : colors.text.primary}
      >
        {label}
      </Text>
      {sublabel && (
        <Text
          variant="caption"
          color={colors.text.tertiary}
          style={styles.sublabel}
        >
          {sublabel}
        </Text>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
  },
  icon: {
    fontSize: 28,
    marginBottom: spacing[2],
  },
  sublabel: {
    marginTop: spacing[1],
  },
});
