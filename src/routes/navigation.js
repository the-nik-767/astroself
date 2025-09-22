import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  color,
  font,
  responsiveHeight,
  responsiveWidth,
} from '../constant/theme';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Login from '../screen/login';
import SplashScreen from '../screen/splashscreen';
import ContinueWithOtp from '../screen/ContinueWithOtp';
import ForgotPassword from '../screen/ForgotPassword';
import ForgotPasswordOtp from '../screen/ForgotPasswordOtp';
import Register from '../screen/Register';
import HomeScreen from '../screen/Home';
import ProfileScreen from '../screen/Profile';
import { icons } from '../assets';
import ChatScreen from '../screen/Chat';
import NakshatraScreen from '../screen/Nakshatra';
import SettingsScreen from '../screen/Settings';

import HomeIcon from '../assets/icons/back.png'; // Placeholder, replace with actual Home icon
import ChatIcon from '../assets/icons/Show.png'; // Placeholder, replace with actual Chat icon
import ProfileIcon from '../assets/image/profile.png'; // Placeholder, replace with actual Profile icon
import NakshatraIcon from '../assets/icons/Subtract.png'; // Placeholder, replace with actual Nakshatra icon
import SettingsIcon from '../assets/icons/googleColor.png'; // Placeholder, replace with actual Settings icon
import BasicDeatil from '../screen/BasicDeatil';
import AddNewMember from '../screen/AddNewMember';
import MemberManagement from '../screen/MemberManagement';
import NotificationScreen from '../screen/Notification';
import ChatWithPromptsScreen from '../screen/ChatWithPrompts';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Existing screens */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="HomeScreen" component={MyTabs} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ContinueWithOtp" component={ContinueWithOtp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtp} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="BasicDeatil" component={BasicDeatil} />
        <Stack.Screen name="AddNewMember" component={AddNewMember} />
        <Stack.Screen name="MemberManagement" component={MemberManagement} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="ChatWithPrompts" component={ChatWithPromptsScreen} />

        {/* <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
       
        <Stack.Screen name="ResetPassword" component={ResetPassword} /> */}
        {/* Add more screens here if needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MyTabs() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -84}
      enabled
      style={{ flex: 1 }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: responsiveWidth('20%'),
            // marginLeft:responsiveWidth('2%'),
            // marginRight:responsiveWidth('2%'),
            // marginBottom:responsiveWidth('5%'),
            borderWidth: 1,
            borderColor: '#EEE5CA',
            paddingBottom: 0,
            paddingTop: responsiveWidth('5%'),
          },
          tabBarBackground: () => (
            <Image
              source={require('../assets/image/tabBg.png')}
              style={{
                width: '100%',
                height: '100%',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                // marginLeft:responsiveWidth('2%'),
                // marginRight:responsiveWidth('2%'),
                opacity: 10,
                resizeMode: 'cover',
              }}
            />
          ),
        }}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItemContainer}>
                <Image
                  source={focused ? icons.icHomeActive : icons.icHome}
                  style={[
                    styles.iconStyle,
                    {
                      tintColor: focused ? '#DF8A5D' : '#EEE5CA',
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: focused ? '#DF8A5D' : '#EEE5CA' },
                  ]}
                >
                  Home
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItemContainer}>
                <Image
                  source={focused ? icons.IcChatActive : icons.icChat}
                  style={[
                    styles.iconStyle,
                    { tintColor: focused ? '#DF8A5D' : '#EEE5CA' },
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: focused ? '#DF8A5D' : '#EEE5CA' },
                  ]}
                >
                  Predictions
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItemContainer}>
                <Image
                  source={
                    focused ? icons.icProfileActive : icons.icProfileInActive
                  }
                  style={[
                    styles.iconStyle,
                    { tintColor: focused ? '#DF8A5D' : '#EEE5CA' },
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: focused ? '#DF8A5D' : '#EEE5CA' },
                  ]}
                >
                  Profile
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="NakshatraScreen"
          component={NakshatraScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItemContainer}>
                <Image
                  source={
                    focused
                      ? icons.icNakshatraActive
                      : icons.icNakshatraInActive
                  }
                  style={[
                    styles.iconStyle,
                    { tintColor: focused ? '#DF8A5D' : '#EEE5CA' },
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: focused ? '#DF8A5D' : '#EEE5CA' },
                  ]}
                >
                  charts
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItemContainer}>
                <Image
                  source={
                    focused ? icons.icSettingsActive : icons.icSettingsInActive
                  }
                  style={[
                    styles.iconStyle,
                    { tintColor: focused ? '#DF8A5D' : '#EEE5CA' },
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: focused ? '#DF8A5D' : '#EEE5CA' },
                  ]}
                >
                  Settings
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
      {/* White indicator bar at the bottom center */}
      {/* <View style={styles.indicatorBar} /> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    // shadowColor: color.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 10,
    // elevation: 5,
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    ...font.caption,
    marginTop: 4,
    textAlign: 'center',
    width: responsiveWidth('20%'),
    color: color.white,
  },
  iconStyle: {
    height: responsiveWidth(7),
    width: responsiveWidth(7),
    resizeMode: 'contain',
    // tintColor: '#EEE5CA',
  },
  indicatorBar: {
    position: 'absolute',
    left: '25%',
    right: '25%',
    bottom: 18,
    height: 10,
    borderRadius: 8,
    // backgroundColor: '#fff',
    opacity: 0.95,
    zIndex: 10,
  },
});

export default MainNavigator;
