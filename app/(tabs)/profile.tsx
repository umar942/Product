import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getMe, updatePassword } from '@/services/api';

type ProfileUser = {
  id: string;
  name: string;
  email: string;
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [authToken, setAuthToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const screenBackground = isDark ? '#121417' : '#fdf8f2';
  const cardBackground = isDark ? '#1b2024' : '#ffffff';
  const inputBackground = isDark ? '#151a1e' : '#ffffff';
  const inputBorder = isDark ? '#2b3238' : '#e4dad0';
  const mutedText = isDark ? '#a9b1b8' : '#6d584b';
  const primaryButtonTextColor = isDark ? '#101418' : '#ffffff';

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token || !isMounted) {
        setLoadingProfile(false);
        return;
      }

      setAuthToken(token);
      try {
        const data = await getMe(token);
        if (isMounted) {
          setProfile(data);
        }
      } catch {
        if (isMounted) {
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const validateForm = () => {
    if (!authToken) {
      return 'Please log in again to update your password.';
    }
    if (!currentPassword.trim()) {
      return 'Current password is required.';
    }
    if (!newPassword.trim()) {
      return 'New password is required.';
    }
    if (newPassword.trim().length < 6) {
      return 'New password must be at least 6 characters.';
    }
    if (newPassword.trim() === currentPassword.trim()) {
      return 'New password must be different from the current password.';
    }
    if (confirmPassword.trim() !== newPassword.trim()) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleUpdatePassword = async () => {
    if (isSubmitting) {
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePassword(authToken as string, {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      });
      setFormSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update password.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.screen} lightColor={screenBackground} darkColor={screenBackground}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <ThemedText type="title" style={[styles.title, { fontFamily: Fonts.rounded }]}>
              Profile
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: mutedText }]}>
              Manage your account and update your password.
            </ThemedText>
          </View>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Account
            </ThemedText>
            {loadingProfile ? (
              <ThemedText style={[styles.bodyText, { color: mutedText }]}>
                Loading profile...
              </ThemedText>
            ) : profile ? (
              <>
                <View style={styles.profileRow}>
                  <ThemedText style={[styles.profileLabel, { color: mutedText }]}>
                    Name
                  </ThemedText>
                  <ThemedText style={styles.profileValue}>{profile.name}</ThemedText>
                </View>
                <View style={styles.profileRow}>
                  <ThemedText style={[styles.profileLabel, { color: mutedText }]}>
                    Email
                  </ThemedText>
                  <ThemedText style={styles.profileValue}>{profile.email}</ThemedText>
                </View>
              </>
            ) : (
              <ThemedText style={[styles.bodyText, { color: mutedText }]}>
                Please log in again to view profile details.
              </ThemedText>
            )}
          </View>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <View style={styles.cardHeader}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Change password
              </ThemedText>
              <Pressable
                onPress={() => setShowPasswords((prev) => !prev)}
                style={({ pressed }) => [
                  styles.toggleButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}>
                <IconSymbol
                  name={showPasswords ? 'eye.slash' : 'eye'}
                  size={18}
                  color={palette.tint}
                />
              </Pressable>
            </View>
            <ThemedText style={[styles.label, { color: mutedText }]}>
              Current password
            </ThemedText>
            <TextInput
              autoCapitalize="none"
              secureTextEntry={!showPasswords}
              placeholder="Current password"
              placeholderTextColor={mutedText}
              selectionColor={palette.tint}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  borderColor: inputBorder,
                  color: palette.text,
                },
              ]}
            />
            <ThemedText style={[styles.label, { color: mutedText }]}>New password</ThemedText>
            <TextInput
              autoCapitalize="none"
              secureTextEntry={!showPasswords}
              placeholder="New password"
              placeholderTextColor={mutedText}
              selectionColor={palette.tint}
              value={newPassword}
              onChangeText={setNewPassword}
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  borderColor: inputBorder,
                  color: palette.text,
                },
              ]}
            />
            <ThemedText style={[styles.label, { color: mutedText }]}>
              Confirm new password
            </ThemedText>
            <TextInput
              autoCapitalize="none"
              secureTextEntry={!showPasswords}
              placeholder="Confirm new password"
              placeholderTextColor={mutedText}
              selectionColor={palette.tint}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  borderColor: inputBorder,
                  color: palette.text,
                },
              ]}
            />
            {formError ? (
              <ThemedText style={[styles.message, { color: '#c0392b' }]}>
                {formError}
              </ThemedText>
            ) : null}
            {formSuccess ? (
              <ThemedText style={[styles.message, { color: '#1f8a4c' }]}>
                {formSuccess}
              </ThemedText>
            ) : null}
            <Pressable
              onPress={handleUpdatePassword}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: palette.tint, opacity: pressed ? 0.85 : 1 },
                isSubmitting && styles.primaryButtonDisabled,
              ]}>
              <ThemedText style={[styles.primaryButtonText, { color: primaryButtonTextColor }]}>
                {isSubmitting ? 'Updating...' : 'Update password'}
              </ThemedText>
            </Pressable>
            <ThemedText style={[styles.helperText, { color: mutedText }]}>
              Password must be at least 6 characters long.
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 24,
    marginTop: 24,
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
  },
  profileRow: {
    marginBottom: 10,
  },
  profileLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  profileValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
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
  toggleButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  message: {
    marginBottom: 10,
    fontSize: 13,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    fontWeight: '700',
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  helperText: {
    marginTop: 10,
    fontSize: 12,
  },
});
