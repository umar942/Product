import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

type DashboardHeaderProps = {
  accent: string;
  mutedText: string;
  showAddUser: boolean;
  onMenuPress: () => void;
  onBackPress: () => void;
};

export function DashboardHeader({
  accent,
  mutedText,
  showAddUser,
  onMenuPress,
  onBackPress,
}: DashboardHeaderProps) {
  const handlePress = showAddUser ? onBackPress : onMenuPress;

  return (
    <View style={styles.headerRow}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.hamburgerButton, { opacity: pressed ? 0.6 : 1 }]}>
        {showAddUser ? (
          <ThemedText style={[styles.backIcon, { color: accent }]}>{'<'}</ThemedText>
        ) : (
          <>
            <View style={[styles.hamburgerLine, { backgroundColor: accent }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: accent }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: accent }]} />
          </>
        )}
      </Pressable>
      <View style={styles.headerText}>
        <ThemedText type="title" style={[styles.title, { fontFamily: Fonts.rounded }]}>
          Dashboard
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: mutedText }]}>
          Add users and keep their details ready for quick access.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 28,
  },
  headerText: {
    marginTop: 50,
    flex: 1,
    alignItems: 'flex-start',
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
  hamburgerButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    borderRadius: 999,
  },
  backIcon: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
});
