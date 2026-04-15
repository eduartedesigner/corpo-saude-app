/**
 * Home Screen — "Meu Plano"
 * Busca treinos reais do Supabase. Fallback para mock se não houver dados.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '../../src/components/layout';
import { Text, H2, H4, Card, Button } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { useAuthStore } from '../../src/stores/authStore';
import { supabase } from '../../src/services/supabase';

const { width } = Dimensions.get('window');

type WorkoutDay = {
  id: string;
  name: string;
  muscles: string;
  order_index: number;
};

type Exercise = {
  id: string;
  name: string;
  sets: string;
  muscle: string;
  icon: string;
  badge: string | null;
};

// Fallback mock quando não há plano no banco
const MOCK_DAYS: WorkoutDay[] = [
  { id: '1', name: 'DIA 1', muscles: 'Peito + Tríceps', order_index: 0 },
  { id: '2', name: 'DIA 2', muscles: 'Costas + Bíceps', order_index: 1 },
  { id: '3', name: 'DIA 3', muscles: 'Pernas', order_index: 2 },
  { id: '4', name: 'DIA 4', muscles: 'Ombros + Abdômen', order_index: 3 },
];

const MOCK_EXERCISES_BY_DAY: Record<string, Exercise[]> = {
  '1': [
    { id: '1', name: 'Supino Reto com Barra', sets: '4x12', muscle: 'Peito', icon: '💪', badge: null },
    { id: '2', name: 'Crucifixo com Halteres', sets: '3x15', muscle: 'Peito', icon: '🏋️', badge: 'AQUECIMENTO' },
    { id: '3', name: 'Tríceps Corda', sets: '4x12', muscle: 'Tríceps', icon: '💪', badge: 'SUPER SÉRIE' },
    { id: '4', name: 'Tríceps Testa', sets: '3x12', muscle: 'Tríceps', icon: '🏋️', badge: null },
    { id: '5', name: 'Crossover', sets: '3x15', muscle: 'Peito', icon: '💪', badge: null },
  ],
  '2': [
    { id: '6', name: 'Puxada Frontal', sets: '4x12', muscle: 'Costas', icon: '🏋️', badge: null },
    { id: '7', name: 'Remada Curvada', sets: '4x10', muscle: 'Costas', icon: '💪', badge: null },
    { id: '8', name: 'Rosca Direta', sets: '3x12', muscle: 'Bíceps', icon: '💪', badge: null },
    { id: '9', name: 'Rosca Martelo', sets: '3x12', muscle: 'Bíceps', icon: '🏋️', badge: null },
  ],
  '3': [
    { id: '10', name: 'Agachamento Livre', sets: '4x12', muscle: 'Quadríceps', icon: '🦵', badge: null },
    { id: '11', name: 'Leg Press', sets: '4x15', muscle: 'Quadríceps', icon: '🏋️', badge: null },
    { id: '12', name: 'Stiff', sets: '3x12', muscle: 'Posteriores', icon: '💪', badge: null },
    { id: '13', name: 'Panturrilha no Smith', sets: '4x20', muscle: 'Panturrilha', icon: '🦶', badge: null },
  ],
  '4': [
    { id: '14', name: 'Desenvolvimento com Halteres', sets: '4x12', muscle: 'Ombros', icon: '🤸', badge: null },
    { id: '15', name: 'Elevação Lateral', sets: '3x15', muscle: 'Ombros', icon: '💪', badge: null },
    { id: '16', name: 'Abdominal Crunch', sets: '3x20', muscle: 'Abdômen', icon: '🔥', badge: null },
    { id: '17', name: 'Prancha', sets: '3x60s', muscle: 'Abdômen', icon: '💪', badge: null },
  ],
};

export default function HomeScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const userId = useAuthStore((s) => s.userId);
  const [selectedDay, setSelectedDay] = useState(0);
  const [days, setDays] = useState<WorkoutDay[]>(MOCK_DAYS);
  const [exercisesByDay, setExercisesByDay] = useState<Record<string, Exercise[]>>(MOCK_EXERCISES_BY_DAY);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  useEffect(() => {
    if (userId) {
      loadWorkoutPlan();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadWorkoutPlan = async () => {
    try {
      setLoading(true);

      // Buscar streak atual
      const { data: streakData } = await supabase
        .from('streaks')
        .select('current_streak')
        .eq('user_id', userId)
        .maybeSingle();
      if (streakData) setStreak(streakData.current_streak ?? 0);

      // Buscar plano de treino ativo
      const { data: plan } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (!plan) {
        setLoading(false);
        return; // usa mock
      }

      // Buscar dias do plano
      const { data: planDays } = await supabase
        .from('workout_days')
        .select('id, name, muscles, order_index')
        .eq('plan_id', plan.id)
        .order('order_index');

      if (!planDays || planDays.length === 0) {
        setLoading(false);
        return;
      }

      setDays(planDays);

      // Buscar exercícios para cada dia
      const exByDay: Record<string, Exercise[]> = {};
      for (const day of planDays) {
        const { data: exs } = await supabase
          .from('workout_day_exercises')
          .select('id, name, sets, reps, muscle_group, order_index')
          .eq('day_id', day.id)
          .order('order_index');

        exByDay[day.id] = (exs || []).map((e: any) => ({
          id: e.id,
          name: e.name,
          sets: `${e.sets}x${e.reps}`,
          muscle: e.muscle_group,
          icon: '💪',
          badge: null,
        }));
      }
      setExercisesByDay(exByDay);
    } catch (err) {
      console.error('Erro ao carregar plano:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentDay = days[selectedDay];
  const currentExercises = currentDay ? (exercisesByDay[currentDay.id] || []) : [];

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
              {streak}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Day tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayTabs}
        >
          {days.map((day, index) => (
            <TouchableOpacity
              key={day.id}
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
                {day.name}
              </Text>
              {selectedDay === index && (
                <Text variant="caption" color={colors.text.tertiary}>
                  {day.muscles}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Workout info */}
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator color={colors.brand.red} style={{ marginTop: spacing[8] }} />
        ) : (
          <>
            {/* Muscle targets */}
            <View style={styles.muscleInfo}>
              <View style={styles.muscleRow}>
                <Text style={{ fontSize: 18 }}>💪</Text>
                <Text variant="bodySm" color={colors.text.secondary}>
                  {currentDay?.muscles || '—'}
                </Text>
              </View>
              <Text variant="caption" color={colors.text.muted}>
                ~{Math.round(currentExercises.length * 8)} min · {currentExercises.length} exercícios
              </Text>
            </View>

            {/* Exercise list */}
            <View style={styles.exerciseList}>
              {currentExercises.map((exercise) => (
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
              <Card
                variant="outline"
                onPress={() => router.push('/workouts')}
                style={styles.quickCard}
              >
                <Text style={{ fontSize: 22, marginBottom: spacing[2] }}>➕</Text>
                <Text variant="labelSm" color={colors.text.secondary}>
                  Adicionar Exercício
                </Text>
              </Card>
              <Card
                variant="outline"
                onPress={() => router.push('/workout-session')}
                style={styles.quickCard}
              >
                <Text style={{ fontSize: 22, marginBottom: spacing[2] }}>📝</Text>
                <Text variant="labelSm" color={colors.text.secondary}>
                  Registrar Treino
                </Text>
              </Card>
            </View>
          </>
        )}
      </View>

      {/* Floating CTA */}
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
    paddingBottom: 100,
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
