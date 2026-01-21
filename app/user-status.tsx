import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { UsersList } from '@/components/home/users-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUsers, type ManagedUserResponse } from '@/services/api';

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

const getTitle = (type: string) => {
  switch (type) {
    case 'expired':
      return 'Expired users';
    case 'expiring10':
      return 'Expiring in 10 days';
    case 'expiring3':
      return 'Expiring in 3 days';
    case 'expiring1':
      return 'Expiring in 1 day';
    case 'active':
      return 'Active users';
    default:
      return 'Users';
  }
};

const getEmptyMessage = (type: string) => {
  switch (type) {
    case 'expired':
      return 'No expired users right now.';
    case 'expiring10':
      return 'No users expiring in the next 10 days.';
    case 'expiring3':
      return 'No users expiring in the next 3 days.';
    case 'expiring1':
      return 'No users expiring in the next 1 day.';
    case 'active':
      return 'No active users right now.';
    default:
      return 'No users found.';
  }
};

export default function UserStatusScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const typeParam = Array.isArray(params.type) ? params.type[0] : params.type;
  const type = typeof typeParam === 'string' ? typeParam : 'users';

  const [authToken, setAuthToken] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

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

  const filteredUsers = useMemo(() => {
    const now = Date.now();
    const tenDays = 10 * 24 * 60 * 60 * 1000;
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const oneDay = 1 * 24 * 60 * 60 * 1000;

    return users.filter((user) => {
      const expiryDate = new Date(user.expiryDateRaw);
      if (Number.isNaN(expiryDate.getTime())) {
        return false;
      }

      const diff = expiryDate.getTime() - now;

      switch (type) {
        case 'expired':
          return diff < 0;
        case 'expiring10':
          return diff >= 0 && diff <= tenDays;
        case 'expiring3':
          return diff >= 0 && diff <= threeDays;
        case 'expiring1':
          return diff >= 0 && diff <= oneDay;
        case 'active':
          return diff >= 0;
        default:
          return true;
      }
    });
  }, [type, users]);

  const title = getTitle(type);
  const emptyMessage = getEmptyMessage(type);
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
                {title}
              </ThemedText>
              <ThemedText style={[styles.subtitle, { color: mutedText }]}>
                {resultLabel}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: cardBackground }]}>
            <View style={styles.summaryRow}>
              <View>
                <ThemedText style={[styles.summaryLabel, { color: mutedText }]}>
                  Showing
                </ThemedText>
                <ThemedText style={styles.summaryValue}>{resultLabel}</ThemedText>
              </View>
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
    marginBottom: 16,
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
    fontSize: 30,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryLabel: {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  summaryValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '700',
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
