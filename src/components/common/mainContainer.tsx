import {
  ImageBackground,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { color, responsiveHeight, responsiveWidth } from '../../constant/theme';

interface MainContainerProps extends ViewProps {
  containerStyle?: ViewStyle;
  subContainerStyle?: ViewStyle;
  childern?: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({
  containerStyle,
  subContainerStyle,
  children,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>

      <ImageBackground
        source={require('../../assets/image/DarkBackground.png')} // Local image
        style={styles.background}
        resizeMode="cover" // or "contain" / "stretch" / "center" / "repeat"
      >
        {/* <View style={[styles.subContainer, subContainerStyle]}>{children}</View> */}
        {children}
      </ImageBackground>
    </View>
  );
};

export { MainContainer };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202945'
  },
  background: {
    flex: 1,
    backgroundColor: '#202945'
  },
  subContainer: {
    flex: 1,
    backgroundColor: color.primaryBackground,
    marginBottom: responsiveWidth(2),
    borderBottomLeftRadius: responsiveWidth(4),
    borderBottomRightRadius: responsiveWidth(4),
    overflow: 'hidden',
  },
});
