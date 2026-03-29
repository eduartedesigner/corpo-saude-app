/**
 * Login Screen — Email + Senha
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/layout';
import { Button, Text, Input, H3 } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { useAuthStore } from '../../src/stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    if (isSignUp && !name) {
      setError('Digite seu nome completo');
      return;
    }

    setLoading(true);
    setError('');

    const result = isSignUp
      ? await signUpWithEmail(email, password, name)
      : await signInWithEmail(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.replace('/(onboarding)/intro');
    }
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.container}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text variant="bodyMd" color={colors.text.secondary}>
            ← Voltar
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <H3>{isSignUp ? 'Criar conta' : 'Entrar'}</H3>
          <Text variant="bodySm" color={colors.text.tertiary} style={styles.subtitle}>
            {isSignUp
              ? 'Crie sua conta para começar'
              : 'Entre com seu email e senha'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {isSignUp && (
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              value={name}
              onChangeText={(t) => { setName(t); setError(''); }}
              style={styles.input}
            />
          )}
          <Input
            label="Email"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); }}
            style={styles.input}
          />
          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={password}
            onChangeText={(t) => { setPassword(t); setError(''); }}
            error={error}
          />
        </View>

        <Button
          title={isSignUp ? 'CRIAR CONTA' : 'ENTRAR'}
          onPress={handleSubmit}
          size="lg"
          fullWidth
          loading={loading}
        />

        <TouchableOpacity
          onPress={() => { setIsSignUp(!isSignUp); setError(''); }}
          style={styles.toggle}
        >
          <Text variant="bodySm" color={colors.text.secondary} align="center">
            {isSignUp
              ? 'Já tem conta? '
              : 'Não tem conta? '}
            <Text variant="bodySm" color={colors.brand.red}>
              {isSignUp ? 'Entrar' : 'Criar conta'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing[4],
  },
  backBtn: {
    marginBottom: spacing[8],
  },
  header: {
    marginBottom: spacing[10],
  },
  subtitle: {
    marginTop: spacing[3],
    lineHeight: 22,
  },
  form: {
    marginBottom: spacing[8],
  },
  input: {
    marginBottom: spacing[4],
  },
  toggle: {
    marginTop: spacing[6],
  },
});
