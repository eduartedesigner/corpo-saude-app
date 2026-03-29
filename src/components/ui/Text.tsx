/**
 * Text Component
 * Typography wrapper with design system tokens
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { typography, TypographyToken } from '../../theme/typography';
import { colors } from '../../theme/colors';

interface TextProps extends RNTextProps {
  variant?: TypographyToken;
  color?: string;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

export function Text({
  variant = 'bodyMd',
  color = colors.text.primary,
  align,
  style,
  children,
  ...props
}: TextProps) {
  const variantStyle = typography[variant] || typography.bodyMd;

  return (
    <RNText
      style={[
        variantStyle,
        { color },
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

/**
 * Heading shortcuts
 */
export function H1(props: Omit<TextProps, 'variant'>) {
  return <Text variant="h1" {...props} />;
}

export function H2(props: Omit<TextProps, 'variant'>) {
  return <Text variant="h2" {...props} />;
}

export function H3(props: Omit<TextProps, 'variant'>) {
  return <Text variant="h3" {...props} />;
}

export function H4(props: Omit<TextProps, 'variant'>) {
  return <Text variant="h4" {...props} />;
}

export function Caption(props: Omit<TextProps, 'variant'>) {
  return <Text variant="caption" color={colors.text.tertiary} {...props} />;
}

export function Label(props: Omit<TextProps, 'variant'>) {
  return <Text variant="label" {...props} />;
}
