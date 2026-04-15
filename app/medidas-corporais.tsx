/**
 * Medidas Corporais — Registro de peso e medidas
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/layout';
import { Text, H3, H4, Card, Input, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius } from '../src/theme/spacing';

type Medidas = {
  peso: string;
  altura: string;
  peito: string;
  cintura: string;
  quadril: string;
  braco: string;
  coxa: string;
  panturrilha: string;
  gordura: string;
};

const HISTORICO = [
  { data: '12/04/2026', peso: '78,5', cintura: '82', braco: '37' },
  { data: '29/03/2026', peso: '79,2', cintura: '83', braco: '36' },
  { data: '15/03/2026', peso: '80,0', cintura: '85', braco: '35' },
];

export default function MedidasCorporaisScreen() {
  const router = useRouter();
  const [medidas, setMedidas] = useState<Medidas>({
    peso: '78,5',
    altura: '178',
    peito: '98',
    cintura: '82',
    quadril: '96',
    braco: '37',
    coxa: '58',
    panturrilha: '38',
    gordura: '14',
  });
  const [saved, setSaved] = useState(false);

  const set = (field: keyof Medidas) => (val: string) =>
    setMedidas((prev) => ({ ...prev, [field]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields: { label: string; key: keyof Medidas; unit: string }[] = [
    { label: 'Peso', key: 'peso', unit: 'kg' },
    { label: 'Altura', key: 'altura', unit: 'cm' },
    { label: 'Peito', key: 'peito', unit: 'cm' },
    { label: 'Cintura', key: 'cintura', unit: 'cm' },
    { label: 'Quadril', key: 'quadril', unit: 'cm' },
    { label: 'Braço', key: 'braco', unit: 'cm' },
    { label: 'Coxa', key: 'coxa', unit: 'cm' },
    { label: 'Panturrilha', key: 'panturrilha', unit: 'cm' },
    { label: '% Gordura', key: 'gordura', unit: '%' },
  ];

  return (
    <ScreenContainer padded={false} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="bodyMd" color={colors.text.secondary}>← Voltar</Text>
        </TouchableOpacity>
        <H3>Medidas Corporais</H3>
        <Text variant="bodySm" color={colors.text.tertiary}>
          Atualizado em 12/04/2026
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* IMC rápido */}
        <Card variant="red" style={styles.imcCard}>
          <View style={styles.imcRow}>
            <View style={styles.imcItem}>
              <Text style={{ fontSize: 28 }}>⚖️</Text>
              <Text variant="statSm" color={colors.white}>24,7</Text>
              <Text variant="caption" color="rgba(255,255,255,0.7)">IMC</Text>
            </View>
            <View style={styles.imcDivider} />
            <View style={styles.imcItem}>
              <Text style={{ fontSize: 28 }}>🔥</Text>
              <Text variant="statSm" color={colors.white}>14%</Text>
              <Text variant="caption" color="rgba(255,255,255,0.7)">Gordura</Text>
            </View>
            <View style={styles.imcDivider} />
            <View style={styles.imcItem}>
              <Text style={{ fontSize: 28 }}>💪</Text>
              <Text variant="statSm" color={colors.white}>67,5kg</Text>
              <Text variant="caption" color="rgba(255,255,255,0.7)">Massa Magra</Text>
            </View>
          </View>
        </Card>

        {/* Formulário */}
        <H4 style={{ marginBottom: spacing[3] }}>Atualizar Medidas</H4>
        <View style={styles.formGrid}>
          {fields.map((f) => (
            <View key={f.key} style={styles.fieldWrap}>
              <Text variant="caption" color={colors.text.muted} style={{ marginBottom: 4 }}>
                {f.label} ({f.unit})
              </Text>
              <Input
                value={medidas[f.key]}
                onChangeText={set(f.key)}
                keyboardType="decimal-pad"
                containerStyle={{ marginBottom: 0 }}
                rightIcon={
                  <Text variant="caption" color={colors.text.muted}>{f.unit}</Text>
                }
              />
            </View>
          ))}
        </View>

        <Button
          title={saved ? '✓ SALVO!' : 'SALVAR MEDIDAS'}
          onPress={handleSave}
          fullWidth
          size="lg"
          style={{ marginTop: spacing[4] }}
        />

        {/* Histórico */}
        <H4 style={{ marginTop: spacing[6], marginBottom: spacing[3] }}>Histórico</H4>
        <Card variant="outline" style={{ padding: 0, overflow: 'hidden' }}>
          <View style={styles.histHeader}>
            <Text variant="caption" color={colors.text.muted} style={{ flex: 1.2 }}>DATA</Text>
            <Text variant="caption" color={colors.text.muted} style={{ flex: 1, textAlign: 'center' }}>PESO</Text>
            <Text variant="caption" color={colors.text.muted} style={{ flex: 1, textAlign: 'center' }}>CINTURA</Text>
            <Text variant="caption" color={colors.text.muted} style={{ flex: 1, textAlign: 'center' }}>BRAÇO</Text>
          </View>
          {HISTORICO.map((h, i) => (
            <View key={i} style={styles.histRow}>
              <Text variant="caption" color={colors.text.tertiary} style={{ flex: 1.2 }}>{h.data}</Text>
              <Text variant="bodySm" color={colors.white} style={{ flex: 1, textAlign: 'center' }}>{h.peso} kg</Text>
              <Text variant="bodySm" color={colors.white} style={{ flex: 1, textAlign: 'center' }}>{h.cintura} cm</Text>
              <Text variant="bodySm" color={colors.white} style={{ flex: 1, textAlign: 'center' }}>{h.braco} cm</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[1],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backBtn: { marginBottom: spacing[2] },
  scroll: { padding: spacing[5], paddingBottom: spacing[12] },
  imcCard: { marginBottom: spacing[6] },
  imcRow: { flexDirection: 'row', alignItems: 'center' },
  imcItem: { flex: 1, alignItems: 'center', gap: spacing[1] },
  imcDivider: { width: 1, height: 48, backgroundColor: 'rgba(255,255,255,0.2)' },
  formGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
  fieldWrap: { width: '47%' },
  histHeader: {
    flexDirection: 'row',
    padding: spacing[3],
    backgroundColor: colors.dark.surfaceLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  histRow: {
    flexDirection: 'row',
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
    alignItems: 'center',
  },
});
