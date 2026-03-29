/**
 * Welcome Screen — Primeira tela do app
 * 
 * Design: Dark background #0A0A0A, logo branca, CTA vermelho pill
 * PRD: "Onboarding gamificado estilo Duolingo"
 */

import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '../../src/components/layout';
import { Button, Text, H1 } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer padded={false} edges={['bottom']}>
      {/* Background gradient */}
      <LinearGradient
        colors={['rgba(226,0,0,0.15)', 'transparent', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.content}>
        {/* Top section — Logo + branding */}
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <Text variant="captionBold" color={colors.brand.red}>
              ACADEMIA
            </Text>
            <H1 style={styles.brandName}>
              Corpo e{'\n'}
              <Text variant="h1" color={colors.brand.red}>
                Saúde
              </Text>
            </H1>
          </View>

          <Text
            variant="bodyMd"
            color={colors.text.tertiary}
            style={styles.tagline}
          >
            Seu treino personalizado por IA.{'\n'}
            Sua saúde em primeiro lugar.
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text variant="statSm" color={colors.white}>
              35
            </Text>
            <Text variant="caption" color={colors.text.muted}>
              Unidades
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text variant="statSm" color={colors.white}>
              24K
            </Text>
            <Text variant="caption" color={colors.text.muted}>
              Alunos
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text variant="statSm" color={colors.white}>
              200+
            </Text>
            <Text variant="caption" color={colors.text.muted}>
              Exercícios
            </Text>
          </View>
        </View>

        {/* Bottom section — CTAs */}
        <View style={styles.bottomSection}>
          <Button
            title="COMEÇAR AGORA"
            onPress={() => router.push('/(auth)/login')}
            size="lg"
            fullWidth
          />
          <Button
            title="Já tenho conta"
            onPress={() => router.push('/(auth)/login')}
            variant="ghost"
            size="md"
            fullWidth
            textStyle={{ textTransform: 'none' }}
          />

          <Text
            variant="caption"
            color={colors.text.muted}
            align="center"
            style={styles.terms}
          >
            Ao continuar, você aceita nossos{' '}
            <Text variant="caption" color={colors.brand.red}>
              Termos de Uso
            </Text>{' '}
            e{' '}
            <Text variant="caption" color={colors.brand.red}>
              Política de Privacidade
            </Text>
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingTop: height * 0.12,
    paddingBottom: spacing[8],
  },
  topSection: {
    gap: spacing[6],
  },
  logoContainer: {
    gap: spacing[2],
  },
  brandName: {
    color: colors.white,
  },
  tagline: {
    lineHeight: 26,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
  },
  stat: {
    alignItems: 'center',
    gap: spacing[1],
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.dark.border,
  },
  bottomSection: {
    gap: spacing[3],
  },
  terms: {
    marginTop: spacing[2],
    lineHeight: 16,
  },
});
