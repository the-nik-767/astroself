import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {color, font, responsiveWidth} from '../../constant/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  buttonContainer?: ViewStyle;
  titleStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  buttonContainer,
  titleStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, buttonContainer]}
      onPress={onPress}>
      <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export {Button};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: responsiveWidth('4%'),
    backgroundColor: color.pink,
    alignItems: 'center',
    borderRadius: 40,
    marginVertical: responsiveWidth('2%'),
    borderWidth: 1,
    borderColor: color.pink,
  },
  titleStyle: {
    color: color.white,
    ...font.button,
  },
});
