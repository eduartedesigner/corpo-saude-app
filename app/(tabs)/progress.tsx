/**
 * Progress Screen — Acompanhamento de evolução
 * 
 * PRD: Gráficos de cargas, medidas corporais, streak
 * Referência BeFit: Calendário, ofensiva, PRs
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '../../src/components/layout';
import { Text, H3, H4, Card } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius } from '../../src/theme/spacing';

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const TODAY = new Date().getDay();

// Mock data
const MOCK_WEEK = [false, true, true, false, true, false, false];
const MOCK_STATS = {
  totalWorkouts: 27,
  totalMinutes: 1350,
  currentStreak: 3,
  longestStreak: 12,
  totalWeightKg: 45600,
};

export default function ProgressScreen() {
  return (
    <ScreenContainer padded={false} scrollable edges={['top']}>
      <View style={styles.content}>
        <H3 style={{ marginBottom: spacing[5] }}>Progresso</H3>

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
                    MOCK_WEEK[index] && styles.dayDotActive,
                    index === TODAY && styles.dayDotToday,
                  ]}
                >
                  {MOCK_WEEK[index] && (
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
              {MOCK_STATS.currentStreak}
            </Text>
            <Text variant="caption" color="rgba(255,255,255,0.7)">
              Ofensiva Diária
            </Text>
          </Card>
          <Card variant="outline" style={styles.statCard}>
            <Text style={{ fontSize: 28 }}>⚡</Text>
            <Text variant="statMd" color={colors.white}>
              {MOCK_STATS.longestStreak}
            </Text>
            <Text variant="caption" color={colors.text.tertiary}>
              Recorde
            </Text>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card variant="outline" style={styles.statCard}>
            <Text variant="statSm" color={colors.brand.red}>
              {MOCK_STATS.totalWorkouts}
            </Text>
            <Text variant="caption" color={colors.text.tertiary}>
              Treinos
            </Text>
          </Card>
          <Card variant="outline" style={styles.statCard}>
            <Text variant="statSm" color={colors.brand.red}>
              {Math.round(MOCK_STATS.totalMinutes / 60)}h
            </Text>
            <Text variant="caption" color={colors.text.tertiary}>
              Total Treinado
            </Text>
          </Card>
          <Card variant="outline" style={styles.statCard}>
            <Text variant="statSm" color={colors.brand.red}>
              {(MOCK_STATS.totalWeightKg / 1000).toFixed(1)}t
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
              Gráficos de evolução estarão disponíveis{'\n'}após seus primeiros treinos
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
