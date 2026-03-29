/**
 * Workouts Screen — Biblioteca de Treinos
 * 
 * PRD: Plano IA / Criar próprios / Treino Rápido
 * Referência BeFit: 500+ exercícios por grupo muscular
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/layout';
import { Text, H3, H4, Card, Input, Button } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius } from '../../src/theme/spacing';

type WorkoutMode = 'plano_ia' | 'meus_treinos' | 'rapido';

const MUSCLE_GROUPS = [
  { id: 'peito', name: 'Peito', count: 36, icon: '💪' },
  { id: 'costas', name: 'Costas', count: 38, icon: '🏋️' },
  { id: 'ombros', name: 'Ombros', count: 43, icon: '🤸' },
  { id: 'biceps', name: 'Bíceps', count: 26, icon: '💪' },
  { id: 'triceps', name: 'Tríceps', count: 26, icon: '🦾' },
  { id: 'quadriceps', name: 'Quadríceps', count: 40, icon: '🦵' },
  { id: 'gluteos', name: 'Glúteos', count: 15, icon: '🍑' },
  { id: 'posteriores', name: 'Posteriores', count: 15, icon: '🦿' },
  { id: 'abdomen', name: 'Abdômen', count: 32, icon: '🔥' },
  { id: 'panturrilhas', name: 'Panturrilhas', count: 8, icon: '🦶' },
];

export default function WorkoutsScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<WorkoutMode>('plano_ia');
  const [search, setSearch] = useState('');

  const modes: { key: WorkoutMode; label: string; icon: string }[] = [
    { key: 'plano_ia', label: 'Plano IA', icon: '🤖' },
    { key: 'meus_treinos', label: 'Meus Treinos', icon: '📋' },
    { key: 'rapido', label: 'Treino Rápido', icon: '⚡' },
  ];

  return (
    <ScreenContainer padded={false} edges={['top']}>
      <View style={styles.header}>
        <H3 style={{ paddingHorizontal: spacing[5] }}>Treinos</H3>

        {/* Mode selector */}
        <View style={styles.modeSelector}>
          {modes.map((m) => (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMode(m.key)}
              style={[styles.modeBtn, mode === m.key && styles.modeBtnActive]}
            >
              <Text style={{ fontSize: 16 }}>{m.icon}</Text>
              <Text
                variant="labelSm"
                color={mode === m.key ? colors.white : colors.text.muted}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={{ paddingHorizontal: spacing[5] }}>
          <Input
            placeholder="Buscar exercício ou músculo..."
            value={search}
            onChangeText={setSearch}
            leftIcon={<Text>🔍</Text>}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>
      </View>

      {/* Muscle groups grid */}
      <FlatList
        data={MUSCLE_GROUPS}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            variant="outline"
            onPress={() => {}}
            style={styles.muscleCard}
          >
            <Text style={styles.muscleIcon}>{item.icon}</Text>
            <Text variant="label" color={colors.white}>
              {item.name}
            </Text>
            <Text variant="caption" color={colors.text.tertiary}>
              {item.count} exercícios
            </Text>
          </Card>
        )}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <H4>Por Grupo Muscular</H4>
            <Text variant="bodySm" color={colors.text.tertiary}>
              200+ exercícios com vídeo
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  modeSelector: {
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    gap: spacing[2],
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  modeBtnActive: {
    backgroundColor: colors.brand.red,
    borderColor: colors.brand.red,
  },
  gridContent: {
    padding: spacing[5],
    gap: spacing[3],
  },
  gridRow: {
    gap: spacing[3],
  },
  sectionHeader: {
    marginBottom: spacing[4],
    gap: spacing[1],
  },
  muscleCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing[5],
    gap: spacing[2],
  },
  muscleIcon: {
    fontSize: 32,
    marginBottom: spacing[1],
  },
});
