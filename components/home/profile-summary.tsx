import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

type ProfileSummaryProps = {
  accent: string;
  mutedText: string;
  cardBackground: string;
  cardAltBackground: string;
  inputBorder: string;
  primaryButtonTextColor: string;
  name: string;
  email?: string;
  totalUsers: number;
  activeUsers: number;
  onAddUser: () => void;
  onOpenActiveUsers?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

const getInitials = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'U';
  }

  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const second = parts.length > 1 ? parts[1]?.[0] ?? '' : parts[0]?.[1] ?? '';
  return `${first}${second}`.toUpperCase();
};

export function ProfileSummary({
  accent,
  mutedText,
  cardBackground,
  cardAltBackground,
  inputBorder,
  primaryButtonTextColor,
  name,
  email,
  totalUsers,
  activeUsers,
  onAddUser,
  onOpenActiveUsers,
  onRefresh,
  isRefreshing = false,
}: ProfileSummaryProps) {
  const initials = getInitials(name || email || '');

  return (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <View style={styles.headerRow}>
        <View style={[styles.avatar, { backgroundColor: accent }]}>
          <ThemedText style={styles.avatarText}>{initials}</ThemedText>
        </View>
        <View style={styles.identity}>
          <ThemedText style={[styles.name, { fontFamily: Fonts.rounded }]}>
            {name}
          </ThemedText>
          {email ? (
            <ThemedText style={[styles.email, { color: mutedText }]}>
              {email}
            </ThemedText>
          ) : null}
        </View>
       
      </View>

      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: cardAltBackground, borderColor: inputBorder },
          ]}>
          <ThemedText style={[styles.statLabel, { color: mutedText }]}>
            Total users
          </ThemedText>
          <ThemedText style={styles.statValue}>{totalUsers}</ThemedText>
        </View>
        <Pressable
          onPress={onOpenActiveUsers}
          disabled={!onOpenActiveUsers}
          style={({ pressed }) => [
            styles.statCard,
            { backgroundColor: cardAltBackground, borderColor: inputBorder },
            pressed && onOpenActiveUsers ? styles.statCardPressed : null,
          ]}>
          <ThemedText style={[styles.statLabel, { color: mutedText }]}>
            Active users
          </ThemedText>
          <ThemedText style={styles.statValue}>{activeUsers}</ThemedText>
        </Pressable>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={onAddUser}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
          ]}>
          <ThemedText style={[styles.primaryButtonText, { color: primaryButtonTextColor }]}>
            Add user
          </ThemedText>
        </Pressable>
        {onRefresh ? (
          <Pressable
            onPress={onRefresh}
            disabled={isRefreshing}
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: accent, opacity: pressed ? 0.7 : 1 },
              isRefreshing && styles.secondaryButtonDisabled,
            ]}>
            <ThemedText style={[styles.secondaryButtonText, { color: accent }]}>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f1418',
  },
  identity: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    lineHeight: 22,
  },
  email: {
    marginTop: 4,
    fontSize: 13,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  statCardPressed: {
    opacity: 0.85,
  },
  statLabel: {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  statValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '700',
  },
  actionsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontWeight: '700',
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonDisabled: {
    opacity: 0.6,
  },
});
