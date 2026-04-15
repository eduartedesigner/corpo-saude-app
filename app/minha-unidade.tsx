/**
 * Minha Unidade — Selecionar academia
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/layout';
import { Text, H3, Card, Input } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius } from '../src/theme/spacing';

const UNIDADES = [
  { id: '1', nome: 'Corpo e Saúde — Moema', endereco: 'R. Abílio Soares, 432 — Moema, SP', horario: '06h–22h', ativo: true },
  { id: '2', nome: 'Corpo e Saúde — Itaim Bibi', endereco: 'Av. Brigadeiro Faria Lima, 2055 — Itaim, SP', horario: '06h–23h', ativo: false },
  { id: '3', nome: 'Corpo e Saúde — Vila Mariana', endereco: 'R. Domingos de Morais, 1.800 — Vila Mariana, SP', horario: '06h–22h', ativo: false },
  { id: '4', nome: 'Corpo e Saúde — Pinheiros', endereco: 'R. dos Pinheiros, 513 — Pinheiros, SP', horario: '05h30–23h', ativo: false },
  { id: '5', nome: 'Corpo e Saúde — Santana', endereco: 'Av. Luís Dumont Villares, 700 — Santana, SP', horario: '06h–22h', ativo: false },
];

export default function MinhaUnidadeScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('1');
  const [search, setSearch] = useState('');

  const filtered = UNIDADES.filter((u) =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.endereco.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScreenContainer padded={false} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="bodyMd" color={colors.text.secondary}>← Voltar</Text>
        </TouchableOpacity>
        <H3>Minha Unidade</H3>
        <Text variant="bodySm" color={colors.text.tertiary}>
          Selecione sua academia principal
        </Text>
      </View>

      <View style={styles.searchWrap}>
        <Input
          placeholder="Buscar unidade..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Text>🔍</Text>}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelected(item.id)} activeOpacity={0.8}>
            <Card
              variant="outline"
              style={[styles.card, selected === item.id && styles.cardSelected]}
            >
              <View style={styles.cardRow}>
                <View style={styles.radioWrap}>
                  <View style={[styles.radio, selected === item.id && styles.radioActive]}>
                    {selected === item.id && <View style={styles.radioInner} />}
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="label" color={colors.white}>{item.nome}</Text>
                  <Text variant="caption" color={colors.text.muted} style={{ marginTop: 2 }}>
                    📍 {item.endereco}
                  </Text>
                  <Text variant="caption" color={colors.text.tertiary} style={{ marginTop: 2 }}>
                    🕐 {item.horario}
                  </Text>
                </View>
                {selected === item.id && (
                  <View style={styles.activeBadge}>
                    <Text variant="caption" color={colors.white}>Ativa</Text>
                  </View>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <Text variant="caption" color={colors.text.muted} align="center" style={{ marginTop: spacing[4] }}>
            Mais unidades em breve
          </Text>
        }
      />
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
  searchWrap: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  list: { padding: spacing[5], gap: spacing[3], paddingBottom: spacing[12] },
  card: { padding: spacing[4] },
  cardSelected: {
    borderColor: colors.brand.red,
    backgroundColor: 'rgba(226,0,0,0.05)',
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] },
  radioWrap: { paddingTop: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.dark.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.brand.red },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand.red,
  },
  activeBadge: {
    backgroundColor: colors.brand.red,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
});
