import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UsersList } from '@/components/home/users-list';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { deleteUser, getUsers, type ManagedUserResponse } from '@/services/api';

type User = {
  id: string;
  name: string;
  houseNumber: string;
  phoneNumber: string;
  expiryDate: string;
  expiryDateRaw: string;
};

const formatMonthYear = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}/${day}`;
};

const normalizeUser = (user: ManagedUserResponse): User => {
  const parsedDate = new Date(user.expiryDate);
  const expiryLabel = Number.isNaN(parsedDate.getTime())
    ? user.expiryDate
    : formatMonthYear(parsedDate);

  return {
    id: user._id,
    name: user.name,
    houseNumber: user.houseNumber,
    phoneNumber: user.phoneNumber,
    expiryDate: expiryLabel,
    expiryDateRaw: user.expiryDate,
  };
};

export default function UsersScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [authToken, setAuthToken] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const screenBackground = isDark ? '#121417' : '#fdf8f2';
  const cardBackground = isDark ? '#1b2024' : '#ffffff';
  const cardAltBackground = isDark ? '#20262b' : '#f2ebe2';
  const inputBackground = isDark ? '#151a1e' : '#ffffff';
  const inputBorder = isDark ? '#2b3238' : '#e4dad0';
  const mutedText = isDark ? '#a9b1b8' : '#6d584b';

  const loadUsers = async (token: string) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const data = await getUsers(token);
      setUsers(data.map(normalizeUser));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load users';
      setUsersError(message);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token || !isMounted) {
        setUsersError('Please log in to view users.');
        return;
      }

      setAuthToken(token);
      await loadUsers(token);
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    if (!authToken || usersLoading) {
      return;
    }

    await loadUsers(authToken);
  };

  const handleDeleteUser = (user: User) => {
    if (!authToken) {
      setUsersError('Please log in again to delete users.');
      return;
    }

    Alert.alert(
      'Delete user',
      `Delete ${user.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(authToken, user.id);
              setUsers((prev) => prev.filter((item) => item.id !== user.id));
            } catch (error) {
              const message =
                error instanceof Error ? error.message : 'Failed to delete user.';
              setUsersError(message);
            }
          },
        },
      ]
    );
  };

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const haystack = [
        user.name,
        user.houseNumber,
        user.phoneNumber,
        user.expiryDate,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery, users]);

  const emptyMessage = searchQuery.trim()
    ? 'No matching users found.'
    : 'No users yet. Tap Add User to create one.';

  const resultLabel = `${filteredUsers.length} ${filteredUsers.length === 1 ? 'user' : 'users'}`;

  return (
    <ThemedView style={styles.screen} lightColor={screenBackground} darkColor={screenBackground}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.6 : 1 }]}>
              <IconSymbol name="chevron.left" size={24} color={palette.tint} />
            </Pressable>
            <View style={styles.headerText}>
              <ThemedText type="title" style={[styles.title, { fontFamily: Fonts.rounded }]}>
                Users
              </ThemedText>
              <ThemedText style={[styles.subtitle, { color: mutedText }]}>
                Search by name, house, phone, or expiry date.
              </ThemedText>
            </View>
          </View>

          <View style={[styles.searchCard, { backgroundColor: cardBackground }]}>
            <View
              style={[
                styles.searchInput,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}>
              <IconSymbol name="magnifyingglass" size={18} color={mutedText} />
              <TextInput
                placeholder="Search users"
                placeholderTextColor={mutedText}
                selectionColor={palette.tint}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchText, { color: palette.text }]}
              />
            </View>
            <View style={styles.searchMetaRow}>
              <ThemedText style={[styles.searchMeta, { color: mutedText }]}>
                {resultLabel}
              </ThemedText>
              <Pressable
                onPress={handleRefresh}
                disabled={usersLoading}
                style={({ pressed }) => [
                  styles.refreshButton,
                  { borderColor: palette.tint, opacity: pressed ? 0.7 : 1 },
                  usersLoading && styles.refreshButtonDisabled,
                ]}>
                <ThemedText style={[styles.refreshLabel, { color: palette.tint }]}>
                  {usersLoading ? 'Refreshing...' : 'Refresh'}
                </ThemedText>
              </Pressable>
            </View>
          </View>

          <UsersList
            users={filteredUsers}
            accent={palette.tint}
            mutedText={mutedText}
            inputBackground={inputBackground}
            inputBorder={inputBorder}
            cardBackground={cardAltBackground}
            isLoading={usersLoading}
            errorMessage={usersError}
            emptyMessage={emptyMessage}
            onDeleteUser={handleDeleteUser}
          />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 20,
  },
  searchCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
  },
  searchMetaRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchMeta: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  refreshButton: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  refreshLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
});
