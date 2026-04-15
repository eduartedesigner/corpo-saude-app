/**
 * Ajuda e Suporte — FAQ + Contato
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Linking, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/layout';
import { Text, H3, H4, Card } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius } from '../src/theme/spacing';

const FAQ = [
  {
    q: 'Como funciona o Plano com IA?',
    a: 'Nossa IA analisa seu perfil MQV (nível de condicionamento, objetivos, restrições físicas) e gera um plano de treino 100% personalizado. O professor da sua academia revisa e aprova antes de você receber.',
  },
  {
    q: 'Posso usar o app sem internet?',
    a: 'Sim! O app funciona offline. Seus treinos são sincronizados automaticamente quando a conexão retornar.',
  },
  {
    q: 'Como cancelo minha assinatura?',
    a: 'Acesse Perfil → Assinatura → Cancelar plano. O cancelamento é imediato e você mantém o acesso até o fim do período pago.',
  },
  {
    q: 'Os vídeos dos exercícios consomem dados?',
    a: 'Os GIFs são carregados uma vez e ficam em cache no dispositivo. Recomendamos baixar em Wi-Fi na primeira vez.',
  },
  {
    q: 'Como registrar uma lesão ou restrição?',
    a: 'Refaça a Avaliação MQV (Perfil → Avaliação MQV) e informe as restrições. A IA ajustará seus treinos automaticamente.',
  },
  {
    q: 'Posso trocar de academia?',
    a: 'Sim. Acesse Perfil → Minha Unidade e selecione a nova academia. Seu histórico de treinos é mantido.',
  },
  {
    q: 'Como funciona o timer de descanso?',
    a: 'O timer inicia automaticamente após você confirmar cada série. Ele toca um sinal sonoro quando o descanso termina.',
  },
];

const CONTATOS = [
  { icon: '💬', label: 'WhatsApp', desc: 'Resposta em até 30 minutos', action: () => Linking.openURL('https://wa.me/5511999999999') },
  { icon: '📧', label: 'E-mail', desc: 'suporte@corpoesaude.app', action: () => Linking.openURL('mailto:suporte@corpoesaude.app') },
  { icon: '📸', label: 'Instagram', desc: '@corpoesaudeapp', action: () => Linking.openURL('https://instagram.com') },
];

export default function AjudaSuporteScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (i: number) => setExpanded(expanded === i ? null : i);

  return (
    <ScreenContainer padded={false} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="bodyMd" color={colors.text.secondary}>← Voltar</Text>
        </TouchableOpacity>
        <H3>Ajuda e Suporte</H3>
        <Text variant="bodySm" color={colors.text.tertiary}>
          Estamos aqui para ajudar
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Contato rápido */}
        <H4 style={{ marginBottom: spacing[3] }}>Fale Conosco</H4>
        <View style={{ gap: spacing[3], marginBottom: spacing[6] }}>
          {CONTATOS.map((c, i) => (
            <TouchableOpacity key={i} onPress={c.action} activeOpacity={0.8}>
              <Card variant="outline" style={styles.contatoCard}>
                <Text style={{ fontSize: 24 }}>{c.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="label" color={colors.white}>{c.label}</Text>
                  <Text variant="caption" color={colors.text.muted}>{c.desc}</Text>
                </View>
                <Text variant="bodySm" color={colors.brand.red}>→</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ */}
        <H4 style={{ marginBottom: spacing[3] }}>Perguntas Frequentes</H4>
        <View style={{ gap: spacing[2] }}>
          {FAQ.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => toggle(i)}
              activeOpacity={0.8}
            >
              <Card variant="outline" style={styles.faqCard}>
                <View style={styles.faqHeader}>
                  <Text variant="bodySm" color={colors.white} style={{ flex: 1 }}>
                    {item.q}
                  </Text>
                  <Text color={colors.brand.red} style={{ fontSize: 18, marginLeft: spacing[2] }}>
                    {expanded === i ? '▲' : '▼'}
                  </Text>
                </View>
                {expanded === i && (
                  <Text variant="bodySm" color={colors.text.secondary} style={{ marginTop: spacing[3] }}>
                    {item.a}
                  </Text>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Text variant="caption" color={colors.text.muted} align="center" style={{ marginTop: spacing[6] }}>
          App Corpo e Saúde v1.0.0{'\n'}
          Horário de atendimento: Seg–Sex 8h–18h
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
  contatoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
  },
  faqCard: { padding: spacing[4] },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
