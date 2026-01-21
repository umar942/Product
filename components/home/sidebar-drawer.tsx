import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type SidebarDrawerProps = {
  accent: string;
  mutedText: string;
  cardBackground: string;
  translateX: Animated.Value;
  onClose: () => void;
  onAddUser: () => void;
  onOpenUsers: () => void;
  onLogout: () => void;
  profileName?: string;
  profileEmail?: string;
};

export function SidebarDrawer({
  accent,
  mutedText,
  cardBackground,
  translateX,
  onClose,
  onAddUser,
  onOpenUsers,
  onLogout,
  profileName,
  profileEmail,
}: SidebarDrawerProps) {
  const danger = '#c0392b';
  const normalizedAccent = accent.toLowerCase();
  const primaryTextColor = normalizedAccent === '#fff' || normalizedAccent === '#ffffff'
    ? '#0f1418'
    : '#ffffff';
  const dividerColor = mutedText;
  const initialsSource = profileName || profileEmail || 'User';
  const initials = initialsSource
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.sidebarOverlay} pointerEvents="box-none">
      <Pressable style={styles.sidebarBackdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.sidebarPanel,
          { backgroundColor: cardBackground, transform: [{ translateX }] },
        ]}>
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: accent }]}>
            <ThemedText style={styles.avatarText}>{initials}</ThemedText>
          </View>
          <View style={styles.profileText}>
            <ThemedText style={styles.profileName}>
              {profileName || 'Account'}
            </ThemedText>
            {profileEmail ? (
              <ThemedText style={[styles.profileEmail, { color: mutedText }]}>
                {profileEmail}
              </ThemedText>
            ) : null}
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <ThemedText style={[styles.sectionLabel, { color: mutedText }]}>
          Quick actions
        </ThemedText>
        <Pressable
          onPress={onAddUser}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
          ]}>
          <ThemedText style={[styles.primaryButtonText, { color: primaryTextColor }]}>
            Add User
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={onOpenUsers}
          style={({ pressed }) => [
            styles.sidebarButton,
            { borderColor: accent, opacity: pressed ? 0.7 : 1, marginBottom: 12 },
          ]}>
          <ThemedText style={[styles.sidebarButtonText, { color: accent }]}>
            Users
          </ThemedText>
        </Pressable>
        <View style={styles.sidebarSpacer} />
        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [
            styles.sidebarButton,
            { borderColor: danger, opacity: pressed ? 0.7 : 1 },
          ]}>
          <ThemedText style={[styles.sidebarButtonText, { color: danger }]}>
            Log Out
          </ThemedText>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
  },
  sidebarBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sidebarPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 260,
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f1418',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 16,
    opacity: 0.25,
  },
  sectionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#0f1418',
  },
  sidebarSpacer: {
    flex: 1,
  },
  sidebarButton: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sidebarButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
