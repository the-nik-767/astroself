// HomeScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  KeyboardEvent,
  Animated,
  Image,
} from 'react-native';
import { responsiveHeight, responsiveWidth, font, color } from '../../constant/theme';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import GoogleAuthService from '../../services/googleAuthService';
// import {InputBox} from '../../components/common/inputBox';
import Toast from 'react-native-toast-message';

// import Bigball from '../../assets/svgs/bigball.svg';
// import IcBall from '../../assets/svgs/icBall.svg';
// import Bg from '../../assets/svgs/bg.svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainContainer } from '../../components/common/mainContainer';
import { icons } from '../../assets';
import { useDispatch } from 'react-redux';
import { setUser, setUserToken } from '../../state/slices/appSlice';

export type RootStackParamList = {
  Login: undefined; // Login screen
  Register: undefined; // Register screen
  ForgotPassword: undefined;
  HomeScreen: undefined;
  ContinueWithOtp: undefined;
  // Add other screens as needed
};

// Define your navigation prop type
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

// Validation schema for formik
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please enter your password'),
});

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  // Ensure serviceFactory is initialized
  React.useEffect(() => {
    serviceFactory.create();
  }, []);
  const userService = serviceFactory.get<UserService>('UserService');
  const googleAuthService = serviceFactory.get<GoogleAuthService>('GoogleAuthService');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      general: undefined,
    },
    validationSchema,
    onSubmit: async values => {
      console.log('values.email==>1', values.email, values.password);
      try {
        console.log('values.email==>', values.email, values.password);

        const data = await userService.login(values.email, values.password);

        if (data && data.access_token) {
          // Dispatch user data to Redux state
          dispatch(setUser(data.data));
          dispatch(setUserToken(data.access_token));

          // Toast.show({
          //   type: 'success',
          //   text1: 'Login Successful',
          //   text2: 'Welcome back! You have successfully logged in.',
          //   position: 'top',
          //   topOffset: 60,
          //   visibilityTime: 3000,
          // });
          navigation.replace('HomeScreen');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: data.message || 'Invalid credentials. Please try again.',
            position: 'top',
            topOffset: 60,
            visibilityTime: 3000,
          });
          formik.setErrors({
            general: data.message || 'Invalid credentials',
          });
        }
      } catch (error: any) {
        console.log('Full error object:', error);
        console.log('Error response:', error?.response);
        console.log('Error response data:', error?.response?.data);
        console.log('Error status:', error?.response?.status);
        console.log('Error message:', error?.message);

        const errorMessage =
          error?.response?.data?.error_message ||
          'Something went wrong. Please try again.';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
          position: 'top',
          topOffset: 60,
          visibilityTime: 3000,
        });
        formik.setErrors({ general: errorMessage });
      }
    },
  });

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleAuthService.signInWithGoogle();
      
      if (result.success) {
        // Use the user data from your backend API
        const userData = result.user;
        const token = result.token || result.idToken;

        // Dispatch user data to Redux state
        dispatch(setUser(userData));
        if (token) {
          dispatch(setUserToken(token));
        }

        const message = result.isNewUser 
          ? 'Welcome! Your account has been created with Google.'
          : 'Welcome back! You have successfully logged in with Google.';

        Toast.show({
          type: 'success',
          text1: result.isNewUser ? 'Registration Successful' : 'Login Successful',
          text2: message,
          position: 'top',
          topOffset: 60,
          visibilityTime: 3000,
        });

        navigation.replace('HomeScreen');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Google Login Failed',
          text2: result.error || 'Failed to login with Google. Please try again.',
          position: 'top',
          topOffset: 60,
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.log('Google Login Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong with Google login. Please try again.',
        position: 'top',
        topOffset: 60,
        visibilityTime: 3000,
      });
    }
  };

  const [, setKeyboardVisible] = useState(false);
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e: KeyboardEvent) => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: 250,
          useNativeDriver: false,
        }).start();
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [keyboardHeight]);

  // Debug log to see Formik state
  console.log(
    'Formik errors:',
    formik.errors,
    'touched:',
    formik.touched,
    'values:',
    formik.values,
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={{ height: responsiveHeight('100%'), justifyContent: 'center' }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -84}
    >
      <MainContainer>
        {/* <Animated.View style={{ paddingBottom: keyboardHeight }}> */}
        <ScrollView
          style={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Logo and Title */}
          <View style={styles.headerContainer}>
            <View style={styles.logoRow}>
              {/* Placeholder for astrology icon */}
              <Image
                source={require('../../assets/icons/Subtract.png')}
                style={styles.astroIcon}
              />
            </View>
            {/* Astrology wheel and planets (placeholders) */}
            <View style={styles.astroWheelContainer}>
              <Image
                source={require('../../assets/image/upscalemediaTransformed.png')}
                style={styles.planet2}
              />
            </View>
          </View>
          {/* Login Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#B0B3C7"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    flex: 1,
                    marginBottom: 0,
                    borderWidth: 0,
                  },
                ]}
                placeholder="Password"
                placeholderTextColor="#B0B3C7"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconContainer}
              >
                <View style={styles.eyeIconWrapper}>
                  <Image
                    source={require('../../assets/icons/Show.png')}
                    style={{
                      width: responsiveWidth('5%'),
                      height: responsiveWidth('5%'),
                    }}
                  />
                  {!showPassword && (
                    <View style={styles.crossLineContainer}>
                      <View style={[styles.crossLine, styles.crossLine1]} />
                      {/* <View style={[styles.crossLine, styles.crossLine2]} /> */}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            {formik.touched.password && formik.errors.password && (
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}
            {formik.errors.general && (
              <Text style={styles.errorText}>{formik.errors.general}</Text>
            )}
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            {/* Login Button */}
            <TouchableOpacity
              onPress={() => {
                console.log('Login button pressed!');
                // console.log('Formik values before submit:', formik.values);
                // console.log('Formik errors before submit:', formik.errors);
                formik.handleSubmit();
                // navigation.navigate("HomeScreen")
              }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            {/* Continue with OTP */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ContinueWithOtp')}
              style={styles.otpButton}
            >
              <Text style={styles.otpButtonText}>Continue with OTP</Text>
            </TouchableOpacity>
            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>
            {/* Google Login */}
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <Image source={icons.Ic_google} style={styles.googleG} />
              <Text style={styles.googleButtonText}>Login with Google</Text>
            </TouchableOpacity>
            {/* Register Link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have account? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerNowText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {/* </Animated.View> */}
      </MainContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    minHeight: '100%',
    // backgroundColor: '#202945',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingBottom: 32,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: responsiveWidth('13%'),
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveWidth('4%'),
  },
  astroIcon: {
    width: responsiveWidth('35%'),
    height: responsiveWidth('10%'),
    resizeMode: 'contain',
  },
  astroWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  planet2: {
    width: responsiveWidth('100%'),
    height: responsiveHeight('15%'),
    resizeMode: 'contain',
  },
  formContainer: {
    paddingHorizontal: responsiveWidth('7%'),
  },
  input: {
    backgroundColor: '#223149',
    borderRadius: 12,
    paddingHorizontal: responsiveWidth('4%'),
    paddingVertical: responsiveWidth('3'),
    color: color.themeTextWhite,
    // ...font.input,
    fontSize: 16,
    marginBottom: responsiveWidth('4%'),
    borderWidth: 1,
    borderColor: '#496CA8',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#223149',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#496CA8',
    marginBottom: responsiveWidth('4%'),
  },
  eyeIconContainer: {
    paddingHorizontal: 12,
  },
  eyeIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossLineContainer: {
    position: 'absolute',
    width: responsiveWidth('5%'),
    height: responsiveWidth('5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossLine: {
    position: 'absolute',
    width: responsiveWidth('5%'),
    height: 2,
    backgroundColor: '#B0B3C7',
  },
  crossLine1: {
    transform: [{ rotate: '45deg' }],
  },
  crossLine2: {
    transform: [{ rotate: '-45deg' }],
  },
  forgotPassword: {
    color: color.themeTextWhite,
    // ...font.input,
    fontSize: 16,
    alignSelf: 'flex-end',
    marginBottom: responsiveWidth('3.5%'),
  },
  loginButton: {
    backgroundColor: '#DF8A5D',
    borderRadius: 10,
    paddingVertical: responsiveWidth('3%'),
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: color.themeTextWhite,
    // ...font.buttonSmall,
    fontSize: 16,
    fontWeight: '600',
  },
  otpButton: {
    borderWidth: 1,
    borderColor: '#DF8A5D',
    borderRadius: 10,
    paddingVertical: responsiveWidth('3'),
    alignItems: 'center',
    marginBottom: responsiveWidth('3%'),
  },
  otpButtonText: {
    color: color.themeTextWhite,
    // ...font.buttonSmall,
    fontSize: 16,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 24,
    marginBottom: responsiveWidth('3%'),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEE5CA',
  },
  orText: {
    color: color.themeTextWhite,
    marginHorizontal: 12,
    // ...font.labelLarge,
    fontSize: 18,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE5CA',
    borderRadius: 10,
    paddingVertical: responsiveWidth('2.5'),
    justifyContent: 'center',
    marginBottom: responsiveWidth('5%'),
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: color.themeTextWhite,
    fontSize: 16,
    fontWeight: '600',
    // ...font.buttonSmall,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: color.themeTextWhite,
    fontSize: 16,
    fontWeight: '400',
    // ...font.bodySmall,
    // ...font.bodySmall,
  },
  registerNowText: {
    color: '#F2994A',
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    // ...font.buttonSmall,
  },
  googleG: {
    width: responsiveWidth('6%'),
    height: responsiveWidth('6%'),
    marginRight: responsiveWidth('2%'),
  },
  errorText: {
    color: 'red',
    marginBottom: responsiveWidth('1'),
    marginTop: -responsiveWidth('2.5'),
  },
});

export default Login;
