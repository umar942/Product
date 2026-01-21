import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type ExpirySummaryProps = {
  mutedText: string;
  cardBackground: string;
  cardAltBackground: string;
  inputBorder: string;
  expiredCount: number;
  expiringSoonCount: number;
  expiringThreeDaysCount: number;
  expiringOneDayCount: number;
  onOpenExpired?: () => void;
  onOpenExpiringSoon?: () => void;
  onOpenExpiringThreeDays?: () => void;
  onOpenExpiringOneDay?: () => void;
};

export function ExpirySummary({
  mutedText,
  cardBackground,
  cardAltBackground,
  inputBorder,
  expiredCount,
  expiringSoonCount,
  expiringThreeDaysCount,
  expiringOneDayCount,
  onOpenExpired,
  onOpenExpiringSoon,
  onOpenExpiringThreeDays,
  onOpenExpiringOneDay,
}: ExpirySummaryProps) {
  return (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <ThemedText type="subtitle" style={styles.title}>
        Expiry overview
      </ThemedText>
      <View style={styles.statsGrid}>
        <Pressable
          onPress={onOpenExpired}
          disabled={!onOpenExpired}
          style={({ pressed }) => [
            styles.statCard,
            { backgroundColor: cardAltBackground, borderColor: inputBorder },
            pressed && onOpenExpired ? styles.statCardPressed : null,
          ]}>
          <ThemedText style={[styles.statLabel, { color: mutedText }]}>
            Expired
          </ThemedText>
          <ThemedText style={styles.statValue}>{expiredCount}</ThemedText>
        </Pressable>
        <Pressable
          onPress={onOpenExpiringSoon}
          disabled={!onOpenExpiringSoon}
          style={({ pressed }) => [
            styles.statCard,
            { backgroundColor: cardAltBackground, borderColor: inputBorder },
            pressed && onOpenExpiringSoon ? styles.statCardPressed : null,
          ]}>
          <ThemedText style={[styles.statLabel, { color: mutedText }]}>
            Expiring 10d
          </ThemedText>
          <ThemedText style={styles.statValue}>{expiringSoonCount}</ThemedText>
        </Pressable>
        <Pressable
          onPress={onOpenExpiringThreeDays}
          disabled={!onOpenExpiringThreeDays}
          style={({ pressed }) => [
            styles.statCard,
            { backgroundColor: cardAltBackground, borderColor: inputBorder },
            pressed && onOpenExpiringThreeDays ? styles.statCardPressed : null,
          ]}>
          <ThemedText style={[styles.statLabel, { color: mutedText }]}>
            Expiring 3d
          </ThemedText>
          <ThemedText style={styles.statValue}>{expiringThreeDaysCount}</ThemedText>
        </Pressable>
        <Pressable
          onPress={onOpenExpiringOneDay}
          disabled={!onOpenExpiringOneDay}
          style={({ pressed }) => [
            styles.statCard,
            { backgroundColor: cardAltBackground, borderColor: inputBorder },
            pressed && onOpenExpiringOneDay ? styles.statCardPressed : null,
          ]}>
          <ThemedText style={[styles.statLabel, { color: mutedText }]}>
            Expiring 1d
          </ThemedText>
          <ThemedText style={styles.statValue}>{expiringOneDayCount}</ThemedText>
        </Pressable>
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
  title: {
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flexGrow: 1,
    minWidth: 120,
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
});
