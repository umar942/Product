import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

type AuthViewProps = {
  accent: string;
  mutedText: string;
  inputBackground: string;
  inputBorder: string;
  textColor: string;
  cardBackground: string;
  cardAltBackground: string;
  primaryButtonTextColor: string;
  onLogin: () => void;
  onSignUp?: () => void;
};

export function AuthView({
  accent,
  mutedText,
  inputBackground,
  inputBorder,
  textColor,
  cardBackground,
  cardAltBackground,
  primaryButtonTextColor,
  onLogin,
  onSignUp,
}: AuthViewProps) {
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
          Login
        </ThemedText>
        <ThemedText style={[styles.label, { color: mutedText }]}>Email</ThemedText>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={mutedText}
          selectionColor={accent}
          style={[
            styles.input,
            {
              backgroundColor: inputBackground,
              borderColor: inputBorder,
              color: textColor,
            },
          ]}
        />
        <ThemedText style={[styles.label, { color: mutedText }]}>Password</ThemedText>
        <TextInput
          autoCapitalize="none"
          autoComplete="password"
          placeholder="********"
          placeholderTextColor={mutedText}
          selectionColor={accent}
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor: inputBackground,
              borderColor: inputBorder,
              color: textColor,
            },
          ]}
        />
        <Pressable
          onPress={onLogin}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
          ]}>
          <ThemedText style={[styles.primaryButtonText, { color: primaryButtonTextColor }]}>
            Log In
          </ThemedText>
        </Pressable>
        <ThemedText style={[styles.helperText, { color: mutedText }]}>
          Forgot password? We can help you reset it.
        </ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: cardAltBackground }]}>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          New here?
        </ThemedText>
        <ThemedText style={[styles.cardCopy, { color: mutedText }]}>
          Create a profile, save your preferences, and pick up where you left off.
        </ThemedText>
        <Pressable
          onPress={onSignUp}
          style={({ pressed }) => [
            styles.secondaryButton,
            { borderColor: accent, opacity: pressed ? 0.7 : 1 },
          ]}>
          <ThemedText style={[styles.secondaryButtonText, { color: accent }]}>
            Sign Up
          </ThemedText>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 28,
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
  helperText: {
    marginTop: 10,
    fontSize: 13,
  },
  cardCopy: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
