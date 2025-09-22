// HomeScreen.tsx

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Switch,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveWidth,
  fontFamily,
  responsiveHeight,
  font,
  color,
} from '../../constant/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainContainer } from '../../components/common/mainContainer';
import { icons } from '../../assets';

export type RootStackParamList = {
  Login: undefined; // Login screen
  Register: undefined; // Register screen
  ForgotPassword: undefined;
  HomeScreen: undefined;
  ContinueWithOtp: undefined;
  ForgotPasswordOtp: undefined;
  // Add other screens as needed
};

// Define your navigation prop type
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const settingsList = [
  {
    section: 'General',
    data: [
      {
        icon: require('../../assets/icons/notification.png'),
        label: 'Notification',
      },
      // { icon: require('../../assets/icons/Security.png'), label: 'Security' },
      {
        icon: require('../../assets/icons/EditThem.png'),
        label: 'Language',
        right: 'English (US)',
      },
      {
        icon: require('../../assets/icons/Dark-Mode.png'),
        label: 'Dark Mode',
        isSwitch: true,
      },
      { icon: require('../../assets/icons/info.png'), label: 'Help Center' },
      { icon: require('../../assets/icons/star.png'), label: 'Rate us' },
    ],
  },
  {
    section: 'About',
    data: [
      {
        icon: require('../../assets/icons/document.png'),
        label: 'Privacy & Policy',
      },
      // {
      //   icon: require('../../assets/icons/Terms-of-Services.png'),
      //   label: 'Terms of Services',
      // },
      { icon: require('../../assets/icons/About-us.png'), label: 'About us' },
    ],
  },
];

const SettingsScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['USER_TOKEN', 'USER_DATA']);
    } catch (e) {
      // noop
    } finally {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -84}
      >
        <MainContainer>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerRow}>
              {/* <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
                activeOpacity={0.7}
              >
                <Image source={icons.Icback} style={styles.backIcon} />
              </TouchableOpacity> */}
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <Text style={styles.headerTitle}>Settings</Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>General</Text>
              {settingsList[0].data.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.row}
                  activeOpacity={0.7}
                  disabled={item.isSwitch}
                >
                  <View style={styles.iconWrap}>
                    <Image source={item.icon} style={styles.icon} />
                  </View>
                  <Text style={styles.label}>{item.label}</Text>
                  {item.right && (
                    <Text style={styles.rightText}>{item.right}</Text>
                  )}
                  {item.isSwitch && (
                    <Switch
                      value={darkMode}
                      onValueChange={setDarkMode}
                      trackColor={{ false: '#767577', true: '#DF8A5D' }}
                      thumbColor={darkMode ? '#fff' : '#f4f3f4'}
                      style={styles.switch}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>About</Text>
              {settingsList[1].data.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.row}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconWrap}>
                    <Image source={item.icon} style={styles.icon} />
                  </View>
                  <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.divider} />

            {/* <TouchableOpacity style={styles.deactivateBtn} activeOpacity={0.7}>
              <Image
                source={require('../../assets/icons/Deactivate-My-Account.png')}
                style={styles.deactivateIcon}
              />
              <Text style={styles.deactivateText}>Deactivate My Account</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.logoutBtn}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <Image
                source={require('../../assets/icons/Log-out.png')}
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </MainContainer>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#202945',
  },
  scrollViewContent: {
    flexGrow: 1,
    minHeight: '100%',
    // backgroundColor: 'transparent',
    paddingBottom: Platform.OS === 'android' ? 32 : 32,
  },
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    marginTop:
      Platform.OS === 'android'
        ? responsiveHeight('0.5%')
        : responsiveWidth('15%'),
    // marginBottom: responsiveWidth('5%'),
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  backIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: '#F6EFD9',
  },
  headerTitle: {
    color: color.themeTextWhite,
    fontSize: 24,
    fontFamily: fontFamily.regular,
    // fontWeight: '600',
    // marginLeft: 8,
  },
  sectionContainer: {
    marginHorizontal: 20,
    // marginBottom: 16,
  },
  sectionTitle: {
    color: color.themeTextWhite,
    // ...font.body,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fontFamily.regular,
    marginBottom: 12,
    // marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical:
      Platform.OS === 'android' ? responsiveWidth('1') : responsiveWidth('1'),
    borderBottomWidth: Platform.OS === 'android' ? 0.5 : 0,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor:
      Platform.OS === 'android' ? 'rgba(255,255,255,0.05)' : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: color.themeTextWhite,
  },
  label: {
    color: color.themeTextWhite,
    // ...font.body,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    flex: 1,
  },
  rightText: {
    color: color.themeTextWhite,
    // ...font.body,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    marginRight: 8,
  },
  switch: {
    marginLeft: 'auto',
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(238, 238, 238, 1)',
    marginVertical: 16,
    marginHorizontal: 20,
  },
  deactivateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 8,
  },
  deactivateIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#DF8A5D',
    marginRight: 10,
  },
  deactivateText: {
    color: '#DF8A5D',
    // ...font.body,
    fontSize: 14,
    fontFamily: fontFamily.regular,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'android' ? 40 : 32,
    paddingVertical: 8,
  },
  logoutIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#DF8A5D',
    marginLeft: 7,
    marginRight: 20,
  },
  logoutText: {
    color: '#DF8A5D',
    // ...font.body,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    // fontFamily:
    //  fontFamily.regular,
  },
});

export default SettingsScreen;
