/**
 * Progress Screen — Acompanhamento de evolução
 * Busca dados reais do Supabase: streak, sessões, medidas.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '../../src/components/layout';
import { Text, H3, H4, Card } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { supabase } from '../../src/services/supabase';
import { useAuthStore } from '../../src/stores/authStore';

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const TODAY = new Date().getDay();

type Stats = {
  totalWorkouts: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  totalWeightKg: number;
};

export default function ProgressScreen() {
  const userId = useAuthStore((s) => s.userId);
  const [loading, setLoading] = useState(true);
  const [weekActivity, setWeekActivity] = useState<boolean[]>(Array(7).fill(false));
  const [stats, setStats] = useState<Stats>({
    totalWorkouts: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalWeightKg: 0,
  });

  useEffect(() => {
    if (userId) loadProgress();
  }, [userId]);

  const loadProgress = async () => {
    try {
      setLoading(true);

      // Streak
      const { data: streakData } = await supabase
        .from('streaks')
        .select('current_streak, longest_streak')
        .eq('user_id', userId)
        .maybeSingle();

      // Sessões de treino
      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('started_at, duration_seconds, total_volume_kg')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('started_at', { ascending: false });

      const totalWorkouts = sessions?.length ?? 0;
      const totalMinutes = Math.round(
        (sessions?.reduce((acc, s) => acc + (s.duration_seconds ?? 0), 0) ?? 0) / 60
      );
      const totalWeightKg = sessions?.reduce((acc, s) => acc + (s.total_volume_kg ?? 0), 0) ?? 0;

      // Atividade desta semana (últimos 7 dias)
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // domingo
      weekStart.setHours(0, 0, 0, 0);

      const activity = Array(7).fill(false);
      sessions?.forEach((s) => {
        const date = new Date(s.started_at);
        if (date >= weekStart) {
          const dayOfWeek = date.getDay();
          activity[dayOfWeek] = true;
        }
      });
      setWeekActivity(activity);

      setStats({
        totalWorkouts,
        totalMinutes,
        currentStreak: streakData?.current_streak ?? 0,
        longestStreak: streakData?.longest_streak ?? 0,
        totalWeightKg,
      });
    } catch (err) {
      console.error('Erro ao carregar progresso:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer padded={false} scrollable edges={['top']}>
      <View style={styles.content}>
        <H3 style={{ marginBottom: spacing[5] }}>Progresso</H3>

        {loading ? (
          <ActivityIndicator color={colors.brand.red} style={{ marginTop: spacing[8] }} />
        ) : (
          <>
            {/* Weekly calendar */}
            <Card variant="default" style={styles.weekCard}>
              <Text variant="label" style={{ marginBottom: spacing[3] }}>
                Esta Semana
              </Text>
              <View style={styles.weekRow}>
                {WEEK_DAYS.map((day, index) => (
                  <View key={day} style={styles.dayCol}>
                    <Text
                      variant="caption"
                      color={index === TODAY ? colors.brand.red : colors.text.muted}
                    >
                      {day}
                    </Text>
                    <View
                      style={[
                        styles.dayDot,
                        weekActivity[index] && styles.dayDotActive,
                        index === TODAY && styles.dayDotToday,
                      ]}
                    >
                      {weekActivity[index] && (
                        <Text variant="caption" color={colors.white}>
                          ✓
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            {/* Streak & stats */}
            <View style={styles.statsGrid}>
              <Card variant="red" style={styles.statCard}>
                <Text style={{ fontSize: 28 }}>🔥</Text>
                <Text variant="statMd" color={colors.white}>
                  {stats.currentStreak}
                </Text>
                <Text variant="caption" color="rgba(255,255,255,0.7)">
                  Ofensiva Diária
                </Text>
              </Card>
              <Card variant="outline" style={styles.statCard}>
                <Text style={{ fontSize: 28 }}>⚡</Text>
                <Text variant="statMd" color={colors.white}>
                  {stats.longestStreak}
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  Recorde
                </Text>
              </Card>
            </View>

            <View style={styles.statsGrid}>
              <Card variant="outline" style={styles.statCard}>
                <Text variant="statSm" color={colors.brand.red}>
                  {stats.totalWorkouts}
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  Treinos
                </Text>
              </Card>
              <Card variant="outline" style={styles.statCard}>
                <Text variant="statSm" color={colors.brand.red}>
                  {stats.totalMinutes >= 60
                    ? `${Math.round(stats.totalMinutes / 60)}h`
                    : `${stats.totalMinutes}m`}
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  Total Treinado
                </Text>
              </Card>
              <Card variant="outline" style={styles.statCard}>
                <Text variant="statSm" color={colors.brand.red}>
                  {stats.totalWeightKg >= 1000
                    ? `${(stats.totalWeightKg / 1000).toFixed(1)}t`
                    : `${stats.totalWeightKg}kg`}
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  Peso Levantado
                </Text>
              </Card>
            </View>

            {/* Evolution charts placeholder */}
            <View style={styles.section}>
              <H4 style={{ marginBottom: spacing[3] }}>Evolução de Cargas</H4>
              <Card variant="outline" style={styles.chartPlaceholder}>
                <Text style={{ fontSize: 40 }}>📈</Text>
                <Text variant="bodySm" color={colors.text.tertiary} align="center">
                  {stats.totalWorkouts > 0
                    ? 'Gráficos em breve'
                    : `Gráficos de evolução estarão disponíveis\napós seus primeiros treinos`}
                </Text>
              </Card>
            </View>

            {/* Body measurements placeholder */}
            <View style={styles.section}>
              <H4 style={{ marginBottom: spacing[3] }}>Medidas Corporais</H4>
              <Card variant="outline" style={styles.chartPlaceholder}>
                <Text style={{ fontSize: 40 }}>📏</Text>
                <Text variant="bodySm" color={colors.text.tertiary} align="center">
                  Adicione suas medidas para{'\n'}acompanhar a evolução
                </Text>
              </Card>
            </View>

            {/* PRs */}
            <View style={styles.section}>
              <H4 style={{ marginBottom: spacing[3] }}>Records Pessoais (PRs)</H4>
              <Card variant="outline" style={styles.chartPlaceholder}>
                <Text style={{ fontSize: 40 }}>🏆</Text>
                <Text variant="bodySm" color={colors.text.tertiary} align="center">
                  Seus records pessoais aparecerão{'\n'}automaticamente aqui
                </Text>
              </Card>
            </View>
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing[5],
    paddingBottom: spacing[12],
  },
  weekCard: {
    marginBottom: spacing[4],
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: spacing[2],
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotActive: {
    backgroundColor: colors.brand.red,
  },
  dayDotToday: {
    borderWidth: 2,
    borderColor: colors.brand.red,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[1],
  },
  section: {
    marginTop: spacing[5],
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
    gap: spacing[3],
  },
});
