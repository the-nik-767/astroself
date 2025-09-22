import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { NavigationProp, StackActions } from '@react-navigation/native';

import { color, responsiveHeight, responsiveWidth } from '../../constant/theme';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons} from "../../assets/index"
// import Icon from '../../assets/svgs/icBall.svg';
// import { useTranslation } from 'react-i18next';

type RootStackParamList = {
  Login: undefined;
  HomeScreen: undefined;
};

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // const { i18n } = useTranslation();  // t is the function to get translations

  // const currentLanguage = i18n.language;

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('USER_TOKEN');

        setTimeout(() => {
          if (token) {
            navigation.dispatch(StackActions.replace('HomeScreen'));
          } else {
            navigation.dispatch(StackActions.replace('Login'));
          }
        }, 2000); // 2 second delay
      } catch (error) {
        console.error('Error checking auth:', error);
        setTimeout(() => {
          navigation.dispatch(StackActions.replace('Login'));
        }, 2000); // 2 second delay
      }
    };

    checkUserData();
  }, [navigation]);

  return (
    <Image
      source={icons.Ic_splash_Screen}
      style={[style.SplashScreenPicContainer]}
    />
  );
};

const style = StyleSheet.create({
  SplashScreenPicContainer: {
    height: responsiveHeight('100%'),
    width: responsiveWidth('100%'),
    // resizeMode: 'contain',
    // transform: [{ rotate: "340deg" }],
  },
});

export default SplashScreen;
