import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

type User = {
  id: string;
  name: string;
  houseNumber: string;
  phoneNumber: string;
  expiryDate: string;
  expiryDateRaw: string;
};

type UsersListProps = {
  users: User[];
  accent: string;
  mutedText: string;
  inputBackground: string;
  inputBorder: string;
  cardBackground: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyMessage?: string;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
};

export function UsersList({
  users,
  accent,
  mutedText,
  inputBackground,
  inputBorder,
  cardBackground,
  isLoading,
  errorMessage,
  emptyMessage = 'No users yet. Tap Add User to create one.',
  onEditUser,
  onDeleteUser,
}: UsersListProps) {
  const showActions = Boolean(onEditUser || onDeleteUser);
  const danger = '#c0392b';
  const today = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const todayKey = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  const isExpired = (expiryDateRaw: string) => {
    const parsedDate = new Date(expiryDateRaw);
    if (Number.isNaN(parsedDate.getTime())) {
      return false;
    }

    const expiryKey = Date.UTC(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate()
    );
    return expiryKey < todayKey;
  };

  const getExpiryBadge = (expiryDateRaw: string) => {
    const parsedDate = new Date(expiryDateRaw);
    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    const expiryKey = Date.UTC(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate()
    );
    const diffDays = Math.round((expiryKey - todayKey) / dayMs);

    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return {
        label: daysAgo === 1 ? 'Expired 1 day ago' : `Expired ${daysAgo} days ago`,
        isExpired: true,
      };
    }
    if (diffDays === 0) {
      return { label: 'Expires today', isExpired: false };
    }
    if (diffDays === 1) {
      return { label: 'Expires tomorrow', isExpired: false };
    }
    return { label: `Expires in ${diffDays} days`, isExpired: false };
  };

  return (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <ThemedText type="subtitle" style={styles.cardTitle}>
        Users
      </ThemedText>
      {isLoading ? (
        <ThemedText style={[styles.emptyState, { color: mutedText }]}>
          Loading users...
        </ThemedText>
      ) : errorMessage ? (
        <ThemedText style={[styles.emptyState, { color: '#c0392b' }]}>
          {errorMessage}
        </ThemedText>
      ) : users.length === 0 ? (
        <ThemedText style={[styles.emptyState, { color: mutedText }]}>
          {emptyMessage}
        </ThemedText>
      ) : (
        <View style={styles.userList}>
          {users.map((user) => {
            const badge = getExpiryBadge(user.expiryDateRaw);

            return (
              <View
                key={user.id}
                style={[
                  styles.userCard,
                  {
                    backgroundColor: inputBackground,
                    borderColor: inputBorder,
                  },
                ]}>
                {showActions ? (
                  <View style={styles.userHeader}>
                    <View style={styles.nameRow}>
                      {isExpired(user.expiryDateRaw) ? <View style={styles.expiredDot} /> : null}
                      <ThemedText style={styles.userName}>{user.name}</ThemedText>
                    </View>
                    <View style={styles.actionRow}>
                      {onEditUser ? (
                        <Pressable
                          accessibilityLabel="Edit user"
                          onPress={() => onEditUser(user)}
                          style={({ pressed }) => [
                            styles.iconButton,
                            { borderColor: accent, opacity: pressed ? 0.6 : 1 },
                          ]}>
                          <IconSymbol name="pencil" size={16} color={accent} />
                        </Pressable>
                      ) : null}
                      {onDeleteUser ? (
                        <Pressable
                          accessibilityLabel="Delete user"
                          onPress={() => onDeleteUser(user)}
                          style={({ pressed }) => [
                            styles.iconButton,
                            { borderColor: danger, opacity: pressed ? 0.6 : 1 },
                          ]}>
                          <IconSymbol name="trash" size={16} color={danger} />
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                ) : (
                  <View style={styles.nameRow}>
                    {isExpired(user.expiryDateRaw) ? <View style={styles.expiredDot} /> : null}
                    <ThemedText style={styles.userName}>{user.name}</ThemedText>
                  </View>
                )}
                <View style={styles.userRow}>
                  <ThemedText style={[styles.userLabel, { color: mutedText }]}>House</ThemedText>
                  <ThemedText style={styles.userValue}>{user.houseNumber}</ThemedText>
                </View>
                <View style={styles.userRow}>
                  <ThemedText style={[styles.userLabel, { color: mutedText }]}>Phone</ThemedText>
                  <ThemedText style={styles.userValue}>{user.phoneNumber}</ThemedText>
                </View>
                <View style={styles.userRow}>
                  <ThemedText style={[styles.userLabel, { color: mutedText }]}>Expiry</ThemedText>
                  <View style={styles.expiryValueRow}>
                    <ThemedText style={styles.userValue}>{user.expiryDate}</ThemedText>
                    {badge ? (
                      <View
                        style={[
                          styles.expiryBadge,
                          { borderColor: badge.isExpired ? danger : accent },
                        ]}>
                        <ThemedText
                          style={[
                            styles.expiryBadgeText,
                            { color: badge.isExpired ? danger : accent },
                          ]}>
                          {badge.label}
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
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
  emptyState: {
    fontSize: 14,
  },
  userList: {
    gap: 12,
  },
  userCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expiredDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c0392b',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  userValue: {
    fontSize: 14,
  },
  expiryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 6,
    flexShrink: 1,
  },
  expiryBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  expiryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
