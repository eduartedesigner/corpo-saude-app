/**
 * Subscription Wall — Paywall
 * 
 * PRD: Mensal R$15 / Anual R$150
 * Modelo: Free (MQV) → Pago (treinos + IA)
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '../../src/components/layout';
import { Button, Text, H2, H4, Card } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { useAuthStore } from '../../src/stores/authStore';
import { supabase } from '../../src/services/supabase';

type Plan = 'mensal' | 'anual';

const PLANS: Record<Plan, { price: string; period: string; savings?: string; pricePerMonth: string }> = {
  mensal: {
    price: 'R$ 15',
    period: '/mês',
    pricePerMonth: 'R$ 15/mês',
  },
  anual: {
    price: 'R$ 150',
    period: '/ano',
    savings: 'Economize R$ 30',
    pricePerMonth: 'R$ 12,50/mês',
  },
};

const FEATURES = [
  '✓ Treinos gerados por IA',
  '✓ Biblioteca de 200+ exercícios em vídeo',
  '✓ Execução guiada com timer',
  '✓ Histórico de cargas pré-preenchido',
  '✓ Gráficos de evolução',
  '✓ Notificações personalizadas',
];

export default function SubscriptionWall() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('anual');
  const [loading, setLoading] = useState(false);
  const setSubscriptionActive = useAuthStore((s) => s.setSubscriptionActive);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const userId = useAuthStore.getState().userId;

      // Modo teste — sem usuário logado, vai direto para home
      if (!userId) {
        setSubscriptionActive(true);
        setLoading(false);
        router.replace('/(tabs)/home');
        return;
      }

      const now = new Date();
      const expiresAt = new Date(now);
      if (selectedPlan === 'anual') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      const { error } = await supabase.from('subscriptions').upsert({
        user_id: userId,
        plan: selectedPlan,
        status: 'active',
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      }, { onConflict: 'user_id' });

      if (error) throw error;

      setSubscriptionActive(true);
      router.replace('/(tabs)/home');
    } catch (err) {
      console.error('Erro ao registrar assinatura:', err);
      Alert.alert('Erro', 'Não foi possível registrar sua assinatura. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Free tier — only MQV
    router.replace('/(tabs)/home');
  };

  return (
    <ScreenContainer scrollable padded={false} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['rgba(226,0,0,0.2)', 'transparent']}
        style={[StyleSheet.absoluteFill, { height: 250 }]}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="captionBold" color={colors.brand.red}>
            DESBLOQUEIE TUDO
          </Text>
          <H2 style={styles.title}>
            Treino com{'\n'}
            <Text variant="h2" color={colors.brand.red}>inteligência</Text>
          </H2>
          <Text variant="bodySm" color={colors.text.tertiary}>
            Acesse treinos personalizados por IA, execução guiada e acompanhamento completo.
          </Text>
        </View>

        {/* Plan cards */}
        <View style={styles.plans}>
          {/* Anual */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('anual')}
            activeOpacity={0.8}
            style={[
              styles.planCard,
              selectedPlan === 'anual' && styles.planCardSelected,
            ]}
          >
            {PLANS.anual.savings && (
              <View style={styles.savingsBadge}>
                <Text variant="captionBold" color={colors.white}>
                  {PLANS.anual.savings}
                </Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <View style={[
                styles.radio,
                selectedPlan === 'anual' && styles.radioSelected,
              ]}>
                {selectedPlan === 'anual' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text variant="label" color={colors.white}>
                  Plano Anual
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  {PLANS.anual.pricePerMonth} · 2 meses grátis
                </Text>
              </View>
            </View>
            <Text variant="h3" color={colors.white} style={styles.planPrice}>
              {PLANS.anual.price}
              <Text variant="bodySm" color={colors.text.tertiary}>
                {PLANS.anual.period}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Mensal */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('mensal')}
            activeOpacity={0.8}
            style={[
              styles.planCard,
              selectedPlan === 'mensal' && styles.planCardSelected,
            ]}
          >
            <View style={styles.planHeader}>
              <View style={[
                styles.radio,
                selectedPlan === 'mensal' && styles.radioSelected,
              ]}>
                {selectedPlan === 'mensal' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text variant="label" color={colors.white}>
                  Plano Mensal
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  Cancele quando quiser
                </Text>
              </View>
            </View>
            <Text variant="h3" color={colors.white} style={styles.planPrice}>
              {PLANS.mensal.price}
              <Text variant="bodySm" color={colors.text.tertiary}>
                {PLANS.mensal.period}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <H4 style={{ marginBottom: spacing[3] }}>O que está incluído</H4>
          {FEATURES.map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Text variant="bodySm" color={colors.text.secondary}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View style={styles.footer}>
          <Button
            title={`ASSINAR ${selectedPlan === 'anual' ? 'ANUAL' : 'MENSAL'} — ${PLANS[selectedPlan].price}`}
            onPress={handleSubscribe}
            size="lg"
            fullWidth
            loading={loading}
          />
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text variant="bodySm" color={colors.text.muted} align="center">
              Continuar com plano gratuito
            </Text>
          </TouchableOpacity>
          <Text variant="caption" color={colors.text.muted} align="center">
            Renovação automática · Cancele a qualquer momento
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
    marginBottom: spacing[8],
    gap: spacing[3],
  },
  title: {
    color: colors.white,
  },
  plans: {
    gap: spacing[3],
    marginBottom: spacing[8],
  },
  planCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    borderWidth: 2,
    borderColor: colors.dark.border,
    gap: spacing[3],
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: colors.brand.red,
    backgroundColor: 'rgba(226, 0, 0, 0.05)',
  },
  savingsBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.brand.red,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderBottomLeftRadius: borderRadius.md,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.dark.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.brand.red,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.brand.red,
  },
  planPrice: {
    alignSelf: 'flex-end',
  },
  features: {
    marginBottom: spacing[8],
  },
  featureRow: {
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  footer: {
    gap: spacing[3],
  },
  skipBtn: {
    paddingVertical: spacing[3],
  },
});
