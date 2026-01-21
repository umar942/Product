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

import { AddUserForm } from '@/components/home/add-user-form';
import { AuthView } from '@/components/home/auth-view';
import { DashboardHeader } from '@/components/home/dashboard-header';
import { SidebarDrawer } from '@/components/home/sidebar-drawer';
import { UsersList } from '@/components/home/users-list';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type User = {
  id: string;
  name: string;
  houseNumber: string;
  phoneNumber: string;
  expiryDate: string;
};

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const palette = Colors[colorScheme];
  const navigation = useNavigation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryDateValue, setExpiryDateValue] = useState(new Date());
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
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

  const canAddUser = Boolean(
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

  const handleAddUser = () => {
    if (!canAddUser) {
      return;
    }

    setUsers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: userName.trim(),
        houseNumber: houseNumber.trim(),
        phoneNumber: phoneNumber.trim(),
        expiryDate: expiryDate.trim(),
      },
    ]);
    setUserName('');
    setHouseNumber('');
    setPhoneNumber('');
    setExpiryDate('');
    setExpiryDateValue(new Date());
    setShowAddUser(false);
    setShowExpiryPicker(false);
  };

  const handleBackToDashboard = () => {
    setShowAddUser(false);
    setShowExpiryPicker(false);
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAddUser(false);
    setShowSidebar(false);
    setSidebarOpen(false);
    setShowExpiryPicker(false);
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

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowSidebar(false);
    setSidebarOpen(false);
  };

  const handleOpenAddUser = () => {
    setShowAddUser(true);
    setShowExpiryPicker(false);
    handleCloseSidebar();
  };

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
                  userName={userName}
                  houseNumber={houseNumber}
                  phoneNumber={phoneNumber}
                  expiryDate={expiryDate}
                  expiryDateValue={expiryDateValue}
                  showExpiryPicker={showExpiryPicker}
                  canSubmit={canAddUser}
                  onChangeUserName={setUserName}
                  onChangeHouseNumber={setHouseNumber}
                  onChangePhoneNumber={setPhoneNumber}
                  onBack={handleBackToDashboard}
                  onSubmit={handleAddUser}
                  onOpenExpiryPicker={handleOpenExpiryPicker}
                  onExpiryChange={handleExpiryChange}
                  onClosePicker={() => setShowExpiryPicker(false)}
                />
              ) : (
                <UsersList
                  users={users}
                  mutedText={mutedText}
                  inputBackground={inputBackground}
                  inputBorder={inputBorder}
                  cardBackground={cardAltBackground}
                />
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
              cardAltBackground={cardAltBackground}
              primaryButtonTextColor={primaryButtonTextColor}
              onLogin={handleLogin}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {isLoggedIn && showSidebar ? (
        <SidebarDrawer
          accent={accent}
          cardBackground={cardBackground}
          translateX={sidebarTranslateX}
          onClose={handleCloseSidebar}
          onAddUser={handleOpenAddUser}
          onLogout={handleLogout}
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
