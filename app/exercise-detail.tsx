/**
 * Exercise Detail — Detalhe do exercício com GIF, instruções e dicas
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../src/components/layout';
import { Text, H3 } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius } from '../src/theme/spacing';
import { ALL_EXERCISES } from '../src/data/exercises';

// Mantém suporte a IDs numéricos legados do home.tsx (dias 1-17)
const LEGACY_ID_MAP: Record<string, string> = {
  '1': 'p1', '2': 'p9', '3': 't3', '4': 't4', '5': 'p12',
  '6': 'c1', '7': 'c8', '8': 'b1', '9': 'b2',
  '10': 'q1', '11': 'q3', '12': 'po1', '13': 'pa3',
  '14': 'o1', '15': 'o6', '16': 'a1', '17': 'a5',
};

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const resolvedId = id ? (LEGACY_ID_MAP[id] ?? id) : null;
  const exercise = resolvedId ? ALL_EXERCISES.find((e) => e.id === resolvedId) : null;

  if (!exercise) {
    return (
      <ScreenContainer padded edges={['top', 'bottom']}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: spacing[4] }}>
          <Text variant="bodyMd" color={colors.text.secondary}>← Voltar</Text>
        </TouchableOpacity>
        <Text color={colors.text.tertiary}>Exercício não encontrado (id: {id})</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="bodyMd" color={colors.text.secondary}>← Voltar</Text>
        </TouchableOpacity>
        <View style={styles.muscleBadge}>
          <Text variant="caption" color={colors.brand.red}>{exercise.muscle}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* GIF */}
        <View style={styles.gifContainer}>
          <Image source={exercise.gif} style={styles.gif} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          {/* Nome e info */}
          <H3 style={styles.name}>{exercise.name}</H3>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text variant="caption" color={colors.text.muted}>SÉRIES</Text>
              <Text variant="label" color={colors.white}>{exercise.sets}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text variant="caption" color={colors.text.muted}>REPS</Text>
              <Text variant="label" color={colors.white}>{exercise.reps}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text variant="caption" color={colors.text.muted}>DESCANSO</Text>
              <Text variant="label" color={colors.white}>{exercise.rest}</Text>
            </View>
          </View>

          {/* Instruções */}
          <View style={styles.section}>
            <Text variant="label" color={colors.text.secondary} style={styles.sectionTitle}>
              Como executar
            </Text>
            {exercise.instructions.map((step, i) => (
              <View key={i} style={styles.instructionRow}>
                <View style={styles.stepNumber}>
                  <Text variant="caption" color={colors.white}>{i + 1}</Text>
                </View>
                <Text variant="bodySm" color={colors.text.secondary} style={{ flex: 1 }}>
                  {step}
                </Text>
              </View>
            ))}
          </View>

          {/* Dicas */}
          <View style={styles.section}>
            <Text variant="label" color={colors.text.secondary} style={styles.sectionTitle}>
              Dicas importantes
            </Text>
            {exercise.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Text color={colors.brand.red} style={styles.tipBullet}>•</Text>
                <Text variant="bodySm" color={colors.text.secondary} style={{ flex: 1 }}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  backBtn: { padding: spacing[2] },
  muscleBadge: {
    backgroundColor: 'rgba(226,0,0,0.1)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(226,0,0,0.3)',
  },
  gifContainer: {
    width: '100%',
    height: 260,
    backgroundColor: colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing[5],
  },
  name: {
    marginBottom: spacing[4],
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[6],
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[1],
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.dark.border,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    marginBottom: spacing[4],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand.red,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  tipBullet: {
    fontSize: 18,
    lineHeight: 20,
  },
});
