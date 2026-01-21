import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
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
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
  const [users, setUsers] = useState<
    {
      id: string;
      name: string;
      houseNumber: string;
      phoneNumber: string;
      expiryDate: string;
    }[]
  >([]);

  const accent = palette.tint;
  const screenBackground = isDark ? '#121417' : '#fdf8f2';
  const cardBackground = isDark ? '#1b2024' : '#ffffff';
  const cardAltBackground = isDark ? '#20262b' : '#f2ebe2';
  const inputBackground = isDark ? '#151a1e' : '#ffffff';
  const inputBorder = isDark ? '#2b3238' : '#e4dad0';
  const mutedText = isDark ? '#a9b1b8' : '#6d584b';
  const sidebarTranslateX = useRef(new Animated.Value(-260)).current;

  const canAddUser = Boolean(
    userName.trim() &&
      houseNumber.trim() &&
      phoneNumber.trim() &&
      expiryDate.trim()
  );

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

  const handleOpenSidebar = () => {
    setShowSidebar(true);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAddUser(false);
    setShowSidebar(false);
    setSidebarOpen(false);
    setShowExpiryPicker(false);
  };

  const formatMonthYear = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}/${day}`;
  };

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
              <View style={styles.headerRow}>
                <Pressable
                  onPress={showAddUser ? handleBackToDashboard : handleOpenSidebar}
                  style={({ pressed }) => [
                    styles.hamburgerButton,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}>
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

              {showAddUser ? (
                <View style={[styles.card, { backgroundColor: cardBackground }]}>
                  <View style={styles.cardHeader}>
                    <ThemedText type="subtitle" style={styles.cardTitle}>
                      Add User
                    </ThemedText>
                    <Pressable
                      onPress={() => {
                        setShowAddUser(false);
                        setShowExpiryPicker(false);
                      }}
                      style={({ pressed }) => [
                        styles.textButton,
                        { opacity: pressed ? 0.6 : 1 },
                      ]}>
                      <ThemedText style={[styles.textButtonLabel, { color: accent }]}>
                        Back
                      </ThemedText>
                    </Pressable>
                  </View>
                  <ThemedText style={[styles.label, { color: mutedText }]}>User Name</ThemedText>
                  <TextInput
                    placeholder="Full name"
                    placeholderTextColor={mutedText}
                    selectionColor={accent}
                    value={userName}
                    onChangeText={setUserName}
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBackground,
                        borderColor: inputBorder,
                        color: palette.text,
                      },
                    ]}
                  />
                  <ThemedText style={[styles.label, { color: mutedText }]}>House Number</ThemedText>
                  <TextInput
                    placeholder="A-12"
                    placeholderTextColor={mutedText}
                    selectionColor={accent}
                    value={houseNumber}
                    onChangeText={setHouseNumber}
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBackground,
                        borderColor: inputBorder,
                        color: palette.text,
                      },
                    ]}
                  />
                  <ThemedText style={[styles.label, { color: mutedText }]}>Phone Number</ThemedText>
                  <TextInput
                    keyboardType="phone-pad"
                    placeholder="0300 1234567"
                    placeholderTextColor={mutedText}
                    selectionColor={accent}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBackground,
                        borderColor: inputBorder,
                        color: palette.text,
                      },
                    ]}
                  />
                <ThemedText style={[styles.label, { color: mutedText }]}>Expiry Date</ThemedText>
                <Pressable
                  onPress={handleOpenExpiryPicker}
                  style={({ pressed }) => [
                    styles.input,
                    {
                      backgroundColor: inputBackground,
                      borderColor: inputBorder,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}>
                  <ThemedText style={[styles.inputText, { color: expiryDate ? palette.text : mutedText }]}>
                    {expiryDate || 'MM/YY/DD'}
                  </ThemedText>
                </Pressable>
                {showExpiryPicker ? (
                  Platform.OS === 'ios' ? (
                    <View
                      style={[
                        styles.pickerCard,
                        { backgroundColor: inputBackground, borderColor: inputBorder },
                      ]}>
                      <DateTimePicker
                        value={expiryDateValue}
                        mode="date"
                        display="inline"
                        onChange={handleExpiryChange}
                      />
                      <Pressable
                        onPress={() => setShowExpiryPicker(false)}
                        style={({ pressed }) => [
                          styles.textButton,
                          { opacity: pressed ? 0.6 : 1, alignSelf: 'flex-end' },
                        ]}>
                        <ThemedText style={[styles.textButtonLabel, { color: accent }]}>
                          Done
                        </ThemedText>
                      </Pressable>
                    </View>
                  ) : (
                    <DateTimePicker
                      value={expiryDateValue}
                      mode="date"
                      display="calendar"
                      onChange={handleExpiryChange}
                    />
                  )
                ) : null}
                  <Pressable
                    onPress={handleAddUser}
                    disabled={!canAddUser}
                    style={({ pressed }) => [
                      styles.primaryButton,
                      {
                        backgroundColor: accent,
                        opacity: pressed ? 0.85 : 1,
                      },
                      !canAddUser && styles.primaryButtonDisabled,
                    ]}>
                    <ThemedText
                      style={[
                        styles.primaryButtonText,
                        { color: isDark ? '#101418' : '#ffffff' },
                      ]}>
                      Add User
                    </ThemedText>
                  </Pressable>
                </View>
              ) : (
                <View style={[styles.card, { backgroundColor: cardAltBackground }]}>
                  <ThemedText type="subtitle" style={styles.cardTitle}>
                    Users
                  </ThemedText>
                  {users.length === 0 ? (
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
                            <ThemedText style={[styles.userLabel, { color: mutedText }]}>
                              House
                            </ThemedText>
                            <ThemedText style={styles.userValue}>{user.houseNumber}</ThemedText>
                          </View>
                          <View style={styles.userRow}>
                            <ThemedText style={[styles.userLabel, { color: mutedText }]}>
                              Phone
                            </ThemedText>
                            <ThemedText style={styles.userValue}>{user.phoneNumber}</ThemedText>
                          </View>
                          <View style={styles.userRow}>
                            <ThemedText style={[styles.userLabel, { color: mutedText }]}>
                              Expiry
                            </ThemedText>
                            <ThemedText style={styles.userValue}>{user.expiryDate}</ThemedText>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </>
          ) : (
            <>
              <View style={styles.header}>
                <ThemedText type="title" style={[styles.title, { fontFamily: Fonts.rounded }]}>
                  Welcome back
                </ThemedText>
                <ThemedText style={[styles.subtitle, { color: mutedText }]}>
                  Log in to continue or create a new account in seconds.
                </ThemedText>
              </View>

              <View style={[styles.card, { backgroundColor: cardBackground }]}>
                <ThemedText type="subtitle" style={styles.cardTitle}>
                  Login
                </ThemedText>
                <ThemedText style={[styles.label, { color: mutedText }]}>Email</ThemedText>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  placeholderTextColor={mutedText}
                  selectionColor={accent}
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBackground,
                      borderColor: inputBorder,
                      color: palette.text,
                    },
                  ]}
                />
                <ThemedText style={[styles.label, { color: mutedText }]}>Password</ThemedText>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="password"
                  placeholder="********"
                  placeholderTextColor={mutedText}
                  selectionColor={accent}
                  secureTextEntry
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBackground,
                      borderColor: inputBorder,
                      color: palette.text,
                    },
                  ]}
                />
                <Pressable
                  onPress={() => {
                    setIsLoggedIn(true);
                    setShowSidebar(false);
                    setSidebarOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
                  ]}>
                  <ThemedText
                    style={[
                      styles.primaryButtonText,
                      { color: isDark ? '#101418' : '#ffffff' },
                    ]}>
                    Log In
                  </ThemedText>
                </Pressable>
                <ThemedText style={[styles.helperText, { color: mutedText }]}>
                  Forgot password? We can help you reset it.
                </ThemedText>
              </View>

              <View style={[styles.card, { backgroundColor: cardAltBackground }]}>
                <ThemedText type="subtitle" style={styles.cardTitle}>
                  New here?
                </ThemedText>
                <ThemedText style={[styles.cardCopy, { color: mutedText }]}>
                  Create a profile, save your preferences, and pick up where you left off.
                </ThemedText>
                <Pressable
                  onPress={() => {}}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    { borderColor: accent, opacity: pressed ? 0.7 : 1 },
                  ]}>
                  <ThemedText style={[styles.secondaryButtonText, { color: accent }]}>
                    Sign Up
                  </ThemedText>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {isLoggedIn && showSidebar ? (
        <View style={styles.sidebarOverlay} pointerEvents="box-none">
          <Pressable
            style={styles.sidebarBackdrop}
            onPress={handleCloseSidebar}
          />
          <Animated.View
            style={[
              styles.sidebarPanel,
              { backgroundColor: cardBackground, transform: [{ translateX: sidebarTranslateX }] },
            ]}>
            <ThemedText type="subtitle" style={styles.sidebarTitle}>
              Menu
            </ThemedText>
            <Pressable
              onPress={() => {
                setShowAddUser(true);
                setShowExpiryPicker(false);
                handleCloseSidebar();
              }}
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
              onPress={handleLogout}
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
  header: {
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 28,
  },
  headerText: {
    marginTop: 50,
    marginRight: 90,
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#101418',
    fontWeight: '700',
    fontSize: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  textButton: {
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  textButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
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
  helperText: {
    marginTop: 10,
    fontSize: 13,
  },
  cardCopy: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pickerCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
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
  sidebarSpacer: {
    flex: 1,
  },
  sidebarTitle: {
    marginBottom: 20,
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
