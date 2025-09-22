import React from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import {
  color,
} from "../../constant/theme";

// Define the interface for props
interface LoaderProps {
  isVisible: boolean;
}

// Convert the component to TypeScript and use the props interface
const Loader: React.FC<LoaderProps> = ({ isVisible }) => {
  if (isVisible) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return null;
  }
};

export { Loader };

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.transparentpink,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
