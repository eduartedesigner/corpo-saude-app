/**
 * Exercise Detail — Detalhe do exercício com GIF
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../src/components/layout';
import { Text, H3 } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius } from '../src/theme/spacing';

// Mapa de exercícios com GIFs e instruções
const EXERCISE_DATA: Record<string, {
  name: string;
  muscle: string;
  sets: string;
  reps: string;
  rest: string;
  gif: any;
  instructions: string[];
  tips: string[];
}> = {
  '1': {
    name: 'Supino com Barra',
    muscle: 'Peito',
    sets: '4',
    reps: '12',
    rest: '90s',
    gif: require('../assets/gifs/peitoral/Supino barra (1).gif'),
    instructions: [
      'Deite no banco com os pés apoiados no chão',
      'Segure a barra com pegada um pouco mais larga que os ombros',
      'Desça a barra controladamente até tocar o peito',
      'Empurre a barra de volta à posição inicial',
    ],
    tips: [
      'Mantenha os ombros retraídos e para baixo',
      'Não deixe os cotovelos ultrapassar 90°',
      'Expire na fase de subida',
    ],
  },
  '2': {
    name: 'Crucifixo com Halteres',
    muscle: 'Peito',
    sets: '3',
    reps: '15',
    rest: '60s',
    gif: require('../assets/gifs/peitoral/Crucifico com halteres (1).gif'),
    instructions: [
      'Deite no banco segurando um halter em cada mão',
      'Estenda os braços acima do peito com leve flexão dos cotovelos',
      'Abra os braços lateralmente em arco até sentir o alongamento',
      'Retorne à posição inicial contraindo o peito',
    ],
    tips: [
      'Mantenha leve flexão nos cotovelos',
      'Movimento controlado, sem soltar os halteres',
      'Foque na contração do peitoral',
    ],
  },
  '3': {
    name: 'Tríceps Francês no Cabo',
    muscle: 'Tríceps',
    sets: '4',
    reps: '12',
    rest: '90s',
    gif: require('../assets/gifs/triceps/Triceps frances no cabo com corda (1).gif'),
    instructions: [
      'Segure a corda com as duas mãos acima da cabeça',
      'Mantenha os cotovelos fixos apontando para cima',
      'Estenda os braços para baixo até a extensão total',
      'Retorne lentamente à posição inicial',
    ],
    tips: [
      'Não mova os cotovelos durante o movimento',
      'Separe as pontas da corda ao estender',
      'Mantenha o core contraído',
    ],
  },
  '4': {
    name: 'Tríceps Testa',
    muscle: 'Tríceps',
    sets: '3',
    reps: '12',
    rest: '90s',
    gif: require('../assets/gifs/triceps/Triceps testa 01 (1).gif'),
    instructions: [
      'Deite no banco com um halter em cada mão',
      'Estenda os braços acima do rosto',
      'Flexione os cotovelos trazendo os halteres até a testa',
      'Estenda de volta contraindo o tríceps',
    ],
    tips: [
      'Cotovelos apontando para o teto',
      'Movimento lento na descida',
      'Não bata os halteres na testa',
    ],
  },
  '5': {
    name: 'Crossover',
    muscle: 'Peito',
    sets: '3',
    reps: '15',
    rest: '60s',
    gif: require('../assets/gifs/peitoral/CROSSOVER (1).gif'),
    instructions: [
      'Posicione-se no centro da polia alta',
      'Segure as alças com os braços abertos',
      'Puxe as alças em direção ao centro do corpo',
      'Junte as mãos na frente do abdômen',
    ],
    tips: [
      'Leve inclinação para frente',
      'Sinta a contração no centro do peito',
      'Retorne de forma controlada',
    ],
  },
};

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = EXERCISE_DATA[id || '1'];

  if (!exercise) {
    return (
      <ScreenContainer>
        <Text>Exercício não encontrado</Text>
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
