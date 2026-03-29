/**
 * MQV Result Screen — Resultado da avaliação
 * 
 * Mostra perfil de saúde gerado e indicadores
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '../../src/components/layout';
import { Button, Text, H2, H4, Card } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { useMqvStore } from '../../src/stores/mqvStore';
import { useAuthStore } from '../../src/stores/authStore';

const { width } = Dimensions.get('window');

export default function MqvResultScreen() {
  const router = useRouter();
  const { answers } = useMqvStore();
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);

  // Compute simple health scores based on answers
  const getScores = () => {
    const scores: { label: string; score: number; icon: string; color: string }[] = [];

    // Dor
    const painScore = answers.pain_level != null ? Math.max(0, 10 - answers.pain_level) : 7;
    scores.push({
      label: 'Dor',
      score: painScore,
      icon: '🩺',
      color: painScore >= 7 ? colors.semantic.success : painScore >= 4 ? colors.semantic.warning : colors.brand.red,
    });

    // Sono
    const sleepMap: Record<string, number> = {
      durmo_muito_bem: 10,
      acordo_cansado: 5,
      demoro_pegar_sono: 4,
      acordo_varias_vezes: 3,
      uso_medicacao: 2,
    };
    const sleepScore = answers.sleep_quality ? sleepMap[answers.sleep_quality] || 5 : 5;
    scores.push({
      label: 'Sono',
      score: sleepScore,
      icon: '😴',
      color: sleepScore >= 7 ? colors.semantic.success : sleepScore >= 4 ? colors.semantic.warning : colors.brand.red,
    });

    // Hidratação
    const hydrationMap: Record<string, number> = {
      menos_4_copos: 3,
      '4_8_copos': 7,
      mais_8_copos: 10,
    };
    const hydrationScore = answers.hydration ? hydrationMap[answers.hydration] || 5 : 5;
    scores.push({
      label: 'Hidratação',
      score: hydrationScore,
      icon: '💧',
      color: hydrationScore >= 7 ? colors.semantic.success : hydrationScore >= 4 ? colors.semantic.warning : colors.brand.red,
    });

    // Emocional
    const emotionalMap: Record<string, number> = {
      equilibrado: 10,
      ansioso: 4,
      irritado: 4,
      triste: 3,
    };
    const emotionalScore = answers.emotional_state ? emotionalMap[answers.emotional_state] || 5 : 5;
    scores.push({
      label: 'Emocional',
      score: emotionalScore,
      icon: '🧠',
      color: emotionalScore >= 7 ? colors.semantic.success : emotionalScore >= 4 ? colors.semantic.warning : colors.brand.red,
    });

    // Atividade Física
    const activityMap: Record<string, number> = {
      sim_3x_plus: 10,
      sim_1_2x: 7,
      raramente: 3,
      sedentario: 1,
    };
    const activityScore = answers.physical_activity ? activityMap[answers.physical_activity] || 5 : 5;
    scores.push({
      label: 'Atividade',
      score: activityScore,
      icon: '🏃',
      color: activityScore >= 7 ? colors.semantic.success : activityScore >= 4 ? colors.semantic.warning : colors.brand.red,
    });

    // Alimentação
    const dietMap: Record<string, number> = {
      equilibrada: 10,
      ultraprocessados: 3,
      pulando_refeicoes: 4,
      excesso_doces: 3,
    };
    const dietScore = answers.diet_quality ? dietMap[answers.diet_quality] || 5 : 5;
    scores.push({
      label: 'Alimentação',
      score: dietScore,
      icon: '🥗',
      color: dietScore >= 7 ? colors.semantic.success : dietScore >= 4 ? colors.semantic.warning : colors.brand.red,
    });

    return scores;
  };

  const scores = getScores();
  const avgScore = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);

  const handleContinue = () => {
    setOnboardingComplete();
    router.replace('/(onboarding)/subscription-wall');
  };

  return (
    <ScreenContainer scrollable padded={false} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['rgba(226,0,0,0.15)', 'transparent']}
        style={[StyleSheet.absoluteFill, { height: 300 }]}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="captionBold" color={colors.brand.red}>
            AVALIAÇÃO COMPLETA
          </Text>
          <H2 style={styles.title}>
            Seu perfil de{'\n'}
            <Text variant="h2" color={colors.brand.red}>saúde</Text>
          </H2>
        </View>

        {/* Overall Score */}
        <Card variant="red" style={styles.overallCard}>
          <View style={styles.overallRow}>
            <View>
              <Text variant="caption" color="rgba(255,255,255,0.7)">
                ÍNDICE GERAL MQV
              </Text>
              <Text variant="statLg" color={colors.white}>
                {avgScore}<Text variant="h3" color="rgba(255,255,255,0.6)">/10</Text>
              </Text>
            </View>
            <View style={styles.overallBadge}>
              <Text style={{ fontSize: 40 }}>
                {avgScore >= 7 ? '💪' : avgScore >= 4 ? '👍' : '⚠️'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Score cards */}
        <View style={styles.scoresGrid}>
          {scores.map((item, index) => (
            <Card key={index} variant="outline" style={styles.scoreCard}>
              <Text style={styles.scoreIcon}>{item.icon}</Text>
              <Text variant="statSm" color={item.color}>
                {item.score}
              </Text>
              <Text variant="caption" color={colors.text.tertiary}>
                {item.label}
              </Text>
            </Card>
          ))}
        </View>

        {/* Recommendations */}
        <View style={styles.recommendations}>
          <H4 style={{ marginBottom: spacing[3] }}>Recomendações</H4>
          <Card variant="default" style={styles.recCard}>
            <Text variant="bodySm" color={colors.text.secondary}>
              🏋️ Baseado no seu perfil, recomendamos treinos focados em 
              {answers.goals?.includes('eliminar_dores') ? ' redução de dor e fortalecimento' :
               answers.goals?.includes('melhorar_postura') ? ' correção postural' :
               answers.goals?.includes('mais_energia') ? ' condicionamento e energia' :
               ' prevenção e saúde geral'}.
              {'\n\n'}
              A IA vai gerar um plano personalizado considerando suas respostas sobre dor, 
              mobilidade e condições de saúde.
            </Text>
          </Card>

          {(answers.pain_level ?? 0) >= 7 && (
            <Card variant="outline" style={StyleSheet.flatten([styles.recCard, { borderColor: colors.semantic.warning }])}>
              <Text variant="bodySm" color={colors.semantic.warning}>
                ⚠️ Seu nível de dor está alto. Recomendamos consultar um profissional de saúde 
                antes de iniciar os treinos.
              </Text>
            </Card>
          )}
        </View>

        {/* CTA */}
        <View style={styles.footer}>
          <Button
            title="VER PLANOS E COMEÇAR"
            onPress={handleContinue}
            size="lg"
            fullWidth
          />
          <Text variant="caption" color={colors.text.muted} align="center" style={{ marginTop: spacing[2] }}>
            Sua avaliação está salva e pode ser atualizada a qualquer momento
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[8],
    paddingBottom: spacing[8],
  },
  header: {
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  title: {
    color: colors.white,
  },
  overallCard: {
    padding: spacing[6],
    marginBottom: spacing[5],
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[8],
  },
  scoreCard: {
    flexBasis: '30%',
    flexGrow: 1,
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[1],
  },
  scoreIcon: {
    fontSize: 24,
    marginBottom: spacing[1],
  },
  recommendations: {
    marginBottom: spacing[8],
  },
  recCard: {
    marginBottom: spacing[3],
  },
  footer: {
    gap: spacing[2],
  },
});
