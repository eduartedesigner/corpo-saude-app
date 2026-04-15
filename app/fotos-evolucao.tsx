/**
 * Fotos de Evolução — Upload e comparativo antes/depois
 */

import React, { useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '../src/components/layout';
import { Text, H3, H4, Card, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius } from '../src/theme/spacing';

type FotoSlot = { uri: string; data: string } | null;

const EVOLUCAO = [
  { label: 'Peso', antes: '80 kg', depois: '78,5 kg', delta: '−1,5 kg', positive: true },
  { label: 'Cintura', antes: '85 cm', depois: '82 cm', delta: '−3 cm', positive: true },
  { label: 'Braço', antes: '35 cm', depois: '37 cm', delta: '+2 cm', positive: true },
  { label: 'Peito', antes: '96 cm', depois: '98 cm', delta: '+2 cm', positive: true },
];

export default function FotosEvolucaoScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'comparar' | 'galeria'>('comparar');
  const [fotoAntes, setFotoAntes] = useState<FotoSlot>(null);
  const [fotoDepois, setFotoDepois] = useState<FotoSlot>(null);
  const [galeria, setGaleria] = useState<FotoSlot[]>([]);

  const pickImage = async (slot: 'antes' | 'depois' | 'galeria') => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para continuar.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const foto: FotoSlot = {
          uri: result.assets[0].uri,
          data: new Date().toLocaleDateString('pt-BR'),
        };
        if (slot === 'antes') setFotoAntes(foto);
        else if (slot === 'depois') setFotoDepois(foto);
        else setGaleria((prev) => [...prev, foto]);
      }
    } catch (e) {
      console.warn('Erro ao selecionar imagem:', e);
    }
  };

  const removeGaleria = (index: number) => {
    setGaleria((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ScreenContainer padded={false} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="bodyMd" color={colors.text.secondary}>← Voltar</Text>
        </TouchableOpacity>
        <H3>Fotos de Evolução</H3>
        <Text variant="bodySm" color={colors.text.tertiary}>
          Acompanhe sua transformação visual
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['comparar', 'galeria'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text variant="labelSm" color={tab === t ? colors.white : colors.text.muted}>
              {t === 'comparar' ? 'Comparar' : 'Galeria'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {tab === 'comparar' ? (
          <>
            {/* Comparativo lado a lado */}
            <H4 style={{ marginBottom: spacing[3] }}>Antes × Depois</H4>
            <View style={styles.compareRow}>
              {/* Antes */}
              <View style={styles.photoSlot}>
                <TouchableOpacity
                  style={styles.photoBox}
                  onPress={() => pickImage('antes')}
                  activeOpacity={0.8}
                >
                  {fotoAntes ? (
                    <Image source={{ uri: fotoAntes.uri }} style={styles.photo} />
                  ) : (
                    <View style={styles.photoEmpty}>
                      <Text style={{ fontSize: 36 }}>📷</Text>
                      <Text variant="caption" color={colors.text.muted} align="center">
                        Toque para{'\n'}adicionar foto
                      </Text>
                    </View>
                  )}
                  <View style={styles.photoLabel}>
                    <Text variant="captionBold" color={colors.white}>ANTES</Text>
                    {fotoAntes && (
                      <Text variant="caption" color="rgba(255,255,255,0.7)">{fotoAntes.data}</Text>
                    )}
                  </View>
                </TouchableOpacity>
                {fotoAntes && (
                  <TouchableOpacity onPress={() => setFotoAntes(null)} style={styles.removeBtn}>
                    <Text variant="caption" color={colors.text.muted}>🗑️ Remover</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Depois */}
              <View style={styles.photoSlot}>
                <TouchableOpacity
                  style={styles.photoBox}
                  onPress={() => pickImage('depois')}
                  activeOpacity={0.8}
                >
                  {fotoDepois ? (
                    <Image source={{ uri: fotoDepois.uri }} style={styles.photo} />
                  ) : (
                    <View style={styles.photoEmpty}>
                      <Text style={{ fontSize: 36 }}>📷</Text>
                      <Text variant="caption" color={colors.text.muted} align="center">
                        Toque para{'\n'}adicionar foto
                      </Text>
                    </View>
                  )}
                  <View style={styles.photoLabel}>
                    <Text variant="captionBold" color={colors.white}>DEPOIS</Text>
                    {fotoDepois && (
                      <Text variant="caption" color="rgba(255,255,255,0.7)">{fotoDepois.data}</Text>
                    )}
                  </View>
                </TouchableOpacity>
                {fotoDepois && (
                  <TouchableOpacity onPress={() => setFotoDepois(null)} style={styles.removeBtn}>
                    <Text variant="caption" color={colors.text.muted}>🗑️ Remover</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Dica */}
            {!fotoAntes && !fotoDepois && (
              <Card variant="outline" style={styles.tipCard}>
                <Text style={{ fontSize: 20 }}>💡</Text>
                <Text variant="caption" color={colors.text.muted} style={{ flex: 1 }}>
                  Tire fotos sempre no mesmo local, horário e posição para uma comparação mais precisa.
                </Text>
              </Card>
            )}

            {/* Tabela de evolução */}
            <H4 style={{ marginTop: spacing[5], marginBottom: spacing[3] }}>Evolução de Medidas</H4>
            <Card variant="outline" style={{ padding: spacing[4] }}>
              {EVOLUCAO.map((item, i) => (
                <View key={i} style={styles.deltaRow}>
                  <Text variant="bodySm" color={colors.text.secondary} style={{ width: 70 }}>
                    {item.label}
                  </Text>
                  <Text variant="caption" color={colors.text.muted} style={{ flex: 1 }}>{item.antes}</Text>
                  <Text color={colors.text.muted} style={{ fontSize: 12 }}>→</Text>
                  <Text variant="bodySm" color={colors.white} style={{ flex: 1, textAlign: 'center' }}>{item.depois}</Text>
                  <Text
                    variant="captionBold"
                    color={item.positive ? '#4CAF50' : colors.brand.red}
                    style={{ width: 56, textAlign: 'right' }}
                  >
                    {item.delta}
                  </Text>
                </View>
              ))}
            </Card>
          </>
        ) : (
          <>
            {/* Galeria */}
            <H4 style={{ marginBottom: spacing[3] }}>
              Todas as Fotos ({galeria.length})
            </H4>
            <View style={styles.gallery}>
              {galeria.map((foto, i) => (
                <View key={i} style={styles.galleryItem}>
                  <Image source={{ uri: foto!.uri }} style={styles.galleryPhoto} />
                  <Text variant="caption" color={colors.text.muted} align="center" style={{ marginTop: 4 }}>
                    {foto!.data}
                  </Text>
                  <TouchableOpacity onPress={() => removeGaleria(i)} style={{ alignItems: 'center', marginTop: 2 }}>
                    <Text variant="caption" color={colors.semantic.error}>Remover</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Botão adicionar */}
              <TouchableOpacity
                style={styles.addPhotoBtn}
                onPress={() => pickImage('galeria')}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 32, color: colors.text.muted }}>＋</Text>
                <Text variant="caption" color={colors.text.muted}>Adicionar</Text>
              </TouchableOpacity>
            </View>

            {galeria.length === 0 && (
              <View style={styles.emptyGaleria}>
                <Text style={{ fontSize: 48 }}>📸</Text>
                <Text variant="bodySm" color={colors.text.tertiary} align="center">
                  Nenhuma foto adicionada ainda.{'\n'}Toque em "+" para começar!
                </Text>
              </View>
            )}
          </>
        )}
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    gap: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  tabActive: {
    backgroundColor: colors.brand.red,
    borderColor: colors.brand.red,
  },
  scroll: { padding: spacing[5], paddingBottom: spacing[12] },
  compareRow: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  photoSlot: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[2],
  },
  photoBox: {
    width: '100%',
    aspectRatio: 0.75,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.dark.border,
    borderStyle: 'dashed',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoEmpty: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: spacing[4],
  },
  photoLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: spacing[2],
    alignItems: 'center',
  },
  removeBtn: {
    paddingVertical: spacing[1],
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[4],
    marginTop: spacing[2],
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
    gap: spacing[2],
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  galleryItem: {
    width: '30%',
  },
  galleryPhoto: {
    width: '100%',
    aspectRatio: 0.75,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.surface,
  },
  addPhotoBtn: {
    width: '30%',
    aspectRatio: 0.75,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  emptyGaleria: {
    alignItems: 'center',
    gap: spacing[3],
    paddingTop: spacing[8],
  },
});
