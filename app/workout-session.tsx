/**
 * Workout Session — Execução do treino
 * Exercícios um a um, marcação de séries, timer de descanso
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/layout';
import { Text, Button, H3, H4 } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius } from '../src/theme/spacing';

const EXERCISES = [
  { id: '1', name: 'Supino com Barra', sets: 4, reps: 12, muscle: 'Peito', rest: 90, gif: require('../assets/gifs/peitoral/Supino barra (1).gif') },
  { id: '2', name: 'Crucifixo com Halteres', sets: 3, reps: 15, muscle: 'Peito', rest: 60, gif: require('../assets/gifs/peitoral/Crucifico com halteres (1).gif') },
  { id: '3', name: 'Tríceps Francês no Cabo', sets: 4, reps: 12, muscle: 'Tríceps', rest: 90, gif: require('../assets/gifs/triceps/Triceps frances no cabo com corda (1).gif') },
  { id: '4', name: 'Tríceps Testa', sets: 3, reps: 12, muscle: 'Tríceps', rest: 90, gif: require('../assets/gifs/triceps/Triceps testa 01 (1).gif') },
  { id: '5', name: 'Crossover', sets: 3, reps: 15, muscle: 'Peito', rest: 60, gif: require('../assets/gifs/peitoral/CROSSOVER (1).gif') },
];

export default function WorkoutSessionScreen() {
  const router = useRouter();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedSets, setCompletedSets] = useState<boolean[][]>(
    EXERCISES.map((e) => Array(e.sets).fill(false))
  );
  const [resting, setResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Elapsed time
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Rest timer
  useEffect(() => {
    if (resting && restTimer > 0) {
      restRef.current = setInterval(() => {
        setRestTimer((t) => {
          if (t <= 1) {
            setResting(false);
            if (restRef.current) clearInterval(restRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (restRef.current) clearInterval(restRef.current); };
  }, [resting]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const exercise = EXERCISES[currentExercise];
  const sets = completedSets[currentExercise];
  const allSetsComplete = sets.every(Boolean);
  const isLastExercise = currentExercise === EXERCISES.length - 1;

  const markSet = (setIndex: number) => {
    if (completedSets[currentExercise][setIndex]) return;
    const updated = completedSets.map((e, ei) =>
      ei === currentExercise
        ? e.map((s, si) => (si === setIndex ? true : s))
        : e
    );
    setCompletedSets(updated);
    // Start rest timer
    setRestTimer(exercise.rest);
    setResting(true);
  };

  const goNext = () => {
    if (isLastExercise) {
      finishWorkout();
    } else {
      setCurrentExercise((c) => c + 1);
      setResting(false);
      setRestTimer(0);
    }
  };

  const finishWorkout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    Alert.alert(
      '🎉 Treino Concluído!',
      `Duração: ${formatTime(elapsed)}\n${EXERCISES.length} exercícios completados!`,
      [{ text: 'Ótimo!', onPress: () => router.replace('/(tabs)/home') }]
    );
  };

  const confirmExit = () => {
    Alert.alert(
      'Sair do treino?',
      'Seu progresso será perdido.',
      [
        { text: 'Continuar treinando', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <ScreenContainer padded={false} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={confirmExit} style={styles.exitBtn}>
          <Text variant="bodySm" color={colors.text.secondary}>✕ Sair</Text>
        </TouchableOpacity>
        <Text variant="labelSm" color={colors.text.tertiary}>
          {currentExercise + 1} / {EXERCISES.length}
        </Text>
        <Text variant="label" color={colors.brand.red}>
          {formatTime(elapsed)}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentExercise) / EXERCISES.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* GIF do exercício */}
        <View style={styles.gifContainer}>
          <Image
            source={exercise.gif}
            style={styles.gif}
            resizeMode="contain"
          />
        </View>

        {/* Exercise name */}
        <View style={styles.exerciseHeader}>
          <Text variant="bodySm" color={colors.text.tertiary}>{exercise.muscle}</Text>
          <H3 style={styles.exerciseName}>{exercise.name}</H3>
          <Text variant="bodySm" color={colors.text.secondary}>
            {exercise.sets} séries · {exercise.reps} repetições · Descanso: {exercise.rest}s
          </Text>
        </View>

        {/* Rest timer */}
        {resting && (
          <View style={styles.restContainer}>
            <Text variant="bodySm" color={colors.text.tertiary}>Descansando</Text>
            <Text style={styles.restTimer}>{restTimer}s</Text>
            <TouchableOpacity onPress={() => setResting(false)} style={styles.skipRest}>
              <Text variant="labelSm" color={colors.brand.red}>Pular descanso →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sets */}
        <View style={styles.setsContainer}>
          <Text variant="label" color={colors.text.secondary} style={styles.setsTitle}>
            Séries
          </Text>
          {sets.map((done, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => markSet(i)}
              style={[styles.setRow, done && styles.setRowDone]}
              activeOpacity={done ? 1 : 0.7}
            >
              <View style={[styles.setCheck, done && styles.setCheckDone]}>
                {done && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text variant="bodyMd" color={done ? colors.text.muted : colors.white}>
                Série {i + 1}
              </Text>
              <Text variant="bodySm" color={done ? colors.text.muted : colors.text.secondary}>
                {exercise.reps} reps
              </Text>
              {!done && <Text variant="labelSm" color={colors.brand.red} style={styles.tapHint}>
                Toque ao concluir
              </Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming exercises */}
        {currentExercise < EXERCISES.length - 1 && (
          <View style={styles.upcoming}>
            <Text variant="labelSm" color={colors.text.muted} style={{ marginBottom: spacing[3] }}>
              Próximos exercícios
            </Text>
            {EXERCISES.slice(currentExercise + 1).map((ex, i) => (
              <View key={ex.id} style={styles.upcomingItem}>
                <Text variant="bodySm" color={colors.text.muted}>{currentExercise + i + 2}.</Text>
                <Text variant="bodySm" color={colors.text.muted}>{ex.name}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title={isLastExercise ? 'FINALIZAR TREINO 🎉' : 'PRÓXIMO EXERCÍCIO →'}
          onPress={goNext}
          size="lg"
          fullWidth
          disabled={!allSetsComplete}
        />
        {!allSetsComplete && (
          <Text variant="caption" color={colors.text.muted} align="center" style={{ marginTop: spacing[2] }}>
            Complete todas as séries para continuar
          </Text>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  gifContainer: {
    width: '100%',
    height: 220,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing[5],
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  exitBtn: {
    padding: spacing[2],
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.dark.border,
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.brand.red,
  },
  content: {
    padding: spacing[5],
    paddingBottom: spacing[4],
  },
  exerciseHeader: {
    marginBottom: spacing[6],
  },
  exerciseName: {
    marginVertical: spacing[2],
  },
  restContainer: {
    backgroundColor: 'rgba(226,0,0,0.08)',
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    alignItems: 'center',
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: 'rgba(226,0,0,0.2)',
  },
  restTimer: {
    fontSize: 56,
    fontWeight: 'bold',
    color: colors.brand.red,
    marginVertical: spacing[2],
  },
  skipRest: {
    marginTop: spacing[2],
  },
  setsContainer: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  setsTitle: {
    marginBottom: spacing[2],
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  setRowDone: {
    opacity: 0.5,
    borderColor: colors.dark.border,
  },
  setCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.brand.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setCheckDone: {
    backgroundColor: colors.brand.red,
    borderColor: colors.brand.red,
  },
  checkMark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tapHint: {
    marginLeft: 'auto',
  },
  upcoming: {
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    paddingTop: spacing[5],
  },
  upcomingItem: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  footer: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
});
