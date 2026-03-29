/**
 * Home Screen — "Meu Plano" (inspirado BeFit)
 * 
 * PRD: Treino do dia, streak, próximo exercício
 * Referência BeFit: Tabs de dias, CTA "INICIAR TREINO"
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '../../src/components/layout';
import { Text, H2, H4, Card, Button } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { useAuthStore } from '../../src/stores/authStore';

const { width } = Dimensions.get('window');

// Mock data for demo
const MOCK_DAYS = ['DIA 1', 'DIA 2', 'DIA 3', 'DIA 4'];

const MOCK_EXERCISES = [
  {
    id: '1',
    name: 'Supino Reto com Barra',
    sets: '4x12',
    muscle: 'Peito',
    icon: '💪',
    badge: null,
  },
  {
    id: '2',
    name: 'Crucifixo com Halteres',
    sets: '3x15',
    muscle: 'Peito',
    icon: '🏋️',
    badge: 'AQUECIMENTO',
  },
  {
    id: '3',
    name: 'Tríceps Corda',
    sets: '4x12',
    muscle: 'Tríceps',
    icon: '💪',
    badge: 'SUPER SÉRIE',
  },
  {
    id: '4',
    name: 'Tríceps Testa',
    sets: '3x12',
    muscle: 'Tríceps',
    icon: '🏋️',
    badge: null,
  },
  {
    id: '5',
    name: 'Crossover',
    sets: '3x15',
    muscle: 'Peito',
    icon: '💪',
    badge: null,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const hasActiveSubscription = useAuthStore((s) => s.hasActiveSubscription);
  const [selectedDay, setSelectedDay] = useState(0);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <ScreenContainer padded={false} scrollable edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(226,0,0,0.1)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerContent}>
          <View>
            <Text variant="bodySm" color={colors.text.tertiary}>
              {greeting()} 👋
            </Text>
            <H2 style={{ color: colors.white }}>
              {profile?.full_name?.split(' ')[0] || 'Atleta'}
            </H2>
          </View>
          <TouchableOpacity style={styles.streakBadge}>
            <Text style={{ fontSize: 20 }}>🔥</Text>
            <Text variant="label" color={colors.brand.red}>
              3
            </Text>
          </TouchableOpacity>
        </View>

        {/* Day tabs — inspirado BeFit */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayTabs}
        >
          {MOCK_DAYS.map((day, index) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(index)}
              style={[
                styles.dayTab,
                selectedDay === index && styles.dayTabActive,
              ]}
            >
              <Text
                variant="labelSm"
                color={selectedDay === index ? colors.white : colors.text.muted}
              >
                {day}
              </Text>
              {selectedDay === index && (
                <Text variant="caption" color={colors.text.tertiary}>
                  Peito + Tríceps
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Workout info */}
      <View style={styles.body}>
        {/* Muscle targets */}
        <View style={styles.muscleInfo}>
          <View style={styles.muscleRow}>
            <Text style={{ fontSize: 18 }}>💪</Text>
            <Text variant="bodySm" color={colors.text.secondary}>
              Peito · Tríceps
            </Text>
          </View>
          <Text variant="caption" color={colors.text.muted}>
            ~45 min · 5 exercícios
          </Text>
        </View>

        {/* Exercise list */}
        <View style={styles.exerciseList}>
          {MOCK_EXERCISES.map((exercise, index) => (
            <Card
              key={exercise.id}
              variant="outline"
              onPress={() => router.push(`/exercise-detail?id=${exercise.id}`)}
              style={styles.exerciseCard}
              padding={4}
            >
              <View style={styles.exerciseRow}>
                <View style={styles.exerciseIcon}>
                  <Text style={{ fontSize: 24 }}>{exercise.icon}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <View style={styles.exerciseHeader}>
                    <Text variant="label" color={colors.white} numberOfLines={1}>
                      {exercise.name}
                    </Text>
                    {exercise.badge && (
                      <View style={styles.badge}>
                        <Text variant="caption" color={colors.brand.red}>
                          {exercise.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text variant="bodySm" color={colors.text.tertiary}>
                    {exercise.sets} · {exercise.muscle}
                  </Text>
                </View>
                <Text variant="bodySm" color={colors.text.muted}>→</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <Card variant="outline" onPress={() => {}} style={styles.quickCard}>
            <Text style={{ fontSize: 22, marginBottom: spacing[2] }}>➕</Text>
            <Text variant="labelSm" color={colors.text.secondary}>
              Adicionar Exercício
            </Text>
          </Card>
          <Card variant="outline" onPress={() => {}} style={styles.quickCard}>
            <Text style={{ fontSize: 22, marginBottom: spacing[2] }}>📝</Text>
            <Text variant="labelSm" color={colors.text.secondary}>
              Registrar Treino
            </Text>
          </Card>
        </View>
      </View>

      {/* Floating CTA — "INICIAR TREINO" (padrão BeFit) */}
      <View style={styles.floatingCta}>
        <Button
          title="INICIAR TREINO"
          onPress={() => router.push('/workout-session')}
          size="lg"
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing[5],
    marginBottom: spacing[5],
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'rgba(226,0,0,0.1)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(226,0,0,0.2)',
  },
  dayTabs: {
    paddingHorizontal: spacing[5],
    gap: spacing[2],
  },
  dayTab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
    minWidth: 80,
    alignItems: 'center',
    gap: 2,
  },
  dayTabActive: {
    backgroundColor: colors.brand.red,
    borderColor: colors.brand.red,
  },
  body: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: 100, // space for floating CTA
  },
  muscleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  muscleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  exerciseList: {
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  exerciseCard: {},
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
    gap: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  badge: {
    backgroundColor: 'rgba(226,0,0,0.1)',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  quickCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing[4],
  },
  floatingCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    paddingBottom: spacing[8],
    backgroundColor: colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
});
