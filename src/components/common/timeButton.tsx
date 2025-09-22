import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { icons } from "../../assets";
import {
  color,
  font,
  responsiveHeight,
  responsiveWidth,
} from "../../constant/theme";

// Define the interface for the props
interface TimeButtonProps {
  title: string;
  onPress: () => void;
  isSelected: boolean;
}

// Convert the component to TypeScript and use the props interface
const TimeButton: React.FC<TimeButtonProps> = ({ title, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: isSelected ? color.green : color.white,
        },
      ]}
    >
      <Image
        style={[
          styles.tinyLogowatch,
          { tintColor: isSelected ? color.white : color.black },
        ]}
        source={icons.icBcak}
      />
      <Text
        style={{
          color: isSelected ? color.white : color.black,
          marginRight: responsiveWidth("5%"),
          marginLeft: responsiveWidth("1%"),
          ...font.bodySmall,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export { TimeButton };

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 5,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveWidth("2%"),
    flexDirection: "row",
  },
  tinyLogowatch: {
    width: responsiveWidth("5%"),
    height: responsiveHeight("5%"),
    marginRight: responsiveWidth("1%"),
    marginLeft: responsiveWidth("6%"),
    resizeMode: "contain",
  },
});
