import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Science from "../screen/subject/MySubject";

import { color, responsiveWidth } from "../constant/theme";

import Home from "../screen/home";
import { StyleSheet, Text, View } from "react-native";


const Tab = createMaterialTopTabNavigator();

export const SignupTabs = () => {
  return (

    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          // bottom: 20,
          top: responsiveWidth('35.5%'),
          left: responsiveWidth('0%'),
          right: responsiveWidth('0%'),
          position: 'absolute',
          // borderRadius: 15,
          backgroundColor: color.white,
          height: responsiveWidth('17%'),
          ...style.shadow,
          // borderWidth:1,
          borderColor: 'gray',
          // paddingBottom: 0,
        },
      }}
      initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: 'center',
                tintColor: focused ? color.green : color.gray,
              }}>
              {/* <Image
                source={icons.ic_home}
                resizeMode="contain"
                style={{
                  height: responsiveHeight('6.5%'),
                  width: responsiveWidth('6.5%'),
                  tintColor: focused ? color.green : color.gray,
                }}
              /> */}
              <Text>Science</Text>
            </View>
          ),
        }}
      />


      <Tab.Screen
        name="Science"
        component={Science}
        options={{
          tabBarIcon: () => (
            <View>
              {/* <Image
                source={icons.ic_home}
                resizeMode="contain"
                style={{
                  height: responsiveHeight('6.5%'),
                  width: responsiveWidth('6.5%'),
                  tintColor: focused ? color.green : color.gray,
                }}
              /> */}
              <Text>Math</Text>
            </View>
          ),
        }}
      />

    </Tab.Navigator>

  );
};

const style = StyleSheet.create({
  shadow: {
    shadowColor: color.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
});
