import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type AddUserFormProps = {
  accent: string;
  mutedText: string;
  inputBackground: string;
  inputBorder: string;
  textColor: string;
  cardBackground: string;
  primaryButtonTextColor: string;
  title?: string;
  submitLabel?: string;
  userName: string;
  houseNumber: string;
  phoneNumber: string;
  phoneHelperText?: string;
  phoneErrorText?: string | null;
  expiryDate: string;
  expiryDateValue: Date;
  showExpiryPicker: boolean;
  canSubmit: boolean;
  isSubmitting?: boolean;
  onChangeUserName: (value: string) => void;
  onChangeHouseNumber: (value: string) => void;
  onChangePhoneNumber: (value: string) => void;
  onSubmit: () => void;
  onOpenExpiryPicker: () => void;
  onExpiryChange: (_event: unknown, selectedDate?: Date) => void;
  onClosePicker: () => void;
};

export function AddUserForm({
  accent,
  mutedText,
  inputBackground,
  inputBorder,
  textColor,
  cardBackground,
  primaryButtonTextColor,
  title = 'Add User',
  submitLabel = 'Add User',
  userName,
  houseNumber,
  phoneNumber,
  phoneHelperText,
  phoneErrorText,
  expiryDate,
  expiryDateValue,
  showExpiryPicker,
  canSubmit,
  isSubmitting = false,
  onChangeUserName,
  onChangeHouseNumber,
  onChangePhoneNumber,
  onSubmit,
  onOpenExpiryPicker,
  onExpiryChange,
  onClosePicker,
}: AddUserFormProps) {
  const isDisabled = isSubmitting || !canSubmit;
  const dayMs = 24 * 60 * 60 * 1000;
  const expiryPreview = React.useMemo(() => {
    if (!expiryDate) {
      return '';
    }

    const today = new Date();
    const todayKey = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const expiryKey = Date.UTC(
      expiryDateValue.getFullYear(),
      expiryDateValue.getMonth(),
      expiryDateValue.getDate()
    );
    const diffDays = Math.round((expiryKey - todayKey) / dayMs);

    if (Number.isNaN(diffDays)) {
      return '';
    }
    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return daysAgo === 1 ? 'Expired 1 day ago' : `Expired ${daysAgo} days ago`;
    }
    if (diffDays === 0) {
      return 'Expires today';
    }
    if (diffDays === 1) {
      return 'Tomorrow';
    }
    return `${diffDays} days left`;
  }, [expiryDate, expiryDateValue, dayMs]);

  return (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <View style={styles.cardHeader}>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          {title}
        </ThemedText>
      </View>
      <ThemedText style={[styles.label, { color: mutedText }]}>User Name</ThemedText>
      <TextInput
        placeholder="Full name"
        placeholderTextColor={mutedText}
        selectionColor={accent}
        value={userName}
        onChangeText={onChangeUserName}
        style={[
          styles.input,
          {
            backgroundColor: inputBackground,
            borderColor: inputBorder,
            color: textColor,
          },
        ]}
      />
      <ThemedText style={[styles.label, { color: mutedText }]}>House Number</ThemedText>
      <TextInput
        placeholder="A-12"
        placeholderTextColor={mutedText}
        selectionColor={accent}
        value={houseNumber}
        onChangeText={onChangeHouseNumber}
        style={[
          styles.input,
          {
            backgroundColor: inputBackground,
            borderColor: inputBorder,
            color: textColor,
          },
        ]}
      />
      <ThemedText style={[styles.label, { color: mutedText }]}>Phone Number</ThemedText>
      <TextInput
        keyboardType="phone-pad"
        placeholder="+923331234567"
        placeholderTextColor={mutedText}
        selectionColor={accent}
        value={phoneNumber}
        onChangeText={onChangePhoneNumber}
        style={[
          styles.input,
          {
            backgroundColor: inputBackground,
            borderColor: phoneErrorText ? '#c0392b' : inputBorder,
            color: textColor,
          },
        ]}
      />
      {phoneHelperText ? (
        <ThemedText style={[styles.helperText, { color: mutedText }]}>
          {phoneHelperText}
        </ThemedText>
      ) : null}
      {phoneErrorText ? (
        <ThemedText style={[styles.errorText, { color: '#c0392b' }]}>
          {phoneErrorText}
        </ThemedText>
      ) : null}
      <ThemedText style={[styles.label, { color: mutedText }]}>Expiry Date</ThemedText>
      <Pressable
        onPress={onOpenExpiryPicker}
        style={({ pressed }) => [
          styles.input,
          {
            backgroundColor: inputBackground,
            borderColor: inputBorder,
            opacity: pressed ? 0.9 : 1,
          },
        ]}>
        <ThemedText style={[styles.inputText, { color: expiryDate ? textColor : mutedText }]}>
          {expiryDate || 'MM/YY/DD'}
        </ThemedText>
      </Pressable>
      {expiryPreview ? (
        <ThemedText style={[styles.previewText, { color: accent }]}>
          {expiryPreview}
        </ThemedText>
      ) : null}
      {showExpiryPicker ? (
        Platform.OS === 'ios' ? (
          <View
            style={[
              styles.pickerCard,
              { backgroundColor: inputBackground, borderColor: inputBorder },
            ]}>
            <DateTimePicker
              value={expiryDateValue}
              mode="date"
              display="inline"
              onChange={onExpiryChange}
            />
            <Pressable
              onPress={onClosePicker}
              style={({ pressed }) => [
                styles.textButton,
                { opacity: pressed ? 0.6 : 1, alignSelf: 'flex-end' },
              ]}>
              <ThemedText style={[styles.textButtonLabel, { color: accent }]}>Done</ThemedText>
            </Pressable>
          </View>
        ) : (
          <DateTimePicker
            value={expiryDateValue}
            mode="date"
            display="calendar"
            onChange={onExpiryChange}
          />
        )
      ) : null}
      <Pressable
        onPress={onSubmit}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.primaryButton,
          {
            backgroundColor: accent,
            opacity: pressed ? 0.85 : 1,
          },
          isDisabled && styles.primaryButtonDisabled,
        ]}>
        <ThemedText style={[styles.primaryButtonText, { color: primaryButtonTextColor }]}>
          {submitLabel}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
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
  pickerCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  helperText: {
    fontSize: 12,
    marginTop: -6,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    marginTop: 0,
    marginBottom: 10,
  },
  previewText: {
    fontSize: 12,
    marginTop: -6,
    marginBottom: 12,
    fontWeight: '600',
  },
});
