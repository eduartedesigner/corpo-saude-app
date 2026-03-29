/**
 * Verify OTP Screen
 * Código de verificação de 6 dígitos
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../../src/components/layout';
import { Button, Text, H3 } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { fontFamily, fontSize } from '../../src/theme/typography';
import { useAuthStore } from '../../src/stores/authStore';

const CODE_LENGTH = 6;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const hasCompletedOnboarding = useAuthStore((s) => s.hasCompletedOnboarding);

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRef = useRef<TextInput>(null);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-focus input
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleCodeChange = (text: string) => {
    const numbers = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(numbers);
    setError('');

    // Auto-submit when complete
    if (numbers.length === CODE_LENGTH) {
      handleVerify(numbers);
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const tokenToVerify = otpCode || code;
    if (tokenToVerify.length < CODE_LENGTH) {
      setError('Digite o código completo');
      return;
    }

    setLoading(true);
    const result = await verifyOtp(phone || '', tokenToVerify);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      setCode('');
    } else {
      // Navigate based on state
      if (hasCompletedOnboarding) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(onboarding)/intro');
      }
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setCode('');
    setError('');
    // Re-send OTP
    useAuthStore.getState().signInWithOtp(phone || '');
  };

  // Format phone for display
  const displayPhone = phone?.replace('+55', '') || '';

  return (
    <ScreenContainer scrollable>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Text variant="bodyMd" color={colors.text.secondary}>
            ← Voltar
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <H3>Código de{'\n'}verificação</H3>
          <Text
            variant="bodySm"
            color={colors.text.tertiary}
            style={styles.subtitle}
          >
            Enviamos um código para{' '}
            <Text variant="bodySm" color={colors.white}>
              +55 {displayPhone}
            </Text>
          </Text>
        </View>

        {/* Hidden input */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleCodeChange}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          style={styles.hiddenInput}
          autoComplete="sms-otp"
          textContentType="oneTimeCode"
        />

        {/* Code display boxes */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => inputRef.current?.focus()}
          style={styles.codeContainer}
        >
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.codeBox,
                code.length === i && styles.codeBoxActive,
                error ? styles.codeBoxError : undefined,
              ]}
            >
              <Text variant="h3" color={colors.white}>
                {code[i] || ''}
              </Text>
            </View>
          ))}
        </TouchableOpacity>

        {error ? (
          <Text
            variant="bodySm"
            color={colors.semantic.error}
            align="center"
            style={styles.error}
          >
            {error}
          </Text>
        ) : null}

        {/* Resend */}
        <View style={styles.resendContainer}>
          {countdown > 0 ? (
            <Text variant="bodySm" color={colors.text.muted} align="center">
              Reenviar código em {countdown}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text variant="label" color={colors.brand.red} align="center">
                Reenviar código
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Button
          title="VERIFICAR"
          onPress={() => handleVerify()}
          size="lg"
          fullWidth
          loading={loading}
          disabled={code.length < CODE_LENGTH}
        />
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
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[6],
  },
  codeBox: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dark.surfaceLight,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBoxActive: {
    borderColor: colors.brand.red,
  },
  codeBoxError: {
    borderColor: colors.semantic.error,
  },
  error: {
    marginBottom: spacing[4],
  },
  resendContainer: {
    marginBottom: spacing[8],
  },
});
