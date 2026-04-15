/**
 * Privacidade (LGPD) — Dados e direitos do usuário
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/layout';
import { Text, H3, H4, Card, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius } from '../src/theme/spacing';

const DADOS = [
  { label: 'Nome completo', value: 'Eduardo Silva' },
  { label: 'Telefone', value: '(11) 99999-1234' },
  { label: 'Cadastro criado em', value: 'Março de 2025' },
  { label: 'Última atividade', value: '15/04/2026' },
  { label: 'Plano ativo', value: 'Premium Anual' },
];

const DIREITOS = [
  { icon: '👁️', titulo: 'Acesso', desc: 'Ver todos os seus dados armazenados' },
  { icon: '✏️', titulo: 'Correção', desc: 'Corrigir dados incorretos ou desatualizados' },
  { icon: '🗑️', titulo: 'Exclusão', desc: 'Solicitar exclusão de todos os seus dados' },
  { icon: '📦', titulo: 'Portabilidade', desc: 'Exportar seus dados em formato legível' },
  { icon: '🚫', titulo: 'Oposição', desc: 'Opor-se ao tratamento de dados pessoais' },
];

export default function PrivacidadeScreen() {
  const router = useRouter();

  const handleExcluir = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza? Esta ação é irreversível e excluirá todos os seus dados.')) {
        window.alert('Solicitação de exclusão enviada. Você receberá um e-mail de confirmação em até 48h.');
      }
    } else {
      Alert.alert(
        'Excluir conta',
        'Tem certeza? Esta ação é irreversível e excluirá todos os seus dados.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () => Alert.alert('Solicitação enviada', 'Você receberá um e-mail de confirmação em até 48h.'),
          },
        ]
      );
    }
  };

  const handleExportar = () => {
    if (Platform.OS === 'web') {
      window.alert('Seus dados serão enviados por e-mail em até 24h.');
    } else {
      Alert.alert('Exportar dados', 'Seus dados serão enviados por e-mail em até 24h.');
    }
  };

  return (
    <ScreenContainer padded={false} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="bodyMd" color={colors.text.secondary}>← Voltar</Text>
        </TouchableOpacity>
        <H3>Privacidade (LGPD)</H3>
        <Text variant="bodySm" color={colors.text.tertiary}>
          Seus dados e direitos
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Dados armazenados */}
        <H4 style={{ marginBottom: spacing[3] }}>Dados Armazenados</H4>
        <Card variant="outline" style={{ padding: 0, overflow: 'hidden', marginBottom: spacing[5] }}>
          {DADOS.map((d, i) => (
            <View key={i} style={[styles.dataRow, i < DADOS.length - 1 && styles.dataRowBorder]}>
              <Text variant="caption" color={colors.text.muted} style={{ flex: 1 }}>{d.label}</Text>
              <Text variant="bodySm" color={colors.white}>{d.value}</Text>
            </View>
          ))}
        </Card>

        {/* Seus direitos */}
        <H4 style={{ marginBottom: spacing[3] }}>Seus Direitos (LGPD)</H4>
        <View style={{ gap: spacing[3], marginBottom: spacing[5] }}>
          {DIREITOS.map((d, i) => (
            <Card key={i} variant="outline" style={styles.direitoCard}>
              <Text style={{ fontSize: 22 }}>{d.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text variant="label" color={colors.white}>{d.titulo}</Text>
                <Text variant="caption" color={colors.text.muted}>{d.desc}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Ações */}
        <H4 style={{ marginBottom: spacing[3] }}>Ações</H4>
        <View style={{ gap: spacing[3] }}>
          <Button
            title="📦 EXPORTAR MEUS DADOS"
            onPress={handleExportar}
            fullWidth
            size="md"
          />
          <TouchableOpacity style={styles.deleteBtn} onPress={handleExcluir}>
            <Text variant="label" color={colors.semantic.error}>
              🗑️ Solicitar Exclusão da Conta
            </Text>
            <Text variant="caption" color={colors.text.muted} align="center">
              Ação irreversível — todos os dados serão removidos
            </Text>
          </TouchableOpacity>
        </View>

        <Text variant="caption" color={colors.text.muted} align="center" style={{ marginTop: spacing[6] }}>
          Lei Geral de Proteção de Dados (Lei nº 13.709/2018){'\n'}
          Dúvidas: privacidade@corpoesaude.app
        </Text>
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
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  dataRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  direitoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[4],
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: colors.semantic.error,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: 'rgba(255,59,48,0.05)',
  },
});
