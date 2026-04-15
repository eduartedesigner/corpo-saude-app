/**
 * Profile Screen
 * 
 * PRD: Perfil MQV, assinatura, configurações
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ToastAndroid, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/layout';
import { Text, H3, Card } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { useAuthStore } from '../../src/stores/authStore';

const MENU_ITEMS = [
  { icon: '🏥', label: 'Avaliação MQV', desc: 'Ver ou refazer sua avaliação de saúde', route: '/(onboarding)/mqv-result' },
  { icon: '💳', label: 'Assinatura', desc: 'Gerenciar seu plano', route: '/(onboarding)/subscription-wall' },
  { icon: '🔔', label: 'Notificações', desc: 'Configurar alertas e lembretes', route: null },
  { icon: '📏', label: 'Medidas Corporais', desc: 'Atualizar peso e medidas', route: null },
  { icon: '📸', label: 'Fotos de Evolução', desc: 'Comparar seu antes e depois', route: null },
  { icon: '🏋️', label: 'Minha Unidade', desc: 'Selecionar academia', route: null },
  { icon: '🔒', label: 'Privacidade (LGPD)', desc: 'Seus dados e direitos', route: null },
  { icon: '❓', label: 'Ajuda e Suporte', desc: 'Fale conosco', route: null },
];

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const hasActiveSubscription = useAuthStore((s) => s.hasActiveSubscription);
  const signOut = useAuthStore((s) => s.signOut);

  const handleSignOut = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable padded={false} edges={['top']}>
      <View style={styles.content}>
        {/* Profile header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <H3>{profile?.full_name || 'Atleta'}</H3>
          <Text variant="bodySm" color={colors.text.tertiary}>
            {profile?.phone || ''}
          </Text>
          <View style={styles.planBadge}>
            <Text
              variant="captionBold"
              color={hasActiveSubscription ? colors.semantic.success : colors.text.muted}
            >
              {hasActiveSubscription ? '⭐ PREMIUM' : 'GRATUITO'}
            </Text>
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                if (item.route) {
                  router.push(item.route as any);
                } else {
                  Alert.alert('Em breve', `"${item.label}" estará disponível em breve.`);
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuText}>
                <Text variant="label" color={colors.white}>
                  {item.label}
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  {item.desc}
                </Text>
              </View>
              <Text variant="bodySm" color={colors.text.muted}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text variant="label" color={colors.semantic.error}>
            Sair da conta
          </Text>
        </TouchableOpacity>

        {/* Version */}
        <Text
          variant="caption"
          color={colors.text.muted}
          align="center"
          style={styles.version}
        >
          App Corpo e Saúde v1.0.0{'\n'}
          Feito com ❤️ para sua saúde
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing[12],
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[5],
    gap: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark.surface,
    borderWidth: 2,
    borderColor: colors.brand.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  planBadge: {
    marginTop: spacing[1],
    backgroundColor: colors.dark.surface,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  menu: {
    paddingTop: spacing[2],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    gap: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  menuIcon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  menuText: {
    flex: 1,
    gap: 2,
  },
  signOutBtn: {
    alignItems: 'center',
    paddingVertical: spacing[5],
    marginTop: spacing[4],
  },
  version: {
    paddingTop: spacing[4],
    lineHeight: 18,
  },
});
