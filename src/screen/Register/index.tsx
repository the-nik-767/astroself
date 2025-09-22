// HomeScreen.tsx

import React, { useState } from 'react';
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
  Modal,
  FlatList,
  StatusBar,
} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { COUNTRY_CODES, isoToDialMap } from '../../constant/countryCodes';
import { responsiveWidth, font, fontFamily, color, responsiveHeight } from '../../constant/theme';
// import serviceFactory from '../../services/serviceFactory';
// import UserService from '../../services/user/user.service';
// import {InputBox} from '../../components/common/inputBox';
import Toast from 'react-native-toast-message';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import GoogleAuthService from '../../services/googleAuthService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { setUser, setUserToken } from '../../state/slices/appSlice';

// import Bigball from '../../assets/svgs/bigball.svg';
// import IcBall from '../../assets/svgs/icBall.svg';
// import Bg from '../../assets/svgs/bg.svg';
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
  // Add other screens as needed
};

// Define your navigation prop type
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

// Validation handled inline for simplicity

const Register = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [isCcModalVisible, setIsCcModalVisible] = useState(false);

  const countryCodes = COUNTRY_CODES;

  React.useEffect(() => {
    serviceFactory.create();
  }, []);
  const userService = serviceFactory.get<UserService>('UserService');
  const googleAuthService = serviceFactory.get<GoogleAuthService>('GoogleAuthService');

  React.useEffect(() => {
    try {
      const deviceCountry = RNLocalize.getCountry();
      const detected = isoToDialMap[deviceCountry];
      if (detected) setCountryCode(detected);
    } catch (e) {
      // ignore and keep default
    }
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('Please enter your first name'),
    lastName: Yup.string().trim().required('Please enter your last name'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Please enter your email'),
    phone: Yup.string()
      .trim()
      .min(6, 'Please enter a valid phone number')
      .required('Please enter your phone number'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Please enter your password'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      general: undefined as undefined | string,
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        helpers.setSubmitting(true);
        const compactLocal = values.phone.replace(/[^\d]/g, '');
        const data = await userService.register({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: `${countryCode}${compactLocal}`,
          password: values.password,
        });

        if (data?.status) {
          // Dispatch user data to Redux state
          dispatch(setUser(data.data));
          if (data.access_token) {
            dispatch(setUserToken(data.access_token));
          }
          
          Toast.show({
            type: 'success',
            text1: 'Registration Successful',
            text2: 'Your account has been created.',
            position: 'top',
            topOffset: 60,
            visibilityTime: 3000,
          });
          // After successful registration, go directly to Home like login flow
          if (data?.access_token) {
            navigation.replace('HomeScreen');
          } else {
            // Fallback: if token missing, go to Login
            navigation.navigate('Login');
          }
        } else {
          const errorMessage = data?.message || 'Please try again.';
          Toast.show({
            type: 'error',
            text1: 'Registration Failed',
            text2: errorMessage,
            position: 'top',
            topOffset: 60,
            visibilityTime: 3000,
          });
          helpers.setErrors({ general: errorMessage });
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong.';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
          position: 'top',
          topOffset: 60,
          visibilityTime: 3000,
        });
        helpers.setErrors({ general: errorMessage });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const handleGoogleSignup = async () => {
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
          text1: 'Google Signup Failed',
          text2: result.error || 'Failed to sign up with Google. Please try again.',
          position: 'top',
          topOffset: 60,
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.log('Google Signup Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong with Google signup. Please try again.',
        position: 'top',
        topOffset: 60,
        visibilityTime: 3000,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={{ flex: 1, backgroundColor: '#202945' }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -84}
    >
      <MainContainer>
        {/* Sticky Header */}
        <View style={styles.stickyHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Image
              source={require('../../assets/icons/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <View style={styles.backIconWrap}>

          <Text style={styles.createAccountText}>Create an Account</Text>
          </View>
        </View>
        
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View style={styles.titleWrap}>
            <Image
              source={require('../../assets/icons/Subtract.png')}
              style={styles.sunIcon}
            />
          </View>

          <View style={styles.lockKeyContainer}>
            <Image
              source={require('../../assets/image/signupLock.png')}
              style={styles.lockKeyImage}
            />
          </View>
          {/* Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="First name"
              placeholderTextColor="#EEE5CA"
              value={formik.values.firstName}
              onChangeText={formik.handleChange('firstName')}
              onBlur={formik.handleBlur('firstName')}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <Text style={styles.errorText}>{formik.errors.firstName}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor="#EEE5CA"
              value={formik.values.lastName}
              onChangeText={formik.handleChange('lastName')}
              onBlur={formik.handleBlur('lastName')}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <Text style={styles.errorText}>{formik.errors.lastName}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#EEE5CA"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}
            <View style={styles.phoneRow}>
              <TouchableOpacity
                onPress={() => setIsCcModalVisible(true)}
                style={styles.ccButton}
                activeOpacity={0.8}
              >
                <Text style={styles.ccText}>{countryCode}</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder="Mobile"
                placeholderTextColor="#EEE5CA"
                keyboardType="phone-pad"
                value={formik.values.phone}
                onChangeText={formik.handleChange('phone')}
                onBlur={formik.handleBlur('phone')}
              />
            </View>
            {formik.touched.phone && formik.errors.phone && (
              <Text style={styles.errorText}>{formik.errors.phone}</Text>
            )}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, marginBottom: 0, borderWidth: 0 },
                ]}
                placeholder="Password"
                placeholderTextColor={color.themeTextWhite}
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
                    style={styles.eyeIcon}
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
            <TouchableOpacity
              onPress={formik.handleSubmit as any}
              disabled={formik.isSubmitting}
              style={styles.createAccountButton}
            >
              <Text style={styles.createAccountButtonText}>
                {formik.isSubmitting ? 'Please wait...' : 'Create an Account'}
              </Text>
            </TouchableOpacity>
            
            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>
            
            {/* Google Signup */}
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleSignup}
            >
              <Image source={icons.Ic_google} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
          </View>
          {/* Footer */}
          <View style={styles.footerWrap}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </MainContainer>
      <Modal
        visible={isCcModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCcModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => setIsCcModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <FlatList
              data={countryCodes}
              keyExtractor={item => `${item.name}-${item.dialCode}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.ccItem}
                  onPress={() => {
                    setCountryCode(item.dialCode);
                    setIsCcModalVisible(false);
                  }}
                >
                  <Text style={styles.ccItemText}>{item.name}</Text>
                  <Text style={styles.ccItemCode}>{item.dialCode}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.ccSeparator} />}
              contentContainerStyle={{ paddingBottom: 12 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    minHeight: '100%',
    // backgroundColor: '#202945',
    paddingBottom: 32,
  },
  stickyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:
      Platform.OS === 'android'
        ? -responsiveWidth('1%')
        : responsiveWidth('13%'),
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    // justifyContent: 'center',
    // paddingTop: responsiveWidth('15%'),
    // paddingBottom: 16,
    paddingHorizontal: responsiveWidth('2'),
    // backgroundColor: '#202945',
    zIndex: 1000,
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveWidth('15%'),
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 10,
    // padding: 6,
  },
  backIcon: {
    width: responsiveWidth('5%'),
    height: responsiveWidth('5%'),
    resizeMode: 'contain',
    marginLeft: responsiveWidth('2%'),
    // tintColor: '#EEE5CA',
  },
  createAccountText: {
    color: color.themeTextWhite,
    // ...font.buttonSmall,
    fontFamily: fontFamily.regular,
    // fontWeight: '600',
    textAlign: 'center',
    // textTransform: 'capitalize',
    fontSize: 24,
    marginLeft: responsiveWidth('2%'),
  },
  titleWrap: {
    alignItems: 'center',
    marginTop: -responsiveWidth('5%'),
  },
  sunIcon: {
    width: responsiveWidth('35%'),
    height: responsiveWidth('10%'),
    resizeMode: 'contain',
    marginTop: responsiveWidth('8%'),
  },
  astroselfTitle: {
    ...font.displayLarge,
    color: '#EEE5CA',
  },

  lockKeyContainer: {
    alignItems: 'center',
    marginTop: -responsiveWidth('10%'),
  },
  lockKeyImage: {
    width: responsiveWidth('100%'),
    height: responsiveWidth('50%'),

    resizeMode: 'contain',
  },
  imageWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  backIconWrap: {
    // width: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 30,
  },
  userCardIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginRight: -30,
    zIndex: 2,
  },
  lockIcon: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginLeft: -30,
    zIndex: 1,
  },
  formContainer: {
    paddingHorizontal: responsiveWidth('5%'),
    // marginBottom: responsiveWidth('4%'),
    // marginTop: -responsiveWidth('4'),
  },
  input: {
    backgroundColor: '#223149',
    borderRadius: 12,
    paddingHorizontal: responsiveWidth('3%'),
    paddingVertical: responsiveWidth('3%'),
    color: color.themeTextWhite,
    // ...font.input,
    fontSize: 16,
    marginBottom: responsiveWidth('4%'),
    borderWidth: 1,
    borderColor: '#496CA8',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveWidth('4%'),
  },
  ccButton: {
    backgroundColor: '#223149',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#496CA8',
    paddingHorizontal: responsiveWidth('3%'),
    paddingVertical: responsiveWidth('3%'),
    marginRight: 10,
  },
  ccText: {
    color: color.themeTextWhite,
    // ...font.input,
    fontSize: 16,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    marginBottom: 0,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#223149',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#496CA8',
    marginBottom: 18,
  },
  eyeIconContainer: {
    paddingHorizontal: 12,
  },
  eyeIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#EEE5CA',
  },
  crossLineContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossLine: {
    position: 'absolute',
    width: 24,
    height: 1.5,
    backgroundColor: '#EEE5CA',
  },
  crossLine1: {
    transform: [{ rotate: '45deg' }],
  },
  crossLine2: {
    transform: [{ rotate: '-45deg' }],
  },
  createAccountButton: {
    backgroundColor: '#DF8A5D',
    borderRadius: 10,
    paddingVertical: responsiveWidth('3%'),
    alignItems: 'center',
    // marginBottom: 16,
  },
  createAccountButtonText: {
    color: color.themeTextWhite,
    fontSize: 16,
    fontWeight: '600',
    // ...font.buttonSmall,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#2A3754',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingBottom: 16,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6B7CA8',
    marginVertical: 10,
  },
  ccItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  ccItemText: {
    color: '#EEE5CA',
    ...font.labelLarge,
  },
  ccItemCode: {
    color: '#EEE5CA',
    ...font.labelLarge,
    fontWeight: '700',
  },
  ccSeparator: {
    height: 1,
    backgroundColor: '#3B4A6A',
    marginHorizontal: 20,
  },
  footerWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: responsiveWidth('3%'),
  },
  footerText: {
    color: color.themeTextWhite,
    fontSize: 16,
    // fontWeight: '600',
    // ...font.buttonSmall,
    fontFamily: fontFamily.regular,
  },
  loginLink: {
    color: '#DF8A5D',
    // ...font.buttonSmall,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: fontFamily.regular,
    marginLeft: 2,
  },
  errorText: {
    color: 'red',
    marginBottom: responsiveWidth('1'),
    marginTop: -responsiveWidth('2.5'),
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveWidth('3%'),
    marginTop: responsiveWidth('3%'),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEE5CA',
  },
  orText: {
    color: color.themeTextWhite,
    marginHorizontal: 12,
    // ...font.subtitleLarge,
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
});

export default Register;
