import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type User = {
  id: string;
  name: string;
  houseNumber: string;
  phoneNumber: string;
  expiryDate: string;
};

type UsersListProps = {
  users: User[];
  mutedText: string;
  inputBackground: string;
  inputBorder: string;
  cardBackground: string;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function UsersList({
  users,
  mutedText,
  inputBackground,
  inputBorder,
  cardBackground,
  isLoading,
  errorMessage,
}: UsersListProps) {
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
          No users yet. Tap Add User to create one.
        </ThemedText>
      ) : (
        <View style={styles.userList}>
          {users.map((user) => (
            <View
              key={user.id}
              style={[
                styles.userCard,
                {
                  backgroundColor: inputBackground,
                  borderColor: inputBorder,
                },
              ]}>
              <ThemedText style={styles.userName}>{user.name}</ThemedText>
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
                <ThemedText style={styles.userValue}>{user.expiryDate}</ThemedText>
              </View>
            </View>
          ))}
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
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
});
