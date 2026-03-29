/**
 * Slider Component
 * Escala 0-10 usada no MQV (dor, estresse, comprometimento)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';

interface ScaleSliderProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  lowLabel?: string;
  highLabel?: string;
}

export function ScaleSlider({
  min = 0,
  max = 10,
  value,
  onChange,
  label,
  lowLabel,
  highLabel,
}: ScaleSliderProps) {
  const items = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.scaleContainer}>
        {items.map((num) => {
          const isSelected = num === value;
          const isLow = num <= 3;
          const isMid = num >= 4 && num <= 6;
          const isHigh = num >= 7;

          return (
            <TouchableOpacity
              key={num}
              onPress={() => onChange(num)}
              style={[
                styles.scaleItem,
                isSelected && styles.scaleItemSelected,
                isSelected && isLow && styles.scaleItemLow,
                isSelected && isMid && styles.scaleItemMid,
                isSelected && isHigh && styles.scaleItemHigh,
              ]}
            >
              <Text
                variant={isSelected ? 'label' : 'bodySm'}
                color={isSelected ? colors.white : colors.text.tertiary}
              >
                {num}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {(lowLabel || highLabel) && (
        <View style={styles.labelsRow}>
          <Text variant="caption" color={colors.text.tertiary}>
            {lowLabel || ''}
          </Text>
          <Text variant="caption" color={colors.text.tertiary}>
            {highLabel || ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    marginBottom: spacing[3],
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[1],
  },
  scaleItem: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  scaleItemSelected: {
    borderColor: colors.brand.red,
    backgroundColor: colors.brand.red,
  },
  scaleItemLow: {
    backgroundColor: colors.semantic.success,
    borderColor: colors.semantic.success,
  },
  scaleItemMid: {
    backgroundColor: colors.semantic.warning,
    borderColor: colors.semantic.warning,
  },
  scaleItemHigh: {
    backgroundColor: colors.brand.red,
    borderColor: colors.brand.red,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[2],
  },
});
