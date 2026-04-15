/**
 * Muscle Exercises — Lista de exercícios por grupo muscular
 * Usa dados centralizados de src/data/exercises.ts
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../src/components/layout';
import { Text, H3, Input } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius } from '../src/theme/spacing';
import { EXERCISES_BY_GROUP } from '../src/data/exercises';

export default function MuscleExercisesScreen() {
  const router = useRouter();
  const { muscle, muscleName } = useLocalSearchParams<{ muscle: string; muscleName: string }>();
  const [search, setSearch] = useState('');

  const exercises = EXERCISES_BY_GROUP[muscle ?? ''] ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return exercises;
    const q = search.toLowerCase();
    return exercises.filter((e) => e.name.toLowerCase().includes(q));
  }, [search, exercises]);

  return (
    <ScreenContainer padded={false} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="bodyMd" color={colors.text.secondary}>← Voltar</Text>
        </TouchableOpacity>
        <H3>{muscleName ?? 'Exercícios'}</H3>
        <Text variant="bodySm" color={colors.text.tertiary}>
          {exercises.length} exercícios
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Input
          placeholder="Buscar exercício..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Text>🔍</Text>}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.75}
            onPress={() => router.push(`/exercise-detail?id=${item.id}`)}
          >
            <Image source={item.gif} style={styles.gif} resizeMode="cover" />
            <View style={styles.cardBody}>
              <Text variant="labelSm" color={colors.white} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.badge}>
                <Text variant="caption" color={colors.brand.red}>Ver detalhes →</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 32 }}>🔍</Text>
            <Text variant="bodySm" color={colors.text.tertiary} align="center">
              Nenhum exercício encontrado para "{search}"
            </Text>
          </View>
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
  backBtn: {
    marginBottom: spacing[2],
  },
  searchWrapper: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  grid: {
    padding: spacing[4],
    gap: spacing[3],
  },
  row: {
    gap: spacing[3],
  },
  card: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  gif: {
    width: '100%',
    height: 130,
    backgroundColor: colors.dark.background,
  },
  cardBody: {
    padding: spacing[3],
    gap: spacing[2],
  },
  badge: {
    marginTop: spacing[1],
  },
  empty: {
    alignItems: 'center',
    gap: spacing[3],
    paddingTop: spacing[8],
  },
});
