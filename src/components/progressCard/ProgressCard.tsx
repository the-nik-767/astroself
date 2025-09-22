import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { color, font, fontFamily, responsiveWidth } from "../../constant/theme";

interface OtherDetails {
  description: string;
  title: string;
}


const ProgressCard = (props:OtherDetails  ) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
       
        <View style={styles.textContainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.subTitle}>{props.description}</Text>
        </View>
       
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ok, Done</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
   
    borderRadius: 8,
    width: "90%",
    marginBottom: 16,
  },
 
 
  textContainer: {
    flex: 1,
  },
  title: {
    ...font.h5,
    color: color.black,
    textAlign:"center",
    lineHeight:responsiveWidth("7")
  },
  subTitle: {
    ...font.label,
    color: color.pink,
    textAlign:"center",
    lineHeight:responsiveWidth("5"),
    marginTop:responsiveWidth("2%")
  },

  button: {
    backgroundColor: color.pink,
    padding: responsiveWidth("3"),
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    marginBottom: responsiveWidth("4"),
  },
  buttonText: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  
});

export default ProgressCard;
