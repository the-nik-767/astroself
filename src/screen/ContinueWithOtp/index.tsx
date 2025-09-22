// HomeScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { responsiveHeight, responsiveWidth, fontFamily, color } from '../../constant/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainContainer } from '../../components/common/mainContainer';
import { icons } from '../../assets';
import UserService from '../../services/user/user.service';
import { useDispatch } from 'react-redux';
import { setUser, setUserToken } from '../../state/slices/appSlice';

export type RootStackParamList = {
  Login: undefined; // Login screen
  Register: undefined; // Register screen
  ForgotPassword: undefined;
  HomeScreen: undefined;
  // Add other screens as needed
};

// Define your navigation prop type
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const ContinueWithOtp = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpActive, setIsOtpActive] = useState(false);
  const [hasSentOnce, setHasSentOnce] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const userService = new UserService();

  const isValidEmail = (value: string) =>
    /^(?!\.)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.trim());

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOtpChange = (value: string, idx: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[idx] = value;
      setOtp(newOtp);
      if (value && idx < 5) {
        otpRefs[idx + 1].current?.focus();
      }
      if (!value && idx > 0) {
        otpRefs[idx - 1].current?.focus();
      }
    }
  };

  const handleSendOtp = async () => {
    if (!isEmailValid) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await userService.requestOtp(email);
      console.log('OTP sent successfully:', response);
      
      setIsOtpActive(true);
      setCountdown(60);
      setHasSentOnce(true);
      
      Alert.alert('Success', response.message || 'OTP sent successfully!');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
      Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isOtpActive) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await userService.requestOtp(email);
      console.log('OTP resent successfully:', response);
      
      setOtp(['', '', '', '', '', '']);
      setIsOtpActive(true);
      setCountdown(60);
      
      Alert.alert('Success', response.message || 'OTP resent successfully!');
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      setErrorMessage(error.message || 'Failed to resend OTP. Please try again.');
      Alert.alert('Error', error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!isOtpComplete) return;
    
    const otpString = otp.join('');
    setIsVerifying(true);
    setErrorMessage('');
    
    try {
      const response = await userService.verifyOtp(email, otpString);
      console.log('OTP verified successfully:', response);
      
      // Dispatch user data to Redux state
      if (response?.status && response?.data) {
        dispatch(setUser(response.data));
        if (response.access_token) {
          dispatch(setUserToken(response.access_token));
        }
        navigation.navigate('HomeScreen');
      }
      
      // Alert.alert(
      //   'Success', 
      //   'Login successful! Welcome back.',
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => {
      //         // Navigate to Home screen after successful login
      //         navigation.navigate('HomeScreen');
      //       }
      //     }
      //   ]
      // );
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setErrorMessage(error.message || 'Invalid OTP. Please try again.');
      Alert.alert('Error', error.message || 'Invalid OTP. Please try again.');
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      otpRefs[0].current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');
  const isEmailValid = isValidEmail(email);

  useEffect(() => {
    if (isOtpActive && countdown > 0 && timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }

    if (!isOtpActive || countdown === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    if (countdown === 0 && isOtpActive) {
      // Timer finished; stop active window but keep OTP inputs visible
      setIsOtpActive(false);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOtpActive, countdown]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={{ flex: 1, backgroundColor: '#202945' }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -84}
    >
      <MainContainer>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with back button and title */}
          <View style={styles.topHeaderRow}>
            <TouchableOpacity onPress={handleBack}>
              <Image
                source={require('../../assets/icons/back.png')}
                style={styles.backBtn}
              />
            </TouchableOpacity>
            <View style={styles.backIconWrap}>

            <Text style={styles.headerTitle}>Continue with OTP</Text>
            </View>

          </View>

          {/* Astroself logo and OTP illustration */}
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/icons/Subtract.png')}
              style={styles.astroIcon}
            />
            <Image
              source={require('../../assets/image/otpMail.png')}
              style={styles.otpIllustration}
            />
          </View>

          {/* Email input */}
          <View style={styles.formContainer}>
            <TextInput
              style={[
                styles.input,
                email.length > 0 && !isEmailValid && styles.inputError,
              ]}
              placeholder="Enter Email"
              placeholderTextColor="#B0B3C7"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setErrorMessage('');
              }}
              editable={!isLoading}
            />
            {email.length > 0 && !isEmailValid ? (
              <Text style={styles.errorText}>
                Please enter a valid email address
              </Text>
            ) : null}

            {/* Error message display */}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* OTP input row - visible after first send */}
            {hasSentOnce ? (
              <View style={styles.otpRow}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={otpRefs[idx]}
                    style={styles.otpBox}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={value => handleOtpChange(value, idx)}
                    returnKeyType="next"
                    textAlign="center"
                    editable={!isVerifying}
                  />
                ))}
              </View>
            ) : null}

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordBtn}
            >
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button - visible after first send (during and after countdown) */}
            {hasSentOnce ? (
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!isOtpComplete || isVerifying) && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={!isOtpComplete || isVerifying}
              >
                <Text style={styles.loginButtonText}>
                  {isVerifying ? 'Verifying...' : 'Login'}
                </Text>
              </TouchableOpacity>
            ) : null}

            {/* Send OTP Button - only first time when no active OTP window */}
            {!isOtpActive && !hasSentOnce ? (
              <TouchableOpacity
                style={[
                  styles.otpButton,
                  (!isEmailValid || isLoading) && styles.otpButtonDisabled,
                ]}
                onPress={handleSendOtp}
                disabled={!isEmailValid || isLoading}
              >
                <Text style={styles.otpButtonText}>
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Text>
              </TouchableOpacity>
            ) : null}

            {/* Countdown during active OTP window */}
            {isOtpActive ? (
              <View style={styles.resendRow}>
                <Text style={styles.resendText}>
                  Time remaining:{' '}
                  {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                  {String(countdown % 60).padStart(2, '0')}
                </Text>
              </View>
            ) : null}

            {/* After first send, when not active, show Resend OTP text (not button) */}
            {!isOtpActive && hasSentOnce ? (
              <View style={styles.resendRow}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.resendLink,
                      isLoading && styles.resendLinkDisabled,
                    ]}
                  >
                    {isLoading ? 'Sending...' : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Login */}
            <TouchableOpacity style={styles.googleButton}>
              {/* <Text style={styles.googleG}>G</Text> */}
              <Image source={icons.Ic_google} style={styles.googleG} />
              <Text style={styles.googleButtonText}> Login with Google</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingBottom: 32,
  },
  headerContainer: {
    alignItems: 'center',
    // marginTop: 40,
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  astroIcon: {
    width: responsiveWidth('35%'),
    height: responsiveWidth('10%'),
    resizeMode: 'contain',
    marginTop: responsiveWidth('8%'),
  },
  astroTitle: {
    fontSize: 36,
    color: '#F6EFD9',
    fontWeight: '700',
    fontFamily: fontFamily.regular,
  },
  astroWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  astroWheel: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  planet1: {
    position: 'absolute',
    left: -30,
    top: 30,
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  planet2: {
    width: responsiveWidth('100%'),
    height: responsiveHeight('26%'),
    resizeMode: 'contain',
  },
  formContainer: {
    paddingHorizontal: responsiveWidth('7%'),
  },
  input: {
    backgroundColor: '#223149',
    borderRadius: 12,
    paddingHorizontal: responsiveWidth('2.5'),
    paddingVertical: responsiveWidth('2.5'),
    color: '#fff',
    fontSize: 16,
    fontFamily: fontFamily.regular,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#496CA8',
  },
  inputError: {
    borderColor: '#D9534F',
  },
  errorText: {
    color: '#D9534F',
    fontSize: 12,
    fontFamily: fontFamily.regular,
    marginTop: -12,
    marginBottom: 16,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#223149',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#496CA8',
    marginBottom: responsiveWidth('1.5%'),
  },
  eyeIconContainer: {
    paddingHorizontal: 12,
  },
  forgotPassword: {
    color: color.themeTextWhite,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    alignSelf: 'flex-end',

    marginBottom: responsiveWidth('3%'),
  },
  loginButton: {
    backgroundColor: '#DF8A5D',
    borderRadius: 10,
    paddingVertical: responsiveWidth('2.5'),
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: color.themeTextWhite,
    fontSize: 18,
    fontFamily: fontFamily.regular,
    fontWeight: '600',
  },
  otpButton: {
    borderWidth: 1,
    borderColor: '#DF8A5D',
    borderRadius: 10,
    paddingVertical: responsiveWidth('2.5'),
    alignItems: 'center',
    marginBottom: responsiveWidth('3%'),
  },
  otpButtonDisabled: {
    opacity: 0.5,
  },
  otpButtonText: {
    color: color.themeTextWhite,
    fontSize: 16,
    fontFamily: fontFamily.regular,
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
    fontSize: 16,
    fontFamily: fontFamily.regular,
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
    fontFamily: fontFamily.regular,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: fontFamily.regular,
  },
  registerNowText: {
    color: '#F2994A',
    fontSize: 15,
    fontFamily: fontFamily.regular,
    fontWeight: '700',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:
      Platform.OS === 'android'
        ? -responsiveWidth('1%')
        : responsiveWidth('13%'),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    // justifyContent: 'center',
    // marginBottom: 8,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    resizeMode: 'contain',
    tintColor: '#F6EFD9',
  },
  backArrow: {
    color: '#F6EFD9',
    fontSize: 22,
    fontFamily: fontFamily.regular,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: color.themeTextWhite,
    // color: '#EEE5CA',

    fontSize: 24,
    fontFamily: fontFamily.regular,
    // fontWeight: '600',
    marginLeft: responsiveWidth('4%'),
  },
  backIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 30,
    flex: 1,
  },
  otpIllustration: {
    width: responsiveWidth('100%'),
    height: responsiveWidth('35%'),
    resizeMode: 'contain',
    marginTop: 16,
    // marginBottom: 8,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: responsiveWidth('2'),
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#223149',
    borderWidth: 1,
    borderColor: '#496CA8',
    color: '#fff',
    fontSize: 24,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    // marginHorizontal: 2,
  },
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    // marginBottom: 12,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  resendText: {
    color: '#EEE5CA',
    fontSize: 15,
    fontFamily: fontFamily.regular,
  },
  resendLink: {
    color: '#DF8A5D',
    fontSize: 15,
    fontFamily: fontFamily.regular,
    fontWeight: '700',
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
  googleG: {
    width: responsiveWidth('6%'),
    height: responsiveWidth('6%'),
    marginRight: responsiveWidth('2%'),
  },
});

export default ContinueWithOtp;
