import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type SidebarDrawerProps = {
  accent: string;
  cardBackground: string;
  translateX: Animated.Value;
  onClose: () => void;
  onAddUser: () => void;
  onLogout: () => void;
};

export function SidebarDrawer({
  accent,
  cardBackground,
  translateX,
  onClose,
  onAddUser,
  onLogout,
}: SidebarDrawerProps) {
  return (
    <View style={styles.sidebarOverlay} pointerEvents="box-none">
      <Pressable style={styles.sidebarBackdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.sidebarPanel,
          { backgroundColor: cardBackground, transform: [{ translateX }] },
        ]}>
        <ThemedText type="subtitle" style={styles.sidebarTitle}>
          Menu
        </ThemedText>
        <Pressable
          onPress={onAddUser}
          style={({ pressed }) => [
            styles.sidebarButton,
            { borderColor: accent, opacity: pressed ? 0.7 : 1 },
          ]}>
          <ThemedText style={[styles.sidebarButtonText, { color: accent }]}>
            Add User
          </ThemedText>
        </Pressable>
        <View style={styles.sidebarSpacer} />
        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [
            styles.sidebarButton,
            { borderColor: accent, opacity: pressed ? 0.7 : 1 },
          ]}>
          <ThemedText style={[styles.sidebarButtonText, { color: accent }]}>
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
    width: 240,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  sidebarTitle: {
    marginBottom: 20,
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
