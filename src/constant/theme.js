import {Platform, Dimensions, PixelRatio, StatusBar} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import themeHelper from '../helper/theme';

const orientation = 'PORTRAIT';

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
// const guidelineBaseHeight = 680;

const mainScale = size => (SCREEN_WIDTH / guidelineBaseWidth) * size;
// const verticalScale = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (mainScale(size) - size) * factor;

// const IS_IPAD = SCREEN_HEIGHT / SCREEN_WIDTH < 1.6;
const scale = SCREEN_WIDTH / 320;

function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return !themeHelper.isPotrait(orientation)
      ? Math.round(PixelRatio.roundToNearestPixel(newSize)) / 2
      : Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return !themeHelper.isPotrait(orientation)
      ? Math.round(PixelRatio.roundToNearestPixel(newSize)) / 2
      : Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}

export const color = {
  transparent: 'transparent',
  transparentBack: 'rgb(245, 245, 245)',
  transparentpink: 'rgba(224, 85, 126, 0.5)',
  transparentGray: 'rgba(71, 71, 71, 0.3)',
  transparentWhite: 'rgba(255,255,255,0.83)',
  black: '#000000',
  white: '#FFFFFF',
  dimOrange: '#FFA500',
  themeTextWhite: '#EEE5CA',
  themeBorderDropdown: 'rgba(73, 108, 168, 1)',
  green: '#00656f',
  red: '#A52A2A',
  pink: '#E0557E',
  dark: '#F2F2F2',
  blur: '#00008B',
  gray: '#858680',
  lightgray: '#D5D8D5',
  navyblue: '#043f5d',
  darkwhitep: '#FAFAFA',
  darkwhite: '#F6F6F6',
  yellow: '#edd095',
  staryello: '#ffd700',
  darkgreen: '#004349',
  border: '#D5D8D5',
  primary: '#0047AF',
  primaryGreen: '#27AE60',
  primaryBackground: '#ECF5FF',
  grayText: '#8E8E93',
  lightGrayText: '#8C8C8C',
};

// Font sizes
export const fontSize = {
  xxxxsmall: normalize(6),
  xxxsmall: normalize(7),
  xxsmall: normalize(9),
  xsmall: normalize(10),
  minixxxx: normalize(11.2),
  minixxx: normalize(11.4),
  minixx: normalize(11.6),
  minix: normalize(11),
  mini: normalize(12),
  regular: normalize(14),
  regularx: normalize(12),
  small: normalize(15),
  smallx: normalize(16),
  smallxx: normalize(24),
  medium: normalize(17),
  mediumx: normalize(18),
  large: normalize(20),
  xlarge: normalize(25),
  xlargexx: normalize(24),
  xlargex: normalize(26),
  xxlarge: normalize(27),
  xxlargex: normalize(30),
  xxlargexx: normalize(35),
  xxlargexxx: normalize(40),
};

export const fontStyle = {
  italic: 'italic',
  normal: 'normal',
};

export const fontFamily = {
  thin: 'Poppins-Thin',
  extraLight: 'Poppins-ExtraLight',
  light: 'Poppins-Light',
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  extraBold: 'Poppins-ExtraBold',
  black: 'Poppins-Black',
  
};

// Unified Font System - Use this instead of fontSize and fontFamily separately
export const font = {
  // Headers
  h1: {
    fontSize: fontSize.xxlargexxx,
    fontFamily: fontFamily.regular,
    fontWeight: '700',
  },
  h2: {
    fontSize: fontSize.xxlargex,
    fontFamily: fontFamily.regular,
    fontWeight: '700',
  },
  h3: {
    fontSize: fontSize.xxlarge,
    fontFamily: fontFamily.regular,
    fontWeight: '600',
  },
  h4: {
    fontSize: fontSize.xlargex,
    fontFamily: fontFamily.regular,
    fontWeight: '600',
  },
  h5: {
    fontSize: fontSize.xlarge,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
  },
  h6: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
  },

  // Body Text
  bodyLarge: {
    fontSize: fontSize.mediumx,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  body: {
    fontSize: fontSize.regular,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: fontSize.mini,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },

  topHeder: {
    fontSize: fontSize.xlargexx,
    // fontFamily: fontFamily.semiBold,
    // fontWeight: '600',
  },

  input: {
    fontSize: fontSize.regularx,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },

  // Labels
  labelLarge: {
    fontSize: fontSize.medium,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
  },
  label: {
    fontSize: fontSize.regularx,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
  },
  labelSmall: {
    fontSize: fontSize.mini,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
  },

  // Captions
  caption: {
    fontSize: fontSize.xsmall,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  captionSmall: {
    fontSize: fontSize.xxsmall,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },

  // Buttons
  buttonLarge: {
    fontSize: fontSize.mediumx,
    fontFamily: fontFamily.regular,
    fontWeight: '600',
  },
  button: {
    fontSize: fontSize.regularx,
    fontFamily: fontFamily.regular,
    fontWeight: '600',
  },
  buttonSmall: {
    fontSize: fontSize.mini,
    fontFamily: fontFamily.regular,
    fontWeight: '600',
  },

  // Special
  overline: {
    fontSize: fontSize.xxsmall,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  subtitleLarge: {
    fontSize: fontSize.smallx,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
  },

  // Display
  displayLarge: {
    fontSize: fontSize.xxlargexxx,
    fontFamily: fontFamily.regular,
    fontWeight: '800',
  },
  displayMedium: {
    fontSize: fontSize.xxlargex,
    fontFamily: fontFamily.regular,
    fontWeight: '800',
  },
  displaySmall: {
    fontSize: fontSize.xxlarge,
    fontFamily: fontFamily.regular,
    fontWeight: '700',
  },

  // Legacy support - keeping old fontSize for backward compatibility
  ...fontSize,
};

export const screen = {
  screen: Dimensions.get('window'),
  screenHeight: SCREEN_HEIGHT,
  screenWidth: SCREEN_WIDTH,
  fullScreenWidth: SCREEN_WIDTH,
  fullScreenHeight: SCREEN_HEIGHT,
  statusBarHeight: StatusBar.currentHeight,
  maxUIWidth: 500,
  wp,
  hp,
  moderateScale,
  orientation,
};

export const responsiveWidth = percentage => {
  return themeHelper.isPotrait(orientation)
    ? wp(percentage)
    : wp(percentage) / 2;
};

export const responsiveHeight = percentage => {
  return themeHelper.isPotrait(orientation)
    ? hp(percentage)
    : hp(percentage) * 2;
};
