/**
 * Onboarding Intro — Apresentação do MQV
 * "Vamos avaliar sua qualidade de vida"
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '../../src/components/layout';
import { Button, Text, H2, Card } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

const { height } = Dimensions.get('window');

const FEATURES = [
  {
    icon: '🏥',
    title: 'Avaliação MQV',
    desc: '7 pilares da sua saúde em 5 minutos',
  },
  {
    icon: '🤖',
    title: 'Treino com IA',
    desc: 'Plano personalizado gerado em segundos',
  },
  {
    icon: '📊',
    title: 'Evolução Real',
    desc: 'Acompanhe seus resultados com dados',
  },
];

export default function OnboardingIntro() {
  const router = useRouter();

  return (
    <ScreenContainer padded={false} edges={['bottom']}>
      <LinearGradient
        colors={['rgba(226,0,0,0.1)', 'transparent']}
        style={[StyleSheet.absoluteFill, { height: height * 0.4 }]}
      />

      <View style={styles.content}>
        <View style={styles.topSection}>
          <Text variant="captionBold" color={colors.brand.red}>
            BEM-VINDO AO APP
          </Text>
          <H2 style={styles.title}>
            Vamos avaliar sua{'\n'}
            <Text variant="h2" color={colors.brand.red}>
              qualidade de vida
            </Text>
          </H2>
          <Text variant="bodySm" color={colors.text.tertiary} style={styles.desc}>
            Responda algumas perguntas sobre sua saúde e rotina para receber um plano de treino 100% personalizado.
          </Text>
        </View>

        {/* Feature cards */}
        <View style={styles.features}>
          {FEATURES.map((feature, index) => (
            <Card key={index} variant="outline" style={styles.featureCard}>
              <View style={styles.featureRow}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureText}>
                  <Text variant="label">{feature.title}</Text>
                  <Text variant="bodySm" color={colors.text.tertiary}>
                    {feature.desc}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Time estimate */}
        <View style={styles.timeEstimate}>
          <Text variant="caption" color={colors.text.muted}>
            ⏱ Menos de 5 minutos · 7 etapas · 100% confidencial
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.bottomSection}>
          <Button
            title="INICIAR AVALIAÇÃO"
            onPress={() => router.push('/(onboarding)/mqv-step?step=0')}
            size="lg"
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: height * 0.08,
    justifyContent: 'space-between',
    paddingBottom: spacing[8],
  },
  topSection: {
    gap: spacing[4],
  },
  title: {
    color: colors.white,
    marginTop: spacing[2],
  },
  desc: {
    lineHeight: 22,
  },
  features: {
    gap: spacing[3],
  },
  featureCard: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  featureIcon: {
    fontSize: 32,
  },
  featureText: {
    flex: 1,
    gap: spacing[1],
  },
  timeEstimate: {
    alignItems: 'center',
  },
  bottomSection: {
    gap: spacing[3],
  },
});
