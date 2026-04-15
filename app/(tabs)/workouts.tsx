/**
 * Workouts Screen — Biblioteca de Treinos
 * Mode selector funcional + search filtrando grupos musculares.
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/layout';
import { Text, H3, H4, Card, Input, Button } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { useAuthStore } from '../../src/stores/authStore';

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

const QUICK_WORKOUTS = [
  { id: 'full_body', name: 'Full Body 30min', exercises: 6, icon: '⚡' },
  { id: 'upper', name: 'Upper Body', exercises: 5, icon: '💪' },
  { id: 'lower', name: 'Lower Body', exercises: 5, icon: '🦵' },
  { id: 'core', name: 'Core & Abdômen', exercises: 4, icon: '🔥' },
];

export default function WorkoutsScreen() {
  const router = useRouter();
  const hasActiveSubscription = useAuthStore((s) => s.hasActiveSubscription);
  const [mode, setMode] = useState<WorkoutMode>('plano_ia');
  const [search, setSearch] = useState('');

  const modes: { key: WorkoutMode; label: string; icon: string }[] = [
    { key: 'plano_ia', label: 'Plano IA', icon: '🤖' },
    { key: 'meus_treinos', label: 'Meus Treinos', icon: '📋' },
    { key: 'rapido', label: 'Treino Rápido', icon: '⚡' },
  ];

  const filteredMuscles = useMemo(() => {
    if (!search.trim()) return MUSCLE_GROUPS;
    const q = search.toLowerCase();
    return MUSCLE_GROUPS.filter((g) => g.name.toLowerCase().includes(q));
  }, [search]);

  const handleMusclePress = (muscleId: string, muscleName: string) => {
    router.push(`/muscle-exercises?muscle=${muscleId}&muscleName=${muscleName}`);
  };

  const handleQuickWorkout = (workoutId: string) => {
    router.push('/workout-session');
  };

  const handleIaPlano = () => {
    if (!hasActiveSubscription) {
      Alert.alert(
        'Recurso Premium',
        'O Plano IA está disponível para assinantes. Assine agora e tenha treinos personalizados!',
        [
          { text: 'Agora não', style: 'cancel' },
          { text: 'Ver planos', onPress: () => router.push('/(onboarding)/subscription-wall') },
        ]
      );
      return;
    }
    Alert.alert('Plano IA', 'Seu plano de treino personalizado está sendo gerado! Em breve disponível.');
  };

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

        {/* Search — só visível na aba de grupos musculares */}
        {mode !== 'rapido' && (
          <View style={{ paddingHorizontal: spacing[5] }}>
            <Input
              placeholder="Buscar exercício ou músculo..."
              value={search}
              onChangeText={setSearch}
              leftIcon={<Text>🔍</Text>}
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
        )}
      </View>

      {/* Conteúdo por mode */}
      {mode === 'plano_ia' && (
        <FlatList
          data={filteredMuscles}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              variant="outline"
              onPress={() => handleMusclePress(item.id, item.name)}
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
            <View>
              {/* Banner Plano IA */}
              <TouchableOpacity
                style={styles.iaBanner}
                onPress={handleIaPlano}
                activeOpacity={0.8}
              >
                <View style={styles.iaBannerContent}>
                  <Text style={{ fontSize: 28 }}>🤖</Text>
                  <View style={{ flex: 1 }}>
                    <Text variant="label" color={colors.white}>
                      Gerar Plano com IA
                    </Text>
                    <Text variant="caption" color={colors.text.tertiary}>
                      Treino personalizado com base no seu perfil
                    </Text>
                  </View>
                  <Text variant="bodySm" color={colors.brand.red}>→</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.sectionHeader}>
                <H4>Por Grupo Muscular</H4>
                <Text variant="bodySm" color={colors.text.tertiary}>
                  200+ exercícios com vídeo
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 32 }}>🔍</Text>
              <Text variant="bodySm" color={colors.text.tertiary} align="center">
                Nenhum grupo encontrado para "{search}"
              </Text>
            </View>
          }
        />
      )}

      {mode === 'meus_treinos' && (
        <View style={styles.comingSoon}>
          <Text style={{ fontSize: 48 }}>📋</Text>
          <H4>Meus Treinos</H4>
          <Text variant="bodySm" color={colors.text.tertiary} align="center">
            Seus treinos salvos aparecerão aqui.{'\n'}Complete treinos para criar seu histórico!
          </Text>
          <Button
            title="INICIAR TREINO"
            onPress={() => router.push('/workout-session')}
            size="md"
          />
        </View>
      )}

      {mode === 'rapido' && (
        <FlatList
          data={QUICK_WORKOUTS}
          contentContainerStyle={styles.gridContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              variant="outline"
              onPress={() => handleQuickWorkout(item.id)}
              style={styles.quickWorkoutCard}
            >
              <View style={styles.quickWorkoutRow}>
                <Text style={{ fontSize: 28 }}>{item.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="label" color={colors.white}>{item.name}</Text>
                  <Text variant="caption" color={colors.text.tertiary}>
                    {item.exercises} exercícios
                  </Text>
                </View>
                <Text variant="bodySm" color={colors.brand.red}>→</Text>
              </View>
            </Card>
          )}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <H4>Treinos Rápidos</H4>
              <Text variant="bodySm" color={colors.text.tertiary}>
                Sem necessidade de plano
              </Text>
            </View>
          }
        />
      )}
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
  iaBanner: {
    backgroundColor: 'rgba(226,0,0,0.08)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(226,0,0,0.2)',
    padding: spacing[4],
    marginBottom: spacing[5],
  },
  iaBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  quickWorkoutCard: {
    marginBottom: spacing[2],
  },
  quickWorkoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    padding: spacing[8],
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing[3],
    paddingTop: spacing[8],
  },
});
