import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

type AuthViewProps = {
  accent: string;
  mutedText: string;
  inputBackground: string;
  inputBorder: string;
  textColor: string;
  cardBackground: string;
  primaryButtonTextColor: string;
  mode: 'login' | 'signup';
  name: string;
  email: string;
  password: string;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
};

export function AuthView({
  accent,
  mutedText,
  inputBackground,
  inputBorder,
  textColor,
  cardBackground,
  primaryButtonTextColor,
  mode,
  name,
  email,
  password,
  isSubmitting,
  errorMessage,
  onChangeName,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onToggleMode,
}: AuthViewProps) {
  const isSignup = mode === 'signup';
  const [showPassword, setShowPassword] = useState(false);
  const primaryLabel = isSignup ? 'Create Account' : 'Log In';
  const togglePrompt = isSignup ? 'Already have an account?' : 'New here?';
  const toggleAction = isSignup ? 'Log In' : 'Sign Up';

  return (
    <>
      <View style={styles.header}>
        <ThemedText type="title" style={[styles.title, { fontFamily: Fonts.rounded }]}>
          Welcome to the dashboard
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: mutedText }]}>
          Log in to continue or create a new account in seconds.
        </ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: cardBackground }]}>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          {isSignup ? 'Create account' : 'Login'}
        </ThemedText>
        {isSignup ? (
          <>
            <ThemedText style={[styles.label, { color: mutedText }]}>Name</ThemedText>
            <TextInput
              autoCapitalize="words"
              placeholder="Your name"
              placeholderTextColor={mutedText}
              selectionColor={accent}
              value={name}
              onChangeText={onChangeName}
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  borderColor: inputBorder,
                  color: textColor,
                },
              ]}
            />
          </>
        ) : null}
        <ThemedText style={[styles.label, { color: mutedText }]}>Email</ThemedText>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={mutedText}
          selectionColor={accent}
          value={email}
          onChangeText={onChangeEmail}
          style={[
            styles.input,
            {
              backgroundColor: inputBackground,
              borderColor: inputBorder,
              color: textColor,
            },
          ]}
        />
        <View style={styles.labelRow}>
          <ThemedText style={[styles.label, { color: mutedText }]}>Password</ThemedText>
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={({ pressed }) => [
              styles.toggleButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}>
            <IconSymbol
              name={showPassword ? 'eye.slash' : 'eye'}
              size={18}
              color={accent}
            />
          </Pressable>
        </View>
        <TextInput
          autoCapitalize="none"
          autoComplete="password"
          placeholder="********"
          placeholderTextColor={mutedText}
          selectionColor={accent}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={onChangePassword}
          style={[
            styles.input,
            {
              backgroundColor: inputBackground,
              borderColor: inputBorder,
              color: textColor,
            },
          ]}
        />
        {errorMessage ? (
          <ThemedText style={[styles.errorText, { color: '#c0392b' }]}>
            {errorMessage}
          </ThemedText>
        ) : null}
        <Pressable
          onPress={onSubmit}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
            isSubmitting && styles.primaryButtonDisabled,
          ]}>
          <ThemedText style={[styles.primaryButtonText, { color: primaryButtonTextColor }]}>
            {primaryLabel}
          </ThemedText>
        </Pressable>
        <ThemedText style={[styles.helperText, { color: mutedText }]}>
          {isSignup
            ? 'Use a strong password you will remember.'
            : 'Forgot password? We can help you reset it.'}
        </ThemedText>
        <View style={styles.toggleRow}>
          <ThemedText style={[styles.togglePrompt, { color: mutedText }]}>
            {togglePrompt}
          </ThemedText>
          <Pressable
            onPress={onToggleMode}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.toggleLink,
              { opacity: pressed ? 0.7 : 1 },
            ]}>
            <ThemedText style={[styles.toggleLinkText, { color: accent }]}>
              {toggleAction}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 28,
    marginTop: 76,
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'left',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'left',
  },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  toggleButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  helperText: {
    marginTop: 10,
    fontSize: 13,
  },
  errorText: {
    marginBottom: 10,
    fontSize: 13,
  },
  toggleRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  togglePrompt: {
    fontSize: 13,
  },
  toggleLink: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  toggleLinkText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
