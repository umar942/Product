import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { AddUserForm } from '@/components/home/add-user-form';
import { AuthView } from '@/components/home/auth-view';
import { DashboardHeader } from '@/components/home/dashboard-header';
import { ExpirySummary } from '@/components/home/expiry-summary';
import { ProfileSummary } from '@/components/home/profile-summary';
import { SidebarDrawer } from '@/components/home/sidebar-drawer';
import { UsersList } from '@/components/home/users-list';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  createUser,
  getMe,
  getUsers,
  login,
  signup,
  updateUser,
  type ManagedUserResponse,
} from '@/services/api';

type ProfileUser = {
  id: string;
  name: string;
  email: string;
};

type User = {
  id: string;
  name: string;
  houseNumber: string;
  phoneNumber: string;
  expiryDate: string;
  expiryDateRaw: string;
};

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const palette = Colors[colorScheme];
  const navigation = useNavigation();
  const router = useRouter();

  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState<ProfileUser | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [userSaving, setUserSaving] = useState(false);
  const [userName, setUserName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryDateValue, setExpiryDateValue] = useState(new Date());
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const accent = palette.tint;
  const screenBackground = isDark ? '#121417' : '#fdf8f2';
  const cardBackground = isDark ? '#1b2024' : '#ffffff';
  const cardAltBackground = isDark ? '#20262b' : '#f2ebe2';
  const inputBackground = isDark ? '#151a1e' : '#ffffff';
  const inputBorder = isDark ? '#2b3238' : '#e4dad0';
  const mutedText = isDark ? '#a9b1b8' : '#6d584b';
  const primaryButtonTextColor = isDark ? '#101418' : '#ffffff';
  const sidebarTranslateX = useRef(new Animated.Value(-260)).current;
  const isLoggedIn = Boolean(authToken);
  const isEditingUser = formMode === 'edit';
  const profileName = authUser?.name || 'Account';
  const profileEmail = authUser?.email || '';

  const canSubmitUser = Boolean(
    userName.trim() &&
      houseNumber.trim() &&
      phoneNumber.trim() &&
      expiryDate.trim()
  );

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

  const resetUserForm = () => {
    setUserName('');
    setHouseNumber('');
    setPhoneNumber('');
    setExpiryDate('');
    setExpiryDateValue(new Date());
  };

  const fetchUsers = async (token: string) => {
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

  const handleSubmitUser = async () => {
    if (!canSubmitUser || !authToken || userSaving) {
      return;
    }

    if (isEditingUser && !editingUserId) {
      setUsersError('No user selected for editing.');
      return;
    }

    setUserSaving(true);
    setUsersError(null);
    try {
      const payload = {
        name: userName.trim(),
        houseNumber: houseNumber.trim(),
        phoneNumber: phoneNumber.trim(),
        expiryDate: expiryDateValue.toISOString(),
      };
      const saved = isEditingUser
        ? await updateUser(authToken, editingUserId as string, payload)
        : await createUser(authToken, payload);
      const normalized = normalizeUser(saved);

      setUsers((prev) =>
        isEditingUser
          ? prev.map((user) => (user.id === normalized.id ? normalized : user))
          : [...prev, normalized]
      );
      resetUserForm();
      setEditingUserId(null);
      setFormMode('add');
      setShowAddUser(false);
      setShowExpiryPicker(false);
    } catch (error) {
      const fallbackMessage = isEditingUser ? 'Failed to update user' : 'Failed to add user';
      const message = error instanceof Error ? error.message : fallbackMessage;
      setUsersError(message);
    } finally {
      setUserSaving(false);
    }
  };

  const handleBackToDashboard = () => {
    setShowAddUser(false);
    setShowExpiryPicker(false);
    setEditingUserId(null);
    setFormMode('add');
    resetUserForm();
  };

  const handleOpenExpiryPicker = () => {
    Keyboard.dismiss();
    setShowExpiryPicker(true);
  };

  const handleExpiryChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowExpiryPicker(false);
    }

    if (selectedDate) {
      setExpiryDateValue(selectedDate);
      setExpiryDate(formatMonthYear(selectedDate));
    }
  };

  const handleOpenSidebar = () => {
    setShowSidebar(true);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOpenUsers = () => {
    setShowAddUser(false);
    setShowExpiryPicker(false);
    setFormMode('add');
    setEditingUserId(null);
    setShowSidebar(false);
    setSidebarOpen(false);
    router.push('/users');
  };

  const handleOpenStatus = (type: string) => {
    setShowSidebar(false);
    setSidebarOpen(false);
    router.push({ pathname: '/user-status', params: { type } });
  };

  const handleEditUser = (user: User) => {
    const parsedDate = new Date(user.expiryDateRaw || user.expiryDate);
    const hasValidDate = !Number.isNaN(parsedDate.getTime());

    setFormMode('edit');
    setEditingUserId(user.id);
    setShowAddUser(true);
    setShowExpiryPicker(false);
    setUserName(user.name);
    setHouseNumber(user.houseNumber);
    setPhoneNumber(user.phoneNumber);
    setExpiryDateValue(hasValidDate ? parsedDate : new Date());
    setExpiryDate(hasValidDate ? formatMonthYear(parsedDate) : user.expiryDate);
  };

  const handleRefreshUsers = async () => {
    if (!authToken || usersLoading) {
      return;
    }

    await fetchUsers(authToken);
  };

  const handleAuthSubmit = async () => {
    if (authLoading) {
      return;
    }

    const trimmedEmail = authEmail.trim();
    const trimmedPassword = authPassword.trim();
    const trimmedName = authName.trim();

    if (!trimmedEmail || !trimmedPassword || (authMode === 'signup' && !trimmedName)) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      const response =
        authMode === 'signup'
          ? await signup({ name: trimmedName, email: trimmedEmail, password: trimmedPassword })
          : await login({ email: trimmedEmail, password: trimmedPassword });

      await AsyncStorage.setItem('authToken', response.token);
      setAuthToken(response.token);
      setAuthUser(response.user);
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
      setShowAddUser(false);
      setShowSidebar(false);
      setSidebarOpen(false);
      setShowExpiryPicker(false);
      await fetchUsers(response.token);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleToggleAuthMode = () => {
    setAuthMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setAuthError(null);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setAuthToken(null);
    setAuthMode('login');
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthError(null);
    setAuthUser(null);
    setUsers([]);
    setUsersError(null);
    setUsersLoading(false);
    setShowAddUser(false);
    setShowSidebar(false);
    setSidebarOpen(false);
    setShowExpiryPicker(false);
    setFormMode('add');
    setEditingUserId(null);
    resetUserForm();
  };

  useEffect(() => {
    Animated.timing(sidebarTranslateX, {
      toValue: sidebarOpen ? 0 : -260,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !sidebarOpen) {
        setShowSidebar(false);
      }
    });
  }, [sidebarOpen, sidebarTranslateX]);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token || !isMounted) {
        return;
      }

      setAuthToken(token);
      try {
        const profile = await getMe(token);
        if (isMounted) {
          setAuthUser(profile);
        }
      } catch {
        // Ignore profile fetch errors; user can still use the app.
      }
      await fetchUsers(token);
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      if (!isLoggedIn) {
        return;
      }

      setShowAddUser(false);
      setShowExpiryPicker(false);
      setShowSidebar(false);
      setSidebarOpen(false);
    });

    return unsubscribe;
  }, [isLoggedIn, navigation]);

  const handleOpenAddUser = () => {
    resetUserForm();
    setFormMode('add');
    setEditingUserId(null);
    setShowAddUser(true);
    setShowExpiryPicker(false);
    handleCloseSidebar();
  };

  const now = new Date();
  const expiringWindow = 10 * 24 * 60 * 60 * 1000;
  const expiringThreeDayWindow = 3 * 24 * 60 * 60 * 1000;
  const expiringOneDayWindow = 1 * 24 * 60 * 60 * 1000;
  const expiredCount = users.reduce((count, user) => {
    const expiryDateValue = new Date(user.expiryDateRaw);
    if (Number.isNaN(expiryDateValue.getTime())) {
      return count;
    }

    return expiryDateValue.getTime() < now.getTime() ? count + 1 : count;
  }, 0);
  const expiringSoonCount = users.reduce((count, user) => {
    const expiryDateValue = new Date(user.expiryDateRaw);
    if (Number.isNaN(expiryDateValue.getTime())) {
      return count;
    }

    const diff = expiryDateValue.getTime() - now.getTime();
    return diff >= 0 && diff <= expiringWindow ? count + 1 : count;
  }, 0);
  const expiringThreeDaysCount = users.reduce((count, user) => {
    const expiryDateValue = new Date(user.expiryDateRaw);
    if (Number.isNaN(expiryDateValue.getTime())) {
      return count;
    }

    const diff = expiryDateValue.getTime() - now.getTime();
    return diff >= 0 && diff <= expiringThreeDayWindow ? count + 1 : count;
  }, 0);
  const expiringOneDayCount = users.reduce((count, user) => {
    const expiryDateValue = new Date(user.expiryDateRaw);
    if (Number.isNaN(expiryDateValue.getTime())) {
      return count;
    }

    const diff = expiryDateValue.getTime() - now.getTime();
    return diff >= 0 && diff <= expiringOneDayWindow ? count + 1 : count;
  }, 0);
  const activeUsers = Math.max(users.length - expiredCount, 0);

  return (
    <ThemedView style={styles.screen} lightColor={screenBackground} darkColor={screenBackground}>
      <View
        style={[
          styles.blob,
          {
            backgroundColor: accent,
            opacity: isDark ? 0.12 : 0.16,
          },
        ]}
      />
      <View
        style={[
          styles.blobTwo,
          {
            backgroundColor: isDark ? '#ff8d5a' : '#ffd166',
            opacity: isDark ? 0.15 : 0.25,
          },
        ]}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            isLoggedIn && showAddUser && styles.contentWithForm,
          ]}
          keyboardShouldPersistTaps="handled">
          {isLoggedIn ? (
            <>
              <DashboardHeader
                accent={accent}
                mutedText={mutedText}
                showAddUser={showAddUser}
                onMenuPress={handleOpenSidebar}
                onBackPress={handleBackToDashboard}
              />
              {showAddUser ? (
                <AddUserForm
                  accent={accent}
                  mutedText={mutedText}
                  inputBackground={inputBackground}
                  inputBorder={inputBorder}
                  textColor={palette.text}
                  cardBackground={cardBackground}
                  primaryButtonTextColor={primaryButtonTextColor}
                  title={isEditingUser ? 'Edit User' : 'Add User'}
                  submitLabel={isEditingUser ? 'Save Changes' : 'Add User'}
                  userName={userName}
                  houseNumber={houseNumber}
                  phoneNumber={phoneNumber}
                  expiryDate={expiryDate}
                  expiryDateValue={expiryDateValue}
                  showExpiryPicker={showExpiryPicker}
                  canSubmit={canSubmitUser}
                  isSubmitting={userSaving}
                  onChangeUserName={setUserName}
                  onChangeHouseNumber={setHouseNumber}
                  onChangePhoneNumber={setPhoneNumber}
                  onSubmit={handleSubmitUser}
                  onOpenExpiryPicker={handleOpenExpiryPicker}
                  onExpiryChange={handleExpiryChange}
                  onClosePicker={() => setShowExpiryPicker(false)}
                />
              ) : (
                <>
                  <ProfileSummary
                    accent={accent}
                    mutedText={mutedText}
                    cardBackground={cardBackground}
                    cardAltBackground={cardAltBackground}
                    inputBorder={inputBorder}
                    primaryButtonTextColor={primaryButtonTextColor}
                  name={profileName}
                  email={profileEmail}
                  totalUsers={users.length}
                  activeUsers={activeUsers}
                  onAddUser={handleOpenAddUser}
                  onOpenActiveUsers={() => handleOpenStatus('active')}
                  onRefresh={handleRefreshUsers}
                  isRefreshing={usersLoading}
                />
                  <ExpirySummary
                    mutedText={mutedText}
                    cardBackground={cardBackground}
                    cardAltBackground={cardAltBackground}
                    inputBorder={inputBorder}
                    expiredCount={expiredCount}
                    expiringSoonCount={expiringSoonCount}
                    expiringThreeDaysCount={expiringThreeDaysCount}
                    expiringOneDayCount={expiringOneDayCount}
                    onOpenExpired={() => handleOpenStatus('expired')}
                    onOpenExpiringSoon={() => handleOpenStatus('expiring10')}
                    onOpenExpiringThreeDays={() => handleOpenStatus('expiring3')}
                    onOpenExpiringOneDay={() => handleOpenStatus('expiring1')}
                  />
                  <UsersList
                    users={users}
                    accent={accent}
                    mutedText={mutedText}
                    inputBackground={inputBackground}
                    inputBorder={inputBorder}
                    cardBackground={cardAltBackground}
                    isLoading={usersLoading}
                    errorMessage={usersError}
                    onEditUser={handleEditUser}
                  />
                </>
              )}
            </>
          ) : (
            <AuthView
              accent={accent}
              mutedText={mutedText}
              inputBackground={inputBackground}
              inputBorder={inputBorder}
              textColor={palette.text}
              cardBackground={cardBackground}
              primaryButtonTextColor={primaryButtonTextColor}
              mode={authMode}
              name={authName}
              email={authEmail}
              password={authPassword}
              isSubmitting={authLoading}
              errorMessage={authError}
              onChangeName={setAuthName}
              onChangeEmail={setAuthEmail}
              onChangePassword={setAuthPassword}
              onSubmit={handleAuthSubmit}
              onToggleMode={handleToggleAuthMode}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {isLoggedIn && showSidebar ? (
        <SidebarDrawer
          accent={accent}
          mutedText={mutedText}
          cardBackground={cardBackground}
          translateX={sidebarTranslateX}
          onClose={handleCloseSidebar}
          onAddUser={handleOpenAddUser}
          onOpenUsers={handleOpenUsers}
          onLogout={handleLogout}
          profileName={profileName}
          profileEmail={profileEmail}
        />
      ) : null}
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
  contentWithForm: {
    paddingBottom: 160,
  },
  blob: {
    position: 'absolute',
    top: -80,
    right: -120,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  blobTwo: {
    position: 'absolute',
    bottom: -120,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
  },
});
